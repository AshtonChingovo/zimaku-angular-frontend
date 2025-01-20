import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { OrdersService } from './orders.service';
import { Pagination as PaginationService } from '../../util/pagination.service';
import { PaginationAPIResponseModel } from '../../model/pagination-response.model';
import { APIResponse } from '../../authentication/model/api-response.model';
import { OrderAPIResponseModel as OrdersAPIResponseModel } from './model/orders-response.model';
import { ClientModel } from '../clients/model/client.model';
import { ClientsService } from '../clients/clients.service';
import { ClientAPIResponseModel } from '../clients/model/client-response.model';
import { ClientsSearchDialogComponent } from './clients-search-dialog/clients-search-dialog.component';

@Component({
  selector: 'app-pending-orders',
  standalone: true,
  imports: [ ClientsSearchDialogComponent, FormsModule, CommonModule ],
  templateUrl: './pending-orders.component.html',
  styleUrl: './pending-orders.component.css'
})
export class PendingOrdersComponent implements OnInit {

  apiResponse: APIResponse
  ordersResponseModel: OrdersAPIResponseModel
  clientsResponseModel: ClientAPIResponseModel
  // clients list on dialog
  clientsListDialogModel: ClientModel[]

  // order types
  ZIMAKU_CLIENT = "ZIMAKU_CLIENT";
  WALKIN_CLIENT = "WALKIN";
  ZIMAKU_AGENT = "AGENT";
  ZIMAKU_FARMER = "FARMER";
  paymentOptions = ["Yes", "No"];
  orderCollectedOptions = ["Yes", "No"];

  orderType = '';

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

  activeZimakuClientOnOrdersList: ClientModel
  dialogSelectedZimakuClient: ClientModel

  // search feature code page 
  // https://chatgpt.com/share/67867424-73f0-8003-af3f-f8847cf7b5c8

  constructor(private orderService: OrdersService, private clientsService: ClientsService, private paginationService: PaginationService) {}

  ngOnInit(): void {

    this.onGetPage(0)

    this.clientsService.clientsResponseSubject.subscribe((response: APIResponse) => {

      this.apiResponse = response.data

      if(response.isSuccessful){

        this.isDialogFetchingData = false

        this.clientsResponseModel = response.data

        // get the pagination == zero list of clients
        if(this.clientsResponseModel.currentPage == 0){
          this.clientsListDialogModel = this.clientsResponseModel.clients
        }

        this.isEmpty = this.clientsResponseModel.numberOfElements == 0
        this.isFetchingData = false
        this.setUpPagination()
      }

      this.isLoading = false

    })
  }

  orderTypeSelected(orderType: string) {
    this.orderType = orderType;
  }

  onSubmitZimakuClientOrder(form: NgForm) {
    if(form.invalid){
      return
    } 

    this.isLoading = true

    this.orderService.postOrder({ 
      quantity: form.value.quantity,
      collectionDate: form.value.collectionDate,
      isPaid: form.value.isPaid,
      isOrderCollected: form.value.isOrderCollected,
      comments: form.value.comments,
      client: this.activeZimakuClientOnOrdersList
    })
  } 

  onSubmitWalkInClientOrder(form: NgForm) {
    if(form.invalid){
      return
    } 

    this.isLoading = true

    this.orderService.postOrder({ 
      quantity: form.value.quantity,
      collectionDate: form.value.collectionDate,
      isPaid: form.value.isPaid,
      isOrderCollected: form.value.isOrderCollected,
      comments: form.value.comments,
      client: {
        firstName: form.value.name,
        lastName: form.value.email,
        phoneNumber: form.value.phoneNumber,
        clientType: this.WALKIN_CLIENT
      }
    })
  }

  onClientDialogOpen(){

    this.isDialogFetchingData = true

    this.clientsService.getClients({
      pageNumber: 0,
      pageSize: 10,
      sortBy: "id"
    })
  }

  onClientSelected(client: ClientModel){
    this.dialogSelectedZimakuClient = client
  }

  setUpPagination(){

    // setup pagination 
    var paginationParams = this.paginationService.paginationConfig(
      this.apiResponse.data.currentPage, 
      this.apiResponse.data.first, 
      this.apiResponse.data.last, 
      this.apiResponse.data.totalPages
    )

    this.pages = paginationParams.pages
    this.minPage = paginationParams.minPage
    this.currentPage = paginationParams.currentPage
    this.maxPage = paginationParams.maxPage
    this.isStartEnabled = paginationParams.isStartEnabled
    this.isPrevEnabled = paginationParams.isPrevEnabled
    this.isNextEnabled = paginationParams.isNextEnabled
    this.isEndEnabled = paginationParams.isEndEnabled
  }

  onGetPage(page: number){

    this.isFetchingData = true

    this.orderService.getOrders({
      pageNumber: page,
      pageSize: 10,
      sortBy: "id"
    })
  }

  onGetPreviousPage(){
    // using clientsResponseModel instead of this.currentPage to not complicate API zero indexing
    if(this.isPrevEnabled)
      this.onGetPage(this.ordersResponseModel.currentPage - 1)
  }

  onGetStartPage(){
    // page indexing starts at zero 
    if(this.isStartEnabled)
      this.onGetPage(0)
  }

  onGetNextPage(){
    // using clientsResponseModel instead of this.currentPage to not complicate API zero indexing
    if(this.isNextEnabled)
      this.onGetPage(this.ordersResponseModel.currentPage + 1)
  }

  onGetEndPage(){
    // page indexing starts at zero 
    if(this.isEndEnabled)
      this.onGetPage(this.ordersResponseModel.totalPages - 1)
  }

}
