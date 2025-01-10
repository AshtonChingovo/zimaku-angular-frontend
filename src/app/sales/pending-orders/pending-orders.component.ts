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

  constructor() {}

  orderTypeSelected(orderType: string) {
    this.orderType = orderType;
  }

}
