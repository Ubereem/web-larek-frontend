import { IEvents } from '../base/events';

export class SuccessView {
    private container: HTMLElement;
    private _title: HTMLElement;
    private _description: HTMLElement;
    private _button: HTMLButtonElement;
    private events?: IEvents;

    constructor(container: HTMLElement, events?: IEvents) {
        this.container = container;
        this._title = container.querySelector('.order-success__title') as HTMLElement;
        this._description = container.querySelector('.order-success__description') as HTMLElement;
        this._button = container.querySelector('.order-success__button') as HTMLButtonElement;
        this.events = events;
        
        this.bindEvents();
    }

    private bindEvents(): void {
        this._button?.addEventListener('click', () => {
            // Закрыть модальное окно через событие
            this.events?.emit('modal:close');
        });
    }

    set total(value: number) {
        if (this._description) {
            this._description.textContent = `Списано ${value} синапсов`;
        }
    }

    set disabled(value: boolean) {
        if (this._button) {
            this._button.disabled = value;
        }
    }

    render(data?: Partial<{ total: number }>): HTMLElement {
        if (data && data.total !== undefined) {
            this.total = data.total;
        }
        return this.container;
    }
} 