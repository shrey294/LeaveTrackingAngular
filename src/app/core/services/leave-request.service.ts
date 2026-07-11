import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../Environments/environment';
import { UserStats } from '../Models/UserStats.model';
import { LeaveResponseDTO } from '../Models/LeaveResponseDTO.model';

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
   getUserStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.baseurl}/LeaveManagement/GetUserStats`);
  }
  getLeaveListByManager(): Observable<LeaveResponseDTO[]> {

    return this.http.get<LeaveResponseDTO[]>(
      `${this.baseurl}/LeaveManagement/Get_LeaveList_ByManager`);
  }
   updateLeaveStatus(status: string, leaveHistoryId: number) {

    const params = new HttpParams()
      .set('status', status)
      .set('LeaveHistoryid', leaveHistoryId);

    return this.http.post<any>(
      `${this.baseurl}/LeaveManagement/LeaveStatus`,
      {},
      { params }
    );
  }
}
