import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../core/Models/login.model';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UserStoreService } from '../../core/services/user-store.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private toastr = inject(ToastrService);
  private userstore = inject(UserStoreService);
  private router = inject(Router);

  loginForm = this.fb.group({
    username:['',Validators.required],
    password:['',Validators.required]
  });
  isloading = false;
  onSubmit(){
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return;
    }
    //console.log(this.loginForm.value);
    this.isloading = true;
    const payload: LoginRequest ={
      username:this.loginForm.value.username!,
      password:this.loginForm.value.password!
    }
    this.auth.login(payload).pipe(finalize(()=>this.isloading=false)).subscribe({
      next:(res)=>{
        this.auth.storeToken(res.accessToken);
        this.auth.storeRefreshtoken(res.refreshToken);
        this.auth.storePermissions(res.permission)
        const tokenpayload = this.auth.decodetoken();
        this.userstore.setName(tokenpayload.name);
        this.userstore.setRole(tokenpayload.role);
        this.loginForm.reset();
        this.router.navigate(['dashboard'])

      },
      error:err=>{
        this.toastr.error(err.error.message,'Error');
        console.log(err);
      }
    })
  }

}
