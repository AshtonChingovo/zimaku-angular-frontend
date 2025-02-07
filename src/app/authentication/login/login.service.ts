import { Injectable, OnInit } from "@angular/core";
import { APIResponse } from "../model/api-response.model";
import { Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { LoginModel } from "../model/login.model";
import { environment } from "../../../environments/environment.development";
import { UserToken } from "../model/user-token.model";
import { ErrorHandlingService } from "../../util/errror-handling.service";

@Injectable({ providedIn: 'root'})
export class LoginService implements OnInit{

    response = new APIResponse()
    authResponseSubject = new Subject<APIResponse>()
    userToken: UserToken = JSON.parse(localStorage.getItem("userToken"));

    constructor(private httpClient: HttpClient, private errorHandlingService: ErrorHandlingService){}

    ngOnInit(): void {
        // default error message
        this.response.errorMessage = "Unknown error occured"
    }

    login(loginModel: LoginModel){
        this.httpClient.post(
            environment.baseUrl + "/auth/login",
            loginModel,
            { observe: 'response'}
        )
        .pipe(catchError((error) => {
            this.response = this.errorHandlingService.handleError(error, this.response)
            return throwError(() => this.response);
        }))
        .subscribe({
            next: (response) => {
                if(response.status == HttpStatusCode.Ok){
                    this.response.isSuccessful = true

                    localStorage.setItem('userToken', JSON.stringify(response.body))
                }
                else{
                    this.response.isSuccessful = false
                    this.response.errorMessage = "Unknown error occured"
                }

                this.authResponseSubject.next(this.response)
            },
            error: (e) => {

                // undefined errorMessage can occur when API is unavailable
                if(!this.response.errorMessage){
                    this.response.errorMessage = "Unknown error occured"
                }
                
                if(this.response.errorMessage == "Forbidden"){
                    this.response.errorMessage = "Login details failed"
                }
                this.authResponseSubject.next(
                    this.response
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
        return JSON.parse(localStorage.getItem("userToken"))
    }

    getUserId(){
        return JSON.parse(localStorage.getItem("userToken")).userId
    }

}