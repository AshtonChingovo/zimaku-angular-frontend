import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ClientsService } from './clients.service';
import { Pagination as PaginationService } from '../../util/pagination.service';
import { PaginationAPIResponseModel } from '../../model/pagination-response.model';
import { APIResponse } from '../../authentication/model/api-response.model';
import { ClientModel } from './model/client.model';
import { ClientAPIResponseModel } from './model/client-response.model';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [ CommonModule, FormsModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {

    apiResponse: APIResponse
    clientsResponseModel: ClientAPIResponseModel

    // order types
    ZIMAKU_CLIENT = "ZIMAKU_CLIENT";
    ZIMAKU_AGENT = "AGENT";
    ZIMAKU_FARMER = "FARMER";
    WALKIN_CLIENT = "WALKIN";
    clientTypesList = [this.ZIMAKU_AGENT, this.ZIMAKU_FARMER];
  
    clientType = '';

    isLoading = false
    isFetchingData = false;
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

    constructor(private clientService: ClientsService, private paginationService: PaginationService) {}

    ngOnInit(): void {

      // get the first page of results
      this.onGetPage(0)

      this.clientService.getResponseSubject.subscribe((response) => {
        this.apiResponse = response
        this.isLoading = false

        if(this.apiResponse.isSuccessful){

          this.clientsResponseModel = this.apiResponse.data

          if(this.clientsResponseModel.source == "POST" && this.currentPage < 2){
            this.onGetPage(0)
          }   
          else if(this.clientsResponseModel.source == "PUT" || this.clientsResponseModel.source == "DELETE"){
            this.onGetPage(this.clientsResponseModel.currentPage)
          }
          else{
            this.isEmpty = this.clientsResponseModel.numberOfElements == 0
          }   
          
          this.setUpPagination()

        }

      })

      this.clientService.postResponseSubject.subscribe((response) => {
        this.apiResponse = response
        this.isLoading = false

        this.clientsResponseModel = this.apiResponse.data

      })

    }
  
    clientTypeSelected(orderType: string) {
      this.clientType = orderType;
    }

    onSubmitZimakuClient(form: NgForm) {
      if(form.invalid){
        return
      } 

      this.isLoading = true

      this.clientService.postClient({ 
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        phoneNumber: form.value.phoneNumber,
        address: form.value.address,
        clientType: form.value.clientType
      })
    } 

    onSubmitWalkInClient(form: NgForm) {
      if(form.invalid){
        return
      } 

      this.isLoading = true

      this.clientService.postClient({ 
        firstName: form.value.firstName,
        phoneNumber: form.value.phoneNumber,
        clientType: this.WALKIN_CLIENT  
      })
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
  
      this.clientService.getClient({
        pageNumber: page,
        pageSize: 10,
        sortBy: "id"
      })
    }
  
    onGetPreviousPage(){
      // using clientsResponseModel instead of this.currentPage to not complicate API zero indexing
      if(this.isPrevEnabled)
        this.onGetPage(this.clientsResponseModel.currentPage - 1)
    }
  
    onGetStartPage(){
      // page indexing starts at zero 
      if(this.isStartEnabled)
        this.onGetPage(0)
    }
  
    onGetNextPage(){
      // using clientsResponseModel instead of this.currentPage to not complicate API zero indexing
      if(this.isNextEnabled)
        this.onGetPage(this.clientsResponseModel.currentPage + 1)
    }
  
    onGetEndPage(){
      // page indexing starts at zero 
      if(this.isEndEnabled)
        this.onGetPage(this.clientsResponseModel.totalPages - 1)
    }

}
