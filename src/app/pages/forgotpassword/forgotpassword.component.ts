import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ForgotpasswordService } from '../../core/services/forgotpassword.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [RouterLink,FormsModule,CommonModule],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.css'
})
export class ForgotpasswordComponent {

  email: string = '';
  private forgotPasswordService = inject(ForgotpasswordService);
  private toastr = inject(ToastrService);
  isLoading: boolean = false;

  sendResetLink() {
    this.isLoading = true;
    if (!this.email || this.email.trim() === '') {
      alert('Email is required');
      return;
    }
    this.forgotPasswordService.forgotpassword(this.email).subscribe({
      next: (response: any) => {
        // Handle success response
        this.toastr.success(response.success,response.message);
      },
      error: (error: any) => {
        // Handle error response
        console.error('Error sending reset link:', error);
        this.toastr.error('Error','Failed to send reset link. Please try again later.');
        //alert('Failed to send reset link. Please try again later.');
      },
      
      complete: () => {
        this.isLoading = false;
      }
      
    });
  }

}
