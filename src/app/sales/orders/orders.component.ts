import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-orders',
  standalone: true,
  imports: [ FormsModule, CommonModule ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class PendingOrdersComponent implements OnInit {

  pendingOrdersAPIResponse: APIResponse
  salesOrdersAPIResponse: APIResponse

  pendingOrdersResponseModel: OrdersAPIResponseModel
  salesOrdersResponseModel: OrdersAPIResponseModel
  clientsListResponseModel: ClientAPIResponseModel

  @ViewChild('clientOrderForm') clientOrderForm: NgForm
  @ViewChild('walkInClientOrderForm') walkInClientOrderForm: NgForm

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
  // holds the selected client from the dialog
  zimakuClientSelectedFromDialog: ClientModel

  // search feature code page 
  // https://chatgpt.com/share/67867424-73f0-8003-af3f-f8847cf7b5c8

  constructor(private orderService: OrdersService, private clientsService: ClientsService, private paginationService: PaginationService) {}

  ngOnInit(): void {

    // get the first page of orders
    this.onGetPage(0,  "PENDING")
    // this.onGetPage(0,  "SALES")

    // pending orders list data
    this.orderService.pendingOrdersListSubject.subscribe((response: APIResponse) => { 
      this.setUpData(response, "PENDING")
    })

    // sales orders list data
    this.orderService.salesOrdersListSubject.subscribe((response: APIResponse) => { 
      this.setUpData(response, "SALES")
    })

    // used by dialog to get clients list
    // clients list accessed by the dialog
    this.clientsService.ordersComponentClientsListSubject.subscribe((response: APIResponse) => {

      // this.apiResponse = response.data

      this.isDialogFetchingData = false
      this.isLoading = false

      if(response.isSuccessful){

        this.clientsListResponseModel = response.data

        // get the pagination == zero list of clients
        if(this.clientsListResponseModel.currentPage == 0){
          this.clientsListDialogModel = this.clientsListResponseModel.clients
        }

        this.isEmpty = this.clientsListResponseModel.numberOfElements == 0
      }

    })

    this.orderService.postResponseSubject.subscribe((response: APIResponse) => {

      if(response.isSuccessful){
        this.clientOrderForm.reset()
        this.walkInClientOrderForm.reset()
      }
      
      this.isLoading = false
    })

  }

  setUpData(response: APIResponse, orderType: string){

    this.isLoading = false
    this.isFetchingData = false

    if(response.isSuccessful){

      if(orderType == "PENDING"){
        this.pendingOrdersAPIResponse = response
        this.pendingOrdersResponseModel = response.data
        this.isEmpty = this.pendingOrdersResponseModel.numberOfElements == 0
      }
      else{
        this.salesOrdersAPIResponse = response
        this.salesOrdersResponseModel = response.data
        this.isEmpty = this.salesOrdersResponseModel.numberOfElements == 0
      }


      this.setUpPagination()
    }
  }

  onSalesOrdersTabSelected(){
    this.onGetPage(0, "SALES")
  }

  orderTypeSelected(orderType: string) {
    this.orderType = orderType;
  }

  onSubmitZimakuClientOrder() {
    if(this.clientOrderForm.form.invalid){
      return
    } 

    this.isLoading = true

    this.orderService.postOrder({ 
      quantity: this.clientOrderForm.value.quantity,
      collectionDate: this.clientOrderForm.value.collectionDate,
      isPaid: this.clientOrderForm.value.isPaymentMade == "Yes" ? true : false,
      isOrderCollected: this.clientOrderForm.value.isOrderCollected == "Yes" ? true : false,
      comments: this.clientOrderForm.value.comments,
      client: this.zimakuClientSelectedFromDialog
    })
  } 

  onSubmitWalkInClientOrder() {
    if(this.walkInClientOrderForm.form.invalid){
      return
    } 

    this.isLoading = true

    this.orderService.postOrder({ 
      quantity: this.walkInClientOrderForm.value.quantity,
      collectionDate: this.walkInClientOrderForm.value.collectionDate,
      isPaid: this.walkInClientOrderForm.value.isPaymentMade == "Yes" ? true : false,
      isOrderCollected: this.walkInClientOrderForm.value.isOrderCollected == "Yes" ? true : false,
      comments: this.walkInClientOrderForm.value.comments,
      client: {
        id: null,
        firstName: this.walkInClientOrderForm.value.firstName,
        lastName: this.walkInClientOrderForm.value.lastName,
        phoneNumber: this.walkInClientOrderForm.value.phoneNumber,
        clientType: this.WALKIN_CLIENT
      }
    })
  }

  onClientListDialogOpen(){

    this.isDialogFetchingData = true

    this.clientsService.getClients({
      pageNumber: 0,
      pageSize: 10,
      sortBy: "id"
    }, "ORDERS_COMPONENT")
  }

  onClientSelected(client: ClientModel){
    this.zimakuClientSelectedFromDialog = client
  }

  setUpPagination(){

    // setup pagination 
    var paginationParams = this.paginationService.paginationConfig(
      this.pendingOrdersAPIResponse.data.currentPage, 
      this.pendingOrdersAPIResponse.data.first, 
      this.pendingOrdersAPIResponse.data.last, 
      this.pendingOrdersAPIResponse.data.totalPages
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

  onGetPage(page: number, orderType: string){

    this.isFetchingData = true

    this.orderService.getOrders({
      pageNumber: page,
      pageSize: 10,
      sortBy: "id"
    }, orderType)

  }

  onGetPreviousPage(orderType: string){
    // using clientsResponseModel instead of this.currentPage to not complicate API zero indexing
    if(this.isPrevEnabled)
      this.onGetPage(this.pendingOrdersResponseModel.currentPage - 1, orderType)
  }

  onGetStartPage(orderType: string){
    // page indexing starts at zero 
    if(this.isStartEnabled)
      this.onGetPage(0, orderType)
  }

  onGetNextPage(orderType: string){
    // using clientsResponseModel instead of this.currentPage to not complicate API zero indexing
    if(this.isNextEnabled)
      this.onGetPage(this.pendingOrdersResponseModel.currentPage + 1, orderType)
  }

  onGetEndPage(source: string){
    // page indexing starts at zero 
    if(this.isEndEnabled)
      this.onGetPage(this.pendingOrdersResponseModel.totalPages - 1, source)
  }

}