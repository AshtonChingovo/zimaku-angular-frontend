import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { UserToken } from "./model/user-token.model";
import { LoginService } from "./login/login.service";

@Injectable({ providedIn: 'root'})
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private loginService: LoginService){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> | boolean  | Observable<boolean | UrlTree> {
            if(this.loginService.isLoggedIn()){
                true
            }
            else{
                return this.router.createUrlTree(['/login']);
            }
    }
    
}