import { ICartItem, AppEvents } from '../../types';
import { IEvents } from '../base/events';
import { CartItemView } from './CartItemView';

export class CartView {
    private container: HTMLElement;
    private _list: HTMLElement;
    private _total: HTMLElement;
    private _button: HTMLButtonElement;
    private events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        this.container = container;
        this.events = events;
        this._list = container.querySelector('.basket__list') as HTMLElement;
        this._total = container.querySelector('.basket__price') as HTMLElement;
        this._button = container.querySelector('.basket__button') as HTMLButtonElement;
        
        this.bindEvents();
    }

    private bindEvents(): void {
        this._button?.addEventListener('click', () => {
            this.events.emit(AppEvents.ORDER_SUBMITTED);
        });
    }

    set items(value: ICartItem[]) {
        if (this._list) {
            this._list.innerHTML = '';
            
            value.forEach(item => {
                const itemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
                if (itemTemplate) {
                    const itemFragment = itemTemplate.content.cloneNode(true) as DocumentFragment;
                    const itemElement = itemFragment.firstElementChild as HTMLElement;
                    
                    if (itemElement) {
                        const itemView = new CartItemView(itemElement, this.events);
                        
                        itemView.render(item);
                        itemView.deleteHandler = () => {
                            this.events.emit(AppEvents.CART_ITEM_REMOVED, { productId: item.id });
                        };
                        
                        this._list.appendChild(itemView.render());
                    }
                }
            });
        }
    }

    set total(value: number) {
        if (this._total) {
            this._total.textContent = `${value} синапсов`;
        }
    }

    set disabled(value: boolean) {
        if (this._button) {
            this._button.disabled = value;
        }
    }

    render(data?: Partial<{ items: ICartItem[], total: number }>): HTMLElement {
        if (data) {
            if (data.items !== undefined) this.items = data.items;
            if (data.total !== undefined) this.total = data.total;
        }
        return this.container;
    }
} 