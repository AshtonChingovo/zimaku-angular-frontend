import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoginService } from './login.service'
import { Router } from '@angular/router';
import { AuthResponse } from '../model/auth-response.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  authResponseSubject = Subscription
  authResponse: AuthResponse;

  constructor(private loginService: LoginService, private router: Router){}

  ngOnInit(): void {
    this.loginService.authResponseSubject.subscribe( response => {
      if(response.isSuccessful){
        this.router.navigate(["/dashboard"])
      }

      this.authResponse = response
    })
  }

  onLogin(form: NgForm){
    if(form.invalid){
      return
    }

    this.loginService.login({
      email: form.value.email,
      password: form.value.password
    })
  }

}
