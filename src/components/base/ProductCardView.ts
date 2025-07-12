import { ProductView } from './ProductView';
import { IProduct, ProductCategory, AppEvents } from '../../types';
import { IEvents } from './events';

export class ProductCardView extends ProductView {
    private _image: HTMLImageElement;
    private _category: HTMLElement;
    private _button: HTMLButtonElement;
    private events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this._image = container.querySelector('.card__image') as HTMLImageElement;
        this._category = container.querySelector('.card__category') as HTMLElement;
        this._button = container.querySelector('.card__button') as HTMLButtonElement;
        
        this.bindEvents();
    }

    private bindEvents(): void {
        // Клик по кнопке «В корзину»
        this._button?.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = this.container.dataset.id;
            if (productId) {
                this.events.emit(AppEvents.PRODUCT_SELECTED, { productId });
            }
        });

        // Клик по карточке — открыть превью
        this.container.addEventListener('click', (e) => {
            if (e.target === this._button) return;
            const productId = this.container.dataset.id;
            if (productId) {
                this.events.emit(AppEvents.MODAL_OPENED, { productId });
            }
        });
    }

    set image(value: string) {
        if (this._image) {
            this._image.src = value;
            this._image.alt = this._title?.textContent || 'Product image';
        }
    }

    set category(value: ProductCategory) {
        if (this._category) {
            // Удаляем все старые модификаторы
            this._category.className = 'card__category';
            // Добавляем нужный модификатор
            switch (value) {
                case 'софт-скил':
                    this._category.classList.add('card__category_soft');
                    break;
                case 'хард-скил':
                    this._category.classList.add('card__category_hard');
                    break;
                case 'другое':
                    this._category.classList.add('card__category_other');
                    break;
                case 'дополнительное':
                    this._category.classList.add('card__category_additional');
                    break;
                case 'кнопка':
                    this._category.classList.add('card__category_button');
                    break;
            }
            this._category.textContent = value;
        }
    }

    render(data?: Partial<IProduct>): HTMLElement {
        super.render(data);
        
        if (data && this.container) {
            if (data.image !== undefined) this.image = data.image;
            if (data.category !== undefined) this.category = data.category;
            if (data.id !== undefined) this.container.dataset.id = data.id;
            if (this._button) {
                if (data.price === null) {
                    this._button.disabled = true;
                    this._button.textContent = 'Недоступно';
                } else {
                    this._button.disabled = false;
                    this._button.textContent = this._inCart ? 'Удалить из корзины' : 'В корзину';
                }
            }
        }
        
        return this.container;
    }

    private _inCart: boolean = false;
    set inCart(value: boolean) {
        this._inCart = value;
        if (this._button) {
            if (!this._button.disabled) {
                this._button.textContent = value ? 'Удалить из корзины' : 'В корзину';
            }
            if (value) {
                this._button.classList.add('card__button_alt-active');
            } else {
                this._button.classList.remove('card__button_alt-active');
            }
        }
    }
} 