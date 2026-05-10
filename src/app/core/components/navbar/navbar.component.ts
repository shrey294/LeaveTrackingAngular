import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  public fullName :string = "";
  public role!:string;
  private auth = inject(AuthService);
  private userstore = inject(UserStoreService);

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

  logout(){
      this.auth.signOut();
  }
}
