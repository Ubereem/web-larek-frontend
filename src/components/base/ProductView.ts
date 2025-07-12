import { IProduct } from '../../types';

export abstract class ProductView {
    protected container: HTMLElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
        this._title = container.querySelector('.card__title') as HTMLElement;
        this._price = container.querySelector('.card__price') as HTMLElement;
    }

    set title(value: string) {
        if (this._title) {
            this._title.textContent = value;
        }
    }

    set price(value: number | null) {
        if (this._price) {
            if (value === null) {
                this._price.textContent = 'Бесценно';
            } else {
                this._price.textContent = `${value} синапсов`;
            }
        }
    }

    render(data?: Partial<IProduct>): HTMLElement {
        if (data) {
            if (data.title !== undefined) this.title = data.title;
            if (data.price !== undefined) this.price = data.price;
        }
        return this.container;
    }
} 