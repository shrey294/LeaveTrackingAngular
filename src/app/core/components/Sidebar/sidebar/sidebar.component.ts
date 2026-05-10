import { Component, inject, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UserStoreService } from '../../../services/user-store.service';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  @Input() collapsed = false;
  showUserMenu = false;
  userInitials: string = 'AK';
  currentUrl: string = '';
  public fullName :string = "";
  public role!:string;
  private auth = inject(AuthService);
  private userstore = inject(UserStoreService);
  private router = inject(Router);

  adminMenuItems = [
    { label: 'Dashboard',       icon: 'fa-tachometer-alt', route: '/dashboard',        badge: null },
    { label: 'Leave Assignment', icon: 'fa-calendar-check', route: '/leave-assignment', badge: '12' },
    { label: 'Leave Requests',  icon: 'fa-file-alt',        route: '/leave-requests',   badge: '4' },
    { label: 'Reports',         icon: 'fa-chart-line',      route: '/reports',          badge: null },
  ];

  managementMenuItems = [
    { label: 'User Registration', icon: 'fa-users',     route: '/userregistration', badge: null },
    { label: 'Departments',       icon: 'fa-sitemap',   route: '/department',       badge: null },
    { label: 'Leave Types',       icon: 'fa-tags',      route: '/leavetype',        badge: null },
    { label: 'Settings',          icon: 'fa-cog',       route: '/settings',         badge: null },
  ];

   userMenuItems = [
    { label: 'My Leaves',    icon: 'fa-calendar-alt', route: '/my-leaves',    badge: null },
    { label: 'Apply Leave',  icon: 'fa-plus-circle',  route: '/apply-leave',  badge: null },
    { label: 'Leave Status', icon: 'fa-clock',        route: '/leave-status', badge: null },
  ];
  ngOnInit(): void {
    
    this.currentUrl = this.router.url;

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.currentUrl = e.urlAfterRedirects;
    });

    this.userstore.getName().subscribe(val=>{
      const fullname = this.auth.getNameFromtoken();
      this.fullName = val || fullname
    });

    this.userstore.getRole().subscribe(val=>{
      const role = this.auth.getRoleFromToken();
      this.role = val || role
    })
  }
  isActive(route: string): boolean {
    return this.currentUrl === route || this.currentUrl.startsWith(route + '/');
  }
  
  navigate(route: string) {
    this.router.navigate([route]);
  }

  logout(){
      this.auth.signOut();
  }
  toggleUserMenu() {
  this.showUserMenu = !this.showUserMenu;
}
}
