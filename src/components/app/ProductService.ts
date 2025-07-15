import { Api } from '../base/api';
import { IProduct, IOrder } from '../../types';
import { OrderModel } from './OrderModel';

export class ProductService {
    private api: Api;
    private orderModel?: OrderModel;

    constructor(baseUrl: string, orderModel?: OrderModel) {
        this.api = new Api(baseUrl);
        this.orderModel = orderModel;
    }

    async getProducts(): Promise<IProduct[]> {
        try {
            const response = await this.api.get('/product') as { total: number; items: IProduct[] };
            return response.items;
        } catch (error) {
            throw error;
        }
    }

    async createOrder(order: IOrder): Promise<{ total: number; items: string[] }> {
        try {
            // Получаем данные формы из OrderModel
            const orderForm = this.orderModel?.getForm();
            const orderWithForm = {
                ...order,
                ...orderForm
            };
            
            const response = await this.api.post('/order', orderWithForm) as { total: number; items: string[] };
            return response;
        } catch (error) {
            throw error;
        }
    }
} 