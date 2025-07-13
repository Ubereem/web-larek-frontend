import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { ProductService } from './components/app/ProductService';
import { ProductModel } from './components/app/ProductModel';
import { CartModel } from './components/app/CartModel';
import { OrderModel } from './components/app/OrderModel';
import { AppModalView } from './components/app/AppModalView';
import { ProductCardView } from './components/app/ProductCardView';
import { ProductPreviewView } from './components/app/ProductPreviewView';
import { CartItemView } from './components/app/CartItemView';
import { CartView } from './components/app/CartView';
import { PaymentFormView } from './components/app/PaymentFormView';
import { ContactsFormView } from './components/app/ContactsFormView';
import { SuccessView } from './components/app/SuccessView';
import { API_URL, CDN_URL } from './utils/constants';
import { AppEvents, IProduct, IOrder } from './types';

class App {
    private events: EventEmitter;
    private productService: ProductService;
    private productModel: ProductModel;
    private cartModel: CartModel;
    private orderModel: OrderModel;
    private modal: AppModalView;
    private cartView: CartView;
    private productCardViews: ProductCardView[] = [];
    private productPreviewView: ProductPreviewView | null = null;
    private paymentFormView: PaymentFormView | null = null;
    private contactsFormView: ContactsFormView | null = null;
    private successView: SuccessView | null = null;

    constructor() {
        this.events = new EventEmitter();
        this.productModel = new ProductModel(this.events);
        this.cartModel = new CartModel(this.events);
        this.orderModel = new OrderModel();
        this.productService = new ProductService(API_URL, this.orderModel);
        
        this.initializeViews();
        this.bindEvents();
        this.loadProducts();
    }

    private initializeViews(): void {
        // Инициализация модального окна
        this.modal = new AppModalView('#modal-container', this.events);
        
        // Инициализация корзины
        const cartContainer = document.querySelector('.basket') as HTMLElement;
        if (cartContainer) {
            this.cartView = new CartView(cartContainer, this.events);
        }

        // Добавляю обработчик на кнопку корзины в шапке
        const basketButton = document.querySelector('.header__basket');
        if (basketButton) {
            basketButton.addEventListener('click', () => {
                this.openCartModal();
            });
        }

        // Инициализация карточек товаров
        this.initializeProductCards();

        // Инициализация счетчика товаров в шапке
        this.updateCartCounter();
    }

    private initializeProductCards(): void {
        const productCards = document.querySelectorAll('.card');
        productCards.forEach(card => {
            const cardView = new ProductCardView(card as HTMLElement, this.events);
            this.productCardViews.push(cardView);
        });
    }

    private bindEvents(): void {
        // Обработка загрузки товаров
        this.events.on(AppEvents.PRODUCTS_LOADED, () => {
            this.renderProducts();
        });

        // Обработка выбора товара
        this.events.on(AppEvents.PRODUCT_SELECTED, (data: { productId: string }) => {
            const product = this.productModel.getProductById(data.productId);
            if (product) {
                if (this.cartModel.isInCart(product.id)) {
                    this.cartModel.removeItem(product.id);
                } else {
                    this.cartModel.addItem(product);
                }
            }
        });

        // Обработка добавления товара в корзину
        this.events.on(AppEvents.CART_ITEM_ADDED, () => {
            this.updateCartView();
            this.updateProductCards();
            this.updateCartCounter();
            
            // Обновляем превью товара, если оно открыто
            this.updateProductPreview();
        });

        // Обработка удаления товара из корзины
        this.events.on(AppEvents.CART_ITEM_REMOVED, (data: { productId: string }) => {
            this.cartModel.removeItem(data.productId);
            this.updateCartView();
            this.updateProductCards();
            this.updateCartCounter();
            
            // Обновляем корзину в модальном окне, если она открыта и это корзина
            if (this.modal && this.isModalOpen() && this.isCartModalOpen()) {
                this.updateCartInModal();
            }
            
            // Обновляем превью товара, если оно открыто
            this.updateProductPreview();
        });

        // Обработка открытия корзины
        this.events.on(AppEvents.CART_OPENED, () => {
            this.openCartModal();
        });

        // Обработка оформления заказа
        this.events.on(AppEvents.ORDER_SUBMITTED, () => {
            // Если корзина пуста, не открываем форму
            if (this.cartModel.getItems().length === 0) {
                return;
            }
            
            // Если это первый вызов (из корзины), открываем форму оплаты
            const orderForm = this.orderModel.getForm();
            if (!orderForm.payment && !orderForm.address) {
                this.openPaymentForm();
            } else {
                // Если форма уже частично заполнена, обрабатываем как обычно
                this.handleOrderSubmission();
            }
        });

        // Обработка событий модального окна
        this.events.on('basket:checkout', () => {
            // Проверяем, что корзина не пуста
            if (this.cartModel.getItems().length > 0) {
                this.openPaymentForm();
            }
        });

        this.events.on('payment:method-selected', (data: { payment: 'card' | 'cash' }) => {
            this.orderModel.setPayment(data.payment);
        });

        this.events.on('payment:next', (data: { payment: 'card' | 'cash'; address: string }) => {
            this.orderModel.setPayment(data.payment);
            this.orderModel.setAddress(data.address);
            this.openContactsForm();
        });

        this.events.on('contacts:submit', (data: { email: string; phone: string }) => {
            this.orderModel.setEmail(data.email);
            this.orderModel.setPhone(data.phone);
            this.submitOrder();
        });

        this.events.on('basket:remove', (item: any) => {
            this.cartModel.removeItem(item.id);
        });



        this.events.on(AppEvents.MODAL_OPENED, (data: { productId: string }) => {
            this.openProductPreview(data.productId);
        });


    }

