import { ClientModel } from "./client.model"

export interface ClientAPIResponseModel {
        clients: ClientModel[]
        numberOfElements?: number
        currentPage?: number
        pageSize?: number
        totalPages?: number
        first?: boolean
        last?: boolean
        source?: string
}

