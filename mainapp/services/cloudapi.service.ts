import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CloudapiService {

  public httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    }),
    params:new HttpParams()
  };
  constructor(private http: HttpClient) { }
  getResourceLocation(){
    const endPoint = environment.baseURL+'masterLookup/master-lookup';
    let queryParams = new HttpParams();
    queryParams = queryParams.append("provider","azure");
    queryParams = queryParams.append("lookupName","location");
    return this.http.get(endPoint, {headers: this.httpOptions.headers, params:queryParams});
  }
  postResource(payload:any){
    const endPoint = environment.baseURL+'terraform-request/save-txn';
    return this.http.post(endPoint,payload,{headers: this.httpOptions.headers});
  }
  createPlan(transactionId:number){
    const endPoint = environment.baseURL+'terraform-request/create-plan';
    let queryParams = new HttpParams();
    queryParams = queryParams.append("transactionId",transactionId);
    return this.http.get(endPoint,{headers: this.httpOptions.headers, params: queryParams });
  }
  executePlan(transactionId:number){
    const endPoint = environment.baseURL+'terraform-request/execute-plan';
    let queryParams = new HttpParams();
    queryParams = queryParams.append("transactionId",transactionId);
    return this.http.get(endPoint,{headers: this.httpOptions.headers,params:queryParams});
  }
  
  getCustomers(){
    const endPoint = environment.baseURL+'terraform-customer/active-customer';
    return this.http.get(endPoint,{headers:this.httpOptions.headers});
  }

  getTransactionById(transactionId:number){
    const endPoint = environment.baseURL+'terraform-txn/transactionId/'+`${transactionId}`;
    return this.http.get(endPoint);
  }

  getSchemaHistory() {
    const endPoint = environment.baseURL + 'terraform-txn/all';
    return this.http.get(endPoint, this.httpOptions);
  }
  DestroyTransactionById(transactionId:number){
    const endPoint = environment.baseURL+'terraform-request/destroy-all-resource';
    let queryParams = new HttpParams();
    queryParams = queryParams.append("transactionId",transactionId);
    return this.http.get(endPoint,{headers: this.httpOptions.headers,params:queryParams});
  }
}
