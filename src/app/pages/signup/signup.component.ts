import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { registerRequest } from '../../core/Models/register-request.model';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  isLoading  = false;

  signupForm = this.fb.group({
    email:['',Validators.required],
    username:['',Validators.required],
    password:['',Validators.required]
  });

  onSubmit(){
    if(this.signupForm.invalid){
      this.signupForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    
    const payload: registerRequest = {
      email:this.signupForm.value.email!,
      username:this.signupForm.value.username!,
      password:this.signupForm.value.password!
    };
    this.auth.register(payload).pipe(finalize(()=>this.isLoading=false)).subscribe({
      next:()=>{
        this.toastr.success('Register successful','Success');
        this.router.navigate(['/login'])
      },
      error:err=>{
        this.toastr.error(err.error.message,'Error');
        console.log(err);
      }
    })
  }
}
