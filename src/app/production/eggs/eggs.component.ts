import { Component } from '@angular/core';
import { EggsRecordsComponent } from './records/records.component';
import { AddEggsComponent } from './add-data/add-data.component';

@Component({
  selector: 'app-eggs',
  standalone: true,
  imports: [ EggsRecordsComponent, AddEggsComponent],
  templateUrl: './eggs.component.html',
  styleUrl: './eggs.component.css'
})
export class EggsComponent {

}
