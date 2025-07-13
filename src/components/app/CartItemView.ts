import { ProductView } from './ProductView';
import { ICartItem, AppEvents } from '../../types';
import { IEvents } from '../base/events';

export class CartItemView extends ProductView {
    private _index: HTMLElement;
    private _deleteButton: HTMLButtonElement;
    private events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this._index = container.querySelector('.basket__item-index') as HTMLElement;
        this._deleteButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;
        
        this.bindEvents();
    }

    private bindEvents(): void {
        this._deleteButton?.addEventListener('click', () => {
            const productId = this.container.dataset.id;
            if (productId) {
                this.events.emit(AppEvents.PRODUCT_SELECTED, { productId });
            }
        });
    }

    set index(value: number) {
        if (this._index) {
            this._index.textContent = value.toString();
        }
    }

    set deleteHandler(handler: () => void) {
        if (this._deleteButton) {
            this._deleteButton.onclick = handler;
        }
    }

    render(data?: Partial<ICartItem>): HTMLElement {
        super.render(data);
        
        if (data) {
            // Устанавливаем все свойства через сеттеры
            if (data.index !== undefined) this.index = data.index;
            if (data.id !== undefined) this.container.dataset.id = data.id;
        }
        
        return this.container;
    }
} 