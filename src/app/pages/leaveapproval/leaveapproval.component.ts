import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeaveRequestService } from '../../core/services/leave-request.service';
import { UserStats } from '../../core/Models/UserStats.model';
import { LeaveResponseDTO } from '../../core/Models/LeaveResponseDTO.model';

declare const bootstrap: any;
type FilterType = 'Pending' | 'Approved' | 'Rejected' | 'all';

@Component({
  selector: 'app-leaveapproval',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './leaveapproval.component.html',
  styleUrl: './leaveapproval.component.css'
})
export class LeaveapprovalComponent implements OnInit, AfterViewInit {
  
  private readonly leaveservice = inject(LeaveRequestService);
  readonly userStats = signal<UserStats | null>(null);
  leaveList: LeaveResponseDTO[] = [];
  @ViewChild('rejectModal') rejectModalRef!: ElementRef<HTMLDivElement>;
  @ViewChild('approveModal') approveModalRef!: ElementRef<HTMLDivElement>;
  @ViewChild('actionToast') actionToastRef!: ElementRef<HTMLDivElement>;

    private rejectModal: any;
   private approveModal: any;
   private toast: any;

  

  activeFilter: FilterType = 'Pending';
  searchTerm = '';
  selectedType = 'All types';
  leaveTypes = ['All types', 'Casual', 'Sick', 'Earned'];

  currentId: number | null = null;
  rejectReasonText = '';
  approveNoteText = '';
  toastMessage = 'Done.';

  loadUserStats(): void {

    this.leaveservice.getUserStats().subscribe({
      next: (response) => {
        this.userStats.set(response);
        
      },
      error: () => {
        console.log("error");
        
      }
    });
  }
  getLeaveList() {

    this.leaveservice
      .getLeaveListByManager().subscribe({
        next: (response) => {
          this.leaveList = response;
          console.log(response);
        },
        error: (error) => {
          console.error(error);
        }
      });

  }

  get filteredRequests(): LeaveResponseDTO[] {
    let list = this.activeFilter === 'all'
      ? this.leaveList
      : this.leaveList.filter(r => r.status === this.activeFilter);

    if (this.selectedType !== 'All types') {
      
      list = list.filter(x =>
      x.leaveName.toLowerCase().includes(this.selectedType.toLowerCase())
    );
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      list = list.filter(r =>
        r.fullName.toLowerCase().includes(term) ||
        r.leaveName.toLowerCase().includes(term) ||
        r.reason.toLowerCase().includes(term)
      );
    }

    return list;
  }

  get currentRequest(): LeaveResponseDTO | undefined {
    return this.leaveList.find(r => r.leaveHistroyId === this.currentId);
  }
  ngOnInit(): void {
    this.loadUserStats();
    this.getLeaveList();
  }
  ngAfterViewInit(): void {
     this.rejectModal = new bootstrap.Modal(this.rejectModalRef.nativeElement);
     this.approveModal = new bootstrap.Modal(this.approveModalRef.nativeElement);
     this.toast = new bootstrap.Toast(this.actionToastRef.nativeElement);
  }
  setFilter(filter: FilterType): void {
    this.activeFilter = filter;
  }

  openReject(id: number): void {
    this.currentId = id;
    this.rejectReasonText = '';
    this.rejectModal.show();
  }

  openApprove(id: number): void {
    this.currentId = id;
    this.approveNoteText = '';
    this.approveModal.show();
  }

  confirmReject(): void {

  if (this.currentId == null) return;

  this.leaveservice.updateLeaveStatus('Rejected', this.currentId)
    .subscribe({
      next: (res) => {

        const r = this.currentRequest;

        if (r) {
          r.status = 'Rejected';
          this.toastMessage = `Rejected ${r.fullName}'s request.`;
        } else {
          this.toastMessage = 'Leave rejected successfully.';
        }

        this.rejectModal.hide();
        this.toast.show();

        this.loadUserStats();
        this.getLeaveList();
      },
      error: (err) => {
        console.error(err);

        this.toastMessage = 'Failed to reject leave.';
        this.toast.show();
      }
    });

}

  confirmApprove(): void {
  if (this.currentId == null) return;

  this.leaveservice.updateLeaveStatus('Approved', this.currentId)
    .subscribe({
      next: (res) => {

        const r = this.currentRequest;

        if (r) {
          r.status = 'Approved';
          this.toastMessage = `Approved ${r.fullName}'s request.`;
        } else {
          this.toastMessage = 'Leave approved successfully.';
        }

        this.approveModal.hide();
        this.toast.show();

        this.loadUserStats();
        this.getLeaveList();
      },
      error: (err) => {
        console.error(err);
        this.toastMessage = 'Failed to approve leave.';
        this.toast.show();
      }
    });
}

  trackById(index: number, item: LeaveResponseDTO): number {
    return item.leaveHistroyId;
  }
}
