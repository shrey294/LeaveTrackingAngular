import { Component, inject, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UserStoreService } from '../../../services/user-store.service';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { MenuService } from '../../../services/menu.service';

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
  private menuservice = inject(MenuService);
  private userstore = inject(UserStoreService);
  private router = inject(Router);

  
  menuItems: { menuId: number; menuOrder: number; label: string; icon: string; route: string; badge: string | null }[] = [];
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
      this.getrolemenu(this.role);
    })
  }
  isActive(route: string): boolean {
    return this.currentUrl === route || this.currentUrl.startsWith(route + '/');
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }
 getrolemenu(role:string){
  
  //console.log(role);
  this.menuservice.getrolemenulist(role).subscribe({
      next: (data: any[]) => {
        // ✅ Map API response to menuItems
        this.menuItems = data.map(item => ({
          menuId:    item.menuId,
          menuOrder: item.menuOrder,
          label:     item.label,
          icon:      item.icon,
          route:     item.route,
          badge:     item.badge ?? null
        }));
      },
      error: (err) => {
        console.error(err?.error?.message || 'Failed to load menu');
      }
    });
 }
  logout(){
      this.auth.signOut();
  }
  toggleUserMenu() {
  this.showUserMenu = !this.showUserMenu;
}
}
