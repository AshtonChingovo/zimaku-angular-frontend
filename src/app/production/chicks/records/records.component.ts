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

  apiResponseSubject = Subscription
  apiResponse: APIResponse
  chicksResponseModel: ChicksAPIResponseModel

  isLoading = true

  // pagination
  pages = []
  minPage = 0
  currentPage = 0
  maxPage = 0
  isStartEnabled: boolean
  isPrevEnabled: boolean
  isNextEnabled: boolean
  isLastEnabled: boolean

  constructor(private chicksService: ChicksService){}

  ngOnInit(): void {

    this.chicksService.getChicks({
      page: 5,
      pageSize: 5,
      sortBy: "id"
    })

    this.chicksService.responseSubject.subscribe(response => {

      this.apiResponse = response

      if(this.apiResponse.isSuccessful){
        this.chicksResponseModel = this.apiResponse.body

        this.setUpPagination()
      }

      this.isLoading = false

    })
  }

  getChicks(page: string){

    this.isLoading = true

    this.chicksService.getChicks({
      page: 8,
      pageSize: 5,
      sortBy: "id"
    })
  }

  setUpPagination(){
    this.currentPage = this.chicksResponseModel.currentPage

    if(this.chicksResponseModel.first && this.chicksResponseModel.last){
      this.minPage = this.currentPage
      this.maxPage = this.currentPage
    }
    else if(this.chicksResponseModel.first){
      this.minPage = this.currentPage
      this.maxPage = this.currentPage

      this.isStartEnabled = false
      this.isPrevEnabled = false

      this.maxPage += (this.currentPage + 2 <= this.chicksResponseModel.totalPages) ? 2 : (this.currentPage + 1 <= this.chicksResponseModel.totalPages) ? 1 : 0 

    }
    else if(this.chicksResponseModel.last){
      this.maxPage = this.currentPage
      this.minPage = this.currentPage

      this.isNextEnabled = false
      this.isLastEnabled = false

      this.minPage -= (this.currentPage - 2 > 0) ? 2 : (this.currentPage - 1 > 0) ? 1 : 0 

    }
    else{
      this.isStartEnabled = true
      this.isPrevEnabled = true
      this.isNextEnabled = true
      this.isLastEnabled = true

      if(this.currentPage - 2 >= 1){
        this.minPage = this.currentPage - 2
        this.maxPage = this.currentPage
      }
      else{
        this.minPage = this.currentPage - 1
        this.maxPage = this.currentPage + 1
      }
    }

    console.log(this.minPage + " -  " + this.currentPage + " - " + this.maxPage + " - " + this.chicksResponseModel.totalPages)

    this.setUpPages()

  }

  setUpPages(){
    this.pages = []
    var i: number
    for(i = this.minPage; i <= this.maxPage; ++i){
      this.pages.push(i)
    }
  }

}
