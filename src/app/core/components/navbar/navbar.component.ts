import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { AppNotification } from '../../Models/AppNotification.model';

// interface Notification {
//   id: number;
//   type: 'leave' | 'approval' | 'alert' | 'info';
//   message: string;
//   from: string;
//   time: string;
//   read: boolean;
// }

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

  notifications: AppNotification[] = [];

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }
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
    this.notifsvc.notification$.subscribe(list=>{
      console.log(list);
      this.notifications = list
    });
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
    n.isRead = true;
    // this.notifsvc.markRead(n.notificationId);
  }
}

markAllRead() {
  this.notifications.forEach(n => n.isRead = true);
  this.showNotifications = false;
}
  logout(){
      this.auth.signOut();
  }
}
