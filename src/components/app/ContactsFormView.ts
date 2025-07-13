import { FormView } from '../base/FormView';
import { AppEvents } from '../../types';
import { IEvents } from '../base/events';

export class ContactsFormView extends FormView {
    private _emailInput: HTMLInputElement;
    private _phoneInput: HTMLInputElement;
    private events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this._emailInput = container.querySelector('input[name="email"]') as HTMLInputElement;
        this._phoneInput = container.querySelector('input[name="phone"]') as HTMLInputElement;
        
        this.bindInputEvents();
    }

    private bindInputEvents(): void {
        this._emailInput?.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            this.email = target.value;
            this.events.emit(AppEvents.ORDER_EMAIL_CHANGED, { email: target.value });
        });

        this._phoneInput?.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            this.phone = target.value;
            this.events.emit(AppEvents.ORDER_PHONE_CHANGED, { phone: target.value });
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
        if (this._submitButton) {
            const hasEmail = this._emailInput?.value && this._emailInput.value.trim() !== '';
            const hasPhone = this._phoneInput?.value && this._phoneInput.value.trim() !== '';
            
            this._submitButton.disabled = !hasEmail || !hasPhone;
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