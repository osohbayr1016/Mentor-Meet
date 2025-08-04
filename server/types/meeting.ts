export enum MeetingStatus {
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export type MeetingType = {
  _id: string;
  categoryId: string;
  mentorId: string;
  studentId: string;
  status: MeetingStatus;
  duration: number;
  scheduledAt: Date;
};
