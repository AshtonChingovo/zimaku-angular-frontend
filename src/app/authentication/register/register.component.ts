import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RegisterService } from './register.service';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { AuthResponse } from '../model/auth-response.model';
import { CommonModule } from '@angular/common';

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

  constructor(private registerService: RegisterService){}

  ngOnInit(): void {
    this.authResponseSubject = this.registerService.authResponseSubject.subscribe( response => {
      this.authResponse = response

      if(this.authResponse.isSuccessfull){

      }
    })
  }

  onSubmit(registerForm: NgForm){
    this.registerService.register({
        firstname: "user2",
        surname: "string",
        email: "",
        password: "string"
      }
    );
  }

}


