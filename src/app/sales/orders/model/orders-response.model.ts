import { OrderModel } from "./order.model"

export interface OrderAPIResponseModel {
        orders: OrderModel[]
        numberOfElements?: number
        currentPage?: number
        pageSize?: number
        totalPages?: number
        first?: boolean
        last?: boolean
        source?: string
}

