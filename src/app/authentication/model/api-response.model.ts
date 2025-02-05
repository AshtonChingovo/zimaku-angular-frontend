export class APIResponse{
    isSuccessful: boolean
    errorMessage: string
    errorsList: string[] = []
    data: any
    // POST, GET, PUT, DELETE
    requestType?: string
}