import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.scss']
})
export class ProviderComponent {
  sessionFormData:any={};
  providerDetails!: FormGroup;
  submitted = false;
  showPassword: boolean = false;

  subscriptionId:string='';
  clientId:string='';
  clientSecret:string='';
  tenantId:string='';


  @Output('tabActive') tabActive = new EventEmitter<any>();
  @Output('isSuccess') isSuccess = new EventEmitter<any>();
  

  constructor(private formBuilder: FormBuilder,private router: Router) {
    this.providerDetails = this.formBuilder.group({
      subscriptionId: ['', [Validators.required, this.noWhitespaceValidator]],
      clientId: ['', [Validators.required, this.noWhitespaceValidator]],
      clientSecret: ['', [Validators.required, this.noWhitespaceValidator]],
      tenantId: ['', [Validators.required, this.noWhitespaceValidator]]
    });
    if(JSON.parse(`${sessionStorage.getItem('sessionFormData')}`)){
      this.sessionFormData=JSON.parse(`${sessionStorage.getItem('sessionFormData')}`);
      this.subscriptionId=this.sessionFormData.provider?.subscriptionId || '';
      this.clientId=this.sessionFormData.provider?.clientId || '';
      this.clientSecret=this.sessionFormData.provider?.clientSecret || '';
      this.tenantId=this.sessionFormData.provider?.tenantId || '';
    }
  }

  onSubmit() {
    this.submitted = true;
    this.sessionFormData.provider = this.providerDetails.value;
    sessionStorage.setItem('sessionFormData', JSON.stringify(this.sessionFormData));
    this.isSuccess.emit(true);
    if(!this.providerDetails.invalid){
      this.tabActive.emit(1);
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
  showPass() {
    this.showPassword = !this.showPassword;
  }
  resetProvider() {
    this.providerDetails.reset();
  }
  get form(): { [key: string]: AbstractControl; } {
    return this.providerDetails.controls;
  }
}
