import { HttpClient, HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { APIResponse } from "../../authentication/model/api-response.model";
import { EggsPageRequestModel } from "./model/eggs-page-request.model";
import { EggsStockModel } from "./model/eggs-stock.model";
import { ErrorHandlingService } from "../../util/errror-handling.service";
import { PageRequestModel } from "../../model/page-request.model";

@Injectable({ providedIn: 'root'})
export class EggsService{
    
    response = new APIResponse()
    getResponseSubject = new Subject<APIResponse>()
    postResponseSubject = new Subject<APIResponse>()

    constructor(private httpClient: HttpClient,  private errorHandlingService: ErrorHandlingService){}

    getEggs(page: PageRequestModel){
        this.httpClient.get(
            environment.baseUrl + "/eggs?pageNumber=" + page.pageNumber + "&pageSize=" + page.pageSize,
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

                    var eggs = httpResponse.body["content"]
                    var totalElements = httpResponse.body["totalElements"]

                    // handle cases when deletion of 0 or more records lead to an (auto) empty page request 
                    // e.g user deletes all 10 records on a page & code auto requests content from that page to reflect data changes on that page
                    // which then returns no content
                    if(eggs.length == 0 && totalElements > 0){
                        // direct pagination to the before that comes before the auto requested one
                        page.pageNumber -= 1
                        this.getEggs(page)
                    }

                    this.response.data = {
                        eggs: eggs,
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

                this.getResponseSubject.next(this.response)
               
            },
            error: (e) => {

                // undefined errorMessage can occur when API is unavailable
                if(!this.response.errorMessage){
                    this.response.errorMessage = "Unknown error occured"
                }
                
                this.getResponseSubject.next(this.response)
            }
        })
    }

    postEggs(eggsModel: EggsStockModel){
        this.httpClient.post(
            environment.baseUrl + "/eggs",
            eggsModel, 
            { observe: 'response'}
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
                        eggs: httpResponse.body["content"],
                        source: "POST"
                    }

                    // for notifying RecordComponent a new record has been added
                    this.getResponseSubject.next(this.response)

                }
                else{
                    this.response.isSuccessful = false
                    this.response.errorMessage = "Unknown error occured"
                }

                // for notifying AddEggsComponent a new record has been added so it can listen for any API errors & display on the form 
                this.postResponseSubject.next(this.response)

            },
            error: (e) => {

                // undefined errorMessage can occur when API is unavailable
                if(!this.response.errorMessage){
                    this.response.errorMessage = "Unknown error occured"
                }

                this.postResponseSubject.next(this.response)
            }
        })
    }

    deleteEggs(id: Number, currentPageNumber: Number){
        this.httpClient.delete(
            environment.baseUrl + "/eggs/" + id,
            { observe: 'response'}
        )
        .pipe(catchError((error) => {
            this.response = this.errorHandlingService.handleError(error, this.response)
            return throwError(() => this.response);
        }))
        .subscribe({
            next: (httpResponse) => {
                if(httpResponse.status == HttpStatusCode.NoContent){
                    this.response.isSuccessful = true

                    this.response.data = {
                        currentPage: currentPageNumber,
                        source: "DELETE"
                    }
                }
                else{
                    this.response.isSuccessful = false
                    this.response.errorMessage = "Unknown error occured"
                }

                // for notifying RecordComponent a new record has been added
                this.getResponseSubject.next(this.response)
            },
            error: (e) => {
                this.postResponseSubject.next(
                    this.response
                )
            }
        })
    }

    updateEggs(eggs: EggsStockModel, currentPageNumber: Number){
        this.httpClient.put(
            environment.baseUrl + "/eggs",
            eggs,
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

                    this.response.data = {
                        currentPage: currentPageNumber,
                        source: "PUT"
                    }
                }
                else{
                    this.response.isSuccessful = false
                    this.response.errorMessage = "Unknown error occured"
                }

                // for notifying RecordComponent a new record has been added
                this.getResponseSubject.next(this.response)
            },
            error: (e) => {
                this.postResponseSubject.next(
                    this.response
                )
            }
        })
    }

}