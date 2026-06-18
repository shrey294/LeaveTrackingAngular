import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { resetpassword } from '../../core/Models/resetpassword.model';
import { ForgotpasswordService } from '../../core/services/forgotpassword.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.css'
})
export class ResetpasswordComponent implements OnInit {

  password: string ='';
  emailToReset!: string;
  emailToken!:string;
  resetpasswordobj = new resetpassword();
  isLoading: boolean = false;
  private activatedroute = inject(ActivatedRoute);
  private service = inject(ForgotpasswordService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  ngOnInit(): void {
    this.activatedroute.queryParams.subscribe(val=>{
      this.emailToReset = val['email'];
      let uritoken = val['code'];
      this.emailToken = uritoken.replace(/ /g,'+');
    })
  }
  


  UpdatePassword(){
    this.isLoading = true;
    if (!this.password || this.password.trim() === '') {
      alert('Password is required');
      return;
    }
    this.resetpasswordobj.email = this.emailToReset;
    this.resetpasswordobj.newPassword = this.password;
    this.resetpasswordobj.emailToken = this.emailToken;
    this.service.resetpassword(this.resetpasswordobj).subscribe({
      next:(res)=>{
         this.toastr.success(res.message,'Success');
          this.router.navigate(['/']);
      },
        error:(err)=>{
          this.toastr.error('Error',err.message);
          this.isLoading = false;
        },
        complete:()=> {
          this.isLoading = false;
        },
    })
  }
}
