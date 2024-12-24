import { Component, OnInit } from '@angular/core';
import { APIResponse } from '../../../authentication/model/api-response.model';
import { EggsAPIResponseModel } from '../../eggs/model/eggs-response.model';
import { CommonModule } from '@angular/common';
import { EggsModel } from '../../eggs/model/eggs.model';
import { DispatchService } from '../dispatch.service';
import { Pagination as PaginationService } from '../../../util/pagination.service';

@Component({
  selector: 'app-dispatch-stock',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './dispatch-stock.component.html',
  styleUrl: './dispatch-stock.component.css'
})
export class DispatchStockComponent implements OnInit {

  apiResponse: APIResponse
  eggsResponseModel: EggsAPIResponseModel

  activeEggsModel: EggsModel

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

  constructor(private dispatchService: DispatchService, private paginationService: PaginationService){}

  ngOnInit(): void {

    // get the first page of results
    this.onGetPage(0)

    this.dispatchService.dispatchEggsSubject.subscribe(response => {

      this.isFetchingData = false
      this.apiResponse = response

      if(this.apiResponse.isSuccessful){

        this.eggsResponseModel = this.apiResponse.data

        if(this.currentPage == 1 && this.eggsResponseModel.source == "POST"){
          // fetch latest data for 1st page
          this.dispatchService.getEggs({
            page: 0,
            pageSize: 5,
            sortBy: "id"
          })
        }
        else{
          this.isEmpty = this.eggsResponseModel.numberOfElements == 0
        }   
        
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

  onGetPage(page: number){

    this.isFetchingData = true

    this.dispatchService.getEggs({
      page: page,
      pageSize: 5,
      sortBy: "id"
    })
  }

  onEggsModelSelected(eggsModel: EggsModel){
    this.activeEggsModel = eggsModel
  }

  onDispatch(){
    if(this.activeEggsModel){

      this.isFetchingData = true

      this.dispatchService.postDispatch({
        dateStockReceived: this.activeEggsModel.date,
        batchNumber: this.activeEggsModel.batchNumber, 
        quantity: this.activeEggsModel.quantity, 
        totalStockReceived: this.activeEggsModel.quantity,
      })
    }
  }

  onGetPreviousPage(){
    // using eggsResponseModel instead of this.currentPage to not complicate API zero indexing
    if(this.isPrevEnabled)
      this.onGetPage(this.eggsResponseModel.currentPage - 1)
  }

  onGetStartPage(){
    // page indexing starts at zero 
    if(this.isStartEnabled)
      this.onGetPage(0)
  }

  onGetNextPage(){
    // using eggsResponseModel instead of this.currentPage to not complicate API zero indexing
    if(this.isNextEnabled)
      this.onGetPage(this.eggsResponseModel.currentPage + 1)
  }

  onGetEndPage(){
    // page indexing starts at zero 
    if(this.isEndEnabled)
      this.onGetPage(this.eggsResponseModel.totalPages - 1)
  }

}
