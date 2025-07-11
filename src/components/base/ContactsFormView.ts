import { FormView } from './FormView';

export class ContactsFormView extends FormView {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;
    private email: string = '';
    private phone: string = '';

    constructor(form: HTMLFormElement) {
        super(form);
        this.emailInput = form.querySelector('input[name="email"]')!;
        this.phoneInput = form.querySelector('input[name="phone"]')!;
    }

    render(data?: { email?: string; phone?: string }): void {
        if (data?.email) this.email = data.email;
        if (data?.phone) this.phone = data.phone;
        this.emailInput.value = this.email;
        this.phoneInput.value = this.phone;
    }

    protected onSubmit(): void {
        // Здесь можно сгенерировать событие или вызвать callback
    }

    protected onInput(name: string, value: string): void {
        if (name === 'email') this.email = value;
        if (name === 'phone') this.phone = value;
        // Здесь можно сгенерировать событие или вызвать callback
    }

    setEmail(email: string): void {
        this.email = email;
        this.render({ email });
    }

    setPhone(phone: string): void {
        this.phone = phone;
        this.render({ phone });
    }
} 