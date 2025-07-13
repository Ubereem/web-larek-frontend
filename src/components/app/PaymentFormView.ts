import { FormView } from '../base/FormView';
import { AppEvents } from '../../types';
import { IEvents } from '../base/events';

export class PaymentFormView extends FormView {
    private _paymentButtons: HTMLButtonElement[];
    private _addressInput: HTMLInputElement;
    private events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this._paymentButtons = Array.from(container.querySelectorAll('.order__buttons .button')) as HTMLButtonElement[];
        this._addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;
        
        this.bindPaymentEvents();
    }

    private bindPaymentEvents(): void {
        this._paymentButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const payment = btn.name as 'card' | 'cash';
                this.payment = payment;
                this.events.emit(AppEvents.ORDER_PAYMENT_CHANGED, { payment });
            });
        });

        this._addressInput?.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            this.address = target.value;
            this.events.emit(AppEvents.ORDER_ADDRESS_CHANGED, { address: target.value });
        });
    }

    set payment(value: 'card' | 'cash') {
        this._paymentButtons.forEach(btn => {
            btn.classList.toggle('active', btn.name === value);
        });
        this.updateSubmitButton();
    }

    set address(value: string) {
        if (this._addressInput) {
            this._addressInput.value = value;
        }
        this.updateSubmitButton();
    }

    private updateSubmitButton(): void {
        if (this._submitButton) {
            const hasPayment = this._paymentButtons.some(btn => btn.classList.contains('active'));
            const hasAddress = this._addressInput?.value && this._addressInput.value.trim() !== '';
            
            this._submitButton.disabled = !hasPayment || !hasAddress;
        }
    }

    render(data?: Partial<{ payment: 'card' | 'cash', address: string, errors: string[] }>): HTMLElement {
        super.render(data);
        
        if (data) {
            if (data.payment !== undefined) this.payment = data.payment;
            if (data.address !== undefined) this.address = data.address;
        }
        
        return this.container;
    }

    protected onSubmit(): void {
        this.events.emit(AppEvents.ORDER_SUBMITTED);
    }
} 