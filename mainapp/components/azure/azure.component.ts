import { Component, ViewChild, TemplateRef, ElementRef, HostListener } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CloudapiService } from '../../services/cloudapi.service';
import { encode, decode } from 'js-base64';
import { ProviderComponent } from './packages/provider/provider.component';
import { ResourceGroupComponent } from './packages/resource-group/resource-group.component';

@Component({
  selector: 'app-azure',
  templateUrl: './azure.component.html',
  styleUrls: ['./azure.component.scss']
})
export class AzureComponent {
  modalRef?: BsModalRef;
  submitted = false;
  showPassword: boolean = false;
  router: Router;

  virtualNetworks: any = [];
  subnets: any = [];
  networkInterfaces: any = [];
  publicIPs: any = [];
  virtualMachines: any = [];
  resourceLocation: any = [];

  createJSON: any = {};
  subnetcreateJSON: any = {};
  enableExecute: boolean = false;
  enableCreate: boolean = false;
  loader: boolean = false;
  package: string = '';
  service: string = '';

  userdata: any = {};
  default: string = '';
  encodedjsonpayload: string = '';
  sessionFormData: any = {};
  transactionId: number = 0;

  currentTabId: number = 0;
  currentTab: string = '';
  editTransaction: any = {};
  iseditTransaction: boolean = false;
  isEditedtrx: boolean = false;
  showSuccessAlert: boolean = false;
  alertMsg: string = '';
  loadTabs: any = [];
  progress = 0;
  loadTabId:number=0;

