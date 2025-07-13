import { IOrderForm } from '../../types';
import { IEvents } from '../base/events';
import { AppEvents } from '../../types';

export class OrderModel {
    form: Partial<IOrderForm> = {};
    private events: IEvents;
    private formErrors: Partial<Record<keyof IOrderForm, string>> = {};

    constructor(events: IEvents) {
        this.events = events;
    }

    setPayment(payment: 'card' | 'cash'): void {
        this.form.payment = payment;
        this.validateForm();
    }

    setAddress(address: string): void {
        this.form.address = address;
        this.validateForm();
    }

    setEmail(email: string): void {
        this.form.email = email;
        this.validateForm();
    }

    setPhone(phone: string): void {
        this.form.phone = phone;
        this.validateForm();
    }

    getForm(): Partial<IOrderForm> {
        return this.form;
    }

    getFormErrors(): Partial<Record<keyof IOrderForm, string>> {
        return this.formErrors;
    }

    reset(): void {
        this.form = {};
        this.formErrors = {};
        this.events.emit('formErrors:change', this.formErrors);
    }

    private validateForm(): void {
        const errors: Partial<Record<keyof IOrderForm, string>> = {};

        if (!this.form.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }

        if (!this.form.address || this.form.address.trim() === '') {
            errors.address = 'Не указан адрес доставки';
        }

        if (!this.form.email || this.form.email.trim() === '') {
            errors.email = 'Не указан email';
        }

        if (!this.form.phone || this.form.phone.trim() === '') {
            errors.phone = 'Не указан телефон';
        }

        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);

        // Если форма валидна, эмитим событие готовности
        if (Object.keys(errors).length === 0) {
            this.events.emit('order:ready', this.form);
        }
    }

    isValid(): boolean {
        return Object.keys(this.formErrors).length === 0;
    }
} 