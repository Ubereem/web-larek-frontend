import { IOrderForm } from '../../types';

import { IEvents } from '../base/events';
import { AppEvents } from '../../types';

export class OrderModel {
    form: Partial<IOrderForm> = {};
    private events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setPayment(payment: 'card' | 'cash'): void {
        this.form.payment = payment;
        this.events.emit(AppEvents.ORDER_PAYMENT_CHANGED, { form: this.form });
    }

    setAddress(address: string): void {
        this.form.address = address;
        this.events.emit(AppEvents.ORDER_ADDRESS_CHANGED, { form: this.form });
    }

    setEmail(email: string): void {
        this.form.email = email;
        this.events.emit(AppEvents.ORDER_EMAIL_CHANGED, { form: this.form });
    }

    setPhone(phone: string): void {
        this.form.phone = phone;
        this.events.emit(AppEvents.ORDER_PHONE_CHANGED, { form: this.form });
    }

    getForm(): Partial<IOrderForm> {
        return this.form;
    }

    reset(): void {
        this.form = {};
        this.events.emit(AppEvents.ORDER_PAYMENT_CHANGED, { form: this.form });
    }

    validate(): Partial<Record<keyof IOrderForm, string>> {
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

        return errors;
    }


} 