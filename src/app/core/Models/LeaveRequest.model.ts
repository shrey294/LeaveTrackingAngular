export interface LeaveRequest {
  id: number;
  name: string;
  initials: string;
  type: string;
  duration: string;
  from: string;
  to: string;
  applied: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}