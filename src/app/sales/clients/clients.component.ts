import { Component } from '@angular/core';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent {

    // order types
    ZIMAKU_CLIENT = "ZIMAKU_CLIENT";
    WALKIN_CLIENT = "WALKIN_CLIENT";
  
    orderType = '';
  
    constructor() {}
  
    orderTypeSelected(orderType: string) {
      this.orderType = orderType;
    }

}
