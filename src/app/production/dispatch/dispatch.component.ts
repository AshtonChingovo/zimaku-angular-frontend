import { Component } from '@angular/core';
import { RecordsComponent } from "./dispatch-records/dispatch-records.component";
import { DispatchStockComponent } from './dispatch-stock/dispatch-stock.component';

@Component({
  selector: 'app-dispatch',
  standalone: true,
  imports: [ DispatchStockComponent, RecordsComponent],
  templateUrl: './dispatch.component.html',
  styleUrl: './dispatch.component.css'
})
export class DispatchComponent {

}
