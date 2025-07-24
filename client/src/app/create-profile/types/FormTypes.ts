export interface SocialLinks {
    website: string;
    linkedin: string;
    twitter: string;
    github: string;
}

export interface BankAccount {
    bankName: string;
    accountNumber: string;
    accountName: string;
}

export interface FormData {
    // Step 1 fields
    firstName: string;
    lastNameInitial: string;
    nickname: string;
    showNickname: boolean;
    professionalField: string;
    experience: string;
    profession: string;
    bio: string;
    profileImage: File | null;

    // Step 2 fields
    description: string;
    socialLinks: SocialLinks;
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