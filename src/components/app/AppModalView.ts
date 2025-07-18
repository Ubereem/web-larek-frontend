import { ModalView } from '../base/ModalView';
import { IEvents } from '../base/events';
import { ICartItem } from '../../types';

export class AppModalView extends ModalView {
    private events: IEvents;

    constructor(containerSelector: string, events: IEvents) {
        super(containerSelector);
        this.events = events;
    }

    showSuccess(totalPrice: number = 0): void {
        const template = document.querySelector('#success') as HTMLTemplateElement;
        if (template) {
            const successElement = template.content.cloneNode(true) as HTMLElement;
            const description = successElement.querySelector('.order-success__description');
            if (description) {
                description.textContent = `Списано ${totalPrice} синапсов`;
            }
            
            const closeButton = successElement.querySelector('.order-success__close');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    this.close();
                });
            }
            
            this.contentElement = successElement;
            this.open();
        }
    }

    showBasket(items: ICartItem[] = [], totalPrice: number = 0): void {
        const template = document.querySelector('#basket') as HTMLTemplateElement;
        if (template) {
            const basketElement = template.content.cloneNode(true) as HTMLElement;
            const list = basketElement.querySelector('.basket__list');
            const totalPriceElement = basketElement.querySelector('.basket__price');
            
            if (list) {
                list.innerHTML = '';
                if (items.length === 0) {
                    const emptyMsg = document.createElement('li');
                    emptyMsg.className = 'basket__empty';
                    emptyMsg.textContent = 'Корзина пуста';
                    list.appendChild(emptyMsg);
                } else {
                    items.forEach((item, index) => {
                        const itemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
                        if (itemTemplate) {
                            const itemElement = itemTemplate.content.cloneNode(true) as HTMLElement;
                            const indexElement = itemElement.querySelector('.basket__item-index');
                            const titleElement = itemElement.querySelector('.card__title');
                            const priceElement = itemElement.querySelector('.card__price');
                            const deleteButton = itemElement.querySelector('.basket__item-delete');
                            
                            if (indexElement) indexElement.textContent = String(index + 1);
                            if (titleElement) titleElement.textContent = item.title;
                            if (priceElement) priceElement.textContent = `${item.price} синапсов`;
                            
                            if (deleteButton) {
                                deleteButton.addEventListener('click', () => {
                                    this.events?.emit('basket:remove', item);
                                });
                            }
                            
                            list.appendChild(itemElement);
                        }
                    });
                }
            }
            
            if (totalPriceElement) {
                totalPriceElement.textContent = `${totalPrice} синапсов`;
            }
            
            const checkoutButton = basketElement.querySelector('.button') as HTMLButtonElement;
            if (checkoutButton) {
                // Делаем кнопку неактивной, если корзина пуста
                checkoutButton.disabled = items.length === 0;
                
                checkoutButton.addEventListener('click', () => {
                    if (items.length > 0) {
                        this.events?.emit('order:submitted');
                    }
                });
            }
            
            this.contentElement = basketElement;
            this.open();
        }
    }

    showPaymentForm(): void {
        const template = document.querySelector('#order') as HTMLTemplateElement;
        if (template) {
            const paymentForm = template.content.cloneNode(true) as HTMLElement;
            const form = paymentForm.querySelector('form') as HTMLFormElement;
            const nextButton = form.querySelector('.order__button') as HTMLButtonElement;
            const addressInput = form.querySelector('input[name="address"]') as HTMLInputElement;
            const cardButton = form.querySelector('button[name="card"]') as HTMLButtonElement;
            const cashButton = form.querySelector('button[name="cash"]') as HTMLButtonElement;
            const errorsContainer = form.querySelector('.form__errors') as HTMLElement;
            
            let selectedPayment: 'card' | 'cash' | null = null;
            
            const validateForm = () => {
                const addressValid = addressInput.value.trim() !== '';
                const paymentValid = selectedPayment !== null;
                nextButton.disabled = !(addressValid && paymentValid);
                
                // Показываем ошибки
                const errors: string[] = [];
                if (!paymentValid) {
                    errors.push('Не выбран способ оплаты');
                }
                if (!addressValid) {
                    errors.push('Не указан адрес доставки');
                }
                
                if (errorsContainer) {
                    errorsContainer.textContent = errors.join(', ');
                    if (errors.length) {
                        errorsContainer.classList.remove('form__errors_hidden');
                    } else {
                        errorsContainer.classList.add('form__errors_hidden');
                    }
                }
            };
            
            // Обработчики для кнопок способа оплаты
            if (cardButton) {
                cardButton.addEventListener('click', () => {
                    selectedPayment = 'card';
                    cardButton.classList.add('button_alt-active');
                    cashButton?.classList.remove('button_alt-active');
                    this.events?.emit('payment:method-selected', { payment: 'card' });
                    validateForm();
                });
            }
            
            if (cashButton) {
                cashButton.addEventListener('click', () => {
                    selectedPayment = 'cash';
                    cashButton.classList.add('button_alt-active');
                    cardButton?.classList.remove('button_alt-active');
                    this.events?.emit('payment:method-selected', { payment: 'cash' });
                    validateForm();
                });
            }
            
            if (addressInput && nextButton) {
                // Инициализируем состояние кнопки
                validateForm();
                
                addressInput.addEventListener('input', validateForm);
                
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    if (selectedPayment && addressInput.value.trim()) {
                        this.events?.emit('payment:next', { 
                            payment: selectedPayment,
                            address: addressInput.value 
                        });
                    } else {
                        validateForm(); // Показываем ошибки при попытке отправки
                    }
                });
            }
            
            this.contentElement = paymentForm;
            this.open();
        }
    }

    showContactsForm(): void {
        const template = document.querySelector('#contacts') as HTMLTemplateElement;
        if (template) {
            const contactsForm = template.content.cloneNode(true) as HTMLElement;
            const form = contactsForm.querySelector('form') as HTMLFormElement;
            const payButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
            const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
            const phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement;
            const errorsContainer = form.querySelector('.form__errors') as HTMLElement;
            
            const validateForm = () => {
                const emailValid = emailInput.value.trim() !== '';
                const phoneValid = phoneInput.value.trim() !== '';
                if (payButton) {
                    payButton.disabled = !(emailValid && phoneValid);
                }
                
                // Показываем ошибки
                const errors: string[] = [];
                if (!emailValid) {
                    errors.push('Не указан email');
                }
                if (!phoneValid) {
                    errors.push('Не указан телефон');
                }
                
                if (errorsContainer) {
                    errorsContainer.textContent = errors.join(', ');
                    if (errors.length) {
                        errorsContainer.classList.remove('form__errors_hidden');
                    } else {
                        errorsContainer.classList.add('form__errors_hidden');
                    }
                }
            };
            
            if (emailInput) emailInput.addEventListener('input', validateForm);
            if (phoneInput) phoneInput.addEventListener('input', validateForm);
            
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (emailInput.value.trim() && phoneInput.value.trim()) {
                    this.events?.emit('contacts:submit', {
                        email: emailInput.value,
                        phone: phoneInput.value
                    });
                } else {
                    validateForm(); // Показываем ошибки при попытке отправки
                }
            });
            
            this.contentElement = contactsForm;
            this.open();
        }
    }

    isCartOpen(): boolean {
        return !!(this.content && this.content.querySelector('.basket'));
    }

    isPaymentFormOpen(): boolean {
        return !!(this.content && this.content.querySelector('form[data-form="payment"]'));
    }

    isContactsFormOpen(): boolean {
        return !!(this.content && this.content.querySelector('form[data-form="contacts"]'));
    }
} 