import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { DepartmentService } from '../../core/services/department.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { departmentModel } from '../../core/Models/department.model';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department.component.html',
  styleUrl: './department.component.css',
  encapsulation: ViewEncapsulation.None
})
export class DepartmentComponent implements OnInit {

  private service = inject(DepartmentService)
  private toastr = inject(ToastrService);
  editingDeptId: number | null = null;
  departmentList: any[] = [];
  departmentModel: departmentModel = {
    departmentName: '',
    departmentCode: '',
    location: ''
  };

  ngOnInit(): void {

    this.fetchdepartment();
  }
  fetchdepartment() {
    this.service.getdepartmentlist().subscribe({
      next: (data) => {
        this.departmentList = data.result;
        //console.log(data.result);
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Failed to load department', 'Error');
      }
    })
  }
  onSubmit(form: NgForm) {

    if (form.invalid) {
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }
    if (this.editingDeptId) {
        this.service.updatedepartment(this.departmentModel).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message || 'Department updated successfully', 'Success');
        this.fetchdepartment();
        form.resetForm();
        this.editingDeptId = null; // Reset after update
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Failed to update department', 'Error');
      }
    });
    }
    else {
      this.service.adddepartment(this.departmentModel).subscribe({
        next: (res) => {
          this.toastr.success('Department added successfully', 'Success');
          this.fetchdepartment();
          form.resetForm();
        },
        error: (err) => {
          this.toastr.error(err?.error?.message || 'Failed to add department', 'Error');
        }
      })
    }

  }
  onEdit(dept: any) {
    // Populate form model with selected department
    this.editingDeptId = dept.id;
    console.log(this.editingDeptId);
    this.departmentModel = {
      id: dept.id,
      departmentName: dept.departmentName,
      departmentCode: dept.departmentCode,
      location: dept.location
    };
  }
  onDelete(id: number) {
  

  this.service.deleteDepartment(id).subscribe({
    next: (res: any) => {
      this.toastr.success(res?.message || 'Department deleted successfully', 'Success');
      this.fetchdepartment();  // Refresh table
    },
    error: (err) => {
      this.toastr.error(err?.error?.message || 'Failed to delete department', 'Error');
    }
  });
}

}
