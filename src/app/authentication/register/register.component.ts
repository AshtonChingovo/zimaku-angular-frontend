import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RegisterService } from './register.service';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { AuthResponse } from '../model/auth-response.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  private authResponseSubject: Subscription;
  authResponse: AuthResponse;

  constructor(private registerService: RegisterService, private router: Router){}

  ngOnInit(): void {
    this.authResponseSubject = this.registerService.authResponseSubject.subscribe( response => {
      if(response.isSuccessful){
        this.router.navigate(['/login'])
        return 
      }

      this.authResponse = response
      
    })
  }

  onSubmit(registerForm: NgForm){
    if(registerForm.invalid){
      return 
    }

    this.registerService.register({
        firstname: registerForm.value.firstname,
        surname: registerForm.value.surname,
        email: registerForm.value.email,
        password: registerForm.value.password
      }
    );
  }

}


