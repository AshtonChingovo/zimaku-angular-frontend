import { Injectable } from "@angular/core";
import { RegisterModel } from "../model/register.model";
import { HttpClient, HttpErrorResponse, HttpResponse, HttpStatusCode } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Subject } from 'rxjs';
import { APIResponse} from '../model/api-response.model';
import { ErrorHandlingService } from "../../util/errror-handling.service";

@Injectable({ providedIn: 'root'})
export class RegisterService {

    response = new APIResponse()
    authResponseSubject = new Subject<APIResponse>()

    constructor(private httpClient: HttpClient, private errorHandlingService: ErrorHandlingService){}

    register(registerModel: RegisterModel){
        this.httpClient.post(
            environment.baseUrl + "/auth/register",
            registerModel,
            { observe: 'response' }
        )
        .pipe(catchError((error) => {
            this.response = this.errorHandlingService.handleError(error, this.response)
            return throwError(() => this.response);
        }))
        .subscribe({
            next: (response) => {

                if(response.status == HttpStatusCode.Created){
                    this.response.isSuccessful = true
                }
                else{
                    this.response.isSuccessful = false
                    this.response.errorMessage = "Unknown error occured"
                }

                this.authResponseSubject.next(
                    this.response
                )
            },
            error: (error) => {
                this.authResponseSubject.next(
                    this.response
                )
            },
        });
    }

}