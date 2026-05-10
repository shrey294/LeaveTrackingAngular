import { inject, Injectable } from '@angular/core';
import { registerRequest } from '../Models/register-request.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../Environments/environment';
import { Observable } from 'rxjs';
import { LoginRequest } from '../Models/login.model';
import { TokenApiModel } from '../Models/tokenapi.model';
import {JwtHelperService} from '@auth0/angular-jwt'
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private baseurl = environment.apibaseurl;
  //private userPayload:any;
  private router = inject(Router);
  // constructor(){
  //   this.userPayload = this.decodetoken();
  // }
  
  register(payload:registerRequest):Observable<any>{
   return this.http.post(`${this.baseurl}/User/register`,payload); 
  }

  login(payload:LoginRequest):Observable<any>{
    return this.http.post(`${this.baseurl}/User/Authenticate`,payload);
  }
  decodetoken(){
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    return jwtHelper.decodeToken(token)
  }
  getDecodedToken(){
    const token = this.getToken();
    if(!token) return null;
    try{
        return jwtDecode<any>(token);
    }
    catch{
      return null;
    }
  }
  getNameFromtoken(){
    // if(this.userPayload){
    //   return this.userPayload.name;
    // }
    const decoded = this.getDecodedToken();
  return decoded?.name || decoded?.unique_name || null;
  }
  getRoleFromToken(){
    // if(this.userPayload){
    //   return this.userPayload.role;
    // }
    const decoded = this.getDecodedToken();
  return decoded?.role || null;
  }
  storeToken(tokenValue:string){
    localStorage.setItem('token',tokenValue);
  }
  getToken(){
    return localStorage.getItem('token');
  }
  storeRefreshtoken(tokenvalue:string){
    localStorage.setItem('refreshtoken',tokenvalue);
  }
  getrefreshtoken(){
    return localStorage.getItem('refreshtoken');
  }
  renewtoken(tokenapi:TokenApiModel){
    return this.http.post<TokenApiModel>(`${this.baseurl}/User/Refresh`,tokenapi);
  }
  signOut(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }

    try {
      const decodedToken: any = jwtDecode(token);

      // check expiration
      if (decodedToken.exp * 1000 < Date.now()) {
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      // invalid token format
      this.logout();
      return false;
    }
  }
  logout() {
    localStorage.removeItem('token');
  }
}
