import { NextRequest, NextResponse } from "next/server";

interface MentorAvailability {
    mentorId: string;
    mentorName: string;
    mentorEmail: string;
    date: string;
    time: string;
    category: string;
    price: number;
    description?: string;
    experience: string;
    rating: number;
    profession: string;
    image: string;
}

export async function GET(request: NextRequest) {
    try {
        // Get query parameters
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");

        // Mock data - in real implementation, this would come from your database
        const mockMentors: MentorAvailability[] = [
            {
                mentorId: "1",
                mentorName: "Ч. Энхжин",
                mentorEmail: "enkhe@example.com",
                date: "08/15",
                time: "14:00",
                category: "programming",
                price: 50000,
                description: "5 жилийн туршлагатай программист",
                experience: "8 жил",
                rating: 4.9,
                profession: "Эмч, Нийгмийн эрүүл мэндийн судлаач",
                image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=64&h=64&fit=crop&crop=face"
            },
            {
                mentorId: "2",
                mentorName: "Б. Сүхээ",
                mentorEmail: "sukhee@example.com",
                date: "08/16",
                time: "10:00",
                category: "business",
                price: 75000,
                description: "Стартап болон бизнес стратеги",
                experience: "12 жил",
                rating: 4.8,
                profession: "Бизнес зөвлөгч, Маркетингийн мэргэжилтэн",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
            },
            {
                mentorId: "3",
                mentorName: "А. Алтанцэцэг",
                mentorEmail: "altan@example.com",
                date: "08/17",
                time: "16:00",
                category: "design",
                price: 60000,
                description: "UI/UX дизайнер",
                experience: "6 жил",
                rating: 4.7,
                profession: "График дизайнер, UI/UX мэргэжилтэн",
                image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
            },
            {
                mentorId: "4",
                mentorName: "Т. Төгс",
                mentorEmail: "tugs@example.com",
                date: "08/18",
                time: "11:00",
                category: "programming",
                price: 45000,
                description: "Боловсролын зөвлөгөө",
                experience: "4 жил",
                rating: 4.6,
                profession: "Программчлалын багш, Технологийн зөвлөгч",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
            },
            {
                mentorId: "5",
                mentorName: "Д. Бат-Эрдэнэ",
                mentorEmail: "bat@example.com",
                date: "08/19",
                time: "13:00",
                category: "law",
                price: 80000,
                description: "Хуульч, эрх зүйн зөвлөгч",
                experience: "15 жил",
                rating: 4.9,
                profession: "Хуульч, Эрх зүйн зөвлөгч",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face"
            },
            {
                mentorId: "6",
                mentorName: "Н. Мөнх-Эрдэнэ",
                mentorEmail: "monkh@example.com",
                date: "08/20",
                time: "15:00",
                category: "health",
                price: 90000,
                description: "Эмч, эрүүл мэндийн зөвлөгч",
                experience: "10 жил",
                rating: 4.8,
                profession: "Эмч, Эрүүл мэндийн зөвлөгч",
                image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=64&h=64&fit=crop&crop=face"
            }
        ];

        // Filter mentors based on query parameters
        let filteredMentors = mockMentors;

        if (category && category !== "all") {
            filteredMentors = filteredMentors.filter(mentor =>
                mentor.category.toLowerCase().includes(category.toLowerCase())
            );
        }

        return NextResponse.json({
            success: true,
            mentors: filteredMentors,
            total: filteredMentors.length
        });

    } catch (error) {
        console.error("Error fetching available mentors:", error);
        return NextResponse.json(
            { error: "Failed to fetch available mentors" },
            { status: 500 }
        );
    }
} 