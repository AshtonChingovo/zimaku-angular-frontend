import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [ FormsModule ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent implements OnInit {

  @ViewChild('createUserForm') createUserForm: NgForm

  constructor(private userService: UsersService,) { }

  ngOnInit(): void {
    this.userService.createUserResponseSubject.subscribe((response) => {
      if(response.isSuccessful){
        this.createUserForm.reset()
      }
    });
  }

  onSubmit() {
    if (this.createUserForm.form.invalid) {
      return;
    }

    this.userService.postUser({
      email: this.createUserForm.value.email,
      firstName: this.createUserForm.value.firstName,
      lastName: this.createUserForm.value.lastName,
      address: this.createUserForm.value.address,
      department: this.createUserForm.value.department,
      phoneNumber: this.createUserForm.value.phoneNumber,
      active: true,
      roles: [{title: this.createUserForm.value.userType}]
    });
  }

}
