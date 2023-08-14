import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-service',
  templateUrl: './select-service.component.html',
  styleUrls: ['./select-service.component.scss']
})
export class SelectServiceComponent {
  rgservice!:string;
  vnservice!:string;
  subnetservice!:string;
  nsgservice!:string;
  bhservice!:string;
  niservice!:string;
  vmservice!:string;
  vnpservice!:string;
  snsgaservice!:string;
  services!:any;
  selected:any=[];
  userdata: any = {};
  
  tabs: any = [];
  loadTabs: any = [];
  selectedServices: any = [];
  dependencies: any = {
    'Resource Group': ["Provider Details", "Resource Group"],
    'Virtual Network': ["Provider Details", "Resource Group", "Virtual Network"],
    'Subnet': ["Provider Details", "Resource Group", "Virtual Network", "Subnet"],
    'Network Security Group': ["Provider Details", "Resource Group", "Network Security Group"],
    'Bastion Host': ["Provider Details", "Resource Group", "Virtual Network", "Subnet", "Public IP","Bastion Host"],
    'Network Interface': ["Provider Details", "Resource Group", "Virtual Network", "Subnet", "Network Interface"],
    'Virtual Machine': ["Provider Details", "Resource Group", "Virtual Network", "Subnet", "Network Interface"],
    'Virtual Network Peering': ["Provider Details", "Resource Group", "Virtual Network","Network Interface","Virtual Network Peering"],
    'Subnet Network Security Group Association': ["Provider Details", "Resource Group", "Virtual Network", "Subnet", "Network Security Group"]
  };

  ngOnInit(){
    this.userdata = {
      selectedCustomer: sessionStorage.getItem('selectedCustomer'),
      selectedCloud: sessionStorage.getItem('selectedCloud'),
      selectedPackage: sessionStorage.getItem('selectedPackage'),
      option: sessionStorage.getItem('Option'),
      selectedService: sessionStorage.getItem('selectedService'),
    }
  }
  constructor(private router: Router) { 
   
  }


  saveData(){
    this.services = document.getElementById("services");
    var checks = this.services.getElementsByTagName("INPUT");
    console.log(checks);
    for (var i = 0; i < checks.length; i++) {
      if (checks[i].checked) {
          this.selected.push(checks[i].value);
      }
    }
    sessionStorage.setItem('selectedService', JSON.stringify(this.selected));

    this.selectedServices = JSON.parse(sessionStorage.getItem('selectedService') as string);
    this.selectedServices.forEach((service: string) => {
      this.tabs = this.tabs.concat(this.dependencies[service]);
    });

    for (var i = 0; i < this.tabs.length; i++) {
      if (!this.loadTabs.includes(this.tabs[i])) {
        this.loadTabs = [...this.loadTabs, this.tabs[i]];
      }
    }
    sessionStorage.setItem('loadTabs', JSON.stringify(this.loadTabs));
    this.router.navigate(['/home/azure']);
  }

  resetSelectedChoice(){
    this.services = document.getElementById("services");
    var checks = this.services.getElementsByTagName("INPUT");
    console.log(checks);
    for (var i = 0; i < checks.length; i++) {
      if (checks[i].checked) {
        checks[i].checked=false;
      }
    }
  }
}
