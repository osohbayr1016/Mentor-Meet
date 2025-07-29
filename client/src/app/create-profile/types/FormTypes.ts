export interface SocialLinks {
  website?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface FormData {
  // Step 1 fields
  firstName: string;
  lastName: string;
  lastNameInitial: string; // Added missing property
  nickName?: string;
  nickname?: string; // Added for backward compatibility
  showNickName?: boolean;
  showNickname?: boolean; // Added for backward compatibility
  category: string;
  careerDuration: string;
  profession: string;
  bio: string;
  image: File | null;
  profileImage: File | null; // Added missing property
  professionalField: string; // Added missing property
  experience: string; // Added missing property

  // Step 2 fields
  description?: string;
  socialLinks: SocialLinks; // Made required with default empty object
  specialization: string;
  achievements: string;

  // Step 3 fields
  bankAccount: BankAccount;
  yearExperience: string;
}

export interface StepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  message: string;
  isLoading: boolean;
}

export interface Step1Props extends StepProps {
  onNext: () => void;
}

export interface Step2Props extends StepProps {
  onNext: () => void;
  onPrev: () => void;
}

export interface Step3Props extends StepProps {
  onPrev: () => void;
  onSubmit: () => void;
}
