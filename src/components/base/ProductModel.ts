import { Model } from './Model';
import { IProduct } from '../../types';
import { IEvents } from './events';

export class ProductModel extends Model<{ items: IProduct[] }> {
    items: IProduct[] = [];

    constructor(events: IEvents) {
        super({}, events);
    }

    setItems(items: IProduct[]) {
        this.items = items;
        this.emitChanges('products:changed', { items });
    }

    getProductById(id: string) {
        return this.items.find(p => p.id === id);
    }

    getItems(): IProduct[] {
        return this.items;
    }
} 