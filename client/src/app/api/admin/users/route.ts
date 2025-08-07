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
        const role = searchParams.get('role');
        const isActive = searchParams.get('isActive');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        // In production, implement actual database queries
        // Example with Mongoose:
        // const query: any = {};
        // if (role) query.role = role;
        // if (isActive !== null) query.isActive = isActive === 'true';
        // if (search) {
        //   query.$or = [
        //     { name: { $regex: search, $options: 'i' } },
        //     { email: { $regex: search, $options: 'i' } }
        //   ];
        // }

        // const users = await User.find(query)
        //   .sort({ createdAt: -1 })
        //   .skip((page - 1) * limit)
        //   .limit(limit)
        //   .populate('profile');

        // const total = await User.countDocuments(query);

        // Mock data for development
        const mockUsers = [
            {
                _id: "1",
                name: "Батбаяр Мөнх",
                email: "batbayar@example.com",
                role: "mentor",
                isActive: true,
                createdAt: "2024-01-15T00:00:00Z",
                updatedAt: "2024-01-15T00:00:00Z"
            },
            {
                _id: "2",
                name: "Болормаа Цэрэн",
                email: "bolormaa@example.com",
                role: "student",
                isActive: true,
                createdAt: "2024-01-20T00:00:00Z",
                updatedAt: "2024-01-20T00:00:00Z"
            }
        ];

        // Filter mock data based on parameters
        let filteredUsers = mockUsers;
        if (role) {
            filteredUsers = filteredUsers.filter(user => user.role === role);
        }
        if (isActive !== null) {
            filteredUsers = filteredUsers.filter(user => user.isActive === (isActive === 'true'));
        }
        if (search) {
            const searchLower = search.toLowerCase();
            filteredUsers = filteredUsers.filter(user =>
                user.name.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower)
            );
        }

        return NextResponse.json({
            success: true,
            data: filteredUsers,
            pagination: {
                page,
                limit,
                total: filteredUsers.length,
                pages: Math.ceil(filteredUsers.length / limit)
            }
        });

    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}