import { Component, EventEmitter, Output, TemplateRef, ViewChild , OnInit} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CloudapiService } from 'src/app/mainapp/services/cloudapi.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-resource-group',
  templateUrl: './resource-group.component.html',
  styleUrls: ['./resource-group.component.scss']
})
export class ResourceGroupComponent {
  resourceGroupDetails: any;
  sessionFormData:any={};
  submitted: boolean=false;
  default:string='';
  resourceLocation: any=[];
  resourceGroupArray:any=[];
  name:string='my-resource-group';
  location:string='';
  selectedService!:string;
  modalRef?: BsModalRef;

  dropdownList: any=[];
  selectedItems : any= [];
  dropdownSettings : any= {};
  

  @Output('tabActive') tabActive = new EventEmitter<any>();
  @Output('isSuccess') isSuccess = new EventEmitter<any>();
  @ViewChild('template', { read: TemplateRef }) template!: TemplateRef<any>;

  constructor(private modalService: BsModalService,private formBuilder: FormBuilder,private cloudapi: CloudapiService,private router: Router) {
    this.resourceGroupDetails = this.formBuilder.group({
      name: ['my-resource-group', [Validators.required, this.noWhitespaceValidator]],
      location: ['', [Validators.required, this.noWhitespaceValidator]]
    });
    this.cloudapi.getResourceLocation().subscribe(res=>{
      for(let item of Object.keys(res)){
        this.resourceLocation.push((res as any)[item].value);
      }
    });
    this.resourceGroupArray=[];
    if(JSON.parse(`${sessionStorage.getItem('sessionFormData')}`)){
      this.sessionFormData=JSON.parse(`${sessionStorage.getItem('sessionFormData')}`);
      if(this.sessionFormData.resourceGroup){
        this.resourceGroupArray=this.sessionFormData.resourceGroup;
      }
      this.name=this.sessionFormData.resourceGroup?.[0]?.name || 'my-resource-group';
      this.location=this.sessionFormData.resourceGroup?.[0]?.location || this.default;
    }

  }
  ngOnInit() {
    this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }
    ];
    // this.selectedItems = [
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' }
    // ];
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
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
    if(!this.resourceGroupDetails.invalid){
      this.resourceGroupArray.push(this.resourceGroupDetails.value);
      this.sessionFormData.resourceGroup=this.resourceGroupArray;
      this.selectedService = sessionStorage.getItem('selectedService')||'';
      sessionStorage.setItem('sessionFormData', JSON.stringify(this.sessionFormData));
      // this.name='my-resource-group';
      // this.location=this.default;
      this.isSuccess.emit(true);
    }
  }
  nextTab(){
      // this.tabActive.emit(2);
      this.tabActive.emit(1);
  }
  backTab(){
    this.tabActive.emit(0);
  }
  viewDetails(){
    if(this.sessionFormData.resourceGroup){
      this.resourceGroupArray=this.sessionFormData.resourceGroup;
    }
    this.openModalWithClass(this.template);
  }
  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  skipTab(){
    if (this.sessionFormData.resourceGroup) {
      delete this.sessionFormData.resourceGroup;
      sessionStorage.setItem('sessionFormData', JSON.stringify(this.sessionFormData));
    }
    this.tabActive.emit(1);
  }
}
