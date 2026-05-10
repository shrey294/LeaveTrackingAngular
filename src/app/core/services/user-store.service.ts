import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {

  private fullnamesubject = new BehaviorSubject<string>('');
  private rolesubject = new BehaviorSubject<string>('');
  constructor() { }

  getRole(): Observable<string>{
    return this.rolesubject.asObservable();
  }
  setRole(role:string):void{
    this.rolesubject.next(role);
  }
  getName():Observable<string>{
    return this.fullnamesubject.asObservable();
  }
  setName(name:string):void{
    this.fullnamesubject.next(name);
  }
}
