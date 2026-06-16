import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DepartmentService } from '../../core/services/department.service';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../core/services/user.service';
import { userModel } from '../../core/Models/user.model';
import { map } from 'rxjs';
import { RoleserviceService } from '../../core/services/roleservice.service';

@Component({
  selector: 'app-userregistration',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './userregistration.component.html',
  styleUrl: './userregistration.component.css'
})
export class UserregistrationComponent {
  
  userForm = new FormGroup({
    depid: new FormControl('', [Validators.required]),
    managerid: new FormControl(''),
    UserName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    Email: new FormControl('', [Validators.required, Validators.email]),
    FirstName: new FormControl('', [Validators.required]),
    LastName: new FormControl('', [Validators.required]),
    Password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    Role: new FormControl('', [Validators.required])
  });

  
  private service = inject(DepartmentService);
  
  private toastr = inject(ToastrService);

  private userservice = inject(UserService);

  private roleservice = inject(RoleserviceService); 
  
  departmentList = toSignal(
  this.service.getdepartmentlist().pipe(map(data => data.result)), 
  { initialValue: [] }
);
  managerList = toSignal(this.userservice.getmanagerslist().pipe(map(data=>data.result)),
  {initialValue:[]}
);

  RoleList = toSignal(this.roleservice.getrolelist().pipe(map(data=>data)),{initialValue:[]});
  Register() {
    if (this.userForm.valid) {
      const payload: userModel = {
        ...this.userForm.value,
        deptid: Number(this.userForm.value.depid),
        Role_id:Number(this.userForm.value.Role),
        managerid:Number(this.userForm.value.managerid)
      };

      this.userservice.RegisterUser(payload).subscribe({
        next: (res: any) => {
          
          if (res && res.success) {
            this.toastr.success(res.message, 'Success');
          } else {
           
            this.toastr.warning(res.message || 'Registration failed', 'Warning');
          }
        },
        error: (err) => {
          
          this.toastr.error(err?.error?.message || 'Failed to register user', 'Error');
        }
      });
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}