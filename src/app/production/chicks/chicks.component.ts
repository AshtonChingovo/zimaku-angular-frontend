import { Component } from '@angular/core';
import { RecordsComponent } from './records/records.component';
import { AddChicksComponent } from './add-chicks/add-chicks.component';

@Component({
  selector: 'app-chicks',
  standalone: true,
  imports: [RecordsComponent, AddChicksComponent],
  templateUrl: './chicks.component.html',
  styleUrl: './chicks.component.css'
})
export class ChicksComponent {

}
