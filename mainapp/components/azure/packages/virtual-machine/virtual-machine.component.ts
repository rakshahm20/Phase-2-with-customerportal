import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { encode } from 'js-base64';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CloudapiService } from 'src/app/mainapp/services/cloudapi.service';

@Component({
  selector: 'app-virtual-machine',
  templateUrl: './virtual-machine.component.html',
  styleUrls: ['./virtual-machine.component.scss']
})
export class VirtualMachineComponent {

  sessionFormData:any={};
  submitted: boolean=false;
  resourceGroupName:string='';
  resourceGroupLocation:string='';
  nicId:string='';
  virtualMachineDetails!: FormGroup;
  showPassword:boolean=false;
  modalRef?: BsModalRef;
  userdata: any={};

  @Output('tabActive') tabActive = new EventEmitter<any>();
  @Output('transactionIdActive') transactionIdActive = new EventEmitter<any>();
  @ViewChild('createdJSON', { read: TemplateRef }) createdJSON!: TemplateRef<any>;
  encodedjsonpayload: string='';
  package: string='';
  @Input() transactionId: number = 0;

  name:string='my-vm';
  vmSize:string='Standard_DS1_v2';
  osDiskTermination:string='false';
  dataDiskTermination:string='false';
  imagePublisher:string='Canonical';
  imageOffer:string='UbuntuServer';
  imageSKU:string='16.04-LTS';
  imageVersion:string='latest';
  diskName:string='my-os-disk';
  diskCaching:string='ReadWrite';
  diskCreateOption:string='FromImage';
  diskManagedDiskType:string='Standard_LRS';
  oSComputerName:string='my-vm';
  oSAdminUsername:string='azureuser';
  oSPassword:string='Admin@123';
  passwordAuthentication:string='false';
  environment:string='';
  dependsOn:string='';
  selectedService!: string;
  default: string = '';
  resourceGroupNameArray:any=[];
  vmArray:any=[];
  @Output('isSuccess') isSuccess = new EventEmitter<any>();
  @ViewChild('template', { read: TemplateRef }) template!: TemplateRef<any>;

