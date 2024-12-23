import { Injectable } from "@angular/core";
import { APIResponse } from "../../authentication/model/api-response.model";
import { environment } from "../../../environments/environment.development";
import { Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { PageRequestModel } from "../../model/page-request.model";
import { DispatchModel } from "./model/dispatch.model";

@Injectable({providedIn: 'root'})
export class DispatchService{

    response = new APIResponse()
    responseSubject = new Subject<APIResponse>()

    constructor(private httpClient: HttpClient){}
 
    getDispatch(pageRequestModel: PageRequestModel){
        this.httpClient.get(
            environment.baseUrl + "/dispatch?pageNumber=" + pageRequestModel.page + "&pageSize=" + pageRequestModel.pageSize, 
            { observe: 'response'}
        )
        .pipe(catchError(this.handleError))
        .subscribe({
            next: (httpResponse) => {

                if(httpResponse.status == HttpStatusCode.Ok){

                    this.response.isSuccessful = true

                    var dispatch = httpResponse.body["content"]
                    var totalElements = httpResponse.body["totalElements"]

                    this.response.body = {
                        data: dispatch,
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

                this.responseSubject.next(
                    this.response
                )
            },
            error: (e) => {
                // undefined errorMessage can occur when API is unavailable
                if(!this.response.errorMessage){
                    this.response.errorMessage = "Unknown error occured"
                }
                
                this.responseSubject.next(
                    this.response
                )
            }
        })
    }

    postDispatch(dispatch: DispatchModel){
        this.httpClient.post(
            environment.baseUrl + "/dispatch",
            dispatch,
            { observe: "response"}
        )
        .subscribe({
            next: (httpResponse) => {
                if(httpResponse.status == HttpStatusCode.Created){
                    this.response.isSuccessful = true
                }
                else{
                    this.response.isSuccessful = false
                    this.response.errorMessage = "Unknown error occured"
                }

                this.responseSubject.next(this.response)

            },
            error: (e) => {
                this.responseSubject.next(this.response)
            }
        })
    }

    handleError(errorResponse: HttpErrorResponse){
        this.response.isSuccessful = false
        this.response.errorMessage = "Unknown error occured"

        if(errorResponse.error.error){
            this.response.errorMessage = errorResponse.error.error
        }
        
        if(errorResponse.error.errorsList){
            this.response.errorsList = []

            errorResponse.error.errorsList.forEach((errorMessage: string) => {
                this.response.errorsList.push(errorMessage)
            });
        }

        return throwError(() => this.response );

    }

}