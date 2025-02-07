import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UsersService } from '../list/users.service';
import { UserModel } from '../model/user.model';
import { LoginService } from '../../authentication/login/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-account-details',
  standalone: true,
  imports: [ FormsModule, CommonModule ],
  templateUrl: './my-account-details.component.html',
  styleUrl: './my-account-details.component.css'
})
export class MyAccountDetailsComponent implements OnInit {

  @ViewChild('UpdateUserDetailsForm') updateUserDetailsForm: NgForm
  @ViewChild('UpdatePasswordForm') updatePasswordForm: NgForm

  private userId = ""

  constructor(private userService: UsersService, private loginService: LoginService) {}

  ngOnInit(): void {

    // get user details
    this.userService.getUser(this.loginService.getUserId())

    this.userService.userResponseSubject.subscribe((response) => {
      if(response.isSuccessful){
        this.setupUserDetailsForm(response.data)
      }
    })

    this.userService.updateUserResponseSubject.subscribe((response) => {
      if(response.isSuccessful){
        this.updateUserDetailsForm.reset()
      }
    })

    this.userService.passwordUpdateSubject.subscribe((response) => {
      if(response.isSuccessful){
        this.updatePasswordForm.reset
      }
    })

  }

  setupUserDetailsForm(user: UserModel) {

    this.userId = user.id

    this.updateUserDetailsForm.form.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address
    })
  }

  onSubmit() {
    this.userService.updateUser({
      id: this.userId,
      email: this.updateUserDetailsForm.value.email,
      firstName: this.updateUserDetailsForm.value.firstName,
      lastName: this.updateUserDetailsForm.value.lastName,
      address: this.updateUserDetailsForm.value.address,
      phoneNumber: this.updateUserDetailsForm.value.phoneNumber,
    })
  }

  onSubmitPassword() {
    this.userService.updatePassword({
      id: this.userId,
      password: this.updatePasswordForm.value.password
    })
  }
  
}
