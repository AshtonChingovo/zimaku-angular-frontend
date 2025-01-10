import { EggsStockModel } from "./eggs-stock.model"

export interface EggsAPIResponseModel {
        eggs: EggsStockModel[]
        numberOfElements?: number
        currentPage?: number
        pageSize?: number
        totalPages?: number
        first?: boolean
        last?: boolean
        source?: string
}

