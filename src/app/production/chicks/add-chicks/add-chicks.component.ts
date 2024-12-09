import { Component } from '@angular/core';
import { ChicksService } from '../chicks.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-chicks',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-chicks.component.html',
  styleUrl: './add-chicks.component.css'
})
export class AddChicksComponent {

  constructor(private chicksService: ChicksService){}

  onSubmit(form: NgForm){
    if(form.invalid){
      return
    }

    this.chicksService.postChicks({
        males: form.value.males,
        females: form.value.females,
        fatalities: form.value.fatalities,
        batch: form.value.batch 
      }
    )
  }

}
