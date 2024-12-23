import { AnyObject } from "chart.js/dist/types/basic"

export interface ChicksAPIResponseModel {
        data: any[]
        numberOfElements?: number
        currentPage?: number
        pageSize?: number
        totalPages?: number
        first?: boolean
        last?: boolean
        source?: string
}

