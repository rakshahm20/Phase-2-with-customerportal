import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  public httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    }),
    params: new HttpParams()
  };

  getActiveCustomerList() {
    const endPoint = environment.baseURL + 'terraform-customer/active-customer';
    return this.http.get(endPoint, {headers: this.httpOptions.headers});
  }

  getCustomerList() {
    const endPoint = environment.baseURL + 'terraform-customer/all-customer';
    return this.http.get(endPoint, {headers: this.httpOptions.headers});
  }

  getCustomerById(customerId: number) {
    const endPoint = environment.baseURL + 'terraform-customer/customer/' + `${customerId}`;
    return this.http.get(endPoint, {headers: this.httpOptions.headers});
  }

  saveCustomer(payload: any) {
    const endPoint = environment.baseURL + 'terraform-customer/save-customer';
    return this.http.post(endPoint, payload, {headers: this.httpOptions.headers});
  }

  savePackage(payload: any) {
    const endPoint = environment.baseURL + 'packages/save-package';
    return this.http.post(endPoint, payload, {headers: this.httpOptions.headers});
  }

  getPacakgesByCustomerIdAndProvider(customerId: number, provider: string) {
    const endPoint = environment.baseURL + 'packages/packagesByCustomerIdAndProvider';
    let queryParams = new HttpParams();
    queryParams = queryParams.append("customerId", customerId);
    queryParams = queryParams.append("provider", provider);
    return this.http.get(endPoint, {headers: this.httpOptions.headers, params: queryParams});
  }

  getPackagesByCustomerId(customerId: number) {
    const endPoint = environment.baseURL + 'packages/packagesByCustomerId/' + `${customerId}`;
    return this.http.get(endPoint, {headers: this.httpOptions.headers});
  }

  getPackageById(packageId: number) {
    const endPoint = environment.baseURL + 'packages/packageById/' + `${packageId}`;
    return this.http.get(endPoint, {headers: this.httpOptions.headers});
  }

  savePrinciple(payload: any) {
    const endPoint = environment.baseURL + 'azure-principle/save-principle';
    return this.http.post(endPoint, payload, {headers: this.httpOptions.headers});
  }

  getPrincipleById(principleId: number) {
    const endPoint = environment.baseURL + 'azure-principle/principleById/' + `${principleId}`;
    return this.http.get(endPoint, {headers: this.httpOptions.headers});
  }

  getPrincipleByCustomerId(customerId: number) {
    const endPoint = environment.baseURL + 'azure-principle/principleByCustomerId/' + `${customerId}`;
    return this.http.get(endPoint, {headers: this.httpOptions.headers});
  }
}
