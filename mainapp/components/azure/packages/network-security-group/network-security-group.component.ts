import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CloudapiService } from 'src/app/mainapp/services/cloudapi.service';

@Component({
  selector: 'app-network-security-group',
  templateUrl: './network-security-group.component.html',
  styleUrls: ['./network-security-group.component.scss']
})
export class NetworkSecurityGroupComponent {

  networkSecurityGroup!: FormGroup;
  sessionFormData:any={};
  networkSecurityGrpArray:any=[];
  modalRef?: BsModalRef;
  
  name:string='my-nsgrp';
  resourceGroupName:string='';
  resourceGroupLocation:string='';
  srName:string='my-security-rule';
  priority:Number=0;
  direction:string='Inbound';
  protocol:string='Tcp';
  sourcePortRange!:Number;
  destinationPortRange!:Number;
  sourceAddressPrefix!:Number;
  destinationAddressPrefix!:Number;
  environment:string='';
  
  submitted: boolean=false;
  default:string='';
  resourceGroupNameArray:any=[];
  resourceGroupLocationArray:any=[];

  @ViewChild('template', { read: TemplateRef }) template!: TemplateRef<any>;
  @Output('tabActive') tabActive = new EventEmitter<any>();
  @Output('isSuccess') isSuccess = new EventEmitter<any>();
  
  constructor(private formBuilder:FormBuilder,private modalService: BsModalService,private cloudapi: CloudapiService){
    this.networkSecurityGroup = this.formBuilder.group({
      name: ['my-nsgrp', [, ]],
      resourceGroupName: ['', [, ]],
      resourceGroupLocation: ['', [, ]],
      securityRule: this.formBuilder.group({
        srName: ['my-security-rule', [, ]],
        priority: ['', [, ]],
        direction: ['Inbound', [, ]],
        protocol:['Tcp', [, ]],
        sourcePortRange:['', [, ]],
        destinationPortRange:['', [, ]],
        sourceAddressPrefix:['', [, ]],
        destinationAddressPrefix:['', [, ]],
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
      this.srName= this.sessionFormData.networkSecurityGroup?.[0]?.securityRule.srName||'my-security-rule';
      this.priority= this.sessionFormData.networkSecurityGroup?.[0]?.securityRule.priority;
      this.direction= this.sessionFormData.networkSecurityGroup?.[0]?.securityRule.direction||'Inbound';
      this.sourcePortRange= this.sessionFormData.networkSecurityGroup?.[0]?.securityRule.sourcePortRange;
      this.destinationPortRange= this.sessionFormData.networkSecurityGroup?.[0]?.securityRule.destinationPortRange;
      this.sourceAddressPrefix= this.sessionFormData.networkSecurityGroup?.[0]?.securityRule.sourceAddressPrefix;
      this.destinationAddressPrefix= this.sessionFormData.networkSecurityGroup?.[0]?.securityRule.destinationAddressPrefix;

      this.environment= this.sessionFormData.networkSecurityGroup?.[0]?.tags.environment||'';
      if(this.sessionFormData.networkSecurityGroup){
        this.networkSecurityGrpArray=this.sessionFormData.networkSecurityGroup;
      }
      if(this.sessionFormData.resourceGroup){
        this.resourceGroupLocation= this.sessionFormData.resourceGroup?.[0]?.location || '';
      }
      this.cloudapi.getResourceLocation().subscribe(res=>{
        for(let item of Object.keys(res)){
          this.resourceGroupLocationArray.push((res as any)[item].value);
        }
      });
    }
  }
  viewDetails(){
    if(this.sessionFormData.bastionHost){
      this.networkSecurityGrpArray=this.sessionFormData.bastionHost;
    }
    this.openModalWithClass(this.template);
  }
  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-md' })
    );
  }

  resourceGroupNameChange(){
    if(this.sessionFormData.resourceGroup){
      for(let rg of this.sessionFormData.resourceGroup){
        if(rg.name==this.resourceGroupName){
          this.resourceGroupLocation=rg.location;
        }
      }
    }
  }
  nextTab(){
    this.tabActive.emit(1);
}
backTab(){
  this.tabActive.emit(0);
}
saveandreset(){
  this.submitted = true;
  if(!this.networkSecurityGroup.invalid){
    this.networkSecurityGrpArray.push(this.networkSecurityGroup.value);
    this.sessionFormData.networkSecurityGroup=this.networkSecurityGrpArray;
    sessionStorage.setItem('sessionFormData', JSON.stringify(this.sessionFormData));
    this.name='my-bastion-host';
    if(this.sessionFormData.networkSecurityGroup){
      this.networkSecurityGrpArray=this.sessionFormData.networkSecurityGroup;
    }
    this.isSuccess.emit(true);
  }
}
}
