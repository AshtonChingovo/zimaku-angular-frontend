import { Component } from '@angular/core';
import { HatcheryRecordsComponent } from './hatchery-records/hatchery-records.component';
import { ReceiveStockComponent } from './receive-stock/receive-stock.component';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { APIResponse } from '../authentication/model/api-response.model';
import { DispatchModel } from '../production/dispatch/model/dispatch.model';
import { DispatchService } from '../production/dispatch/dispatch.service';
import { HatcheryService } from './hatchery.service';
import { Pagination as PaginationService } from '../util/pagination.service';
import { PaginationAPIResponseModel as PaginationResponseModel } from '../model/pagination-response.model';

@Component({
  selector: 'app-hatchery',
  standalone: true,
  imports: [ HatcheryRecordsComponent, CommonModule, FormsModule],
  templateUrl: './hatchery.component.html',
  styleUrl: './hatchery.component.css'
})
export class HatcheryComponent {

  apiResponse: APIResponse
  paginationResponseModel: PaginationResponseModel
  dispatchRecords: DispatchModel[]

  isFetchingData = true
  isEmpty = true

  // pagination parameters
  pages = []
  minPage = 0
  currentPage = 0
  maxPage = 0
  isStartEnabled: boolean
  isPrevEnabled: boolean
  isNextEnabled: boolean
  isEndEnabled: boolean

  activeDispatchModel: DispatchModel = {
    id: 0,
    date: "",
    dateStockReceived: "",
    batchNumber: "", 
    quantity: 0, 
    totalStockReceived: 0,
    ageOnDispatch: "",
    eggsStockId: 0
  }

  constructor(
    private dispatchService: DispatchService, 
    private hatcheryService: HatcheryService,
    private paginationService: PaginationService) { }

  ngOnInit(): void {
       // get first page of content
       this.onGetPage(0)
    
       this.hatcheryService.dispatchRecordsResponseSubject.subscribe((response) => {
   
         this.isFetchingData = false
         this.apiResponse = response
   
         if(this.apiResponse.isSuccessful){

           if(this.apiResponse.requestType == "POST" && this.currentPage == 1){
             // reload page if currently on page zero to fetch lastest list
             this.onGetPage(0)
             return
           }
   
           this.paginationResponseModel = this.apiResponse.data
           this.dispatchRecords = this.paginationResponseModel.data
   
           this.isEmpty = this.paginationResponseModel.numberOfElements == 0
    
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
      })
  }

  onActiveDispatch(dispatchModel: DispatchModel){
    this.activeDispatchModel = dispatchModel
  }

  onSubmit(form: NgForm){ 
    this.hatcheryService.post({
      batchNumber: this.activeDispatchModel.batchNumber, 
      totalDispatched: this.activeDispatchModel.quantity, 
      breakages: form.value.quantity,
      dispatchId: this.activeDispatchModel.id,
      eggsStockId: this.activeDispatchModel.eggsStockId
    })
  }

  onGetPage(page: number){

    this.isFetchingData = true

    // get the first page of results
    this.hatcheryService.getDispatchNotInHatchery({
      pageNumber: page,
      pageSize: 10,
      sortBy: "id"
    })
  }

  onGetPreviousPage(){
    // using paginationResponseModel instead of this.currentPage to not complicate API zero indexing
    if(this.isPrevEnabled)
      this.onGetPage(this.paginationResponseModel.currentPage - 1)
  }

  onGetStartPage(){
    // page indexing starts at zero 
    if(this.isStartEnabled)
      this.onGetPage(0)
  }

  onGetNextPage(){
    // using paginationResponseModel instead of this.currentPage to not complicate API zero indexing
    if(this.isNextEnabled)
      this.onGetPage(this.paginationResponseModel.currentPage + 1)
  }

  onGetEndPage(){
    // page indexing starts at zero 
    if(this.isEndEnabled)
      this.onGetPage(this.paginationResponseModel.totalPages - 1)
  }

}
