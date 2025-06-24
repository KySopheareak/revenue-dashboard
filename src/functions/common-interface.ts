export interface IOrder {
    user: string;
    products: { product: string; quantity: number; }[];
}