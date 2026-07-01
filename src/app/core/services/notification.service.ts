import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../Environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { AppNotification } from '../Models/AppNotification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly baseurl = environment.apibaseurl;
  private readonly hub = environment.Huburl;

  private http = inject(HttpClient);
  private auth = inject(AuthService);

  //private _notification = new BehaviorSubject<AppNotification[]>([]);
  //notification$ = this._notification.asObservable();
  private _notification = signal<AppNotification[]>([]);
  notification = this._notification.asReadonly();

  private hubConnection!: signalR.HubConnection;

  startconnection():void {
    this.hubConnection = new signalR.HubConnectionBuilder().withUrl(this.hub,{
      accessTokenFactory:()=> this.auth.getToken()??''
    }).withAutomaticReconnect().build();

    this.hubConnection.on('ReceiveNotification',(notif:AppNotification)=>{
      //const current = this._notification.getValue();
      //this._notification.next([notif,...current]);
      this._notification.update(current=>[notif,...current]);
    });
    this.hubConnection.start()
    .then(() => {
        //console.log('✅ SignalR connected, state:', this.hubConnection.state);
        //console.log('✅ Connection ID:', this.hubConnection.connectionId);
        this.loadunread();
    })
    .catch(err => console.error('SignalR error:', err));
  }

  stopConnection():void{
    this.hubConnection?.stop();
  }
  private loadunread():void {
    this.http.get<AppNotification[]>(`${this.baseurl}/Notification/GetUnreadNotifications`).subscribe({
      next:list=>this._notification.set(list),
      error:err=>console.log(err)
    });
  }
  markRead(notificationId: number) {
  return this.http.post(`${this.baseurl}/Notification/MarkAsRead`,notificationId);
  }
  markReadAll(Recevier_user_id:number){
    console.log(Recevier_user_id);
    return this.http.post(`${this.baseurl}/Notification/markAllRead`,Recevier_user_id);
  }
  markReadLocal(notificationId: number): void {
  this._notification.update(list =>
    list.map(n => n.notificationId === notificationId ? { ...n, isRead: true } : n)
  );
}

markAllReadLocal(): void {
  this._notification.update(list => list.map(n => ({ ...n, isRead: true })));
}
  constructor() { }
}
