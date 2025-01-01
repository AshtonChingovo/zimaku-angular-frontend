import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http"
import { Injectable, OnInit } from "@angular/core"
import { Router } from "@angular/router"
import { APIResponse } from "../authentication/model/api-response.model"

@Injectable({ providedIn: "root"})
export class ErrorHandlingService{

  constructor(private router: Router){}

  handleError(errorResponse: HttpErrorResponse, response: APIResponse){

    if(errorResponse.status == HttpStatusCode.Unauthorized){
        localStorage.removeItem("userToken")
        this.router.navigate(["/login"])
        return 
    }

    response.isSuccessful = false
    response.errorMessage = "Unknown error occured"

    if(errorResponse.error.error){
        response.errorMessage = errorResponse.error.error
    }
    
    if(errorResponse.error.errorsList){
        response.errorsList = []

        errorResponse.error.errorsList.forEach((errorMessage: string) => {
            response.errorsList.push(errorMessage)
        });
    }

    return response

  }

}