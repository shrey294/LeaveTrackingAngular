import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../Environments/environment';
import { Observable } from 'rxjs';
import { departmentModel } from '../Models/department.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private http = inject(HttpClient)
  private baseurl = environment.apibaseurl;

  constructor() { }

  getdepartmentlist():Observable<any>{
    return this.http.get(`${this.baseurl}/Department/AllDepartment`);
  }
  adddepartment(department: departmentModel){
    return this.http.post(`${this.baseurl}/Department/AddDepartment`,department)
  }
  updatedepartment(department:departmentModel){
    return this.http.put(`${this.baseurl}/Department/UpdateDepartment`,department)
  }
  deleteDepartment(id: number) {
  return this.http.delete(`${this.baseurl}/Department/DeleteDepartment?id=${id}`);
}

}
