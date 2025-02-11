export interface HatcheryModel{
    date?: string,
    batchNumber: string, 
    totalDispatched: number, 
    breakages: number,
    difference?: number,
    dispatchId?: number,
    eggsStockId?: number
}