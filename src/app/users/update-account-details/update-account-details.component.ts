import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../list/users.service';
import { FormsModule, NgForm } from '@angular/forms';
import { UserModel } from '../model/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-account-details',
  standalone: true,
  imports: [ FormsModule, CommonModule ],
  templateUrl: './update-account-details.component.html',
  styleUrl: './update-account-details.component.css'
})
export class UpdateAccountDetailsComponent implements OnInit {

  @ViewChild('UpdateUserDetailsForm') updateUserDetailsForm: NgForm
  private userId = ""

  constructor(private userService: UsersService, private router: Router) {}

  ngOnInit(): void {
    this.userService.selectedUserId.subscribe((userId) => {
      this.userService.getUser(userId)
      this.userId = userId
    })

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
  }
  
  setupUserDetailsForm(user: UserModel) {

    this.userId = user.id

    console.log(user.department)
    console.log(user.roles[0].title)

    this.updateUserDetailsForm.form.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      department: user.department,
      userType: user.roles[0].title
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

}
