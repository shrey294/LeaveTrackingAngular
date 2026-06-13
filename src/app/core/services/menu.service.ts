import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../Environments/environment';
import { Observable } from 'rxjs';
import { MenuModel } from '../Models/MenuModel.model';
import { MenuNameModel } from '../Models/MenuName.model';
import { adminmenulist } from '../Models/adminmenulist.model';

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
  AdminMenuList():Observable<adminmenulist[]>{
    return this.http.get<adminmenulist[]>(`${this.baseurl}/Menu/AdminMenuList`);
  }
  delete(id:number){
    return this.http.post(`${this.baseurl}/Menu/DeleteMenuMapping?id=${id}`,{})
  }
  addMenuRoleMapping(menuId: number, role: string) {
  return this.http.post(
    `${this.baseurl}/Menu/AddMenuMapping?menuid=${menuId}&role=${role}`,
    {}
  );
}
EditMenuRoleMapping(permission_id:number,menuId: number, role: string) {
  return this.http.post(
    `${this.baseurl}/Menu/EditMenuMapping?permission_id=${[permission_id]}&menuid=${menuId}&role=${role}`,
    {}
  );
}
}
