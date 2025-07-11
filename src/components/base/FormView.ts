import { IView } from '../../types';

export abstract class FormView implements IView {
    protected form: HTMLFormElement;
    protected submitButton: HTMLButtonElement;
    protected errorsContainer: HTMLElement;

    constructor(form: HTMLFormElement) {
        this.form = form;
        this.submitButton = form.querySelector('button[type="submit"]')!;
        this.errorsContainer = form.querySelector('.form__errors')!;
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.onSubmit();
        });
        this.form.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            this.onInput(target.name, target.value);
        });
    }

    abstract render(data?: any): void;

    setDisabled(disabled: boolean): void {
        this.submitButton.disabled = disabled;
    }

    setErrors(errors: string[]): void {
        this.errorsContainer.textContent = errors.join(', ');
        this.errorsContainer.style.display = errors.length ? 'block' : 'none';
    }

    clearErrors(): void {
        this.errorsContainer.textContent = '';
        this.errorsContainer.style.display = 'none';
    }

    protected abstract onSubmit(): void;
    protected abstract onInput(name: string, value: string): void;
} 