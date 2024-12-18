import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { EggsService } from '../eggs.service';
import { APIResponse } from '../../../authentication/model/api-response.model';

@Component({
  selector: 'app-add-data',
  standalone: true,
  imports: [ FormsModule, CommonModule ],
  templateUrl: './add-data.component.html',
  styleUrl: './add-data.component.css'
})
export class AddEggsComponent implements OnInit {

  @ViewChild('addEggsForm') addEggsForm: NgForm

  isLoading = false
  apiResponse: APIResponse

  constructor(private eggsService: EggsService){}

  ngOnInit(): void {
    this.eggsService.postResponseSubject.subscribe(response => {
      
      this.apiResponse = response

      if(this.apiResponse.isSuccessful)
        this.addEggsForm.reset()

      this.isLoading = false
    })
  }

  onSubmit(form: NgForm) {
    if(this.addEggsForm.invalid){
      return
    }

    this.isLoading = true

    this.eggsService.postEggs({
      // id added in by the backend 
      id: 0,
      quantity: this.addEggsForm.value.quantity,
      hatchable: this.addEggsForm.value.hatchable,
      rejects: this.addEggsForm.value.rejects,
      batchNumber: this.addEggsForm.value.batchNumber,
    })
  }


}
