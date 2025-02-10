export interface HatcheryModel{
    date?: string,
    batchNumber: string, 
    totalDispatched: number, 
    breakages: number,
    dispatchId?: number,
    eggsStockId?: number
}