    private async loadProducts(): Promise<void> {
        try {
            const products = await this.productService.getProducts();
            console.log('Products from API:', products);
            
            // Фильтруем валидные продукты и добавляем CDN_URL к изображениям
            const productsWithCDN = (products || [])
                .filter(product => product && product.id && product.title)
                .map(product => ({
                    ...product,
                    image: product.image ? `${CDN_URL}/${product.image.replace('.svg', '.png')}` : ''
                }));
            
            console.log('Processed products:', productsWithCDN);
            this.productModel.setItems(productsWithCDN);
        } catch (error) {
            console.error('Failed to load products:', error);
        }
    }

    private renderProducts(): void {
        const products = this.productModel.getItems();
        const gallery = document.querySelector('.gallery');
        
        if (gallery) {
            gallery.innerHTML = '';
            
            products.forEach(product => {
                const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
                if (cardTemplate) {
                    const cardFragment = cardTemplate.content.cloneNode(true) as DocumentFragment;
                    const cardElement = cardFragment.firstElementChild as HTMLElement;
                    
                    if (cardElement) {
                        const cardView = new ProductCardView(cardElement, this.events);
                        
                        cardView.render(product);
                        cardView.inCart = this.cartModel.isInCart(product.id);
                        
                        gallery.appendChild(cardView.render());
                        this.productCardViews.push(cardView);
                    }
                }
            });
        }
    }

    private updateCartView(): void {
        if (this.cartView) {
            this.cartView.render({
                items: this.cartModel.getItems(),
                total: this.cartModel.getTotal()
            });
        }
    }

    private updateProductCards(): void {
        this.productCardViews.forEach(cardView => {
            const productId = cardView.render().dataset.id;
            if (productId) {
                cardView.inCart = this.cartModel.isInCart(productId);
            }
        });
    }

    private updateCartCounter(): void {
        const counter = document.querySelector('.header__basket-counter') as HTMLElement;
        if (counter) {
            const itemCount = this.cartModel.getItems().length;
            counter.textContent = itemCount.toString();
            counter.style.display = itemCount > 0 ? 'block' : 'none';
        }
    }

    private openCartModal(): void {
        this.modal.showBasket(this.cartModel.getItems(), this.cartModel.getTotal());
    }

    private openPaymentForm(): void {
        this.modal.showPaymentForm();
    }

    private openContactsForm(): void {
        this.modal.showContactsForm();
    }

    private updateCartInModal(): void {
        // Обновляем корзину в модальном окне, если она открыта
        if (this.modal && this.isModalOpen()) {
            this.modal.showBasket(this.cartModel.getItems(), this.cartModel.getTotal());
        }
    }

    private isModalOpen(): boolean {
        return this.modal.isOpen();
    }

    private isCartModalOpen(): boolean {
        const modalContent = document.querySelector('#modal-container .modal__content');
        return !!(modalContent && modalContent.querySelector('.basket'));
    }

    private handleOrderSubmission(): void {
        const orderForm = this.orderModel.getForm();
        const errors = this.orderModel.validate();
        
        if (Object.keys(errors).length === 0) {
            // Если это первая форма (оплата), переходим к контактам
            if (orderForm.payment && orderForm.address && !orderForm.email) {
                this.openContactsForm();
            } else if (orderForm.payment && orderForm.address && orderForm.email && orderForm.phone) {
                // Если это вторая форма (контакты), отправляем заказ
                this.submitOrder();
            }
        } else {
            // Показываем ошибки
            this.showFormErrors(errors);
        }
    }

    private async submitOrder(): Promise<void> {
        try {
            const cartItems = this.cartModel.getItems();
            const total = this.cartModel.getTotal();
            
            const order: IOrder = {
                total: total,
                items: cartItems.map(item => item.id)
            };

            const response = await this.productService.createOrder(order);
            
            // Очищаем корзину и форму
            this.cartModel.clear();
            this.orderModel.reset();
            
            // Показываем успех
            this.showSuccess(response.total);
            
        } catch (error) {
            console.error('Failed to submit order:', error);
            // Показываем ошибку
        }
    }

    private showFormErrors(errors: Record<string, string>): void {
        const errorMessages = Object.values(errors);
        
        if (this.paymentFormView) {
            this.paymentFormView.render({ errors: errorMessages });
        } else if (this.contactsFormView) {
            this.contactsFormView.render({ errors: errorMessages });
        }
    }

    private showSuccess(total: number): void {
        this.modal.showSuccess(total);
    }

    private openProductPreview(productId: string): void {
        const product = this.productModel.getProductById(productId);
        if (!product) return;
        
        const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
        if (previewTemplate) {
            const previewFragment = previewTemplate.content.cloneNode(true) as DocumentFragment;
            const previewElement = previewFragment.firstElementChild as HTMLElement;
            if (previewElement) {
                this.productPreviewView = new ProductPreviewView(previewElement, this.events);
                this.productPreviewView.render(product);
                this.productPreviewView.inCart = this.cartModel.isInCart(product.id);
                this.modal.render(this.productPreviewView.render());
            }
        }
    }

    private updateProductPreview(): void {
        if (this.productPreviewView) {
            const productId = this.productPreviewView.render().dataset.id;
            if (productId) {
                this.productPreviewView.inCart = this.cartModel.isInCart(productId);
            }
        }
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
