export interface DispatchModel{
    id?: number,
    date?: string,
    dateStockReceived?: string
    batchNumber: string, 
    quantity: number, 
    totalStockReceived: number,
    ageOnDispatch?: string,
    eggsStockId?: number
}