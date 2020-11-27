import {Injectable} from '@angular/core';
import {BaseApiUrl} from '../_config/base-url';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AuthenticationService} from "../_services";
import {CategoryData} from "../_models/category.model";

@Injectable({
  providedIn: 'root'
})
export class GroupApi {

  url:string = BaseApiUrl + '/group';

  constructor(
    private http: HttpClient,
    public auth: AuthenticationService,
  ) {
  }

  getAll():Observable<any> {
    return this.http.get<any>(this.url, this.auth.getHttpOptions());
  }

  addItem(item:any){
    return this.http.post<any>(this.url,item
      ,this.auth.getHttpOptions());
  }

  editItem(item:any, id){
    return this.http.put<any>(this.url+'/'+id,item
      ,this.auth.getHttpOptions());
  }

  deleteItem(id):Observable<any> {
    return this.http.delete<any>(this.url+'/'+id, this.auth.getHttpOptions());
  }

  getGroupTypes():Observable<any> {
    return this.http.get<any>(BaseApiUrl+'/getGroupTypes', this.auth.getHttpOptions());
  }

  getGroupDetails(userId):Observable<any> {
    return this.http.get<any>(BaseApiUrl+'/getGroupDetails?user_id='+userId, this.auth.getHttpOptions());
  }
}
