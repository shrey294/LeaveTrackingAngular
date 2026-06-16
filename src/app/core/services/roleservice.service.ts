import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../Environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleserviceService {
  private http = inject(HttpClient)
  private baseurl = environment.apibaseurl;
  constructor() { }

  getrolelist():Observable<any[]>{
    return this.http.get<any[]>(`${this.baseurl}/Role/GetRole`)
  }
  addrole(rolename: string) {
  return this.http.post(`${this.baseurl}/Role/AddRole?rolename=${rolename}`, {});
}
updaterole(roleid:number, rolename:string){
  return this.http.post(
    `${this.baseurl}/Role/EditRole?roleid=${roleid}&rolename=${rolename}`,
    {}
  );
}
delete(roleid:number){
  return this.http.post(`${this.baseurl}/Role/DeleteRole?role_id=${roleid}`,{})
}
}
