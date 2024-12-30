import { Injectable } from "@angular/core";
import { APIResponse } from "../../authentication/model/api-response.model";
import { environment } from "../../../environments/environment.development";
import { Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { PageRequestModel } from "../../model/page-request.model";
import { DispatchModel } from "./model/dispatch.model";
import { EggsPageRequestModel } from "../eggs/model/eggs-page-request.model";

@Injectable({providedIn: 'root'})
export class DispatchService{

    response = new APIResponse()
    dispatchRecordsResponseSubject = new Subject<APIResponse>()
    dispatchEggsSubject = new Subject<APIResponse>()

    constructor(private httpClient: HttpClient){}

    getEggs(eggsPageModel: EggsPageRequestModel){
        this.httpClient.get(
            environment.baseUrl + "/eggs/not_dispatched?pageNumber=" + eggsPageModel.page + "&pageSize=" + eggsPageModel.pageSize,
            { observe: 'response' }
        )
        .pipe(catchError(this.handleError))
        .subscribe({
            next: (httpResponse) => {

                if(httpResponse.status == HttpStatusCode.Ok){

                    this.response.isSuccessful = true

                    var eggs = httpResponse.body["content"]
                    var totalElements = httpResponse.body["totalElements"]

                    // handle cases when deletion of 0 or more records lead to an (auto) empty page request 
                    // e.g user deletes all 10 records on a page & code auto requests content from that page to reflect data changes on that page
                    // which then returns no content
                    if(eggs.length == 0 && totalElements > 0){
                        // direct pagination to the before that comes before the auto requested one
                        eggsPageModel.page -= 1
                        this.getEggs(eggsPageModel)
                    }
                
                    this.response.data = {
                        eggs: eggs,
                        numberOfElements: totalElements,
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

                this.dispatchEggsSubject.next(this.response)
               
            },
            error: (e) => {
                // undefined errorMessage can occur when API is unavailable
                if(!this.response.errorMessage){
                    this.response.errorMessage = "Unknown error occured"
                }
                
                this.dispatchEggsSubject.next(this.response)
            }
        })
    }
 
    getDispatch(pageRequestModel: PageRequestModel){
        this.httpClient.get(
            environment.baseUrl + "/dispatches?pageNumber=" + pageRequestModel.page + "&pageSize=" + pageRequestModel.pageSize, 
            { observe: 'response'}
        )
        .pipe(catchError(this.handleError))
        .subscribe({
            next: (httpResponse) => {

                if(httpResponse.status == HttpStatusCode.Ok){

                    this.response.isSuccessful = true

                    var dispatch = httpResponse.body["content"]
                    var totalElements = httpResponse.body["totalElements"]

                    this.response.data = {
                        data: dispatch,
                        numberOfElements: totalElements,
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

                this.dispatchRecordsResponseSubject.next(
                    this.response
                )
            },
            error: (e) => {
                // undefined errorMessage can occur when API is unavailable
                if(!this.response.errorMessage){
                    this.response.errorMessage = "Unknown error occured"
                }
                
                this.dispatchRecordsResponseSubject.next(
                    this.response
                )
            }
        })
    }

    postDispatch(dispatch: DispatchModel){
        this.httpClient.post(
            environment.baseUrl + "/dispatches",
            dispatch,
            { observe: "response" }
        )
        .subscribe({
            next: (httpResponse) => {
                if(httpResponse.status == HttpStatusCode.Created){
                    this.response.isSuccessful = true
                    this.response.data.source = "POST"

                    // send notification to dispatch records component to reload page to fetch latest list
                    this.dispatchRecordsResponseSubject.next(this.response)
                }
                else{
                    this.response.isSuccessful = false
                    this.response.errorMessage = "Unknown error occured"
                }

                this.dispatchEggsSubject.next(this.response)

            },
            error: (e) => {
                this.dispatchEggsSubject.next(this.response)
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