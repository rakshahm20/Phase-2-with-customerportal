import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-public-ip',
  templateUrl: './public-ip.component.html',
  styleUrls: ['./public-ip.component.scss']
})
export class PublicIpComponent {

  sessionFormData: any = {};
  submitted: boolean = false;
  resourceGroupName: string = '';
  resourceGroupLocation: string = '';
  publicIPDetails!: FormGroup;

  name:string='my-ip-name';
  pipnameArray:any=[];
  allocationMethod:string='Dynamic';
  environment:string='';
  publicIPDetailsArray:any=[];
  default: string = '';
  modalRef?: BsModalRef;

  @Output('tabActive') tabActive = new EventEmitter<any>();
  @Output('isSuccess') isSuccess = new EventEmitter<any>();
  @ViewChild('template', { read: TemplateRef }) template!: TemplateRef<any>;
  selectedService!: string ;

  constructor(private formBuilder: FormBuilder, private router: Router,private modalService: BsModalService) {
    this.publicIPDetails = this.formBuilder.group({
      name: ['my-ip-name', [,]],
      resourceGroupName: ['', [,]],
      resourceGroupLocation: ['', [,]],
      allocationMethod: ['Dynamic', [,]],
      tags: this.formBuilder.group({
        environment: ['', [,]]
      })
    });

    if(JSON.parse(`${sessionStorage.getItem('sessionFormData')}`)){
      this.sessionFormData=JSON.parse(`${sessionStorage.getItem('sessionFormData')}`);
      this.name=this.sessionFormData.networkInterface?.[0]?.ipConfiguration.publicIPAddress ||'my-ip-name';
      
      this.resourceGroupName = this.sessionFormData.resourceGroup?.[0]?.name||'';
      this.resourceGroupLocation = this.sessionFormData?.resourceGroup?.[0]?.location||'';
      if(this.sessionFormData.networkInterface){
        for(let ni of this.sessionFormData.networkInterface){
          this.pipnameArray.push(ni.ipConfiguration?.publicIPAddress);
        }
      }
      
      this.allocationMethod= this.sessionFormData.publicIp?.[0]?.allocationMethod||'Dynamic';
      this.environment=this.sessionFormData.publicIp?.[0]?.tags.environment||'';
      if(this.sessionFormData.publicIp){
        this.publicIPDetailsArray=this.sessionFormData.subnet;
      }
    }
    this.selectedService = sessionStorage.getItem('selectedService')||'';
  }
  public noWhitespaceValidator(control: FormControl) {
    if (control.value) {
      if ((control.value as string).indexOf(' ') >= 0) {
        return { cannotContainSpace: true }
      }
    }
    return null;
  }
  
  
  skipTab() {
    if (this.sessionFormData.publicIp) {
      delete this.sessionFormData.publicIp;
      sessionStorage.setItem('sessionFormData', JSON.stringify(this.sessionFormData));
    }
    // this.tabActive.emit(6);
    this.tabActive.emit(1);
  }

  saveandreset(){
    this.submitted = true;
    if(!this.publicIPDetails.invalid){
      this.publicIPDetailsArray.push(this.publicIPDetails.value);
      this.sessionFormData.publicIp=this.publicIPDetailsArray;
      this.selectedService = sessionStorage.getItem('selectedService')||'';
      sessionStorage.setItem('sessionFormData', JSON.stringify(this.sessionFormData));
      this.name='my-ip-name';
      this.isSuccess.emit(true);
    }
  }
  nextTab(){
      // this.tabActive.emit(6);
      this.tabActive.emit(1);
  }
  backTab(){
    // this.tabActive.emit(4);
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
  pipNameChange(){
    
    if(this.sessionFormData.networkInterface){
      for(let ni of this.sessionFormData.networkInterface){
        if(ni.ipConfiguration.publicIPAddress==this.name){
          this.resourceGroupLocation=ni.resourceGroupLocation;
          this.resourceGroupName=ni.resourceGroupName;

        }
      }
    }
    if(this.sessionFormData.resourceGroup){
      for(let rg of this.sessionFormData.resourceGroup){
        if(rg.name==this.resourceGroupName){
          this.resourceGroupLocation=rg.location;
        }
      }
    }
  }
  viewDetails(){
    if(this.sessionFormData.publicIp){
      this.publicIPDetailsArray=this.sessionFormData.publicIp;
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
