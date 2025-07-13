import { EventEmitter } from '../base/events';
import { ProductService } from './ProductService';
import { ProductModel } from './ProductModel';
import { CartModel } from './CartModel';
import { OrderModel } from './OrderModel';
import { AppModalView } from './AppModalView';
import { CartView } from './CartView';
import { HeaderBasketView } from './HeaderBasketView';
import { ProductGalleryView } from './ProductGalleryView';
import { AppPresenter } from './AppPresenter';
import { API_URL } from '../../utils/constants';
import { createElementFromTemplate } from '../../utils/template';

export class App {
    private events: EventEmitter;
    private productService: ProductService;
    private productModel: ProductModel;
    private cartModel: CartModel;
    private orderModel: OrderModel;
    private modal: AppModalView;
    private cartView: CartView;
    private headerBasketView: HeaderBasketView;
    private productGalleryView: ProductGalleryView;
    private presenter: AppPresenter;

    constructor() {
        // Создаем только базовые сервисы и EventEmitter
        this.events = new EventEmitter();
        this.productModel = new ProductModel(this.events);
        this.cartModel = new CartModel(this.events);
        this.orderModel = new OrderModel(this.events);
        this.productService = new ProductService(API_URL, this.orderModel);
        
        this.initializeViews();
        this.initializePresenter();
    }

    private initializeViews(): void {
        // Инициализация модального окна
        this.modal = new AppModalView('#modal-container', this.events);
        
        // Инициализация корзины из темплейта
        const cartElement = createElementFromTemplate('basket');
        this.cartView = new CartView(cartElement, this.events);

        // Инициализация кнопки корзины в шапке
        const headerElement = document.querySelector('header') as HTMLElement;
        if (headerElement) {
            this.headerBasketView = new HeaderBasketView(headerElement, this.events);
        }

        // Инициализация галерии товаров
        const galleryElement = document.querySelector('.gallery') as HTMLElement;
        if (galleryElement) {
            this.productGalleryView = new ProductGalleryView(galleryElement, this.events);
        }
    }

    private initializePresenter(): void {
        // Создаем презентер, передавая ему все зависимости
        this.presenter = new AppPresenter(
            this.events,
            this.productService,
            this.productModel,
            this.cartModel,
            this.orderModel,
            this.modal,
            this.cartView,
            this.headerBasketView,
            this.productGalleryView
        );
    }
} 