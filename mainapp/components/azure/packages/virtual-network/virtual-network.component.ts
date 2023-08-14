import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CloudapiService } from 'src/app/mainapp/services/cloudapi.service';

@Component({
  selector: 'app-virtual-network',
  templateUrl: './virtual-network.component.html',
  styleUrls: ['./virtual-network.component.scss']
})
export class VirtualNetworkComponent {

  resourceGroupNameArray:any=[];
  resourceGroupName:string='';
  resourceGroupLocation:string='';
  virtualNetworkDetails!: FormGroup;
  submitted: boolean=false;
  sessionFormData: any={};
  default:string='';
  virtualNetworkArray:any=[];
  resourceGroupLocationArray:any=[];

  name:string='my-virtual-network';
  addressSpace:string='10.0.0.0/16';
  modalRef?: BsModalRef;

  @Output('tabActive') tabActive = new EventEmitter<any>();
  @Output('isSuccess') isSuccess = new EventEmitter<any>();
  @ViewChild('template', { read: TemplateRef }) template!: TemplateRef<any>;
  

  constructor(private modalService: BsModalService,private formBuilder: FormBuilder,private router:Router,private cloudapi: CloudapiService){
    this.virtualNetworkDetails = this.formBuilder.group({
      name: ['my-virtual-network', [Validators.required, this.noWhitespaceValidator]],
      resourceGroupName: ['', [, ]],
      resourceGroupLocation: ['', [, ]],
      addressSpace: ['10.0.0.0/16', [, ]]
    });
    this.virtualNetworkArray=[];
    if(JSON.parse(`${sessionStorage.getItem('sessionFormData')}`)){
      this.sessionFormData=JSON.parse(`${sessionStorage.getItem('sessionFormData')}`);
      this.name=this.sessionFormData.virtualNetwork?.[0]?.name || 'my-virtual-network';
      if(this.sessionFormData.resourceGroup){
        this.resourceGroupName= this.sessionFormData.resourceGroup?.[0]?.name || '';
      }
      if(this.sessionFormData.resourceGroup){
        this.resourceGroupLocation= this.sessionFormData.resourceGroup?.[0]?.location || '';
      }
      this.cloudapi.getResourceLocation().subscribe(res=>{
        for(let item of Object.keys(res)){
          this.resourceGroupLocationArray.push((res as any)[item].value);
        }
      });
      
      if(this.sessionFormData.resourceGroup){
        for(let rg of this.sessionFormData.resourceGroup){
          this.resourceGroupNameArray.push(rg.name);
        }
      }
      if(this.sessionFormData.virtualNetwork){
        this.virtualNetworkArray=this.sessionFormData.virtualNetwork;
      }
      this.addressSpace=this.sessionFormData.virtualNetwork?.[0]?.addressSpace || '10.0.0.0/16';
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
    if(!this.virtualNetworkDetails.invalid){
      this.virtualNetworkArray.push(this.virtualNetworkDetails.value);
      this.sessionFormData.virtualNetwork=this.virtualNetworkArray;
      sessionStorage.setItem('sessionFormData', JSON.stringify(this.sessionFormData));
      if(JSON.parse(`${sessionStorage.getItem('sessionFormData')}`)){
        this.sessionFormData=JSON.parse(`${sessionStorage.getItem('sessionFormData')}`);
        this.name='my-virtual-network';
        this.sessionFormData.virtualNetwork=this.sessionFormData.virtualNetwork;
        this.addressSpace='10.0.0.0/16';
      }
      this.isSuccess.emit(true);
  }
}
  nextTab(){
    // this.tabActive.emit(3);
    this.tabActive.emit(1);
  }
  backTab(){
    // this.tabActive.emit(1);
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
  }
  viewDetails(){
    if(this.sessionFormData.virtualNetwork){
      this.virtualNetworkArray=this.sessionFormData.virtualNetwork;
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
