

export class ModalView {
    protected container: HTMLElement;
    protected content: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(containerSelector: string) {
        this.container = document.querySelector(containerSelector) as HTMLElement;
        this.content = this.container.querySelector('.modal__content') as HTMLElement;
        this.closeButton = this.container.querySelector('.modal__close') as HTMLButtonElement;

        // Убираем modal_active при инициализации, если он есть
        this.container.classList.remove('modal_active');
        
        this.bindEvents();
    }

    private bindEvents(): void {
        // Клик по крестику
        this.closeButton?.addEventListener('click', (e) => {
            e.preventDefault();
            this.close();
        });
        // Клик вне модального окна (оверлей)
        this.container?.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.close();
            }
        });
        // ESC для закрытия
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.container.classList.contains('modal_active')) {
                this.close();
            }
        });
    }

    set contentElement(value: HTMLElement | null) {
        this.content.innerHTML = '';
        if (value) {
            this.content.appendChild(value);
        }
    }

    open() {
        this.container.classList.add('modal_active');
        const pageWrapper = document.querySelector('.page__wrapper');
        if (pageWrapper) {
            pageWrapper.classList.add('page__wrapper_locked');
        }
    }

    close() {
        this.container.classList.remove('modal_active');
        this.content.innerHTML = '';
        const pageWrapper = document.querySelector('.page__wrapper');
        if (pageWrapper) {
            pageWrapper.classList.remove('page__wrapper_locked');
        }
    }

    render(content: HTMLElement): HTMLElement {
        this.contentElement = content;
        this.open();
        return this.container;
    }

    setDisabled(disabled: boolean): void {
        if (this.closeButton) {
            this.closeButton.disabled = disabled;
        }
    }

    isOpen(): boolean {
        return this.container.classList.contains('modal_active');
    }
} 