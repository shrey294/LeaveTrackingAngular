import { Component, inject, OnInit } from '@angular/core';
import { MenuService } from '../../core/services/menu.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu-master',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './menu-master.component.html',
  styleUrl: './menu-master.component.css'
})
export class MenuMasterComponent implements OnInit {
  
  menunameList: any[] = [];
  selectedRole: string = '';
  selectedMenuId: number = 0;
  private menuservice = inject(MenuService);
  ngOnInit(): void {
   this.getrolemenuname() 
  }
  getrolemenuname(){
    this.menuservice.getrolemenunamelist().subscribe({
      next:(data:any[])=>{
        this.menunameList=data;
        console.log(this.menunameList)
      }
    })
  }
   saveMapping() {

    if (!this.selectedRole || !this.selectedMenuId) {
      alert('Please select Role and Menu');
      return;
    }

    this.menuservice
      .addMenuRoleMapping(this.selectedMenuId, this.selectedRole)
      .subscribe({
        next: (res: any) => {
          alert(res.message);
        },
        error: (err) => {
          alert('Failed to save mapping');
          console.error(err);
        }
      });
  }
}
