import { ChicksAverageWeightModel } from "./chicks-average-weight.model"

export interface ChicksStockModel{
        id: number
        date?: string
        age?: string
        males: number
        females: number
        fatalities: number
        batchNumber: string
        averageWeight?: ChicksAverageWeightModel[]
}

