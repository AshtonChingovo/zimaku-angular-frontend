import { Inject, Injectable } from "@angular/core";
import { APIResponse } from "../../authentication/model/api-response.model";
import { Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient, HttpStatusCode } from "@angular/common/http";
import { ErrorHandlingService } from "../../util/errror-handling.service";
import { environment } from "../../../environments/environment.development";
import { ClientModel } from "./model/client.model";
import { PageRequestModel } from "../../model/page-request.model";

@Injectable({providedIn: 'root'})
export class ClientsService {

    private response = new APIResponse()
    ordersComponentClientsListSubject = new Subject<APIResponse>()
    postResponseSubject = new Subject<APIResponse>()
    getResponseOrdersSubject = new Subject<APIResponse>()

    WALKIN_CLIENT = "WALKIN";
    ZIMAKU_AGENT = "AGENT";
    ZIMAKU_FARMER = "FARMER";

    constructor(private httpClient: HttpClient, private errorHandlingService: ErrorHandlingService){
        this.response = new APIResponse()
    }

    getClients(page: PageRequestModel, source?: string){
        this.httpClient.get(
            environment.baseUrl + "/clients?pageNumber=" + page.pageNumber + "&pageSize=" + page.pageSize,
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
                        clients: httpResponse.body["content"],
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
                
                // TODO: Refactor this 
                if(source == "ORDERS_COMPONENT"){
                    this.ordersComponentClientsListSubject.next(this.response)
                    return 
                }

                this.getResponseOrdersSubject.next(this.response)

            },
            error: (e) => {
                // undefined errorMessage can occur when API is unavailable
                if(this.response && !this.response.errorMessage){
                    this.response.errorMessage = "Unknown error occured"
                }
                
                this.ordersComponentClientsListSubject.next(
                    this.response
                )
            }
        })
    }

    postClient(client: ClientModel, source?: string){
        this.httpClient.post(
            environment.baseUrl + "/clients",
            client,
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
                
                    this.response.requestType = "POST"
                    
                    // for notifying that a new record has been added so it can fetch latest data
                    this.getResponseOrdersSubject.next(this.response)

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
                
                this.postResponseSubject.next(
                    this.response
                )
            }
        })
    }

}