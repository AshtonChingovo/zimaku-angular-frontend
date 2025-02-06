import { Component } from '@angular/core';
import { CreateUserComponent } from './create-user/create-user.component';
import { UsersComponent } from '../users.component';
import { UsersListComponent } from "./users-list/users-list.component";

@Component({
  selector: 'app-list-create-users',
  standalone: true,
  imports: [ CreateUserComponent, UsersListComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListAndCreateUsersComponent {

}
