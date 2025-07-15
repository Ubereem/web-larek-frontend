import './scss/styles.scss';
import { App } from './components/app/App';
import { EventEmitter } from './components/base/events';
import { ProductService } from './components/app/ProductService';
import { ProductModel } from './components/app/ProductModel';
import { CartModel } from './components/app/CartModel';
import { OrderModel } from './components/app/OrderModel';
import { AppModalView } from './components/app/AppModalView';
import { CartView } from './components/app/CartView';
import { HeaderBasketView } from './components/app/HeaderBasketView';
import { ProductGalleryView } from './components/app/ProductGalleryView';
import { API_URL } from './utils/constants';
import { createElementFromTemplate } from './utils/template';

// Создание экземпляров зависимостей
const events = new EventEmitter();
const productModel = new ProductModel(events);
const cartModel = new CartModel(events);
const orderModel = new OrderModel(events);
const productService = new ProductService(API_URL, orderModel);

const modal = new AppModalView('#modal-container', events);
const cartElement = createElementFromTemplate('basket');
const cartView = new CartView(cartElement, events);
const headerElement = document.querySelector('header') as HTMLElement;
const headerBasketView = new HeaderBasketView(headerElement, events);
const galleryElement = document.querySelector('.gallery') as HTMLElement;
const productGalleryView = new ProductGalleryView(galleryElement, events);

// Запуск приложения
new App(
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
