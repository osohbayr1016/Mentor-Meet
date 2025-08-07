export type MeetingStatus = "scheduled" | "cancelled" | "completed";

// 🔁 UI-д ашиглагдах уулзалтын format
export interface Meeting {
  id: string;
  date: string;
  day: string;
  time: string;
  studentEmail: string;
  status: MeetingStatus;
}

// 🛠 API-аас ирдэг уулзалтын формат (backend JSON)
export interface MeetingApiResponse {
  _id: string;
  scheduledAt: string;
  studentId: { email: string } | string;
  status: "PENDING" | "CANCELLED" | "COMPLETED";
}
