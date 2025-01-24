import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { APIResponse } from '../../authentication/model/api-response.model';

@Component({
  selector: 'app-sales-orders',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './sales-orders.component.html',
  styleUrl: './sales-orders.component.css'
})
export class SalesOrdersComponent {

  apiResponse: APIResponse

  isLoading = false
  isFetchingData = false;
  isDialogFetchingData = false;
  isEmpty = true;

  // pagination
  pages = []
  minPage = 0
  currentPage = 0
  maxPage = 0
  isStartEnabled: boolean
  isPrevEnabled: boolean
  isNextEnabled: boolean
  isEndEnabled: boolean

  constructor() {}

}
