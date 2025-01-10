import { ChicksStockModel } from "./chicks-stock.model"

export interface ChicksAPIResponseModel {
        chicksStock: ChicksStockModel[]
        numberOfElements?: number
        currentPage?: number
        pageSize?: number
        totalPages?: number
        first?: boolean
        last?: boolean
        source?: string
}

