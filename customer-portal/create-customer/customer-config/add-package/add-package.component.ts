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
  showSuccessAlert: boolean = false;
  alertMsg: string = '';

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
    this.packageDetails.resources = ['Provider Details', 'Resource Group'];
    this.selectedItems = [
      { item_id: 1, item_text: 'Provider Details', isDisabled: true },
      { item_id: 2, item_text: 'Resource Group', isDisabled: true }
    ];
    this.packageDetails.status = true;
  }

  ngOnInit() {
    this.dropdownList = [
      { item_id: 1, item_text: 'Provider Details', isDisabled: true },
      { item_id: 2, item_text: 'Resource Group', isDisabled: true },
      { item_id: 3, item_text: 'Virtual Network', isDisabled: false },
      { item_id: 4, item_text: 'Subnet', isDisabled: false },
      { item_id: 5, item_text: 'Network Security Group', isDisabled: false },
      { item_id: 6, item_text: 'Bastion Host', isDisabled: false },
      { item_id: 7, item_text: 'Network Interface', isDisabled: false },
      { item_id: 8, item_text: 'Public Ip', isDisabled: false },
      { item_id: 9, item_text: 'Virtual Machine', isDisabled: false },
      { item_id: 10, item_text: 'Virtual Network Peering', isDisabled: false }
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

    this.selectedItems = [
      { item_id: 1, item_text: 'Provider Details', isDisabled: true },
      { item_id: 2, item_text: 'Resource Group', isDisabled: true }
    ];
    this.packageDetails.resources = ['Provider Details', 'Resource Group'];

    this.customerDetails = JSON.parse(sessionStorage.getItem('currentCustomer') || '');
    this.getPackagesList();
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
      this.ngOnInit();
      if(response != null) {
        this.alertMsg = 'Data saved successfully!';
        this.showSuccessAlert = true;
        setTimeout(() => {
          this.showSuccessAlert = false;
        }, 2000);
      }
    });
    this.modalRef?.hide();
  }

  editPackage(packages: any, addPackage: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      addPackage,
      Object.assign({}, { class: 'gray modal-lg' })
    );
    this.packageDetails = packages;
    this.selectedItems = [];
    if(this.packageDetails.resources == null) {
      this.packageDetails.resources = ['Provider Details', 'Resource Group'];
    }
    else {
      if(!this.packageDetails.resources.includes('Provider Details')) {
        this.packageDetails.resources.push('Provider Details');
      }
      if(!this.packageDetails.resources.includes('Resource Group')) {
        this.packageDetails.resources.push('Resource Group');
      }
      
    }
    for (let i = 0; i < this.dropdownList.length; i++) {
      if(this.packageDetails.resources.includes(this.dropdownList[i].item_text)) {
        this.selectedItems.push(this.dropdownList[i]);
      }
    }
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