  @ViewChild('execute', { read: TemplateRef }) execute!: TemplateRef<any>;
  @ViewChild('backHome', { read: TemplateRef }) backHome!: TemplateRef<any>;
  @ViewChild('errorMsg', { read: TemplateRef }) errorMsg!: TemplateRef<any>;
  @ViewChild('createscript', { read: TemplateRef }) createscript!: TemplateRef<any>;
  @ViewChild('createdJSON', { read: TemplateRef }) createdJSON!: TemplateRef<any>;
  @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;
  constructor(router: Router, private formBuilder: FormBuilder, private modalService: BsModalService, private route: ActivatedRoute, private cloudapi: CloudapiService) {
    this.router = router;
  }
  ngOnInit() {

    setInterval(() => {
      if (this.progress < 80) {
        this.progress = this.progress + 1;
      }
    }, 300);
    if (JSON.parse(`${sessionStorage.getItem('editTxnid')}`)) {
      this.editTransaction = JSON.parse(`${sessionStorage.getItem('sessionFormData')}`);
      this.iseditTransaction = true;
      this.enableCreate = true;
      if (this.editTransaction.provider) {
        this.loadTabs.push('Provider Details');
      }
      if (this.editTransaction.resourceGroup) {
        this.loadTabs.push('Resource Group');
      }
      if (this.editTransaction.virtualNetwork) {
        this.loadTabs.push('Virtual Network');
      }
      if (this.editTransaction.subnet) {
        this.loadTabs.push('Subnet');
      }
      if (this.editTransaction.networkInterface) {
        this.loadTabs.push('Network Interface');
      }
      if (this.editTransaction.publicIp) {
        this.loadTabs.push('Public IP');
      }
      if (this.editTransaction.virtualMachine) {
        this.loadTabs.push('Virtual Machine');
      }
      if (this.editTransaction.bastionHost) {
        this.loadTabs.push('Bastion Host');
      }
      if (this.editTransaction.networkSecurityGroup) {
        this.loadTabs.push('Network Security Group');
      }
      this.loadTabs.push('Create & Execute');
    }
    else{
      this.loadTabs=JSON.parse(sessionStorage.getItem('loadTabs')||'');
      this.loadTabs.push("Create & Execute");
    }
    this.userdata = {
      selectedCustomer: sessionStorage.getItem('selectedCustomer'),
      selectedCloud: sessionStorage.getItem('selectedCloud'),
      selectedPackage: sessionStorage.getItem('selectedPackage'),
      option: sessionStorage.getItem('Option'),
      selectedService: sessionStorage.getItem('selectedService'),
    }
    this.package = JSON.parse(this.userdata.selectedPackage);
    this.service = JSON.parse(this.userdata.selectedService);
    if (this.userdata.option == 'packages') {
      this.currentTab = this.package[0];
    } else if (this.userdata.option == 'services') {
      this.currentTab = this.service[0];
    }

    sessionStorage.setItem('currentTab', this.currentTab);
    this.loadTabId=0;
  }
  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-md' })
    );
  }

  createScript() {
    if (this.iseditTransaction) {
      this.transactionId = JSON.parse(sessionStorage.getItem('editTxnid') || '0');
    }
    this.loader = true;
    this.cloudapi.createPlan(this.transactionId).subscribe((res: any) => {
      this.openModalWithClass(this.createscript);
      this.enableExecuteButton();
      this.loader = false;
    }, err => {
      if (err.status == 417) {
        this.openModalWithClass(this.errorMsg);
      }
      this.loader = false;
    });
  }
  executePlan() {
    if (this.iseditTransaction) {
      this.transactionId = JSON.parse(sessionStorage.getItem('editTxnid') || '0');
    }
    this.loader = true;
    this.cloudapi.executePlan(this.transactionId).subscribe((res: any) => {
      this.loader = false;
      this.openModalWithClass(this.execute)
    }, err => {
      if (err.status == 417) {
        this.loader = false;
        this.openModalWithClass(this.errorMsg);
      }
    });
    if (sessionStorage.getItem('sessionFormData')) {
      sessionStorage.removeItem('sessionFormData');
    }
  }
  enableExecuteButton() {
    this.enableExecute = true;
  }

  goBackHome() {
    if (sessionStorage.getItem('sessionFormData')) {
      this.openModalWithClass(this.backHome);
    } else {
      this.router.navigate(['/home']);
    }
  }
  clearSessionData() {
    sessionStorage.removeItem('sessionFormData');
    sessionStorage.removeItem('selectedCustomer');
    sessionStorage.removeItem('selectedPackage');
    sessionStorage.removeItem('selectedCloud');
    sessionStorage.removeItem('Option');
    sessionStorage.removeItem('currentTab');
    sessionStorage.removeItem('loadTabs');
    sessionStorage.removeItem('editTxnid');
  }

  tabActive(value: any) {
    if(value){
      this.currentTabId=this.currentTabId+1;
      console.log(this.currentTabId);
      if (this.staticTabs?.tabs[this.currentTabId]) {
        this.staticTabs.tabs[this.currentTabId].active = true;
      }
    }
    else{
      this.currentTabId=this.currentTabId-1;
      if (this.staticTabs?.tabs[this.currentTabId]) {
        this.staticTabs.tabs[this.currentTabId].active = true;
      }
    }
  }
  updateCurrentTabId(id: any) {
    this.currentTabId = this.loadTabs.indexOf(id);
  }
  transactionIdActive(id: number) {
    this.transactionId = id;
  }
  getSessionFormData() {
    this.sessionFormData = JSON.parse(`${sessionStorage.getItem('sessionFormData')}`);
  }
  submitData() {
    if (this.iseditTransaction) {
      this.transactionId = JSON.parse(sessionStorage.getItem('editTxnid') || '0');
    }
    this.enableCreate = true;
    this.sessionFormData = JSON.parse(`${sessionStorage.getItem('sessionFormData')}`);
    this.encodedjsonpayload = encode(JSON.stringify(this.sessionFormData));
    let payload = {
      provider: this.userdata.selectedCloud,
      customerName: this.userdata.selectedCustomer,
      resourcePayload: this.encodedjsonpayload,
      transactionId: this.transactionId
    }
    this.loader = true;
    this.cloudapi.postResource(payload).subscribe((res: any) => {
      this.loader = false;
      this.transactionId = res.transactionId;
      this.openModalWithClass(this.createdJSON);
    });
  }

  isSuccess(value: any) {
    this.isEditedtrx = value;
    if (this.isEditedtrx) {
      this.enableCreate = false;
    }
    if (value) {
      this.alertMsg = 'Data saved';
      this.showSuccessAlert = value;
    }
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 2000);
  }
}

