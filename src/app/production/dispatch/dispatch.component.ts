import { Component } from '@angular/core';
import { AddDispatchComponent } from "./add-dispatch/add-dispatch.component";
import { RecordsComponent } from "./records/records.component";

@Component({
  selector: 'app-dispatch',
  standalone: true,
  imports: [AddDispatchComponent, RecordsComponent],
  templateUrl: './dispatch.component.html',
  styleUrl: './dispatch.component.css'
})
export class DispatchComponent {

}
