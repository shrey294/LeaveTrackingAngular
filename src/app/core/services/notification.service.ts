import { inject, Injectable } from '@angular/core';
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

  private _notification = new BehaviorSubject<AppNotification[]>([]);
  notification$ = this._notification.asObservable();

  private hubConnection!: signalR.HubConnection;

  startconnection():void {
    this.hubConnection = new signalR.HubConnectionBuilder().withUrl(this.hub,{
      accessTokenFactory:()=> this.auth.getToken()??''
    }).withAutomaticReconnect().build();

    this.hubConnection.on('ReceiveNotification',(notif:AppNotification)=>{
      const current = this._notification.getValue();
      this._notification.next([notif,...current]);
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
      next:list=>this._notification.next(list),
      error:err=>console.log(err)
    });
  }
  constructor() { }
}
