import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaveTypeService } from '../../core/services/leave-type.service';
import { CommonModule } from '@angular/common';

interface LeaveType {
  id?: number;  // Make id optional for adding new leave type
  leaveName: string;
  leaveCode: string;
}

@Component({
  selector: 'app-leave-type',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './leave-type.component.html',
  styleUrl: './leave-type.component.css'
})
export class LeaveTypeComponent implements OnInit {
  leaveForm: FormGroup;
  leaveTypes: any[] = [];
  editingLeaveId: number | null = null;
  private fb = inject(FormBuilder);
  private leaveservice = inject(LeaveTypeService);

  constructor() {
    this.leaveForm = this.fb.group({
      leaveName: ['', [Validators.required]],    // Leave Name is required
      leaveCode: ['', [Validators.required]]     // Leave Code is required
    });
  }

  ngOnInit(): void {
    this.fetchLeaveTypes();
  }

  onSave(): void {
  if (this.leaveForm.invalid) {
    return;
  }

  // Prepare the leave type object
  const leaveType: LeaveType = {
    leaveName: this.leaveForm.value.leaveName,
    leaveCode: this.leaveForm.value.leaveCode
  };

  // If editing, add the id to the leaveType object
  if (this.editingLeaveId !== null) {
    leaveType.id = this.editingLeaveId;
  }

  // Now we handle both the add and edit scenarios:
  if (this.editingLeaveId !== null) {
    // If editing, update the existing leave type
    this.leaveservice.editLeaveType(leaveType as { id: number, leaveName: string, leaveCode: string }).subscribe(
      (response: any) => {
        if (response.success) {
          alert(response.message);
          this.leaveForm.reset();
          this.fetchLeaveTypes();
          this.editingLeaveId = null;  // Reset the edit mode
        } else {
          alert(response.message);
        }
      },
      (error) => {
        alert('An error occurred: ' + error);
      }
    );
  } else {
    // If adding, create a new leave type
    this.leaveservice.addleave(leaveType).subscribe(
      (response: any) => {
        if (response.success) {
          alert(response.message);
          this.leaveForm.reset();
          this.fetchLeaveTypes();
        } else {
          alert(response.message);
        }
      },
      (error) => {
        alert('An error occurred: ' + error);
      }
    );
  }
}

  fetchLeaveTypes(): void {
    this.leaveservice.getLeaveTypes().subscribe(
      (data) => {
        this.leaveTypes = data;  // Store the fetched data in the leaveTypes array
      },
      (error) => {
        console.error('Error fetching leave types:', error);
      }
    );
  }

  onEdit(leave: any): void {
    this.leaveForm.patchValue({
      leaveName: leave.leaveName,
      leaveCode: leave.leaveCode
    });
    this.editingLeaveId = leave.leaveId;  // Store the id of the leave type being edited
  }

  onDelete(leaveId: number): void {
  if (confirm('Are you sure you want to delete this leave type?')) {
    //console.log('Delete leave ID:', leaveId); // Add a log to check the value
    this.leaveservice.deleteLeaveType(leaveId).subscribe(
      (response: any) => {
        if (response.success) {
          alert(response.message);
          this.fetchLeaveTypes();  // Refresh the list after deleting
        } else {
          alert('Error deleting leave type: ' + response.message);
        }
      },
      (error) => {
        alert('An error occurred: ' + error);
      }
    );
  }
}
}