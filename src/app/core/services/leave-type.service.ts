import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../Environments/environment';
import { Observable } from 'rxjs';

export interface LeaveTypeDTO {
  leaveName: string;
  leaveCode: string;
}


@Injectable({
  providedIn: 'root'
})
export class LeaveTypeService {

  private http = inject(HttpClient)
  private baseurl = environment.apibaseurl;

  constructor() { }

   getLeaveTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseurl}/LeaveType/GetLeaveList`);
  }
  addleave(leavetype:LeaveTypeDTO):Observable<any>{
    return this.http.post(`${this.baseurl}/LeaveType/AddLeaveType`,leavetype);
  }
  editLeaveType(leaveType: { id: number, leaveName: string, leaveCode: string }): Observable<any> {
    return this.http.post(`${this.baseurl}/LeaveType/EditLeaveType`, leaveType);
  }
  deleteLeaveType(leaveId: number): Observable<any> {
    //console.log("from service",leaveId)
    return this.http.post(`${this.baseurl}/LeaveType/DeleteLeave`, { id: leaveId });
  }
}
