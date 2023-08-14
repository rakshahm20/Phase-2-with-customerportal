import { Component, ViewChild } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer-config',
  templateUrl: './customer-config.component.html',
  styleUrls: ['./customer-config.component.scss']
})
export class CustomerConfigComponent {
  isOpen = true;
  dropdownList:any = [];
  selectedItems:any = [];
  dropdownSettings:any = {};
  items: any = [];
  default!: string;
  loader: boolean = false;

  newCustomer: any = {};
  editCustomer: boolean = false;
  currentDate: any;

  constructor(private customer: CustomerService, private datePipe: DatePipe) {}
  
  ngOnInit() {
    this.dropdownList = [
      { item_id: 1, item_text: 'Azure' },
      { item_id: 2, item_text: 'GCP' },
      { item_id: 3, item_text: 'AWS' },
      // { item_id: 4, item_text: 'Alibaba' },
      // { item_id: 5, item_text: 'Oracle Cloud' }
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

    this.newCustomer.providers = [];
    this.newCustomer.prefixName = 'default';
    this.newCustomer.status = 'Active';
    this.selectedItems = [];

    this.editCustomer = false;
  }

  ngAfterViewInit() {
    if(sessionStorage.getItem('currentCustomer') != null) {
      this.newCustomer = JSON.parse(sessionStorage.getItem('currentCustomer') || '');
      for (let i = 0; i < this.dropdownList.length; i++) {
        if(this.newCustomer.providers.includes(this.dropdownList[i].item_text)) {
          this.selectedItems.push(this.dropdownList[i]);
        }
      }
      this.editCustomer = true;
    }
  }

  onItemSelect(item: any) {
    if(!this.newCustomer.providers.includes(item.item_text)) {
      this.newCustomer.providers.push(item.item_text);
    }
  }

  onItemDeSelect(item: any) {
    if(this.newCustomer.providers.includes(item.item_text)) {
      this.newCustomer.providers = this.newCustomer.providers.filter((text: any) => text !== item.item_text);
    }
  }

  onSelectAll(items: any) {
    for (let i=0; i < items.length; i++) {
      if(!this.newCustomer.providers.includes(items[i].item_text)) {
        this.newCustomer.providers.push(items[i].item_text);
      }
    }
  }

  onUnSelectAll() {
    this.newCustomer.providers = [];
  }

  onSubmit(customerForm: NgForm) {
    this.loader = true
    if(!this.editCustomer) {
      this.currentDate = new Date();
      this.currentDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd HH:mm:ss');
      this.newCustomer.createdDate = this.currentDate;
      if(this.newCustomer.emailId == null) {
        this.newCustomer.emailId = '-';
      }
      if(this.newCustomer.phoneNo == null) {
        this.newCustomer.phoneNo = '-';
      }
    }
    this.customer.saveCustomer(this.newCustomer).subscribe(response => {
      this.newCustomer = response;
      sessionStorage.setItem('currentCustomer', JSON.stringify(this.newCustomer));
      this.loader = false;
    });
    this.editCustomer = true;
  }

  getCustomer(id: number) {
    this.loader = true;
    this.customer.getCustomerById(id).subscribe(response => {
      this.newCustomer = response;
      this.loader = false;
    });
  }
}
