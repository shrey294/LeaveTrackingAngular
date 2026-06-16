import { Component, inject, OnInit } from '@angular/core';
import { RoleserviceService } from '../../core/services/roleservice.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rolemaster',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './rolemaster.component.html',
  styleUrl: './rolemaster.component.css'
})
export class RolemasterComponent implements OnInit {
  RoleList: any [] = [];
  private roleservice = inject(RoleserviceService)
  private toastr = inject(ToastrService)
  roleName: string = '';
  roleId: number = 0;   
  isEditMode: boolean = false;

  ngOnInit(): void {
    this.rolelist();
  }

  rolelist(){
    this.roleservice.getrolelist().subscribe({
      next:(data:any[])=>{
        this.RoleList = data;
        console.log(this.RoleList)
      },
      error: (err) => {
      console.error('Failed to load role list:', err);

      // optional: clear list or show fallback UI
      this.RoleList = [];
      this.toastr.error('Error','Unable to load Roles.')
    }
    
    });
  }

  save() {

  if (!this.roleName || this.roleName.trim() === '') {
    alert('Role Name is required');
    return;
  }

  // UPDATE
  if (this.isEditMode && this.roleId > 0) {
    //console.log(this.roleId)
    //console.log(this.roleName)
    this.roleservice.updaterole(this.roleId, this.roleName).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastr.success('Updated', res.message);
          this.resetForm();
          this.rolelist();
        } else {
          this.toastr.error('Error', res.message);
        }
      },
      error: (err) => console.error(err)
    });

  }
  // INSERT
  else {

    this.roleservice.addrole(this.roleName).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastr.success('Success', res.message);
          this.resetForm();
          this.rolelist();
        } else {
          this.toastr.error('Error', res.message);
        }
      },
      error: (err) => console.error(err)
    });

  }
}
  Edit(role:any){
    this.roleName = role.roleName;   
    this.roleId = role.roleId;           
    this.isEditMode = true;
  }

  delete(id:number){
    this.roleservice.delete(id).subscribe({
      next:(res:any)=>{
        if (res.success) {
          this.toastr.success('Success', res.message);
          
          this.rolelist();
        }
        else{
          this.toastr.error('Error', res.message);
        }
      },
      error: (err) => console.error(err)
    })
  }
  resetForm() {
  this.roleName = '';
  this.roleId = 0;
  this.isEditMode = false;
}
}
