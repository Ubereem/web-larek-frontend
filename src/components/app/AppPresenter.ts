import { EventEmitter } from '../base/events';
import { ProductService } from './ProductService';
import { ProductModel } from './ProductModel';
import { CartModel } from './CartModel';
import { OrderModel } from './OrderModel';
import { AppModalView } from './AppModalView';
import { ProductPreviewView } from './ProductPreviewView';
import { CartView } from './CartView';
import { HeaderBasketView } from './HeaderBasketView';
import { ProductGalleryView } from './ProductGalleryView';
import { PaymentFormView } from './PaymentFormView';
import { ContactsFormView } from './ContactsFormView';
import { SuccessView } from './SuccessView';
import { API_URL, CDN_URL } from '../../utils/constants';
import { AppEvents, IProduct, IOrder, IOrderForm } from '../../types';
import { createElementFromTemplate } from '../../utils/template';

export class AppPresenter {
    private events: EventEmitter;
    private productService: ProductService;
    private productModel: ProductModel;
    private cartModel: CartModel;
    private orderModel: OrderModel;
    private modal: AppModalView;
    private cartView: CartView;
    private headerBasketView: HeaderBasketView;
    private productGalleryView: ProductGalleryView;
    private productPreviewView: ProductPreviewView | null = null;
    private paymentFormView: PaymentFormView | null = null;
    private contactsFormView: ContactsFormView | null = null;
    private successView: SuccessView | null = null;

    constructor(
        events: EventEmitter,
        productService: ProductService,
        productModel: ProductModel,
        cartModel: CartModel,
        orderModel: OrderModel,
        modal: AppModalView,
        cartView: CartView,
        headerBasketView: HeaderBasketView,
        productGalleryView: ProductGalleryView
    ) {
        this.events = events;
        this.productService = productService;
        this.productModel = productModel;
        this.cartModel = cartModel;
        this.orderModel = orderModel;
        this.modal = modal;
        this.cartView = cartView;
        this.headerBasketView = headerBasketView;
        this.productGalleryView = productGalleryView;
        
        this.bindEvents();
        this.loadProducts();
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

        // Обработка событий формы оплаты
        this.events.on('payment:next', (data: { payment: 'card' | 'cash'; address: string }) => {
            // Вносим изменения в модель только при сабмите валидной формы
            this.orderModel.setPayment(data.payment);
            this.orderModel.setAddress(data.address);
            this.openContactsForm();
        });

        // Обработка событий формы контактов
        this.events.on('contacts:submit', (data: { email: string; phone: string }) => {
            // Вносим изменения в модель только при сабмите валидной формы
            this.orderModel.setEmail(data.email);
            this.orderModel.setPhone(data.phone);
            this.submitOrder();
        });

        // Обработка изменений валидации формы
        this.events.on('formErrors:change', (errors: Partial<Record<string, string>>) => {
            this.updateFormValidation(errors);
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
            
            // Добавляем CDN_URL к изображениям
            const productsWithCDN = (products || []).map(product => ({
                ...product,
                image: product.image ? `${CDN_URL}/${product.image.replace('.svg', '.png')}` : ''
            }));
            
            this.productModel.setItems(productsWithCDN);
        } catch (error) {
            console.error('Failed to load products:', error);
        }
    }

    private renderProducts(): void {
        const products = this.productModel.getItems();
        const inCartItems = this.cartModel.getItems().map(item => item.id);
        this.productGalleryView.render(products, inCartItems);
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
        const inCartItems = this.cartModel.getItems().map(item => item.id);
        this.productGalleryView.updateCartStatus(inCartItems);
    }

    private updateCartCounter(): void {
        const itemCount = this.cartModel.getItems().length;
        this.headerBasketView.updateCounter(itemCount);
    }

    public openCartModal(): void {
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
        return this.modal.isCartOpen();
    }

    private isPaymentFormOpen(): boolean {
        return this.modal.isPaymentFormOpen();
    }

    private isContactsFormOpen(): boolean {
        return this.modal.isContactsFormOpen();
    }

    private handleOrderSubmission(): void {
        const orderForm = this.orderModel.getForm();
        
        if (this.orderModel.isValid()) {
            // Если это первая форма (оплата), переходим к контактам
            if (orderForm.payment && orderForm.address && !orderForm.email) {
                this.openContactsForm();
            } else if (orderForm.payment && orderForm.address && orderForm.email && orderForm.phone) {
                // Если это вторая форма (контакты), отправляем заказ
                this.submitOrder();
            }
        } else {
            // Ошибки уже показаны через событие formErrors:change
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

            // Синхронизируем UI
            this.updateCartCounter();
            this.updateCartView();
            this.updateProductCards();
            
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
        
        this.productPreviewView = ProductPreviewView.create(this.events);
        this.productPreviewView.render(product);
        this.productPreviewView.inCart = this.cartModel.isInCart(product.id);
        this.modal.render(this.productPreviewView.render());
    }

    private updateProductPreview(): void {
        if (this.productPreviewView) {
            const productId = this.productPreviewView.render().dataset.id;
            if (productId) {
                this.productPreviewView.inCart = this.cartModel.isInCart(productId);
            }
        }
    }

    private updateFormValidation(errors: Partial<Record<string, string>>): void {
        // Обновляем форму оплаты, если она открыта
        if (this.isModalOpen() && this.isPaymentFormOpen()) {
            const form = this.orderModel.getForm();
            const isPaymentValid = !errors.payment && !errors.address;
            
            this.modal.showPaymentForm();
            // Здесь нужно обновить форму с данными о валидности
            // Но пока у нас нет прямого доступа к форме в модальном окне
        }

        // Обновляем форму контактов, если она открыта
        if (this.isModalOpen() && this.isContactsFormOpen()) {
            const form = this.orderModel.getForm();
            const isContactsValid = !errors.email && !errors.phone;
            
            this.modal.showContactsForm();
            // Здесь нужно обновить форму с данными о валидности
        }
    }

    private updatePaymentFormView(form: Partial<IOrderForm>): void {
        // Обновляем форму оплаты в модальном окне
        if (this.isModalOpen() && this.isPaymentFormOpen()) {
            this.modal.showPaymentForm();
        }
    }

    private updateContactsFormView(form: Partial<IOrderForm>): void {
        // Обновляем форму контактов в модальном окне
        if (this.isModalOpen() && this.isContactsFormOpen()) {
            this.modal.showContactsForm();
        }
    }
} 