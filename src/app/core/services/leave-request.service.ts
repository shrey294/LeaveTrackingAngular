import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {
   private http = inject(HttpClient)
    private baseurl = environment.apibaseurl;
    
  getLeaveTypes(): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseurl}/LeaveRequest/GetLeaveList`);
    }
  addLeaveRequest(payload: any): Observable<any> {
  return this.http.post(
    `${this.baseurl}/LeaveRequest/AddLeaveRequest`,
    payload
  );
}
}
