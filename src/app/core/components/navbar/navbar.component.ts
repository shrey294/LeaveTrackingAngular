import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';
import { CommonModule } from '@angular/common';

interface Notification {
  id: number;
  type: 'leave' | 'approval' | 'alert' | 'info';
  message: string;
  from: string;
  time: string;
  read: boolean;
}

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

notifications: Notification[] = [
    {
      id: 1,
      type: 'leave',
      message: 'Rahul Mehta applied for 3 days casual leave.',
      from: 'Rahul Mehta',
      time: '2 min ago',
      read: false
    },
    {
      id: 2,
      type: 'approval',
      message: 'Priya Sharma\'s leave request has been approved.',
      from: 'System',
      time: '15 min ago',
      read: false
    },
    {
      id: 3,
      type: 'alert',
      message: 'Leave balance for Dev team is running low.',
      from: 'HR System',
      time: '1 hr ago',
      read: false
    },
    {
      id: 4,
      type: 'info',
      message: 'New employee Anjali Patel has been registered.',
      from: 'Admin',
      time: '3 hr ago',
      read: true
    },
    {
      id: 5,
      type: 'leave',
      message: 'Vikram Joshi applied for sick leave from Mon–Wed.',
      from: 'Vikram Joshi',
      time: 'Yesterday',
      read: true
    },
    {
      id: 6,
      type: 'approval',
      message: 'Sneha Patil\'s half-day leave has been rejected.',
      from: 'System',
      time: 'Yesterday',
      read: true
    }
  ];
  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }
  ngOnInit(): void {
     
  

    this.userstore.getName().subscribe(val=>{
      const fullname = this.auth.getNameFromtoken();
      this.fullName = val || fullname
    });

    this.userstore.getRole().subscribe(val=>{
      const role = this.auth.getRoleFromToken();
      this.role = val || role
    })
  }
  toggleSidebar() {
    this.sidebarToggled.emit();
  }
  toggleNotifications() {
    // hook up your notification panel here
    this.showNotifications = !this.showNotifications;
  }
  markRead(n: Notification) {
    n.read = true;
  }
  markAllRead() {
    this.notifications.forEach(n => n.read = true);
  }
  getIcon(type: string): string {
    const map: Record<string, string> = {
      leave:    'fa-calendar-alt',
      approval: 'fa-check-circle',
      alert:    'fa-exclamation-triangle',
      info:     'fa-info-circle'
    };
    return map[type] ?? 'fa-bell';
  }
  logout(){
      this.auth.signOut();
  }
}
