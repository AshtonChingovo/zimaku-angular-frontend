import { Component, OnInit } from '@angular/core';
import { EggsService } from '../../eggs/eggs.service';
import { APIResponse } from '../../../authentication/model/api-response.model';
import { EggsAPIResponseModel } from '../../eggs/model/eggs-response.model';
import { CommonModule } from '@angular/common';
import { EggsModel } from '../../eggs/model/eggs.model';
import { DispatchService } from '../dispatch.service';

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

  constructor(private eggsService: EggsService, private dispatchService: DispatchService){}

  ngOnInit(): void {

    // get the first page of results
    this.onGetPage(0)

    this.eggsService.getResponseSubject.subscribe(response => {
      this.apiResponse = response

      if(this.apiResponse.isSuccessful){

        this.eggsResponseModel = this.apiResponse.data

        if(this.currentPage == 1){
          // fetch latest data for 1st page
          this.eggsService.getEggs({
            page: 0,
            pageSize: 10,
            sortBy: "id"
          })
        }
        else{
          this.isEmpty = this.eggsResponseModel.numberOfElements == 0
        }   
        
        // this.setUpPagination()
      }

      this.isLoading = false
      
    })
    
  }

  onGetPage(page: number){

    this.isLoading = true

    this.eggsService.getEggs({
      page: page,
      pageSize: 10,
      sortBy: "id"
    })
  }

  onEggsModelSelected(eggsModel: EggsModel){
    this.activeEggsModel = eggsModel
  }

  onDispatch(){
    if(this.activeEggsModel){
      this.dispatchService.postDispatch({
        dateStockReceived: this.activeEggsModel.date,
        batchNumber: this.activeEggsModel.batchNumber, 
        quantity: this.activeEggsModel.quantity, 
        totalStockReceived: this.activeEggsModel.quantity,
      })
    }

  }

}
