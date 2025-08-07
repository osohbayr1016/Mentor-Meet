// Admin Panel Types
export interface User {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "mentor" | "student";
    createdAt: string;
    updatedAt: string;
    avatar?: string;
    isActive: boolean;
}

export interface MentorProfile {
    _id: string;
    userId: string;
    user?: User;
    category: string;
    subcategory?: string;
    experience: string;
    bio: string;
    hourlyRate: number;
    approved: boolean;
    profileImage?: string;
    specializations: string[];
    totalBookings: number;
    rating: number;
    totalEarnings: number;
    createdAt: string;
    updatedAt: string;
}

export interface Booking {
    _id: string;
    studentId: string;
    mentorId: string;
    student?: User;
    mentor?: User;
    mentorProfile?: MentorProfile;
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
    amount: number;
    status: "pending" | "confirmed" | "completed" | "cancelled" | "refunded";
    paymentStatus: "pending" | "paid" | "refunded" | "failed";
    meetingLink?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AdminStats {
    totalUsers: number;
    totalMentors: number;
    totalStudents: number;
    totalBookings: number;
    totalRevenue: number;
    monthlyRevenue: number;
    pendingMentorApprovals: number;
    activeBookings: number;
    completedBookings: number;
    averageRating: number;
    recentSignups: number;
    conversionRate: number;
}

export interface AdminUser extends User {
    role: "admin";
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

// Filter and Search Types
export interface UserFilters {
    role?: "mentor" | "student" | "admin";
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
}

export interface BookingFilters {
    status?: Booking["status"];
    paymentStatus?: Booking["paymentStatus"];
    mentorId?: string;
    studentId?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export interface MentorFilters {
    approved?: boolean;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
}