import { Model } from './Model';
import { ICartItem, IProduct, AppEvents } from '../../types';
import { IEvents } from './events';

export class CartModel extends Model<{ items: ICartItem[] }> {
    items: ICartItem[] = [];

    constructor(events: IEvents) {
        super({}, events);
    }

    addItem(product: IProduct): void {
        const existingItem = this.items.find(item => item.id === product.id);
        if (!existingItem) {
            const newItem: ICartItem = {
                id: product.id,
                title: product.title,
                price: product.price,
                index: this.items.length + 1
            };
            this.items.push(newItem);
            this.emitChanges(AppEvents.CART_ITEM_ADDED, { item: newItem, product });
        }
    }

    removeItem(id: string): void {
        const itemIndex = this.items.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            const removedItem = this.items[itemIndex];
            this.items.splice(itemIndex, 1);
            // Обновляем индексы
            this.items.forEach((item, index) => {
                item.index = index + 1;
            });
            this.emitChanges(AppEvents.CART_ITEM_REMOVED, { item: removedItem });
        }
    }

    clear(): void {
        this.items = [];
        this.emitChanges(AppEvents.CART_CLEARED);
    }

    getItems(): ICartItem[] {
        return this.items;
    }

    getTotal(): number {
        return this.items.reduce((total, item) => {
            return total + (item.price || 0);
        }, 0);
    }

    isInCart(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
} 