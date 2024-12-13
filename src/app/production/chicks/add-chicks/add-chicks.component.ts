import { Component, OnInit, ViewChild } from '@angular/core';
import { ChicksService } from '../chicks.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule, NgForm } from '@angular/forms';
import { APIResponse } from '../../../authentication/model/api-response.model';

@Component({
  selector: 'app-add-chicks',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-chicks.component.html',
  styleUrl: './add-chicks.component.css'
})
export class AddChicksComponent implements OnInit{

  @ViewChild('addParentStockForm') addParentStockForm: NgForm

  isLoading = false
  apiResponse: APIResponse

  constructor(private chicksService: ChicksService){}

  ngOnInit(): void {
    this.chicksService.postResponseSubject.subscribe(response => {

      this.apiResponse = response

      if(this.apiResponse.isSuccessful)
        this.addParentStockForm.reset()

      this.isLoading = false

    })
  }

  onSubmit(){
    if(this.addParentStockForm.invalid){
      return
    }

    this.isLoading = true

    this.chicksService.postChicks({
        males: this.addParentStockForm.value.males,
        females: this.addParentStockForm.value.females,
        fatalities: this.addParentStockForm.value.fatalities,
        batch: this.addParentStockForm.value.batch 
      }
    )
  }

}
