import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ClientsService } from './clients.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [ CommonModule, FormsModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {

    // order types
    ZIMAKU_CLIENT = "ZIMAKU_CLIENT";
    ZIMAKU_AGENT = "AGENT";
    ZIMAKU_FARMER = "FARMER";
    WALKIN_CLIENT = "WALKIN";
    clientTypesList = [this.ZIMAKU_AGENT, this.ZIMAKU_FARMER];
  
    clientType = '';

    isLoading = false
    apiResponse: any;
    isFetchingData: any;
    isEmpty: any;

    constructor(private clientService: ClientsService) {}

    ngOnInit(): void {

      this.clientService.getResponseSubject.subscribe((response) => {
        this.apiResponse = response
        this.isLoading = false
      })
    }
  
    clientTypeSelected(orderType: string) {
      this.clientType = orderType;
    }

    onSubmitZimakuClient(form: NgForm) {
      if(form.invalid){
        return
      } 

      this.isLoading = true

      this.clientService.postClient({ 
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        phoneNumber: form.value.phoneNumber,
        address: form.value.address,
        clientType: form.value.clientType
      })
    } 

    onSubmitWalkInClient(form: NgForm) {
      if(form.invalid){
        return
      } 

      this.isLoading = true

      this.clientService.postClient({ 
        firstName: form.value.firstName,
        phoneNumber: form.value.phoneNumber,
        clientType: this.WALKIN_CLIENT  
      })
    }

}
