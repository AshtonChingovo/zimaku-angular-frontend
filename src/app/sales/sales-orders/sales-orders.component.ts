import { Component } from '@angular/core';

@Component({
  selector: 'app-sales-orders',
  standalone: true,
  imports: [],
  templateUrl: './sales-orders.component.html',
  styleUrl: './sales-orders.component.css'
})
export class SalesOrdersComponent {

    // order types
    ZIMAKU_CLIENT = "ZIMAKU_CLIENT";
    WALKIN_CLIENT = "WALKIN_CLIENT";
  
    orderType = '';
  
    constructor() {}
  
    orderTypeSelected(orderType: string) {
      this.orderType = orderType;
    }  

}
