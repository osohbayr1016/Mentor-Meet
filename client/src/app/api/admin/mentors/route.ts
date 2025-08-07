import { NextRequest, NextResponse } from "next/server";

// Mock mentor data generator
function generateMentors(count: number = 100) {
    const statuses = ["active", "pending", "suspended", "inactive"];
    const specializations = [
        "Математик", "Физик", "Хими", "Биологи", "Англи хэл",
        "Монгол хэл", "Түүх", "География", "Компьютер", "Эдийн засаг"
    ];
    const firstNames = [
        "Батбаяр", "Энхбаяр", "Сарангэрэл", "Оюунаа", "Цэцэг",
        "Мөнхбат", "Болд", "Нарангэрэл", "Ганбат", "Дэлгэр"
    ];
    const lastNames = [
        "Доктор", "Профессор", "Магистр", "Багш", "Инженер"
    ];

    const mentors = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
        const joinDate = new Date(now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000);
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const specialization = specializations[Math.floor(Math.random() * specializations.length)];
        const totalBookings = Math.floor(Math.random() * 200) + 10;
        const hourlyRate = (Math.floor(Math.random() * 150) + 50) * 1000; // 50k - 200k
        const rating = 3.5 + Math.random() * 1.5; // 3.5 - 5.0
        const completionRate = 85 + Math.random() * 15; // 85% - 100%

        mentors.push({
            id: `MNT${String(i + 1).padStart(4, '0')}`,
            name: `${lastName} ${firstName}`,
            email: `${firstName.toLowerCase()}${i + 1}@mentor.mn`,
            phone: `${99000000 + Math.floor(Math.random() * 999999)}`,
            specialization,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            joinDate: joinDate.toISOString(),
            totalBookings,
            completedBookings: Math.floor(totalBookings * (completionRate / 100)),
            totalRevenue: totalBookings * hourlyRate * 0.8, // Assume 80% completion
            hourlyRate,
            rating: Number(rating.toFixed(1)),
            completionRate: Number(completionRate.toFixed(1)),
            responseTime: Math.floor(Math.random() * 60) + 5, // 5-65 minutes
            isVerified: Math.random() > 0.2, // 80% verified
            profileImage: `https://images.unsplash.com/photo-${1500000000000 + i}?w=64&h=64&fit=crop&crop=face`,
            bio: `Туршлагатай ${specialization.toLowerCase()} багш. ${Math.floor(Math.random() * 15) + 5} жилийн туршлагатай.`,
            education: ["Их сургууль", "Магистр", "Доктор"][Math.floor(Math.random() * 3)],
            experience: Math.floor(Math.random() * 20) + 1,
            languages: ["Монгол", "Англи", "Орос"].slice(0, Math.floor(Math.random() * 3) + 1),
            availability: {
                monday: Math.random() > 0.3,
                tuesday: Math.random() > 0.3,
                wednesday: Math.random() > 0.3,
                thursday: Math.random() > 0.3,
                friday: Math.random() > 0.3,
                saturday: Math.random() > 0.5,
                sunday: Math.random() > 0.5,
            },
            lastActive: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        });
    }

    return mentors.sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const status = searchParams.get("status");
        const search = searchParams.get("search");
        const specialization = searchParams.get("specialization");
        const sortBy = searchParams.get("sortBy") || "joinDate";
        const sortOrder = searchParams.get("sortOrder") || "desc";

        // Generate all mentors
        let allMentors = generateMentors(200);

        // Apply filters
        if (status && status !== "all") {
            allMentors = allMentors.filter(mentor => mentor.status === status);
        }

        if (specialization && specialization !== "all") {
            allMentors = allMentors.filter(mentor => mentor.specialization === specialization);
        }

        if (search) {
            const searchLower = search.toLowerCase();
            allMentors = allMentors.filter(mentor =>
                mentor.name.toLowerCase().includes(searchLower) ||
                mentor.email.toLowerCase().includes(searchLower) ||
                mentor.specialization.toLowerCase().includes(searchLower) ||
                mentor.id.toLowerCase().includes(searchLower)
            );
        }

        // Apply sorting
        allMentors.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case "name":
                    aValue = a.name;
                    bValue = b.name;
                    break;
                case "rating":
                    aValue = a.rating;
                    bValue = b.rating;
                    break;
                case "totalBookings":
                    aValue = a.totalBookings;
                    bValue = b.totalBookings;
                    break;
                case "totalRevenue":
                    aValue = a.totalRevenue;
                    bValue = b.totalRevenue;
                    break;
                case "joinDate":
                default:
                    aValue = new Date(a.joinDate).getTime();
                    bValue = new Date(b.joinDate).getTime();
                    break;
            }

            if (sortOrder === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        // Calculate pagination
        const totalCount = allMentors.length;
        const totalPages = Math.ceil(totalCount / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedMentors = allMentors.slice(startIndex, endIndex);

        // Calculate stats
        const stats = {
            total: allMentors.length,
            active: allMentors.filter(m => m.status === "active").length,
            pending: allMentors.filter(m => m.status === "pending").length,
            suspended: allMentors.filter(m => m.status === "suspended").length,
            inactive: allMentors.filter(m => m.status === "inactive").length,
            verified: allMentors.filter(m => m.isVerified).length,
            averageRating: allMentors.reduce((sum, m) => sum + m.rating, 0) / allMentors.length,
            totalRevenue: allMentors.reduce((sum, m) => sum + m.totalRevenue, 0),
            totalBookings: allMentors.reduce((sum, m) => sum + m.totalBookings, 0),
            averageResponseTime: allMentors.reduce((sum, m) => sum + m.responseTime, 0) / allMentors.length,
        };

        // Get unique specializations for filter options
        const specializations = [...new Set(allMentors.map(m => m.specialization))].sort();

        return NextResponse.json({
            success: true,
            data: {
                mentors: paginatedMentors,
                stats,
                specializations,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCount,
                    hasNext: page < totalPages,
                    hasPrev: page > 1,
                },
                filters: {
                    status,
                    search,
                    specialization,
                    sortBy,
                    sortOrder,
                },
                lastUpdated: new Date().toISOString(),
            }
        });

    } catch (error) {
        console.error("Admin mentors API error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch mentors data" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, mentorId, data } = body;

        switch (action) {
            case "approve":
                // Approve pending mentor
                return NextResponse.json({
                    success: true,
                    message: `Багш ${mentorId} амжилттай зөвшөөрөгдлөө`,
                });

            case "suspend":
                // Suspend mentor
                return NextResponse.json({
                    success: true,
                    message: `Багш ${mentorId} түр хаагдлаа`,
                });

            case "activate":
                // Activate mentor
                return NextResponse.json({
                    success: true,
                    message: `Багш ${mentorId} идэвхжүүлэгдлээ`,
                });

            case "delete":
                // Delete mentor (soft delete)
                return NextResponse.json({
                    success: true,
                    message: `Багш ${mentorId} устгагдлаа`,
                });

            case "updateProfile":
                // Update mentor profile
                return NextResponse.json({
                    success: true,
                    message: `Багшийн мэдээлэл шинэчлэгдлээ`,
                    data: { ...data, id: mentorId },
                });

            case "sendMessage":
                // Send message to mentor
                return NextResponse.json({
                    success: true,
                    message: `Багш ${mentorId}-д мессеж илгээгдлээ`,
                });

            case "export":
                // Generate export
                return NextResponse.json({
                    success: true,
                    exportUrl: `/api/admin/export/mentors?${new URLSearchParams(data).toString()}`,
                    message: "Багшийн жагсаалт экспорт хийгдлээ",
                });

            default:
                return NextResponse.json(
                    { success: false, error: "Invalid action" },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error("Admin mentors POST error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to process mentor action" },
            { status: 500 }
        );
    }
}