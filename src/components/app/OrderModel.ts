import { Model } from '../base/Model';
import { IOrderForm, AppEvents } from '../../types';
import { IEvents } from '../base/events';

export class OrderModel extends Model<{ form: Partial<IOrderForm> }> {
    form: Partial<IOrderForm> = {};

    constructor(events: IEvents) {
        super({}, events);
    }

    setPayment(payment: 'card' | 'cash'): void {
        this.form.payment = payment;
        this.emitChanges(AppEvents.ORDER_PAYMENT_CHANGED, { form: this.form });
    }

    setAddress(address: string): void {
        this.form.address = address;
        this.emitChanges(AppEvents.ORDER_ADDRESS_CHANGED, { form: this.form });
    }

    setEmail(email: string): void {
        this.form.email = email;
        this.emitChanges(AppEvents.ORDER_EMAIL_CHANGED, { form: this.form });
    }

    setPhone(phone: string): void {
        this.form.phone = phone;
        this.emitChanges(AppEvents.ORDER_PHONE_CHANGED, { form: this.form });
    }

    getForm(): Partial<IOrderForm> {
        return this.form;
    }

    reset(): void {
        this.form = {};
        this.emitChanges(AppEvents.ORDER_PAYMENT_CHANGED, { form: this.form });
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
        } else if (!this.isValidEmail(this.form.email)) {
            errors.email = 'Некорректный email';
        }

        if (!this.form.phone || this.form.phone.trim() === '') {
            errors.phone = 'Не указан телефон';
        } else if (!this.isValidPhone(this.form.phone)) {
            errors.phone = 'Некорректный номер телефона';
        }

        return errors;
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private isValidPhone(phone: string): boolean {
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }
} 