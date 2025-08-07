// 📌 Mentor профайлын бүтэц
export interface MentorProfile {
  id: string;
  firstName: string;
  lastName: string;
  nickName?: string;
  profession: string;
  bio: string;
  image: string;
  rating: number;
  experience: {
    work: string;
    position: string;
    careerDuration: string;
  };
  education: {
    schoolName: string;
    major: string;
    endedYear: string;
  };
  category: {
    categoryId: string;
    price: number;
  };
  email: string;
}

// 📌 Edit form-д ашиглагддаг локал төрлүүд
export type EditFormType = {
  firstName: string;
  lastName: string;
  nickName?: string;
  hourlyPrice: number;
  bio: string;
  profession: string;
  image: string;
  experience: {
    work: string;
    position: string;
    careerDuration: string;
  };
  education: {
    schoolName: string;
    major: string;
    endedYear: string;
  };
};

// 📌 Уулзалтын статусын төрөл
export type MeetingStatus = "scheduled" | "cancelled" | "completed";

// 📌 Уулзалтын төрөл (day-г optional болгосон)
export interface Meeting {
  id: string;
  date: string;
  day?: string; // ⬅️ Энэ мөрийг нэм
  time: string;
  studentEmail: string;
  status: "scheduled" | "cancelled" | "completed";
}

// 📌 ProfileView компонентын props
export interface ProfileViewProps {
  mentorProfile: MentorProfile | null;
  editForm: EditFormType;
  isEditing: boolean;
  setEditForm: React.Dispatch<React.SetStateAction<EditFormType>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: () => void;
  onCancel: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  error: string | null;
}
