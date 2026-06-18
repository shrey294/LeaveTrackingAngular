import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../Environments/environment';
import { resetpassword } from '../Models/resetpassword.model';

@Injectable({
  providedIn: 'root'
})
export class ForgotpasswordService {

  private http = inject(HttpClient);
  private baseurl = environment.apibaseurl;

  constructor() { }

  forgotpassword(email: string) {
    return this.http.post(`${this.baseurl}/User/ForgotPassword?email=${email}`, {});
  }
  resetpassword(resetpasswordobj:resetpassword)
  {
    return this.http.post<any>(`${this.baseurl}/User/Reset-Password`,resetpasswordobj);
  }
}
