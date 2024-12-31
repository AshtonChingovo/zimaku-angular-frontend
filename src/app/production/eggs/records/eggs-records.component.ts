import { Component, OnInit } from '@angular/core';
import { EggsService } from '../eggs.service';
import { EggsAPIResponseModel } from '../model/eggs-response.model';
import { APIResponse } from '../../../authentication/model/api-response.model';
import { EggsModel } from '../model/eggs.model';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Pagination as PaginationService } from '../../../util/pagination.service';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [ FormsModule, CommonModule],
  templateUrl: './eggs-records.component.html',
  styleUrl: './records.component.css'
})
export class EggsRecordsComponent implements OnInit {

  apiResponse: APIResponse
  eggsResponseModel: EggsAPIResponseModel

  isFetchingData = true
  isEmpty = true
  isShowEditDialog = false
  isShowDeleteDialog = false

  // pagination
  pages = []
  minPage = 0
  currentPage = 0
  maxPage = 0
  isStartEnabled: boolean
  isPrevEnabled: boolean
  isNextEnabled: boolean
  isEndEnabled: boolean

  activeEggsModel = {
    id: 0,
    quantity: 0,
    hatchable: 0,
    rejects: 0,
    batchNumber: "",
    isDispatched: false
  }

  constructor(private eggsService: EggsService, private paginationService: PaginationService){}    

  ngOnInit(): void {

    // get the first page of results
    this.onGetPage(0)

    this.eggsService.getResponseSubject.subscribe(response => {

      console.log("ACTIVE")

      this.apiResponse = response
      this.isFetchingData = false

      if(this.apiResponse.isSuccessful){

        this.eggsResponseModel = this.apiResponse.data

        // new records returned from AddEggsComponent POST request should only reload page when on the first page
        if(this.eggsResponseModel.source == "POST" && this.currentPage < 2){
          this.eggsService.getEggs({
            page: 0,
            pageSize: 10,
            sortBy: "id"
          })
        }   
        else if(this.eggsResponseModel.source == "PUT" || this.eggsResponseModel.source == "DELETE"){
          this.eggsService.getEggs({
            page: this.eggsResponseModel.currentPage,
            pageSize: 10,
            sortBy: "id"
          })
        }
        else{
          this.isEmpty = this.eggsResponseModel.numberOfElements == 0
        }   
        
        this.setUpPagination()

      }

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

  // used to set the activeEggsModel select for editing or deleting
  onSetActiveEggsModel(eggsModel: EggsModel){
    this.activeEggsModel = eggsModel
  }  

  onEdit(form: NgForm){
    if(form.invalid)
      return

    this.eggsService.updateEggs({
      // use ID of currently active (select) record
      id: this.activeEggsModel.id,
      quantity: form.value.quantity,
      hatchable: form.value.hatchable,
      rejects: form.value.rejects,
      batchNumber: form.value.batchNumber,
      isDispatched: this.activeEggsModel.isDispatched
    }, this.eggsResponseModel.currentPage)
  }

  onDelete(){
    this.eggsService.deleteEggs(this.activeEggsModel.id, this.eggsResponseModel.currentPage)
  }

  onGetPage(page: number){

    this.isFetchingData = true

    this.eggsService.getEggs({
      page: page,
      pageSize: 10,
      sortBy: "id"
    })
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
