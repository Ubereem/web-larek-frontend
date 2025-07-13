import { FormView } from '../base/FormView';
import { AppEvents } from '../../types';
import { IEvents } from '../base/events';

interface IPaymentFormData {
    payment?: 'card' | 'cash';
    address?: string;
    valid?: boolean;
    errors?: string[];
}

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
                this.events.emit('payment:method-selected', { payment });
            });
        });

        this._addressInput?.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            this.events.emit('payment:address-changed', { address: target.value });
        });
    }

    set payment(value: 'card' | 'cash') {
        this._paymentButtons.forEach(btn => {
            btn.classList.toggle('active', btn.name === value);
        });
    }

    set address(value: string) {
        if (this._addressInput) {
            this._addressInput.value = value;
        }
    }

    set valid(value: boolean) {
        if (this._submitButton) {
            this._submitButton.disabled = !value;
        }
    }

    render(data?: Partial<IPaymentFormData>): HTMLElement {
        super.render(data);
        
        if (data) {
            if (data.payment !== undefined) this.payment = data.payment;
            if (data.address !== undefined) this.address = data.address;
            if (data.valid !== undefined) this.valid = data.valid;
        }
        
        return this.container;
    }

    protected onSubmit(): void {
        this.events.emit('payment:next', {
            payment: this.getPayment(),
            address: this.getAddress()
        });
    }

    // Методы для получения текущих данных (используются презентером)
    private getPayment(): 'card' | 'cash' | null {
        const activeButton = this._paymentButtons.find(btn => btn.classList.contains('active'));
        return activeButton?.name as 'card' | 'cash' || null;
    }

    private getAddress(): string {
        return this._addressInput?.value || '';
    }
} 