import { FormView } from '../base/FormView';
import { AppEvents } from '../../types';
import { IEvents } from '../base/events';

interface IContactsFormData {
    email?: string;
    phone?: string;
    valid?: boolean;
    errors?: string[];
}

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
            this.events.emit('contacts:email-changed', { email: target.value });
        });

        this._phoneInput?.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            this.events.emit('contacts:phone-changed', { phone: target.value });
        });
    }

    set email(value: string) {
        if (this._emailInput) {
            this._emailInput.value = value;
        }
    }

    set phone(value: string) {
        if (this._phoneInput) {
            this._phoneInput.value = value;
        }
    }

    set valid(value: boolean) {
        if (this._submitButton) {
            this._submitButton.disabled = !value;
        }
    }

    render(data?: Partial<IContactsFormData>): HTMLElement {
        super.render(data);
        
        if (data) {
            if (data.email !== undefined) this.email = data.email;
            if (data.phone !== undefined) this.phone = data.phone;
            if (data.valid !== undefined) this.valid = data.valid;
        }
        
        return this.container;
    }

    protected onSubmit(): void {
        this.events.emit('contacts:submit', {
            email: this.getEmail(),
            phone: this.getPhone()
        });
    }

    // Методы для получения текущих данных (используются презентером)
    private getEmail(): string {
        return this._emailInput?.value || '';
    }

    private getPhone(): string {
        return this._phoneInput?.value || '';
    }
} 