import { Component, OnInit } from '@angular/core';
import { ChicksService } from '../chicks.service';
import { ChicksAPIResponseModel } from '../model/chicks-response.model';
import { APIResponse } from '../../../authentication/model/api-response.model';
import { CommonModule } from '@angular/common';
import { ChicksStockModel } from '../model/chicks-stock.model';
import { Form, FormsModule, NgForm } from '@angular/forms';
import { Pagination as PaginationService } from '../../../util/pagination.service';
import { PaginationAPIResponseModel } from '../../../model/pagination-response.model';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [ FormsModule, CommonModule ],
  templateUrl: './records.component.html',
  styleUrl: './records.component.css'
})
export class RecordsComponent implements OnInit{

  apiResponse: APIResponse
  chicksResponseModel: ChicksAPIResponseModel

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

  // average weight week to record 
  averageChickWeightWeek = 0
  
  activeChickModel: ChicksStockModel = {
    id: 0,
    males: 0,
    females: 0,
    fatalities: 0,
    batchNumber: "",
    averageWeight: []
  }

  constructor(private chicksService: ChicksService, private paginationService: PaginationService){}

  ngOnInit(): void {

    // get the first page of results
    this.onGetPage(0)

    this.chicksService.getResponseSubject.subscribe(response => {

      this.apiResponse = response
      this.isLoading = false

      if(this.apiResponse.isSuccessful){

        this.chicksResponseModel = this.apiResponse.data

        // new records returned from AddChicksComponent POST request should only cause reload when on the first page
        if(this.chicksResponseModel.source == "POST" && this.currentPage < 2){
          this.chicksService.getChicks({
            page: 0,
            pageSize: 10,
            sortBy: "id"
          })
        }   
        else if(this.chicksResponseModel.source == "PUT" || this.chicksResponseModel.source == "DELETE"){
          this.chicksService.getChicks({
            page: this.chicksResponseModel.currentPage,
            pageSize: 10,
            sortBy: "id"
          })
        }
        else{
          this.isEmpty = this.chicksResponseModel.numberOfElements == 0
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

  // used to set the chicksModel select for editing or deleting
  onSetActiveChickModel(chicksModel: ChicksStockModel){
    this.activeChickModel = chicksModel
  }

  onSetUpAverageChickWeightWeek(chicksModel: ChicksStockModel){
    this.activeChickModel = chicksModel

    // work out the week to record the average weight
    if(chicksModel.averageWeight && chicksModel.averageWeight.length < 23)
      this.averageChickWeightWeek = chicksModel.averageWeight.length + 1
    else if(chicksModel.averageWeight && chicksModel.averageWeight.length == 23)
      return
    else
      this.averageChickWeightWeek = 1
  }

  onSaveAverageChickWeightWeek(form: NgForm){
    if(form.invalid)
      return

    this.chicksService.postChicksAverageWeight({
      id: this.activeChickModel.id,
      males: this.activeChickModel.males,
      females: this.activeChickModel.females,
      fatalities: this.activeChickModel.fatalities,
      batchNumber: this.activeChickModel.batchNumber,
      averageWeight: [
        {
          week: this.averageChickWeightWeek,
          averageWeight: form.value.averageWeight
        }
      ]
    })
  }

  onEdit(form: NgForm){
    if(form.invalid)
      return

    this.chicksService.updateChicks({
      // use ID of currently active (select) record
      id: this.activeChickModel.id,
      males: form.value.males,
      females: form.value.females,
      fatalities: form.value.fatalities,
      batchNumber: form.value.batch 
    },
    this.chicksResponseModel.currentPage)
  }

  onDelete(){
    this.chicksService.deleteChicks(this.activeChickModel.id, this.chicksResponseModel.currentPage)
  }

  onGetPage(page: number){

    this.isLoading = true

    this.chicksService.getChicks({
      page: page,
      pageSize: 10,
      sortBy: "id"
    })
  }

  onGetPreviousPage(){
    // using chicksResponseModel instead of this.currentPage to not complicate API zero indexing
    if(this.isPrevEnabled)
      this.onGetPage(this.chicksResponseModel.currentPage - 1)
  }

  onGetStartPage(){
    // page indexing starts at zero 
    if(this.isStartEnabled)
      this.onGetPage(0)
  }

  onGetNextPage(){
    // using chicksResponseModel instead of this.currentPage to not complicate API zero indexing
    if(this.isNextEnabled)
      this.onGetPage(this.chicksResponseModel.currentPage + 1)
  }

  onGetEndPage(){
    // page indexing starts at zero 
    if(this.isEndEnabled)
      this.onGetPage(this.chicksResponseModel.totalPages - 1)
  }

}
