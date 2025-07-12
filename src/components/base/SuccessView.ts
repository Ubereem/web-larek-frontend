export class SuccessView {
    private container: HTMLElement;
    private _title: HTMLElement;
    private _description: HTMLElement;
    private _button: HTMLButtonElement;

    constructor(container: HTMLElement) {
        this.container = container;
        this._title = container.querySelector('.order-success__title') as HTMLElement;
        this._description = container.querySelector('.order-success__description') as HTMLElement;
        this._button = container.querySelector('.order-success__button') as HTMLButtonElement;
        
        this.bindEvents();
    }

    private bindEvents(): void {
        this._button?.addEventListener('click', () => {
            // Закрыть модальное окно
            const modal = this.container.closest('.modal');
            if (modal) {
                modal.classList.remove('modal_active');
                document.body.style.overflow = '';
            }
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