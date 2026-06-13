import { Component, inject, OnInit } from '@angular/core';
import { MenuService } from '../../core/services/menu.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { adminmenulist } from '../../core/Models/adminmenulist.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-menu-master',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './menu-master.component.html',
  styleUrl: './menu-master.component.css'
})
export class MenuMasterComponent implements OnInit {
  
  menuList:any[]=[];
  menunameList: any[] = [];
  selectedRole: string = '';
  selectedMenuId: number = 0;
  private menuservice = inject(MenuService);
  private Toastr = inject(ToastrService);

  ngOnInit(): void {
   this.getrolemenuname() 
   this.AdminMenuList()
  }
  getrolemenuname(){
    this.menuservice.getrolemenunamelist().subscribe({
      next:(data:any[])=>{
        this.menunameList=data;
        console.log(this.menunameList)
      }
    })
  }
  AdminMenuList(){
    this.menuservice.AdminMenuList().subscribe({
      next:(res:adminmenulist[])=>{
        //console.log(res);
        this.menuList=res
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
  delete(id:number){
    this.menuservice.delete(id).subscribe({
      next:(res:any)=>{
        //console.log(res);
        if(res.success){
          this.Toastr.success(res.message,'Success')
          this.AdminMenuList()
        }
        else{
          this.Toastr.error(res.message,'error')
        }
      }
    })
    //console.log(id);
  }
}
