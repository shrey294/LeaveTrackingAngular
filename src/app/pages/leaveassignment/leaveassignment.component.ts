import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartmentService } from '../../core/services/department.service';
import { LeaveTypeService } from '../../core/services/leave-type.service';
import { UserService } from '../../core/services/user.service';
import { DeptLeaveAssignment } from '../../core/Models/DeptLeaveAssignment.model';
interface AssignmentRecord {
  department: string;
  leaveType: string;
  totalLeaves: number;
  assignedOn: Date;
}
interface LeaveBalanceDTO {
  deptId: number;
  leaveTypeId: number;
  totalLeaves: number;
}
@Component({
  selector: 'app-leaveassignment',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './leaveassignment.component.html',
  styleUrl: './leaveassignment.component.css'
})

export class LeaveassignmentComponent implements OnInit {
  private service = inject(DepartmentService)
  private leaveservice = inject(LeaveTypeService);
  private Userservice = inject(UserService)
  departmentList: any[] = [];
  deptLeaveAssignments: DeptLeaveAssignment[] = [];
  isEditMode = false;

  ngOnInit(): void {
    this.initForm();
    this.loadDepartments();
    this.loadLeaveTypes();
    this.loadDeptLeaveAssignment()
  }
  loadDeptLeaveAssignment():void{
    this.Userservice.getDeptLeaveAssignments().subscribe({
      next:(data:DeptLeaveAssignment[])=>{
        this.deptLeaveAssignments = data;
        
      },
      error:()=>{

      }
    })
  }
  private fb = inject(FormBuilder);
  leaveForm!: FormGroup;
  //departments: departmentList
  leaveTypes: any[] = [];
  recentAssignments: AssignmentRecord[] = [];

  isLoading = false;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';


  initForm(): void {
    this.leaveForm = this.fb.group({
      deptId: ['', Validators.required],
      leaveTypeId: ['', Validators.required],
      totalLeaves: ['', [Validators.required, Validators.min(1), Validators.max(365)]]
    });
  }
  loadDepartments(): void {
    // Replace with actual API endpoint
    this.service.getdepartmentlist().subscribe({
      next: (data) => {
        this.departmentList = data.result;
        //console.log(data.result);
      },
      error: () => {
        // Fallback mock data for development
        this.departmentList = [
          { deptId: 1, deptName: 'Human Resources' },
          { deptId: 2, deptName: 'Engineering' },
          { deptId: 3, deptName: 'Finance' },
          { deptId: 4, deptName: 'Marketing' },
          { deptId: 5, deptName: 'Operations' }
        ];
      }
    });
    //console.log(this.departmentList)
  }
  loadLeaveTypes(): void {
    // Replace with actual API endpoint
    this.leaveservice.getLeaveTypes().subscribe({
      //next: (data) => this.leaveTypes = data,
      next: (data) => {
        this.leaveTypes = data;
        //console.log(data);
      },
      error: () => {
        // Fallback mock data for development
        this.leaveTypes = [
          { leaveTypeId: 1, leaveTypeName: 'Annual Leave' },
          { leaveTypeId: 2, leaveTypeName: 'Sick Leave' },
          { leaveTypeId: 3, leaveTypeName: 'Casual Leave' },
          { leaveTypeId: 4, leaveTypeName: 'Maternity Leave' },
          { leaveTypeId: 5, leaveTypeName: 'Paternity Leave' }
        ];
      }
    });
    //console.log(this.leaveTypes)
  }
  getSelectedDeptName(): string {
    const deptId = this.leaveForm.get('deptId')?.value;
    console.log(deptId)
    return this.departmentList.find(d => d.id == deptId)?.departmentName || '';
  }
 
  getSelectedLeaveTypeName(): string {
    const leaveTypeId = this.leaveForm.get('leaveTypeId')?.value;
    return this.leaveTypes.find(l => l.leaveId == leaveTypeId)?.leaveName || '';
  }
  onSubmit(): void {
    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      return;
    }
 
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';
 
    const payload: LeaveBalanceDTO = {
      deptId: +this.leaveForm.value.deptId,
      leaveTypeId: +this.leaveForm.value.leaveTypeId,
      totalLeaves: +this.leaveForm.value.totalLeaves
    };
    const request$ = this.isEditMode
    ? this.Userservice.updateLeaveAssignment(payload)   // PUT/POST for update
    : this.Userservice.assignLeave(payload);
    
    request$.subscribe({
      next: (res:any) => {
        this.isSubmitting = false;
        //console.log(res)
        if (res.success) {
           this.loadDeptLeaveAssignment();
          this.successMessage = res.message || 'Leave assigned successfully!';
          this.isEditMode = false;
          if (!this.isEditMode) {
          this.recentAssignments.unshift({
            department: this.getSelectedDeptName(),
            leaveType: this.getSelectedLeaveTypeName(),
            totalLeaves: payload.totalLeaves,
            assignedOn: new Date()
          });
        }
          this.leaveForm.reset();
        } else {
          this.errorMessage = res.message || 'Error while saving data.';
        }
      },
      error: (err:any) => {
        this.isSubmitting = false;
        this.errorMessage = err?.error?.message || 'Something went wrong. Please try again.';
      }
    });
  }
  isFieldInvalid(field: string): boolean {
    const control = this.leaveForm.get(field);
    return !!(control && control.invalid && control.touched);
  }
  onReset(): void {
    this.leaveForm.reset();
    this.successMessage = '';
    this.errorMessage   = '';
    this.isEditMode=false;
  }
  onEdit(row: DeptLeaveAssignment): void {
  this.isEditMode = true;
  this.leaveForm.patchValue({
    deptId: row.deptId,
    leaveTypeId: row.leaveTypeId,
    totalLeaves: row.totalLeaves
  });

  // Scroll to top of form smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
}
