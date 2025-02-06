import { ClientModel } from "../../clients/model/client.model";

export interface OrderModel{
    id?: number,
    date?: string,
    collectionDate: string,
    quantity: string,
    isPaid: boolean,
    isOrderCollected?: boolean,
    comments?: string,
    client?: ClientModel,
    price?: number
}