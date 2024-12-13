import { Component, OnInit } from '@angular/core';
import { ChicksService } from '../chicks.service';
import { Subscription } from 'rxjs';
import { ChicksAPIResponseModel } from '../model/chicks-response.model';
import { APIResponse } from '../../../authentication/model/api-response.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './records.component.html',
  styleUrl: './records.component.css'
})
export class RecordsComponent implements OnInit{

  apiResponse: APIResponse
  chicksResponseModel: ChicksAPIResponseModel

  isLoading = true
  isEmpty = true

  // pagination
  pages = []
  minPage = 0
  currentPage = 0
  maxPage = 0
  isStartEnabled: boolean
  isPrevEnabled: boolean
  isNextEnabled: boolean
  isEndEnabled: boolean

  constructor(private chicksService: ChicksService){}

  ngOnInit(): void {

    this.onGetPage(0)

    this.chicksService.getResponseSubject.subscribe(response => {

      this.apiResponse = response

      if(this.apiResponse.isSuccessful){

        this.chicksResponseModel = this.apiResponse.body

        console.log(this.chicksResponseModel.source)

        // new records returned from AddChicksComponent POST request should only cause reload when on the first page
        if(this.chicksResponseModel.source == "POST" && this.currentPage < 2){
          this.chicksService.getChicks({
            page: 0,
            pageSize: 10,
            sortBy: "id"
          })
        }   
        else{
          this.isEmpty = this.chicksResponseModel.numberOfElements == 0
        }   
        
        this.setUpPagination()
      }

      this.isLoading = false

    })
  }

  setUpPagination(){
    // page indexing starts at zero 
    this.currentPage = this.chicksResponseModel.currentPage + 1

    if(this.chicksResponseModel.first){
      this.minPage = this.currentPage
      this.maxPage = this.currentPage

      this.isStartEnabled = false
      this.isPrevEnabled = false

      this.maxPage += (this.currentPage + 2 <= this.chicksResponseModel.totalPages) ? 2 : (this.currentPage + 1 <= this.chicksResponseModel.totalPages) ? 1 : 0 

      // if != means a next page is available
      this.isNextEnabled = this.minPage != this.maxPage
      this.isEndEnabled = this.minPage != this.maxPage

    }
    else if(this.chicksResponseModel.last){
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
      this.maxPage += (this.currentPage + 1 <= this.chicksResponseModel.totalPages) ? 1 : 0 

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
