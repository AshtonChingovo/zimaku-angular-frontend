import { Injectable } from "@angular/core";
import { APIResponse } from "../../authentication/model/api-response.model";
import { environment } from "../../../environments/environment.development";
import { Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { PageRequestModel } from "../../model/page-request.model";
import { ErrorHandlingService } from "../../util/errror-handling.service";
import { HatcheryModel } from "./model/hatchery.model";

@Injectable({providedIn: 'root'})
export class HatcheryService{

    response = new APIResponse()
    dispatchRecordsResponseSubject = new Subject<APIResponse>()
    hatcheryRecordsResponseSubject = new Subject<APIResponse>()

    constructor(private httpClient: HttpClient, private errorHandlingService: ErrorHandlingService){}
 
    getDispatch(pageRequestModel: PageRequestModel){
        this.httpClient.get(
            environment.baseUrl + "/dispatches?pageNumber=" + pageRequestModel.pageNumber + "&pageSize=" + pageRequestModel.pageSize, 
            { observe: 'response'}
        )
        .pipe(catchError((error) => {
            this.response = this.errorHandlingService.handleError(error, this.response)
            return throwError(() => this.response);
        }))
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

    getHatcheryStock(pageRequestModel: PageRequestModel){
        this.httpClient.get(
            environment.baseUrl + "/hatchery_stock?pageNumber=" + pageRequestModel.pageNumber + "&pageSize=" + pageRequestModel.pageSize, 
            { observe: 'response'}
        )
        .pipe(catchError((error) => {
            this.response = this.errorHandlingService.handleError(error, this.response)
            return throwError(() => this.response);
        }))
        .subscribe({
            next: (httpResponse) => {

                if(httpResponse.status == HttpStatusCode.Ok){

                    this.response.isSuccessful = true

                    var hatchery = httpResponse.body["content"]
                    var totalElements = httpResponse.body["totalElements"]

                    this.response.data = {
                        data: hatchery,
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

                this.hatcheryRecordsResponseSubject.next(
                    this.response
                )
            },
            error: (e) => {
                // undefined errorMessage can occur when API is unavailable
                if(!this.response.errorMessage){
                    this.response.errorMessage = "Unknown error occured"
                }
                
                this.hatcheryRecordsResponseSubject.next(
                    this.response
                )
            }
        })
    }

    post(hatchery: HatcheryModel){
        this.httpClient.post(
            environment.baseUrl + "/hatchery_stock",
            hatchery,
            { observe: "response" }
        )
        .pipe(catchError((error) => {
            this.response = this.errorHandlingService.handleError(error, this.response)
            return throwError(() => this.response);
        }))
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

            },
            error: (e) => {
                // undefined errorMessage can occur when API is unavailable
                if(!this.response.errorMessage){
                    this.response.errorMessage = "Unknown error occured"
                }
                
                this.dispatchRecordsResponseSubject.next(this.response)
            }
        })
    }

}