import { ChicksModel } from "./chicks.model"

export interface ChicksAPIResponseModel {
        chicks: ChicksModel[]
        numberOfElements?: number
        currentPage?: number
        pageSize?: number
        totalPages?: number
        first?: boolean
        last?: boolean
        source?: string
}

