import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-package',
  templateUrl: './select-package.component.html',
  styleUrls: ['./select-package.component.scss']
})
export class SelectPackageComponent {


  userdata: any = {};

  vmpackage!:string;
  subnetpackage!:string;
  vnpackage!:string;
  lspackage!:string;
  lmhpackage!:string;
  packages!:any;
  selected:any=[];

  tabs: any = [];
  loadTabs: any = [];
  selectedServices: any = [];
  dependencies: any = {
    'Virtual Machine': ["Provider Details", "Resource Group", "Virtual Network", "Subnet", "Network Interface", "Public IP", "Virtual Machine"],
    'Subnet': ["Provider Details", "Resource Group", "Subnet Creation", "Network Interface"],
    'Virtual Network': ["Provider Details", "Resource Group", "Virtual Network"],
    'Landingzone small': ["Resource Group", "Virtual Network", "Subnet", "Network Security Group", "Public IP", "NIC", "Virtual Machine", "NSG's with 2(RDP, HTTPS) Inbound rules creation", "NSG's association with Subnets", "Bastion Host"],
    'Landingzone Mid Hspok': ["Resource Group", "Virtual Network", "Subnet", "Network Security Group", "Public IP", "Private IP Address", "NIC and Private IP association", "Virtual Machine", "NSG's with 2(RDP, HTTPS) Inbound rules creation", "NSG's association with Subnets", "VPC Peering between Hub to Spoke1", "Bastion Host", "Associate Bastion host with Public IP"]
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
    this.packages = document.getElementById("packages");
    var checks = this.packages.getElementsByTagName("INPUT");
    for (var i = 0; i < checks.length; i++) {
      if (checks[i].checked) {
          this.selected.push(checks[i].value);
      }
    }
    sessionStorage.setItem('selectedPackage', JSON.stringify(this.selected));
    this.selectedServices = JSON.parse(sessionStorage.getItem('selectedPackage') as string);
    this.selectedServices.forEach((service: string) => {
      this.tabs = this.tabs.concat(this.dependencies[service]);
    });

    for (var i = 0; i < this.tabs.length; i++) {
      if (!this.loadTabs.includes(this.tabs[i])) {
        this.loadTabs = [...this.loadTabs, this.tabs[i]];
      }
    }
    console.log(this.loadTabs);
    sessionStorage.setItem('loadTabs', JSON.stringify(this.loadTabs));
    this.router.navigate(['/home/azure']);
  }

  resetSelectedChoice(){
    this.packages = document.getElementById("services");
    var checks = this.packages.getElementsByTagName("INPUT");
    console.log(checks);
    for (var i = 0; i < checks.length; i++) {
      if (checks[i].checked) {
        checks[i].checked=false;
      }
    }
  }
}
