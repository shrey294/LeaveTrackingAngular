import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeaveRequestService } from '../../core/services/leave-request.service';
import { UserStats } from '../../core/Models/UserStats.model';
import { LeaveResponseDTO } from '../../core/Models/LeaveResponseDTO.model';

type LeaveStatus = 'pending' | 'approved' | 'rejected';

interface LeaveRequest {
  id: number;
  name: string;
  initials: string;
  type: string;
  duration: string;
  from: string;
  to: string;
  applied: string;
  status: LeaveStatus;
  reason: string;
}

type FilterType = LeaveStatus | 'all';

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

  // private rejectModal!: Modal;
  // private approveModal!: Modal;
  // private toast!: Toast;

  requests: LeaveRequest[] = [
    { id: 1, name: 'Ananya Sharma', initials: 'AS', type: 'Sick Leave', duration: '2 days', from: 'Jul 02', to: 'Jul 03', applied: '2 hours ago', status: 'pending', reason: 'Down with viral fever, doctor advised rest for two days.' },
    { id: 2, name: 'Rahul Verma', initials: 'RV', type: 'Casual Leave', duration: '1 day', from: 'Jul 05', to: 'Jul 05', applied: '5 hours ago', status: 'pending', reason: 'Personal errand at home, will be unreachable in the morning.' },
    { id: 3, name: 'Meera Iyer', initials: 'MI', type: 'Earned Leave', duration: '5 days', from: 'Jul 14', to: 'Jul 18', applied: '1 day ago', status: 'pending', reason: 'Family trip planned, all handover notes prepared.' },
    { id: 4, name: 'Karthik Nair', initials: 'KN', type: 'Hourly', duration: '3 hours', from: 'Jul 04 · 2:00 PM', to: '5:00 PM', applied: '1 day ago', status: 'pending', reason: 'Bank appointment for home loan documentation.' },
    { id: 5, name: 'Sneha Kapoor', initials: 'SK', type: 'Sick Leave', duration: '1 day', from: 'Jun 28', to: 'Jun 28', applied: '3 days ago', status: 'approved', reason: 'Migraine, medical certificate attached.' },
    { id: 6, name: 'Imran Sheikh', initials: 'IS', type: 'Casual Leave', duration: '2 days', from: 'Jun 24', to: 'Jun 25', applied: '6 days ago', status: 'rejected', reason: 'Insufficient coverage during release week.' }
  ];

  activeFilter: FilterType = 'pending';
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
        //this.loading.set(false);
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
          console.log(this.leaveList);
        },
        error: (error) => {
          console.error(error);
        }
      });

  }

  get filteredRequests(): LeaveRequest[] {
    let list = this.activeFilter === 'all'
      ? this.requests
      : this.requests.filter(r => r.status === this.activeFilter);

    if (this.selectedType !== 'All types') {
      list = list.filter(r => r.type.toLowerCase().includes(this.selectedType.toLowerCase()));
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      list = list.filter(r =>
        r.name.toLowerCase().includes(term) ||
        r.type.toLowerCase().includes(term) ||
        r.reason.toLowerCase().includes(term)
      );
    }

    return list;
  }

  get currentRequest(): LeaveRequest | undefined {
    return this.requests.find(r => r.id === this.currentId);
  }
  ngOnInit(): void {
    this.loadUserStats();
    this.getLeaveList();
  }
  ngAfterViewInit(): void {
    // this.rejectModal = new Modal(this.rejectModalRef.nativeElement);
    // this.approveModal = new Modal(this.approveModalRef.nativeElement);
    // this.toast = new Toast(this.actionToastRef.nativeElement);
  }
  setFilter(filter: FilterType): void {
    this.activeFilter = filter;
  }

  openReject(id: number): void {
    this.currentId = id;
    this.rejectReasonText = '';
    //this.rejectModal.show();
  }

  openApprove(id: number): void {
    this.currentId = id;
    this.approveNoteText = '';
    //this.approveModal.show();
  }

  confirmReject(): void {
    const r = this.currentRequest;
    if (!r) return;
    r.status = 'rejected';
    //this.rejectModal.hide();
    this.toastMessage = `Rejected ${r.name}'s request.`;
    //this.toast.show();
  }

  confirmApprove(): void {
    const r = this.currentRequest;
    if (!r) return;
    r.status = 'approved';
    //this.approveModal.hide();
    this.toastMessage = `Approved ${r.name}'s request.`;
    //this.toast.show();
  }

  trackById(index: number, item: LeaveRequest): number {
    return item.id;
  }
}
