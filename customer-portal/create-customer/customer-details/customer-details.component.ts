import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent {

  constructor(private customer: CustomerService, private router: Router) {}

  customerList: any = [];
  searchText = ''; 
  loader: boolean = false;

  ngOnInit() {
    this.getCustomerList();
    sessionStorage.removeItem('currentCustomer');
  }

  getCustomerList() {
    this.loader = true;
    this.customer.getCustomerList().subscribe((response) => {
      this.customerList = response;
      this.loader = false;
    });
  }

  editCustomer(customer: any) {
    sessionStorage.setItem('currentCustomer', JSON.stringify(customer));
    this.router.navigate(['/customerportal/customerconfiguration']);
  }

}
