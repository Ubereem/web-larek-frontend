import { EventEmitter } from '../base/events';
import { AppEvents } from '../../types';

export class HeaderBasketView {
    private container: HTMLElement;
    private events: EventEmitter;
    private basketButton: HTMLElement | null = null;
    private counter: HTMLElement | null = null;

    constructor(container: HTMLElement, events: EventEmitter) {
        this.container = container;
        this.events = events;
        this.initialize();
    }

    private initialize(): void {
        this.basketButton = this.container.querySelector('.header__basket') as HTMLElement;
        this.counter = this.container.querySelector('.header__basket-counter') as HTMLElement;
        
        if (this.basketButton) {
            this.basketButton.addEventListener('click', () => {
                this.events.emit(AppEvents.CART_OPENED);
            });
        }
    }

    public updateCounter(count: number): void {
        if (this.counter) {
            this.counter.textContent = count.toString();
            if (count > 0) {
                this.counter.classList.remove('header__basket-counter_hidden');
            } else {
                this.counter.classList.add('header__basket-counter_hidden');
            }
        }
    }
} 