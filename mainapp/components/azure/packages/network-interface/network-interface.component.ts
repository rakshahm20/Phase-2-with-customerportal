import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-network-interface',
  templateUrl: './network-interface.component.html',
  styleUrls: ['./network-interface.component.scss']
})
export class NetworkInterfaceComponent {

  sessionFormData:any={};
  submitted: boolean=false;
  resourceGroupName:string='';
  resourceGroupLocation:string='';
  subnetName:string='';
  networkInterface!: FormGroup;
  @Output('tabActive') tabActive = new EventEmitter<any>();
  @Output('isSuccess') isSuccess = new EventEmitter<any>();
  @ViewChild('template', { read: TemplateRef }) template!: TemplateRef<any>;

  name:string='my-nic';
  default:string='';
  ipName:string='my-nic-cfg';
  subnetInternalId:string='';
  privateIPAddress:string='Dynamic';
  publicIPAddress:string='';
  selectedService!: string;
  networkInterfaceArray:any=[];
  resourceGroupNameArray:any=[];
  modalRef?: BsModalRef;
  
  constructor(private formBuilder:FormBuilder,private router:Router,private modalService: BsModalService){
    this.networkInterface = this.formBuilder.group({
      name: ['my-nic', [, ]],
      resourceGroupName: ['', [, ]],
      resourceGroupLocation: ['', [, ]],
      ipConfiguration: this.formBuilder.group({
        ipName: ['my-nic-cfg', [, ]],
        subnetInternalId: ['', [, ]],
        privateIPAddress: ['Dynamic', [, ]],
        publicIPAddress: ['', [, ]]
      })
    });
    if(JSON.parse(`${sessionStorage.getItem('sessionFormData')}`)){
      this.sessionFormData=JSON.parse(`${sessionStorage.getItem('sessionFormData')}`);
      this.name=this.sessionFormData.networkInterface?.[0]?.name || 'my-nic';
      this.resourceGroupName= this.sessionFormData.resourceGroup?.[0]?.name || '';
      this.resourceGroupLocation= this.sessionFormData.resourceGroup?.[0]?.location || '';
      
      if(this.sessionFormData.resourceGroup){
        for(let rg of this.sessionFormData.resourceGroup){
          this.resourceGroupNameArray.push(rg.name);
        }
      }
      
      this.ipName=this.sessionFormData.networkInterface?.[0]?.ipConfiguration.ipName || 'my-nic-cfg';
      this.subnetName= this.sessionFormData.subnet?.[0]?.name||'';
      this.privateIPAddress=this.sessionFormData. networkInterface?.[0]?.ipConfiguration.privateIPAddress||'Dynamic';
      this.publicIPAddress=this.sessionFormData.networkInterface?.[0]?.ipConfiguration.publicIPAddress || '';
      if(this.sessionFormData.networkInterface){
        this.networkInterfaceArray=this.sessionFormData.networkInterface;
      }
    }

  }
  public noWhitespaceValidator(control: FormControl) {
    if (control.value) {
      if ((control.value as string).indexOf(' ') >= 0) {
        return { cannotContainSpace: true }
      }
    }
    return null;
  }
  
saveandreset(){
  this.submitted = true;
  if(!this.networkInterface.invalid){
    this.networkInterfaceArray.push(this.networkInterface.value);
    this.sessionFormData.networkInterface=this.networkInterfaceArray;
    this.selectedService = sessionStorage.getItem('selectedService')||'';
    sessionStorage.setItem('sessionFormData', JSON.stringify(this.sessionFormData));
    this.name='my-nic';
    if(this.sessionFormData.networkInterface){
      this.networkInterfaceArray=this.sessionFormData.networkInterface;
    }
    this.isSuccess.emit(true);
  }
}
nextTab(){
    // this.tabActive.emit(5);
    this.tabActive.emit(1);
}
backTab(){
  // this.tabActive.emit(3);
  this.tabActive.emit(0);
}
resourceGroupNameChange(){
  if(this.sessionFormData.resourceGroup){
    for(let rg of this.sessionFormData.resourceGroup){
      if(rg.name==this.resourceGroupName){
        this.resourceGroupLocation=rg.location;
      }
    }
  }
  if(this.sessionFormData.subnet){
    for(let sn of this.sessionFormData.subnet){
      if(sn.resourceGroupName==this.resourceGroupName){
        this.subnetName=sn.name;
      }
    }
  }
}
viewDetails(){
  if(this.sessionFormData.networkInterface){
    this.networkInterfaceArray=this.sessionFormData.networkInterface;
  }
  this.openModalWithClass(this.template);
}
openModalWithClass(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(
    template,
    Object.assign({}, { class: 'gray modal-md' })
  );
}
}
