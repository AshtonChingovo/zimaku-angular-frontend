import { Component, OnInit } from '@angular/core';
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

  constructor(private userService: UsersService,) { }

  ngOnInit(): void {
    this.userService.createUserResponseSubject.subscribe((response) => {

    });
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.userService.postUser({
      email: form.value.email,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      address: form.value.address,
      department: form.value.department,
      phoneNumber: form.value.phoneNumber,
      active: true,
      roles: [{title: form.value.userType}]
    });
  }

}
