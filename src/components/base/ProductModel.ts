import { Model } from './Model';
import { IProduct, AppEvents } from '../../types';
import { IEvents } from './events';

export class ProductModel extends Model<{ items: IProduct[] }> {
    items: IProduct[] = [];

    constructor(events: IEvents) {
        super({}, events);
    }

    setItems(items: IProduct[]): void {
        this.items = items;
        this.emitChanges(AppEvents.PRODUCTS_LOADED, { items });
    }

    getProductById(id: string): IProduct | undefined {
        return this.items.find(p => p.id === id);
    }

    getItems(): IProduct[] {
        return this.items;
    }
} 