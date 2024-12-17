import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LoginService } from "./login/login.service";

@Injectable({ providedIn: 'root'})
export class AuthInterceptor implements HttpInterceptor{

    // exclude login & registration URLs from adding a token 
    private excludedUrls: string[] = ['/auth/'];

    constructor(private loginService: LoginService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const shouldExclude = this.excludedUrls.some(url => req.url.includes(url))
        
        if(shouldExclude)
            return next.handle(req)

        // get logged in user token
        let userToken = this.loginService.getUserToken()

        const modifiedReq = req.clone({
            headers: new HttpHeaders({
                'Authorization': `${userToken.tokenType} ${userToken.token}`
            })
        })
        
        return next.handle(modifiedReq);
    }
    
}