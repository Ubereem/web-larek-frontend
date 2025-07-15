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

export class App {
    private presenter: AppPresenter;

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
        this.presenter = new AppPresenter(
            events,
            productService,
            productModel,
            cartModel,
            orderModel,
            modal,
            cartView,
            headerBasketView,
            productGalleryView
        );
    }
} 