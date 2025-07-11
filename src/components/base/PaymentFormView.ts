import { FormView } from './FormView';

export class PaymentFormView extends FormView {
    private paymentButtons: NodeListOf<HTMLButtonElement>;
    private addressInput: HTMLInputElement;
    private payment: 'card' | 'cash' | null = null;
    private address: string = '';

    constructor(form: HTMLFormElement) {
        super(form);
        this.paymentButtons = form.querySelectorAll('.order__buttons .button');
        this.addressInput = form.querySelector('input[name="address"]')!;
        this.paymentButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.payment = btn.name as 'card' | 'cash';
                this.onInput('payment', this.payment);
            });
        });
    }

    render(data?: { payment?: 'card' | 'cash'; address?: string }): void {
        if (data?.payment) this.payment = data.payment;
        if (data?.address) this.address = data.address;
        this.addressInput.value = this.address;
        this.paymentButtons.forEach(btn => {
            btn.classList.toggle('active', btn.name === this.payment);
        });
    }

    protected onSubmit(): void {
        // Здесь можно сгенерировать событие или вызвать callback
    }

    protected onInput(name: string, value: string): void {
        if (name === 'address') this.address = value;
        if (name === 'payment') this.payment = value as 'card' | 'cash';
        // Здесь можно сгенерировать событие или вызвать callback
    }

    setPayment(payment: 'card' | 'cash'): void {
        this.payment = payment;
        this.render({ payment });
    }

    setAddress(address: string): void {
        this.address = address;
        this.render({ address });
    }
} 