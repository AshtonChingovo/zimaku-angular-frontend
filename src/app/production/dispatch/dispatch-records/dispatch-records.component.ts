import { Component, OnInit } from '@angular/core';
import { DispatchService } from '../dispatch.service';
import { APIResponse } from '../../../authentication/model/api-response.model';
import { CommonModule } from '@angular/common';
import { DispatchModel } from '../model/dispatch.model';
import { Pagination as PaginationService } from '../../../util/pagination.service';
import { PaginationAPIResponseModel as PaginationResponseModel } from '../../../model/pagination-response.model';

@Component({
  selector: 'app-dispatch-records',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './dispatch-records.component.html',
  styleUrl: './dispatch-records.component.css'
})
export class RecordsComponent implements OnInit {

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

  constructor (private dispatchService: DispatchService, private paginationService: PaginationService){}

  ngOnInit(): void {

    // get first page of content
    this.onGetPage(0)
    
    this.dispatchService.dispatchRecordsResponseSubject.subscribe((response) => {

      this.isFetchingData = false
      this.apiResponse = response

      if(this.apiResponse.isSuccessful){

        if(this.apiResponse.data.source == "POST" && this.currentPage == 1){
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
  
  onEdit(){

  }

  onGetPage(page: number){

    this.isFetchingData = true

    // get the first page of results
    this.dispatchService.getDispatch({
      page: page,
      pageSize: 5,
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
