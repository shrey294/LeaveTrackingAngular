import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../Environments/environment';
import { Observable } from 'rxjs';
import { MenuModel } from '../Models/MenuModel.model';
import { MenuNameModel } from '../Models/MenuName.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private http = inject(HttpClient)
  private baseurl = environment.apibaseurl;

  constructor() { }

  getrolemenulist(role:string):Observable<MenuModel[]>{
    const params = new HttpParams().set('role', role);
    return this.http.get<MenuModel[]>(`${this.baseurl}/Menu/GetRoleMenu`,{params});
  }
  getrolemenunamelist():Observable<MenuNameModel[]>{
    return this.http.get<MenuNameModel[]>(`${this.baseurl}/Menu/GetMenuList`);
  }
  addMenuRoleMapping(menuId: number, role: string) {
  return this.http.post(
    `${this.baseurl}/Menu/AddMenuMapping?menuid=${menuId}&role=${role}`,
    {}
  );
}
}
