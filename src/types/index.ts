// Типы данных для товаров
export interface IProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    category: ProductCategory;
    price: number | null; // null для бесценных товаров
}

export type ProductCategory = 'софт-скил' | 'хард-скил' | 'другое';

// Типы данных для корзины
export interface ICartItem {
    id: string;
    title: string;
    price: number | null;
    index: number;
}

// Типы данных для заказа
export interface IOrderForm {
    payment: 'card' | 'cash';
    address: string;
    email: string;
    phone: string;
}

export interface IOrder {
    total: number;
    items: string[]; // массив ID товаров
}

// Типы данных для API
export interface IApiResponse<T> {
    total: number;
    items: T[];
}

export interface IApiError {
    error: string;
}

// Интерфейс API клиента
export interface IApiClient {
    getProducts(): Promise<IApiResponse<IProduct>>;
    createOrder(order: IOrder): Promise<{ total: number; items: string[] }>;
}

// Интерфейс сервиса для работы с товарами
export interface IProductService {
    getProducts(): Promise<IProduct[]>;
}

// Интерфейсы для моделей
export interface IProductModel {
    items: IProduct[];
    setItems(items: IProduct[]): void;
    getProductById(id: string): IProduct | undefined;
    getItems(): IProduct[];
}

export interface ICartModel {
    items: ICartItem[];
    addItem(product: IProduct): void;
    removeItem(id: string): void;
    clear(): void;
    getItems(): ICartItem[];
    getTotal(): number;
    isInCart(id: string): boolean;
}

export interface IOrderModel {
    form: Partial<IOrderForm>;
    setPayment(payment: 'card' | 'cash'): void;
    setAddress(address: string): void;
    setEmail(email: string): void;
    setPhone(phone: string): void;
    reset(): void;
    isValid(): boolean;
    getForm(): Partial<IOrderForm>;
}

// Интерфейсы для представлений
export interface IView {
    render(data?: any): void;
    setDisabled(disabled: boolean): void;
}

export interface IModalView extends IView {
    open(): void;
    close(): void;
    setContent(content: HTMLElement): void;
}

// Базовый интерфейс для всех представлений товаров
export interface IProductView extends IView {
    setTitle(title: string): void;
    setPrice(price: number | null): void;
}

export interface IProductCardView extends IProductView {
    setImage(src: string): void;
    setCategory(category: ProductCategory): void;
    setInCart(inCart: boolean): void;
}

export interface IProductPreviewView extends IProductView {
    setImage(src: string): void;
    setCategory(category: ProductCategory): void;
    setDescription(description: string): void;
    setInCart(inCart: boolean): void;
}

export interface ICartItemView extends IProductView {
    setIndex(index: number): void;
    setDeleteHandler(handler: () => void): void;
}

export interface ICartView extends IView {
    setItems(items: ICartItem[]): void;
    setTotal(total: number): void;
}

export interface IOrderFormView extends IView {
    setPayment(payment: 'card' | 'cash'): void;
    setAddress(address: string): void;
    setEmail(email: string): void;
    setPhone(phone: string): void;
    setErrors(errors: string[]): void;
    clearErrors(): void;
}

// События приложения
export enum AppEvents {
    // События товаров
    PRODUCTS_LOADED = 'products:loaded',
    PRODUCT_SELECTED = 'product:selected',
    
    // События корзины
    CART_ITEM_ADDED = 'cart:item:added',
    CART_ITEM_REMOVED = 'cart:item:removed',
    CART_CLEARED = 'cart:cleared',
    CART_OPENED = 'cart:opened',
    
    // События заказа
    ORDER_PAYMENT_CHANGED = 'order:payment:changed',
    ORDER_ADDRESS_CHANGED = 'order:address:changed',
    ORDER_EMAIL_CHANGED = 'order:email:changed',
    ORDER_PHONE_CHANGED = 'order:phone:changed',
    ORDER_SUBMITTED = 'order:submitted',
    ORDER_SUCCESS = 'order:success',
    
    // События модальных окон
    MODAL_OPENED = 'modal:opened',
    MODAL_CLOSED = 'modal:closed',
    
    // События форм
    FORM_VALIDATED = 'form:validated',
    FORM_ERRORS = 'form:errors'
}

// Интерфейсы событий
export interface IProductEvent {
    product: IProduct;
}

export interface ICartEvent {
    item: ICartItem;
    product?: IProduct;
}

export interface IOrderEvent {
    form: Partial<IOrderForm>;
}

export interface IModalEvent {
    content?: HTMLElement;
}

export interface IFormEvent {
    errors?: string[];
    isValid?: boolean;
}
