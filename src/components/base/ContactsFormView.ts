import { FormView } from './FormView';
import { AppEvents } from '../../types';
import { IEvents } from './events';

export class ContactsFormView extends FormView {
    private _emailInput: HTMLInputElement;
    private _phoneInput: HTMLInputElement;
    private events: IEvents;
    private orderModel: any; // Будет передаваться из App

    constructor(container: HTMLElement, events: IEvents, orderModel?: any) {
        super(container);
        this.events = events;
        this.orderModel = orderModel;
        this._emailInput = container.querySelector('input[name="email"]') as HTMLInputElement;
        this._phoneInput = container.querySelector('input[name="phone"]') as HTMLInputElement;
        
        this.bindInputEvents();
    }

    private bindInputEvents(): void {
        this._emailInput?.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            this.email = target.value;
            if (this.orderModel) {
                this.orderModel.setEmail(target.value);
            }
        });

        this._phoneInput?.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            this.phone = target.value;
            if (this.orderModel) {
                this.orderModel.setPhone(target.value);
            }
        });
    }

    set email(value: string) {
        if (this._emailInput) {
            this._emailInput.value = value;
        }
        this.updateSubmitButton();
    }

    set phone(value: string) {
        if (this._phoneInput) {
            this._phoneInput.value = value;
        }
        this.updateSubmitButton();
    }

    private updateSubmitButton(): void {
        const submitButton = this.container.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (submitButton) {
            const orderForm = this.orderModel?.getForm();
            const hasEmail = orderForm?.email && orderForm.email.trim() !== '';
            const hasPhone = orderForm?.phone && orderForm.phone.trim() !== '';
            
            submitButton.disabled = !hasEmail || !hasPhone;
        }
    }

    render(data?: Partial<{ email: string, phone: string, errors: string[] }>): HTMLElement {
        super.render(data);
        
        if (data) {
            if (data.email !== undefined) this.email = data.email;
            if (data.phone !== undefined) this.phone = data.phone;
        }
        
        return this.container;
    }

    protected onSubmit(): void {
        this.events.emit(AppEvents.ORDER_SUBMITTED);
    }
} 