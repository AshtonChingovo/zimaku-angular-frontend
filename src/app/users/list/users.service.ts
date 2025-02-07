import { Injectable } from "@angular/core";
import { APIResponse } from "../../authentication/model/api-response.model";
import { Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient, HttpStatusCode } from "@angular/common/http";
import { ErrorHandlingService } from "../../util/errror-handling.service";
import { PageRequestModel } from "../../model/page-request.model";
import { environment } from "../../../environments/environment.development";
import { UserModel } from "../model/user.model";
import { PasswordModel } from "../model/password.model";

@Injectable({providedIn: 'root'})
export class UsersService{

    selectedUserId = new Subject<string>()

    response = new APIResponse()
    userResponseSubject = new Subject<APIResponse>()
    passwordUpdateSubject = new Subject<APIResponse>()
    updateUserResponseSubject = new Subject<APIResponse>()
    usersListResponseSubject = new Subject<APIResponse>()
    createUserResponseSubject = new Subject<APIResponse>()

    constructor(private httpClient: HttpClient, private errorHandlingService: ErrorHandlingService){}

    updateSelectedUserIdSubject(id: string){
        this.selectedUserId.next(id)
    }

    getUser(id: string){
        this.httpClient.get(
            environment.baseUrl + "/users/user/" + id,
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
                    this.response.requestType = "GET"

                    var user = httpResponse.body

                    this.response.data = user
                }
                else{
                    this.response.isSuccessful = false
                    this.response.errorMessage = "Unknown error occured"
                }

                this.userResponseSubject.next(this.response)

            },
            error: (e) => {
                // undefined errorMessage can occur when API is unavailable
                if(!this.response.errorMessage){
                    this.response.errorMessage = "Unknown error occured"
                }
                
                this.usersListResponseSubject.next(
                    this.response
                )
            }
        })
    }

    getUsers(pageRequestModel: PageRequestModel){
        this.httpClient.get(
            environment.baseUrl + "/users?pageNumber=" + pageRequestModel.pageNumber + "&pageSize=" + pageRequestModel.pageSize,
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
                    this.response.requestType = "GET"

                    var users = httpResponse.body["content"]
                    var totalElements = httpResponse.body["totalElements"]

                    this.response.data = {
                        data: users,
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

                this.usersListResponseSubject.next(this.response)

            },
            error: (e) => {
                // undefined errorMessage can occur when API is unavailable
                if(!this.response.errorMessage){
                    this.response.errorMessage = "Unknown error occured"
                }
                
                this.usersListResponseSubject.next(
                    this.response
                )
            }
        })
    }

    postUser(user: UserModel){
        this.httpClient.post(
            environment.baseUrl + "/users",
            user,
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
                    this.response.requestType = "POST"

                    // update the list of users
                    this.usersListResponseSubject.next(this.response)
                }
                else{
                    this.response.isSuccessful = false
                    this.response.errorMessage = "Unknown error occured"
                }

                this.createUserResponseSubject.next(this.response)
            },
            error: (e) => {
                // undefined errorMessage can occur when API is unavailable
                if(!this.response.errorMessage){
                    this.response.errorMessage = "Unknown error occured"
                }
                
                this.createUserResponseSubject.next(
                    this.response
                )
            }
        })
    }

    updateUser(user: UserModel){
        this.httpClient.put(
            environment.baseUrl + "/users",
            user,
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
                    this.response.requestType = "PUT"
                }
                else{
                    this.response.isSuccessful = false
                    this.response.errorMessage = "Unknown error occured"
                }

                this.updateUserResponseSubject.next(this.response)
            },
            error: (e) => {
                // undefined errorMessage can occur when API is unavailable
                if(!this.response.errorMessage){
                    this.response.errorMessage = "Unknown error occured"
                }
                
                this.updateUserResponseSubject.next(
                    this.response
                )
            }
        })
    }

    updatePassword(password: PasswordModel){
        this.httpClient.post(
            environment.baseUrl + "/update/password",
            password,
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
                    this.response.requestType = "POST"

                    // update the list of users
                    this.usersListResponseSubject.next(this.response)
                }
                else{
                    this.response.isSuccessful = false
                    this.response.errorMessage = "Unknown error occured"
                }

                this.passwordUpdateSubject.next(this.response)
            },
            error: (e) => {
                // undefined errorMessage can occur when API is unavailable
                if(!this.response.errorMessage){
                    this.response.errorMessage = "Unknown error occured"
                }
                
                this.passwordUpdateSubject.next(this.response)
            }
        })
    }

}