  constructor(private formBuilder:FormBuilder,private router:Router,private modalService: BsModalService,private cloudapi:CloudapiService){
    this.virtualMachineDetails = this.formBuilder.group({
      name: ['my-vm', [, ]],
      resourceGroupName: ['', [, ]],
      resourceGroupLocation: ['', [, ]],
      network_interface_ids:['', [, ]],
      vmSize: ['Standard_DS1_v2', [, ]],
      osDiskTermination: ['false', [, ]],
      dataDiskTermination: ['false', [, ]],
      storageImage: this.formBuilder.group({
        imagePublisher: ['Canonical', [, ]],
        imageOffer: ['UbuntuServer', [, ]],
        imageSKU: ['16.04-LTS', [, ]],
        imageVersion: ['latest', [, ]]
      }),
      storageOSDisk: this.formBuilder.group({
        diskName: ['my-os-disk', [, ]],
        diskCaching: ['ReadWrite', [, ]],
        diskCreateOption: ['FromImage', [, ]],
        diskManagedDiskType: ['Standard_LRS', [, ]],
      }),
      oSProfile: this.formBuilder.group({
        oSComputerName: ['my-vm', [, ]],
        oSAdminUsername: ['azureuser', [, ]],
        oSPassword: ['Admin@123', [, ]],
      }),
      osProfileLinuxConfig: this.formBuilder.group({
        passwordAuthentication: ['false', [, ]]
      }),
      tags: this.formBuilder.group({
        environment: ['', [, ]]
      }),
      dependsOn: ['', [, ]]
    });
    
    
    this.userdata={
      selectedCustomer: sessionStorage.getItem('selectedCustomer'),
      selectedCloud: sessionStorage.getItem('selectedCloud'),
      selectedPackage: sessionStorage.getItem('selectedPackage')
    }
    this.package=this.userdata.selectedPackage;
    if(JSON.parse(`${sessionStorage.getItem('sessionFormData')}`)){
      this.sessionFormData=JSON.parse(`${sessionStorage.getItem('sessionFormData')}`);
      this.resourceGroupName= this.sessionFormData?.resourceGroup?.[0]?.name||'';
      this.resourceGroupLocation= this.sessionFormData?.resourceGroup?.[0]?.location||'';
      this.nicId= this.sessionFormData?.networkInterface?.[0]?.name||'';
      this.name=this.sessionFormData.virtualMachine?.[0]?.name||'my-vm';
      if(this.sessionFormData.resourceGroup){
        for(let rg of this.sessionFormData.resourceGroup){
          this.resourceGroupNameArray.push(rg.name);
        }
      }
      
      
      this.vmSize= this.sessionFormData.virtualMachine?.[0]?.vmSize||'Standard_DS1_v2';
      this.osDiskTermination= this.sessionFormData.virtualMachine?.[0]?.osDiskTermination||'false';
      this.dataDiskTermination= this.sessionFormData.virtualMachine?.[0]?.dataDiskTermination||'false';
      
      this.imagePublisher= this.sessionFormData.virtualMachine?.[0]?.imagePublisher||'Canonical';
      this.imageOffer= this.sessionFormData.virtualMachine?.[0]?.imageOffer||'UbuntuServer';
      this.imageSKU= this.sessionFormData.virtualMachine?.[0]?.imageSKU||'16.04-LTS';
      this.imageVersion= this.sessionFormData.virtualMachine?.[0]?.imageVersion||'latest';
      
      this.diskName= this.sessionFormData.virtualMachine?.[0]?.diskName||'my-os-disk';
      this.diskCaching= this.sessionFormData.virtualMachine?.[0]?.diskCaching||'ReadWrite';
      this.diskCreateOption= this.sessionFormData.virtualMachine?.[0]?.diskCreateOption||'FromImage';
      this.diskManagedDiskType= this.sessionFormData.virtualMachine?.[0]?.diskManagedDiskType||'Standard_LRS';

      this.oSComputerName= this.sessionFormData.virtualMachine?.[0]?.oSComputerName||'my-vm';
      this.oSAdminUsername= this.sessionFormData.virtualMachine?.[0]?.oSAdminUsername||'azureuser';
      this.oSPassword= this.sessionFormData.virtualMachine?.[0]?.oSPassword||'Admin@123';

      
      this.passwordAuthentication= this.sessionFormData.virtualMachine?.[0]?.passwordAuthentication||'false';

      this.environment= this.sessionFormData.publicIp?.[0]?.tags.environment||'';
      this.dependsOn= this.sessionFormData.publicIp?.[0]?.name||'';

      if(this.sessionFormData.virtualMachine){
        this.vmArray=this.sessionFormData.virtualMachine;
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
  
  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }
  backTab(){
    // this.tabActive.emit(5);
    this.tabActive.emit(0);
  }
  
  showPass() {
    this.showPassword = !this.showPassword;
  }
  saveandreset(){
    this.submitted = true;
    if(!this.virtualMachineDetails.invalid){
      this.vmArray.push(this.virtualMachineDetails.value);
      this.sessionFormData.virtualMachine=this.vmArray;
      sessionStorage.setItem('sessionFormData', JSON.stringify(this.sessionFormData));
    if (JSON.parse(`${sessionStorage.getItem('sessionFormData')}`)) {
      this.sessionFormData = JSON.parse(`${sessionStorage.getItem('sessionFormData')}`);
      this.name = 'my-vm';
      if(this.sessionFormData.virtualMachine){
        this.vmArray=this.sessionFormData.virtualMachine;
      }
    }
    this.isSuccess.emit(true);
    }
  }
  nextTab(){
    // this.tabActive.emit(7);
    this.tabActive.emit(1);
  }
  resourceGroupNameChange(){
    if(this.sessionFormData.resourceGroup){
      for(let rg of this.sessionFormData.resourceGroup){
        if(rg.name==this.resourceGroupName){
          this.resourceGroupLocation=rg.location;
        }
      }
    }
    if(this.sessionFormData.networkInterface){
      for(let ni of this.sessionFormData.networkInterface){
        if(ni.resourceGroupName==this.resourceGroupName){
          this.nicId=ni.name;
        }
      }
    }
    if(this.sessionFormData.publicIp){
      for(let pi of this.sessionFormData.publicIp){
        if(pi.resourceGroupName==this.resourceGroupName){
          this.dependsOn=pi.name;
          this.environment=pi.tags.environment;
        }
      }
    }
  }
  viewDetails(){
    if(this.sessionFormData.virtualMachine){
      this.vmArray=this.sessionFormData.virtualMachine;
    }
    this.openModalWithClass(this.template);
  }
}
