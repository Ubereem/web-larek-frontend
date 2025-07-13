import { IOrderForm } from '../../types';

export class OrderModel {
    form: Partial<IOrderForm> = {};

    setPayment(payment: 'card' | 'cash'): void {
        this.form.payment = payment;
    }

    setAddress(address: string): void {
        this.form.address = address;
    }

    setEmail(email: string): void {
        this.form.email = email;
    }

    setPhone(phone: string): void {
        this.form.phone = phone;
    }

    getForm(): Partial<IOrderForm> {
        return this.form;
    }

    reset(): void {
        this.form = {};
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