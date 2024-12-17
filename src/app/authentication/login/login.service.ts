import { Injectable, OnInit } from "@angular/core";
import { APIResponse } from "../model/api-response.model";
import { Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { LoginModel } from "../model/login.model";
import { environment } from "../../../environments/environment.development";
import { UserToken } from "../model/user-token.model";

@Injectable({ providedIn: 'root'})
export class LoginService implements OnInit{

    authResponse = new APIResponse()
    authResponseSubject = new Subject<APIResponse>()
    userToken: UserToken = JSON.parse(localStorage.getItem("userToken"));
    constructor(private httpClient: HttpClient){}

    ngOnInit(): void {
        // default error message
        this.authResponse.errorMessage = "Unknown error occured"
    }

    login(loginModel: LoginModel){
        this.httpClient.post(
            environment.baseUrl + "/auth/login",
            loginModel,
            { observe: 'response'}
        )
        .pipe(catchError(this.handleError))
        .subscribe({
            next: (response) => {
                if(response.status == HttpStatusCode.Ok){
                    this.authResponse.isSuccessful = true

                    localStorage.setItem('userToken', JSON.stringify(response.body))
                }
                else{
                    this.authResponse.isSuccessful = false
                    this.authResponse.errorMessage = "Unknown error occured"
                }

                this.authResponseSubject.next(this.authResponse)
            },
            error: (e) => {

                // undefined errorMessage can occur when API is unavailable
                if(!this.authResponse.errorMessage){
                    this.authResponse.errorMessage = "Unknown error occured"
                }
                
                if(this.authResponse.errorMessage == "Forbidden"){
                    this.authResponse.errorMessage = "Login details failed"
                }
                this.authResponseSubject.next(
                    this.authResponse
                )
            }
        })
    }

    isLoggedIn(){
        if(this.userToken)
            return true
        else 
            return false
    }

    getUserToken(){
        if(this.userToken)
            return this.userToken
    }

    handleError(errorResponse: HttpErrorResponse){

        this.authResponse.isSuccessful = false
        this.authResponse.errorMessage = "Unknown error occured"

        if(errorResponse.error.error){
            this.authResponse.errorMessage = errorResponse.error.error
        }
        
        if(errorResponse.error.errorsList){
            this.authResponse.errorsList = []

            errorResponse.error.errorsList.forEach((errorMessage: string) => {
                this.authResponse.errorsList.push(errorMessage)
            });
        }

        return throwError(() => this.authResponse );

    }

}