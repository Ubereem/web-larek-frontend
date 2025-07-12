import { FormView } from './FormView';
import { AppEvents } from '../../types';
import { IEvents } from './events';

export class PaymentFormView extends FormView {
    private _paymentButtons: HTMLButtonElement[];
    private _addressInput: HTMLInputElement;
    private events: IEvents;
    private orderModel: any; // Будет передаваться из App

    constructor(container: HTMLElement, events: IEvents, orderModel?: any) {
        super(container);
        this.events = events;
        this.orderModel = orderModel;
        this._paymentButtons = Array.from(container.querySelectorAll('.order__buttons .button')) as HTMLButtonElement[];
        this._addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;
        
        this.bindPaymentEvents();
    }

    private bindPaymentEvents(): void {
        this._paymentButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const payment = btn.name as 'card' | 'cash';
                this.payment = payment;
                if (this.orderModel) {
                    this.orderModel.setPayment(payment);
                }
            });
        });

        this._addressInput?.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            this.address = target.value;
            if (this.orderModel) {
                this.orderModel.setAddress(target.value);
            }
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
        const submitButton = this.container.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (submitButton) {
            const orderForm = this.orderModel?.getForm();
            const hasPayment = orderForm?.payment;
            const hasAddress = orderForm?.address && orderForm.address.trim() !== '';
            
            submitButton.disabled = !hasPayment || !hasAddress;
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