import { EggsModel } from "./eggs.model"

export interface EggsAPIResponseModel {
        eggs: EggsModel[]
        numberOfElements?: number
        currentPage?: number
        pageSize?: number
        totalPages?: number
        first?: boolean
        last?: boolean
        source?: string
}

