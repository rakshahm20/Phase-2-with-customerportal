import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-bastion-host',
  templateUrl: './bastion-host.component.html',
  styleUrls: ['./bastion-host.component.scss']
})
export class BastionHostComponent {

  sessionFormData:any={};
  submitted: boolean=false;
  bastionHostDetails!: FormGroup;
  bastionHostArray:any=[];
  name:string="my-bastion-host";
  resourceGroupName!:string;
  resourceGroupLocation!:string;
  ipName:string="my-bastion-cfg";
  subnetName!:string;
  publicIPAddress:string="Dynamic";
  environment!:string;
  resourceGroupNameArray:any=[];
  default:string='';
  modalRef?: BsModalRef;

  copy_paste_enabled:string='false';
  file_copy_enabled:string='false';

  @Output('tabActive') tabActive = new EventEmitter<any>();
  @Output('isSuccess') isSuccess = new EventEmitter<any>();
  @ViewChild('template', { read: TemplateRef }) template!: TemplateRef<any>;

  constructor(private formBuilder:FormBuilder,private modalService: BsModalService){
    this.bastionHostDetails = this.formBuilder.group({
      name: ['my-bastion-host', [, ]],
      resourceGroupName: ['', [, ]],
      resourceGroupLocation: ['', [, ]],
      copy_paste_enabled: ['false', [, ]],
      file_copy_enabled: ['false', [, ]],
      ipConfiguration: this.formBuilder.group({
        ipName: ['my-bastion-cfg', [, ]],
        subnetInternalId: ['', [, ]],
        publicIPAddress: ['Dynamic', [, ]]
      }),
      tags: this.formBuilder.group({
        environment: ['', [, ]]
      }),
    });
    if(JSON.parse(`${sessionStorage.getItem('sessionFormData')}`)){
      this.sessionFormData=JSON.parse(`${sessionStorage.getItem('sessionFormData')}`);
    this.resourceGroupName= this.sessionFormData.resourceGroup?.[0]?.name || '';
      this.resourceGroupLocation= this.sessionFormData.resourceGroup?.[0]?.location || '';
      
      if(this.sessionFormData.resourceGroup){
        for(let rg of this.sessionFormData.resourceGroup){
          this.resourceGroupNameArray.push(rg.name);
        }
      }
      this.subnetName= this.sessionFormData.subnet?.[0]?.name||'';
      if(this.sessionFormData.bastionHost){
        this.bastionHostArray=this.sessionFormData.bastionHost;
      }
      this.environment= this.sessionFormData.bastionHost?.[0]?.tags.environment||'';
    }
  }
  viewDetails(){
    if(this.sessionFormData.bastionHost){
      this.bastionHostArray=this.sessionFormData.bastionHost;
    }
    this.openModalWithClass(this.template);
  }
  nextTab(){
    this.tabActive.emit(1);
}
backTab(){
  this.tabActive.emit(0);
}
saveandreset(){
  this.submitted = true;
  if(!this.bastionHostDetails.invalid){
    this.bastionHostArray.push(this.bastionHostDetails.value);
    this.sessionFormData.bastionHost=this.bastionHostArray;
    sessionStorage.setItem('sessionFormData', JSON.stringify(this.sessionFormData));
    this.name='my-bastion-host';
    if(this.sessionFormData.bastionHost){
      this.bastionHostArray=this.sessionFormData.bastionHost;
    }
    this.isSuccess.emit(true);
  }
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
openModalWithClass(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(
    template,
    Object.assign({}, { class: 'gray modal-md' })
  );
}
}
