import { IView } from '../../types';

export abstract class FormView implements IView {
    protected container: HTMLElement;
    protected _submitButton: HTMLButtonElement;
    protected _errorsContainer: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
        this._submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
        this._errorsContainer = container.querySelector('.form__errors') as HTMLElement;
        
        this.bindEvents();
    }

    private bindEvents(): void {
        const form = this.container.querySelector('form') as HTMLFormElement;
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.onSubmit();
            });
        }
    }

    set errors(value: string[]) {
        if (this._errorsContainer) {
            this._errorsContainer.textContent = value.join(', ');
            this._errorsContainer.style.display = value.length ? 'block' : 'none';
        }
    }

    set disabled(value: boolean) {
        if (this._submitButton) {
            this._submitButton.disabled = value;
        }
    }

    setDisabled(disabled: boolean): void {
        this.disabled = disabled;
    }

    render(data?: Partial<{ errors: string[] }>): HTMLElement {
        if (data && data.errors !== undefined) {
            this.errors = data.errors;
        }
        return this.container;
    }

    clearErrors(): void {
        if (this._errorsContainer) {
            this._errorsContainer.textContent = '';
            this._errorsContainer.style.display = 'none';
        }
    }

    protected abstract onSubmit(): void;
} 