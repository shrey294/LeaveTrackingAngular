export interface LeaveResponseDTO {
  leaveHistroyId: number;
  fullName: string;
  alias: string;
  leaveName: string;
  status: string;
  leaveDate?: string;
  startDate?: string;
  endDate?: string;
  days: string;
  reason: string;
}