import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject,Injectable } from '@angular/core';
import { environment } from '../../../Environments/environment';
import { userModel } from '../Models/user.model';
import { catchError, map, Observable, throwError } from 'rxjs';
import { LeaveBalanceDTO } from '../Models/LeaveBalanceDTO.model';
import { ApiResponse } from '../Models/ApiResponse.model';
import { DeptLeaveAssignment } from '../Models/DeptLeaveAssignment.model';

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
  getDeptLeaveAssignments():Observable<DeptLeaveAssignment[]>{
    return this.http.get<DeptLeaveAssignment[]>(`${this.baseurl}/User/GetDeptLeaveAssignments`)
  }
  assignLeave(payload: LeaveBalanceDTO): Observable<ApiResponse> {
    return this.http
      .post<ApiResponse>(`${this.baseurl}/User/LeaveAssignment`, payload)
      .pipe(
        map((res) => res),          // pass through on success
        catchError(this.handleError)
      );
  }
  updateLeaveAssignment(payload:LeaveBalanceDTO):Observable<ApiResponse>{
    return this.http.post<ApiResponse>(`${this.baseurl}/User/updateLeave`,payload).pipe(map((res)=>res),
  catchError(this.handleError)
);
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Something went wrong. Please try again.';
 
    if (error.error instanceof ErrorEvent) {
      // Client-side / network error
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      // Server-side error — use the API message if present
      errorMessage =
        error.error?.message ||
        error.error?.title ||
        `Server error (${error.status}): ${error.statusText}`;
    }
 
      return throwError(() => new Error(errorMessage));
  }
}
