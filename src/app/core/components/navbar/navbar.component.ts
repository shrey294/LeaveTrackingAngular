import { Component, computed, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { AppNotification } from '../../Models/AppNotification.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  @Output() sidebarToggled = new EventEmitter<void>();

  public fullName :string = "";
  public role!:string;
  showNotifications = false;

  private auth = inject(AuthService);
  private userstore = inject(UserStoreService);
  private notifsvc = inject(NotificationService);

  //notifications: AppNotification[] = [];
  notifications = computed(()=> this.notifsvc.notification());
  

  // get unreadCount(): number {
  //   return this.notifications.filter(n => !n.isRead).length;
  // }
  unreadCount = computed(()=>this.notifications().filter(n=>!n.isRead).length);
  ngOnInit(): void {
     
    this.userstore.getName().subscribe(val=>{
      const fullname = this.auth.getNameFromtoken();
      this.fullName = val || fullname
    });

    this.userstore.getRole().subscribe(val=>{
      const role = this.auth.getRoleFromToken();
      this.role = val || role
    });
    this.notifsvc.startconnection();
    // this.notifsvc.notification$.subscribe(list=>{
    //   console.log(list);
    //   this.notifications = list
    // });
  }
  ngOnDestroy(): void {
    this.notifsvc.stopConnection();
  }
  toggleSidebar() {
    this.sidebarToggled.emit();
  }
  toggleNotifications() {
    // hook up your notification panel here
    this.showNotifications = !this.showNotifications;
  }
  // markRead(n: Notification) {
  //   n.read = true;
  // }
  // markAllRead() {
  //   this.notifications.forEach(n => n.read = true);
  // }
  getIcon(type: string): string {
    const map: Record<string, string> = {
      leave:    'fa-calendar-alt',
      approval: 'fa-check-circle',
      alert:    'fa-exclamation-triangle',
      info:     'fa-info-circle'
    };
    return map[type] ?? 'fa-bell';
  }
  getInitials(name: string): string {
  if (!name) return '?';
  return name.split(' ')
    .map(w => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}
getAvatarClass(type: string): string {
  const map: Record<string, string> = {
    'LeaveRequest' : 'avatar-blue',
    'Assignment'   : 'avatar-green',
    'Approved'     : 'avatar-green',
    'Rejected'     : 'avatar-red'
  };
  return map[type] ?? 'avatar-blue';
}
getPillClass(type: string): string {
  const map: Record<string, string> = {
    'LeaveRequest' : 'pill-leave',
    'Assignment'   : 'pill-assign',
    'Approved'     : 'pill-approve',
    'Rejected'     : 'pill-reject'
  };
  return map[type] ?? 'pill-leave';
}

getTypeLabel(type: string): string {
  const map: Record<string, string> = {
    'LeaveRequest' : 'Leave request',
    'Assignment'   : 'Assignment',
    'Approved'     : 'Approved',
    'Rejected'     : 'Rejected'
  };
  return map[type] ?? type;
}

markRead(n: AppNotification) {
  if (!n.isRead) {
    
     this.notifsvc.markRead(n.notificationId).subscribe({
      next:(res:any)=>{
        if(res.success){
         // n.isRead = true;
         this.notifsvc.markReadLocal(n.notificationId);
        }
      },
      error: (err) => {
      console.error('Error', err);
    }
     });
  }
}

markAllRead() {
   if (!this.notifications().length) {
    console.log(123);
    return;
  }
  const receiverUserId = this.notifications()[0].recevierUserId;
  //console.log(receiverUserId)
  this.notifsvc.markReadAll(receiverUserId).subscribe({
    next:(res:any)=>{
      if(res.success) {
        //this.notifications.forEach(n => n.isRead = true);
        this.notifsvc.markAllReadLocal();
      }
    },
    error: (err) => {
      console.error('Error', err);
    }
  })
  
  //this.showNotifications = false;
}
  logout(){
      this.auth.signOut();
  }
}
