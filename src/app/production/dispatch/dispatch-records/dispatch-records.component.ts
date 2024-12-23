import { Component, OnInit } from '@angular/core';
import { DispatchService } from '../dispatch.service';
import { APIResponse } from '../../../authentication/model/api-response.model';
import { CommonModule } from '@angular/common';
import { DispatchModel } from '../model/dispatch.model';

@Component({
  selector: 'app-dispatch-records',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './dispatch-records.component.html',
  styleUrl: './dispatch-records.component.css'
})
export class RecordsComponent implements OnInit {

  private apiResponse: APIResponse
  dispatch: DispatchModel[]

  isFetching = false

  constructor (private dispatchService: DispatchService){}

  ngOnInit(): void {

    // get first page of content
    this.onGetPage(0)

    this.isFetching = true
    
    this.dispatchService.responseSubject.subscribe((response) => {

      this.isFetching = false

      this.apiResponse = response

      if(this.apiResponse.isSuccessful){
        this.dispatch = this.apiResponse.data.data
      }

    })

  }
  
  onEdit(){

  }

  onGetPage(page: number){

    this.isFetching = true

    // get the first page of results
    this.dispatchService.getDispatch({
      page: 0,
      pageSize: 5,
      sortBy: "id"
    })
  }

}
