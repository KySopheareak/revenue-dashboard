export interface IOrder {
    user: string | undefined;
    products: { product: string; quantity: number; }[];
}

export interface IUser {
    _id: string | undefined;
    type: string | undefined;
    username: string | undefined;
    email: string | undefined;
    createdAt: string | undefined;
    updatedAt: string | undefined;
}