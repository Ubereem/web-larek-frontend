import { EventEmitter } from '../base/events';
import { ProductCardView } from './ProductCardView';
import { createElementFromTemplate } from '../../utils/template';
import { IProduct } from '../../types';

export class ProductGalleryView {
    private container: HTMLElement;
    private events: EventEmitter;
    private productCardViews: ProductCardView[] = [];

    constructor(container: HTMLElement, events: EventEmitter) {
        this.container = container;
        this.events = events;
    }

    public render(products: IProduct[], inCartItems: string[]): void {
        this.container.innerHTML = '';
        this.productCardViews = [];
        
        products.forEach(product => {
            const cardElement = createElementFromTemplate('card-catalog');
            const cardView = new ProductCardView(cardElement, this.events);
            
            cardView.render(product);
            cardView.inCart = inCartItems.includes(product.id);
            
            this.container.appendChild(cardView.render());
            this.productCardViews.push(cardView);
        });
    }

    public updateCartStatus(inCartItems: string[]): void {
        this.productCardViews.forEach(cardView => {
            const productId = cardView.render().dataset.id;
            if (productId) {
                cardView.inCart = inCartItems.includes(productId);
            }
        });
    }

    public getProductCardViews(): ProductCardView[] {
        return this.productCardViews;
    }
} 