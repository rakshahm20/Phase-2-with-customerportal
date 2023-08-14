import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { encode } from 'js-base64';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CloudapiService } from 'src/app/mainapp/services/cloudapi.service';

@Component({
  selector: 'app-subnet',
  templateUrl: './subnet.component.html',
  styleUrls: ['./subnet.component.scss']
})
export class SubnetComponent {

  subnetCreation: any;
  sessionFormData: any = {};
  submitted: boolean = false;
  resourceGroupName:string='';
  resourceGroupNameArray: any = [];
  virtualNetworkName:string='';
  package: any;
  loader: boolean = false;

  @Output('tabActive') tabActive = new EventEmitter<any>();
  @ViewChild('createdJSON', { read: TemplateRef }) createdJSON!: TemplateRef<any>;
  @Output('transactionIdActive') transactionIdActive = new EventEmitter<any>();
  
  userdata: any = {};
  encodedjsonpayload: any;
  modalRef?: BsModalRef;
  @Input() transactionId: number = 0;
  default: string = '';

  name: string = 'my-subnet';
  addressPrefixes: string = '10.0.2.0/24';
  selectedService!: string;
  subnetArray: any = [];
  @Output('isSuccess') isSuccess = new EventEmitter<any>();
  @ViewChild('template', { read: TemplateRef }) template!: TemplateRef<any>;

  constructor(private formBuilder: FormBuilder, private router: Router, private modalService: BsModalService, private cloudapi: CloudapiService) {
    this.subnetCreation = this.formBuilder.group({
      name: ['my-subnet', [Validators.required, this.noWhitespaceValidator]],
      resourceGroupName: ['', [,]],
      virtualNetworkName: ['', [,]],
      addressPrefixes: ['10.0.2.0/24', [,]]
    });

    this.subnetArray = [];
    if (JSON.parse(`${sessionStorage.getItem('sessionFormData')}`)) {
      this.sessionFormData = JSON.parse(`${sessionStorage.getItem('sessionFormData')}`);
      this.name = this.sessionFormData.subnet?.[0]?.name || 'my-subnet';
      // this.resourceGroupName= this.sessionFormData?.resourceGroup?.[0]?.name || '';
      this.virtualNetworkName= this.sessionFormData?.virtualNetwork?.[0]?.name || '';
      this.resourceGroupName= this.sessionFormData.virtualNetwork?.[0]?.resourceGroupName || '';
      if(this.sessionFormData.resourceGroup){
        this.resourceGroupName= this.sessionFormData.resourceGroup?.[0]?.name || '';
      }
      
      if(this.sessionFormData.resourceGroup){
        for (let rg of this.sessionFormData.resourceGroup) {
          this.resourceGroupNameArray.push(rg.name);
        }
      }
      
      
      this.addressPrefixes = this.sessionFormData.subnet?.[0]?.addressPrefixes || '10.0.2.0/24';
      if(this.sessionFormData.subnet){
        this.subnetArray=this.sessionFormData.subnet;
      }
    }
    this.userdata = {
      selectedCustomer: sessionStorage.getItem('selectedCustomer'),
      selectedCloud: sessionStorage.getItem('selectedCloud'),
      selectedPackage: sessionStorage.getItem('selectedPackage')
    }
    this.package = sessionStorage.getItem('currentTab');
    this.selectedService = sessionStorage.getItem('selectedService') || '';
  }
  public noWhitespaceValidator(control: FormControl) {
    if (control.value) {
      if ((control.value as string).indexOf(' ') >= 0) {
        return { cannotContainSpace: true }
      }
    }
    return null;
  }
  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-md' })
    );
  }
  saveandreset() {
    this.submitted = true;
    if (!this.subnetCreation.invalid) {
        this.subnetArray.push(this.subnetCreation.value);
        this.sessionFormData.subnet=this.subnetArray;
        sessionStorage.setItem('sessionFormData', JSON.stringify(this.sessionFormData));
      if (JSON.parse(`${sessionStorage.getItem('sessionFormData')}`)) {
        this.sessionFormData = JSON.parse(`${sessionStorage.getItem('sessionFormData')}`);
        this.name = 'my-subnet';
        this.addressPrefixes = '10.0.2.0/24';
        if(this.sessionFormData.subnet){
          this.subnetArray=this.sessionFormData.subnet;
        }
      }
      this.isSuccess.emit(true);
    }
  }
  backTab() {
    // this.tabActive.emit(2);
    this.tabActive.emit(0);
  }

  nextTab(){
    // this.tabActive.emit(4);
    this.tabActive.emit(1);
  }

  resourceGroupNameChange(){
    if(this.sessionFormData.virtualNetwork){
      for(let vn of this.sessionFormData.virtualNetwork){
        if(vn.resourceGroupName==this.resourceGroupName){
          this.virtualNetworkName=vn.name;
        }
      }
    }
  }
  viewDetails(){
    if(this.sessionFormData.subnet){
      this.subnetArray=this.sessionFormData.subnet;
    }
    this.openModalWithClass(this.template);
  }

}
