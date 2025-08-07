import { NextRequest, NextResponse } from "next/server";
import { checkAdminPermission } from "../../../../lib/admin-auth";

export async function GET(request: NextRequest) {
    try {
        const { authorized, session } = await checkAdminPermission();

        if (!authorized) {
            return NextResponse.json(
                { success: false, message: "Admin access required" },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const approved = searchParams.get('approved');
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        // In production, implement actual database queries
        // Example with Mongoose:
        // const query: any = {};
        // if (approved !== null) query.approved = approved === 'true';
        // if (category) query.category = { $regex: category, $options: 'i' };
        // if (search) {
        //   query.$or = [
        //     { 'user.name': { $regex: search, $options: 'i' } },
        //     { 'user.email': { $regex: search, $options: 'i' } },
        //     { category: { $regex: search, $options: 'i' } }
        //   ];
        // }

        // const mentors = await MentorProfile.find(query)
        //   .populate('user')
        //   .sort({ createdAt: -1 })
        //   .skip((page - 1) * limit)
        //   .limit(limit);

        // const total = await MentorProfile.countDocuments(query);

        // Mock data for development
        const mockMentors = [
            {
                _id: "1",
                userId: "user1",
                user: {
                    _id: "user1",
                    name: "Батбаяр Мөнх",
                    email: "batbayar@example.com",
                    role: "mentor",
                    createdAt: "2024-01-15T00:00:00Z",
                    updatedAt: "2024-01-15T00:00:00Z",
                    isActive: true
                },
                category: "Програм хангамж",
                subcategory: "Web хөгжүүлэлт",
                experience: "5+ жил",
                bio: "Full-stack хөгжүүлэгч",
                hourlyRate: 50000,
                approved: true,
                specializations: ["React", "Node.js"],
                totalBookings: 45,
                rating: 4.8,
                totalEarnings: 2250000,
                createdAt: "2024-01-15T00:00:00Z",
                updatedAt: "2024-01-15T00:00:00Z"
            },
            {
                _id: "2",
                userId: "user2",
                user: {
                    _id: "user2",
                    name: "Сувдаа Болор",
                    email: "suvdaa@example.com",
                    role: "mentor",
                    createdAt: "2024-02-20T00:00:00Z",
                    updatedAt: "2024-02-20T00:00:00Z",
                    isActive: true
                },
                category: "Маркетинг",
                subcategory: "Digital Marketing",
                experience: "3+ жил",
                bio: "Digital маркетингийн мэргэжилтэн",
                hourlyRate: 40000,
                approved: false,
                specializations: ["SEO", "Google Ads"],
                totalBookings: 0,
                rating: 0,
                totalEarnings: 0,
                createdAt: "2024-02-20T00:00:00Z",
                updatedAt: "2024-02-20T00:00:00Z"
            }
        ];

        // Filter mock data based on parameters
        let filteredMentors = mockMentors;
        if (approved !== null) {
            filteredMentors = filteredMentors.filter(mentor => mentor.approved === (approved === 'true'));
        }
        if (category) {
            filteredMentors = filteredMentors.filter(mentor =>
                mentor.category.toLowerCase().includes(category.toLowerCase())
            );
        }
        if (search) {
            const searchLower = search.toLowerCase();
            filteredMentors = filteredMentors.filter(mentor =>
                mentor.user.name.toLowerCase().includes(searchLower) ||
                mentor.user.email.toLowerCase().includes(searchLower) ||
                mentor.category.toLowerCase().includes(searchLower)
            );
        }

        return NextResponse.json({
            success: true,
            data: filteredMentors,
            pagination: {
                page,
                limit,
                total: filteredMentors.length,
                pages: Math.ceil(filteredMentors.length / limit)
            }
        });

    } catch (error) {
        console.error("Error fetching mentors:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}