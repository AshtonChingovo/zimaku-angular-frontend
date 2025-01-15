import { Component } from '@angular/core';

@Component({
  selector: 'app-pending-orders',
  standalone: true,
  imports: [],
  templateUrl: './pending-orders.component.html',
  styleUrl: './pending-orders.component.css'
})
export class PendingOrdersComponent {

  // order types
  ZIMAKU_CLIENT = "ZIMAKU_CLIENT";
  WALKIN_CLIENT = "WALKIN_CLIENT";

  orderType = '';

  // search feature code page 
  // https://chatgpt.com/share/67867424-73f0-8003-af3f-f8847cf7b5c8

  constructor() {}

  orderTypeSelected(orderType: string) {
    this.orderType = orderType;
  }

}
