import { Component, OnInit } from '@angular/core';
import { EggsService } from '../eggs.service';
import { EggsAPIResponseModel } from '../model/eggs-response.model';
import { APIResponse } from '../../../authentication/model/api-response.model';
import { EggsModel } from '../model/eggs.model';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  isLoading = true
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
    batchNumber: ""
  }

  constructor(private eggsService: EggsService){}    

  ngOnInit(): void {

    // get the first page of results
    this.onGetPage(0)

    this.eggsService.getResponseSubject.subscribe(response => {
      this.apiResponse = response

      if(this.apiResponse.isSuccessful){

        this.eggsResponseModel = this.apiResponse.body

        // new records returned from AddEggsComponent POST request should only cause reload when on the first page
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
        
        console.log(this.eggsResponseModel)
        this.setUpPagination()
      }

      this.isLoading = false
      
    })
  }

  setUpPagination(){
    // page indexing starts at zero 
    this.currentPage = this.eggsResponseModel.currentPage + 1

    if(this.eggsResponseModel.first){
      this.minPage = this.currentPage
      this.maxPage = this.currentPage

      this.isStartEnabled = false
      this.isPrevEnabled = false

      this.maxPage += (this.currentPage + 2 <= this.eggsResponseModel.totalPages) ? 2 : (this.currentPage + 1 <= this.eggsResponseModel.totalPages) ? 1 : 0 

      // if != means a next page is available
      this.isNextEnabled = this.minPage != this.maxPage
      this.isEndEnabled = this.minPage != this.maxPage

    }
    else if(this.eggsResponseModel.last){
      this.maxPage = this.currentPage
      this.minPage = this.currentPage

      this.isStartEnabled = true
      this.isPrevEnabled = true
      this.isNextEnabled = false
      this.isEndEnabled = false

      this.minPage -= (this.currentPage - 2 > 0) ? 2 : (this.currentPage - 1 > 0) ? 1 : 0 

      // if != means a next page is available
      this.isPrevEnabled = this.maxPage != this.minPage
      this.isStartEnabled = this.maxPage != this.minPage
    }
    else{
      this.isStartEnabled = true
      this.isPrevEnabled = true
      this.isNextEnabled = true
      this.isEndEnabled = true

      this.minPage = this.currentPage
      this.maxPage = this.currentPage

      this.minPage -= (this.currentPage - 1 > 0) ? 1 : 0 
      this.maxPage += (this.currentPage + 1 <= this.eggsResponseModel.totalPages) ? 1 : 0 

    }

    // console.log(this.minPage + " -  " + this.currentPage + " - " + this.maxPage + " - " + this.chicksResponseModel.totalPages)

    this.setUpPages()

  }

  setUpPages(){
    this.pages = []
    var i: number
    for(i = this.minPage; i <= this.maxPage; ++i){
      this.pages.push(i)
    }
  }

  // used to set the chicksModel select for editing or deleting
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
      batchNumber: form.value.batchNumber 
    }, this.eggsResponseModel.currentPage)
  }

  onDelete(){
    this.eggsService.deleteEggs(this.activeEggsModel.id, this.eggsResponseModel.currentPage)
  }

  onGetPage(page: number){

    this.isLoading = true

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
