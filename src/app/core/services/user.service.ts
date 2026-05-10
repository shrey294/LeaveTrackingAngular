import { HttpClient } from '@angular/common/http';
import { inject,Injectable } from '@angular/core';
import { environment } from '../../../Environments/environment';
import { userModel } from '../Models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient)
  private baseurl = environment.apibaseurl;

  constructor() { }

  RegisterUser(user:userModel){
    return this.http.post(`${this.baseurl}/User/register`,user)
  }
  getmanagerslist():Observable<any>{
    return this.http.get(`${this.baseurl}/User/ManagerList`)
  }
}
