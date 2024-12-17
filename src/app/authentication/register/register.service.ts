import { Injectable } from "@angular/core";
import { RegisterModel } from "../model/register.model";
import { HttpClient, HttpErrorResponse, HttpResponse, HttpStatusCode } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Subject } from 'rxjs';
import { APIResponse} from '../model/api-response.model';

@Injectable({ providedIn: 'root'})
export class RegisterService {

    authResponse = new APIResponse()
    authResponseSubject = new Subject<APIResponse>()

    constructor(private httpClient: HttpClient){}

    register(registerModel: RegisterModel){
        this.httpClient.post(
            environment.baseUrl + "/auth/register",
            registerModel,
            { observe: 'response' }
        )
        .pipe(
            catchError(this.handleError)
        )
        .subscribe({
            next: (response) => {

                if(response.status == HttpStatusCode.Created){
                    this.authResponse.isSuccessful = true
                }
                else{
                    this.authResponse.isSuccessful = false
                    this.authResponse.errorMessage = "Unknown error occured"
                }

                this.authResponseSubject.next(
                    this.authResponse
                )
            },
            error: (error) => {
                this.authResponseSubject.next(
                    this.authResponse
                )
            },
        });
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