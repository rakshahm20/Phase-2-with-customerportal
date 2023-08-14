import { Component, Input, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/customer-portal/services/customer.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-service-principle',
  templateUrl: './service-principle.component.html',
  styleUrls: ['./service-principle.component.scss']
})

export class ServicePrincipleComponent {
  isOpen = true;
  router: Router;
  modalRef?: BsModalRef;
  default!: string;
  searchText = '';
  loader: boolean = false;

  principleDetails: any = {};
  principleList: any = [];
  @Input() customerDetails: any = {};
  providerName: string = '';

  constructor(router: Router, private modalService: BsModalService, private customer: CustomerService) { 
    this.router = router;
  }

  openModalWithClass(ServicePrinciple: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      ServicePrinciple,
      Object.assign({}, { class: 'gray modal-lg' })
    );
    this.principleDetails = {};
    this.principleDetails.status = true;
  }

  ngOnInit() {
    this.customerDetails = JSON.parse(sessionStorage.getItem('currentCustomer') || '');
    this.getPrincipleList(this.customerDetails.customerId);
  }

  onSubmit(principleForm: NgForm) {
    this.loader = true;
    this.principleDetails.customerId = this.customerDetails.customerId;
    console.log(this.principleDetails);
    var payload: any = [];
    payload.push(this.principleDetails);
    this.customer.savePrinciple(payload).subscribe(response => {
      this.loader = false;
    });
    this.ngOnInit();
  }

  getPrinciple(id: number) {
    this.loader = true;
    this.customer.getPrincipleById(id).subscribe(response => {
      console.log(response);
      this.loader = false;
    });
  }

  getPrincipleList(id: number) {
    this.loader = true;
    this.customer.getPrincipleByCustomerId(this.customerDetails.customerId).subscribe(response => {
      this.principleList = response;
      this.loader = false;
    });
  }
}
