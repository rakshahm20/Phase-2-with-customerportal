import { Component, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CloudapiService } from '../../services/cloudapi.service';
import { encode, decode } from 'js-base64';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-view-history',
  templateUrl: './view-history.component.html',
  styleUrls: ['./view-history.component.scss']
})
export class ViewHistoryComponent {
  modalRef?: BsModalRef;
  transactionHistory: any = [];
  package: any;
  searchText = ''; 
  resourceJson: any;
  targetJson: any;
  applicationIds:any=[];
  loader: boolean = false;
  resourceData:any={};
  destroyedMsg:string='';
  @ViewChild('template1', { read: TemplateRef }) template1!: TemplateRef<any>;
  @ViewChild('template2', { read: TemplateRef }) template2!: TemplateRef<any>;
  @ViewChild('destroy', { read: TemplateRef }) destroy!: TemplateRef<any>;
  
  constructor(private router: Router,private modalService: BsModalService, private cloudapi: CloudapiService,private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.getLatestUser();
  }
  getLatestUser() {
    this.loader = true;
    this.cloudapi.getSchemaHistory().subscribe((response) => {
      this.loader = false;
      this.transactionHistory = response;
      for(var item of this.transactionHistory){
        item.applicationId=(JSON.parse(atob(item.resourcePayload))?.provider?.subscriptionId);
      }
    });
    
  }
 
  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-md' })
    );
  }
  
  sourceDataById(id:any){
    for(var item of this.transactionHistory){
      if(id==item.transactionId)
      {
        this.resourceJson= JSON.parse(atob(item.resourcePayload));
       
      }
    }
    this.openModalWithClass(this.template1);
  }
  targetDataById(id:any){
    for(var item of this.transactionHistory){
      if(id==item.transactionId)
      {
        if(item.terraformScript==null){
          this.targetJson='NA'
        }
        else{
          this.targetJson= atob(item.terraformScript);
        }
      }
    }
    this.openModalWithClass(this.template2);
  }
  OnEdit(id:number){
    this.loader=true;
    this.cloudapi.getTransactionById(id).subscribe((res:any) => {
      this.loader=false;
      sessionStorage.setItem('selectedCustomer', res.customerName);
      sessionStorage.setItem('selectedCloud', res.provider);
      sessionStorage.setItem('editTxnid',res.transactionId);
      sessionStorage.removeItem('Option');
      sessionStorage.removeItem('selectedPackage');
      sessionStorage.removeItem('selectedService');
      this.resourceData=JSON.parse(atob(res.resourcePayload));
      sessionStorage.setItem('sessionFormData',JSON.stringify(this.resourceData));
      this.router.navigate(['/home/azure']);
    });
  }
  OnDelete(id:number){
    this.loader=true;
   this.cloudapi.DestroyTransactionById(id).subscribe((res:any)=>{
      this.loader=false;
      this.destroyedMsg=res;
      console.log(res);
      this.openModalWithClass(this.destroy);
    });
  }
  reloadData(){
    this.getLatestUser();
  }
}

