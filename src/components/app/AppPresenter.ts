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

        // Обработка клика по кнопке корзины в шапке
        this.events.on('header:basket-clicked', () => {
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

        // Обработчики событий изменения данных в моделях
        this.events.on(AppEvents.ORDER_PAYMENT_CHANGED, (data: { form: Partial<IOrderForm> }) => {
            this.updatePaymentFormView(data.form);
        });

        this.events.on(AppEvents.ORDER_ADDRESS_CHANGED, (data: { form: Partial<IOrderForm> }) => {
            this.updatePaymentFormView(data.form);
        });

        this.events.on(AppEvents.ORDER_EMAIL_CHANGED, (data: { form: Partial<IOrderForm> }) => {
            this.updateContactsFormView(data.form);
        });

        this.events.on(AppEvents.ORDER_PHONE_CHANGED, (data: { form: Partial<IOrderForm> }) => {
            this.updateContactsFormView(data.form);
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
            
            // Добавляем CDN_URL к изображениям
            const productsWithCDN = (products || []).map(product => ({
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
        
        const previewElement = createElementFromTemplate('card-preview');
        this.productPreviewView = new ProductPreviewView(previewElement, this.events);
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

    private isPaymentFormOpen(): boolean {
        const modalContent = document.querySelector('#modal-container .modal__content');
        return !!(modalContent && modalContent.querySelector('form[data-form="payment"]'));
    }

    private isContactsFormOpen(): boolean {
        const modalContent = document.querySelector('#modal-container .modal__content');
        return !!(modalContent && modalContent.querySelector('form[data-form="contacts"]'));
    }
} 