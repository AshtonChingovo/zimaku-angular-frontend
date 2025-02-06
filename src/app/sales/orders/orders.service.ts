import { Inject, Injectable } from "@angular/core";
import { APIResponse } from "../../authentication/model/api-response.model";
import { Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient, HttpStatusCode } from "@angular/common/http";
import { ErrorHandlingService } from "../../util/errror-handling.service";
import { environment } from "../../../environments/environment.development";
import { PageRequestModel } from "../../model/page-request.model";
import { OrderModel } from "./model/order.model";

@Injectable({providedIn: 'root'})
export class OrdersService {

    private response = new APIResponse()
    pendingOrdersListSubject = new Subject<APIResponse>()
    salesOrdersListSubject = new Subject<APIResponse>()
    postResponseSubject = new Subject<APIResponse>()

    constructor(private httpClient: HttpClient, private errorHandlingService: ErrorHandlingService){
        this.response = new APIResponse()
    }

    getOrders(page: PageRequestModel, orderType: string){
        this.httpClient.get(
            environment.baseUrl + "/orders?pageNumber=" + page.pageNumber + "&pageSize=" + page.pageSize + "&orderType=" + orderType,
            { observe: 'response' }
        )
        .pipe(catchError((error) => {
            this.response = this.errorHandlingService.handleError(error, this.response)
            return throwError(() => this.response);
        }))
        .subscribe({
            next: (httpResponse) => {
                
                if(httpResponse.status == HttpStatusCode.Ok){

                    this.response.isSuccessful = true
                    // this.response.data = httpResponse.body

                    this.response.data = {
                        orders: httpResponse.body["content"],
                        numberOfElements: httpResponse.body["numberOfElements"],
                        currentPage: httpResponse.body["number"],
                        pageSize: httpResponse.body["content"],
                        totalPages: httpResponse.body["totalPages"],
                        first: httpResponse.body["first"],
                        last: httpResponse.body["last"],
                        source: "GET"
                    }
                }
                else{
                    this.response.isSuccessful = false
                    this.response.errorMessage = "Unknown error occured"
                }

                if(orderType == "SALES"){
                    this.salesOrdersListSubject.next(this.response)
                }
                else{
                    // orderType == "PENDING"
                    this.pendingOrdersListSubject.next(this.response)
                }
            },
            error: (e) => {
                // undefined errorMessage can occur when API is unavailable
                if(this.response && !this.response.errorMessage){
                    this.response.errorMessage = "Unknown error occured"
                }

                if(orderType == "SALES"){
                    this.salesOrdersListSubject.next(this.response)
                }
                else{
                    // orderType == "PENDING"
                    this.pendingOrdersListSubject.next(this.response)
                }
               
            }
        })
    }

    postOrder(order: OrderModel){

        this.httpClient.post(
            environment.baseUrl + "/orders",
            order,
            { observe: 'response' } 
        )
        .pipe(catchError((error) => {
            this.response = this.errorHandlingService.handleError(error, this.response)
            return throwError(() => this.response);
        }))
        .subscribe({
            next: (httpResponse) => {
                if(httpResponse.status == HttpStatusCode.Created){
                    this.response.isSuccessful = true
                
                    this.response.data = {
                        source: "POST"
                    }

                    // trigger content update
                    this.getOrders({
                        pageNumber: 0,
                        pageSize: 10,
                        sortBy: "id"
                    }, order.isPaid == true ? "SALES" : "PENDING")
                    
                }
                else{
                    this.response.isSuccessful = false
                    this.response.errorMessage = "Unknown error occured"
                }

                // for notifying that a new record has been added so it can listen for any API errors & display on the form 
                this.postResponseSubject.next(this.response)

            },
            error: (e) => {
                // undefined errorMessage can occur when API is unavailable
                if(this.response && !this.response.errorMessage){
                    this.response.errorMessage = "Unknown error occured"
                }
                
                // for notifying listners of any errors that may have occured on posting data
                this.postResponseSubject.next(
                    this.response
                )
            }
        })
    }

}