import { Component } from '@angular/core';
import { RecordsComponent } from './records/records.component';
import { AddDataComponent } from './add-data/add-data.component';

@Component({
  selector: 'app-eggs',
  standalone: true,
  imports: [RecordsComponent, AddDataComponent],
  templateUrl: './eggs.component.html',
  styleUrl: './eggs.component.css'
})
export class EggsComponent {

}
