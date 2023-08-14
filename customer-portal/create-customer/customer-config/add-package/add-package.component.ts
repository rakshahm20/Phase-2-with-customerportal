import { Component, Input, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/customer-portal/services/customer.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-package',
  templateUrl: './add-package.component.html',
  styleUrls: ['./add-package.component.scss']
})

export class AddPackageComponent {
  isOpen = true;
  router: Router;
  modalRef?: BsModalRef;
  dropdownList:any = [];
  selectedItems:any = [];
  dropdownSettings:any = {};
  default!: string;
  searchText = '';
  loader: boolean = false;

  packageDetails: any = {};
  packagesList: any = [];
  customerId: number = 0;
  customerName: string = '';
  @Input() customerDetails: any = {};

  constructor(router: Router, private modalService: BsModalService, private customer: CustomerService) { 
    this.router = router;
  }

  openModalWithClass(addPackage: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      addPackage,
      Object.assign({}, { class: 'gray modal-lg' })
    );
    this.packageDetails = {};
    this.packageDetails.resources = [];
    this.packageDetails.status = true;
  }

  ngOnInit() {
    this.dropdownList = [
      { item_id: 1, item_text: 'Virtual Network' },
      { item_id: 2, item_text: 'Subnet' },
      { item_id: 3, item_text: 'Public Ip' },
      { item_id: 4, item_text: 'Network Interface' },
      { item_id: 5, item_text: 'Virtual Machine' },
      { item_id: 6, item_text: 'Bastion Host' }
    ];

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.selectedItems = [];

    this.customerDetails = JSON.parse(sessionStorage.getItem('currentCustomer') || '');
    this.getPackagesList();
  }

  ngAfterViewInit() {
    if(sessionStorage.getItem('currentCustomer') != null) {
      this.packageDetails = JSON.parse(sessionStorage.getItem('currentCustomer') || '');
      for (let i = 0; i < this.dropdownList.length; i++) {
        if(this.packageDetails.resources.includes(this.dropdownList[i].item_text)) {
          this.selectedItems.push(this.dropdownList[i]);
        }
      }
    }
  }

  onItemSelect(item: any) {
    if(!this.packageDetails.resources.includes(item.item_text)) {
      this.packageDetails.resources.push(item.item_text);
    }
  }

  onItemDeSelect(item: any) {
    if(this.packageDetails.resources.includes(item.item_text)) {
      this.packageDetails.resources = this.packageDetails.resources.filter((text: any) => text !== item.item_text);
    }
  }

  onSelectAll(items: any) {
    for (let i=0; i < items.length; i++) {
      if(!this.packageDetails.resources.includes(items[i].item_text)) {
        this.packageDetails.resources.push(items[i].item_text);
      }
    }
  }

  onUnSelectAll() {
    this.packageDetails.resources = [];
  }

  onSubmit(packageForm: NgForm) {
    this.loader = true;
    this.packageDetails.customerId = this.customerDetails.customerId;
    this.customer.savePackage(this.packageDetails).subscribe(response => {
      this.loader = false;
    });
    this.ngOnInit();
  }

  getPackage(id: number) {
    this.loader = true;
    this.customer.getPackageById(id).subscribe(response => {
      this.packageDetails = response;
      this.loader = false;
    });
  }

  getPackagesList() {
    this.loader = true;
    var id = this.customerDetails.customerId;
    this.customer.getPackagesByCustomerId(id).subscribe(response => {
      this.packagesList = response;
      this.loader = false;
    });
  }
}
