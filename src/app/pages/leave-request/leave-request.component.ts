import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaveRequestService } from '../../core/services/leave-request.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-leave-request',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './leave-request.component.html',
  styleUrl: './leave-request.component.css'
})
export class LeaveRequestComponent implements OnInit {
  private leaveservice = inject(LeaveRequestService)
  private toastr = inject(ToastrService)
   leaveForm: FormGroup;
   leaveTypes: any[] = [];
  

  hourOptions = ['01', '02', '03', '04', '05'];

  constructor(private fb: FormBuilder) {
    this.leaveForm = this.fb.group({
      leaveType: ['', Validators.required],
      duration: ['singleDay', Validators.required],
      date: [''],
      startDate: [''],
      endDate: [''],
      hours: [''],
      reason: ['', Validators.required]
    });

    this.updateValidators();

    this.leaveForm.get('duration')?.valueChanges.subscribe(() => {
      this.updateValidators();
    });
  }
  ngOnInit(): void {
    this.fetchLeaveTypes()
  }
  fetchLeaveTypes(): void {
    this.leaveservice.getLeaveTypes().subscribe(
      (data) => {
        this.leaveTypes = data;
        //console.log(this.leaveTypes)
      },
      (error) => {
        console.error('Error fetching leave types:', error);
      }
    );
  }
  updateValidators() {
    const duration = this.leaveForm.get('duration')?.value;

    this.leaveForm.get('date')?.clearValidators();
    this.leaveForm.get('startDate')?.clearValidators();
    this.leaveForm.get('endDate')?.clearValidators();
    this.leaveForm.get('hours')?.clearValidators();

    if (duration === 'singleDay') {
      this.leaveForm.get('date')?.setValidators([Validators.required]);
    }

    if (duration === 'multipleDay') {
      this.leaveForm.get('startDate')?.setValidators([Validators.required]);
      this.leaveForm.get('endDate')?.setValidators([Validators.required]);
    }

    if (duration === 'hours') {
      this.leaveForm.get('hours')?.setValidators([Validators.required]);
    }

    this.leaveForm.get('date')?.updateValueAndValidity();
    this.leaveForm.get('startDate')?.updateValueAndValidity();
    this.leaveForm.get('endDate')?.updateValueAndValidity();
    this.leaveForm.get('hours')?.updateValueAndValidity();
  }

  applyLeave() {
  if (this.leaveForm.invalid) {
    this.leaveForm.markAllAsTouched();
    return;
  }

  const formValue = this.leaveForm.value;

  let durationHours = 0;

  if (formValue.duration === 'singleDay') {
    durationHours = 8;
  }

  if (formValue.duration === 'hours') {
    durationHours = Number(formValue.hours);
  }

  if (formValue.duration === 'multipleDay') {
    durationHours = 0;
  }

  const payload: any = {
    leaveTypeId: formValue.leaveType,
    reason: formValue.reason,
    duration: durationHours.toString()
  };

  if (formValue.duration === 'singleDay') {
    payload.date = formValue.date;
  }

  if (formValue.duration === 'multipleDay') {
    payload.startDate = formValue.startDate;
    payload.endDate = formValue.endDate;
  }
  //console.log(payload)
  this.leaveservice.addLeaveRequest(payload).subscribe({
    next: (res:any) => {
      //console.log('Leave request submitted successfully', res);
      if(res.success){
        this.toastr.success(res.message,'Success')
      }
      else{
        this.toastr.error(res.message,'Error')
      }
      this.leaveForm.reset({
        duration: 'singleDay'
      });
    },
    error: (err) => {
      console.error('Error submitting leave request', err);
    }
  });
}
}
