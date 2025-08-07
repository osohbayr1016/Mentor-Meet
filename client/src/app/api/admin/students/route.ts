import { NextRequest, NextResponse } from "next/server";

// Mock student data generator
function generateStudents(count: number = 150) {
    const statuses = ["active", "inactive", "suspended", "pending"];
    const grades = ["9", "10", "11", "12", "Их сургууль", "Ажиллагч"];
    const firstNames = [
        "Болд", "Цэцэг", "Ганбат", "Нарангэрэл", "Мөнхзул",
        "Оюунаа", "Батбаяр", "Энхбаяр", "Сарангэрэл", "Дэлгэр",
        "Батсайхан", "Мөнхбат", "Төмөр", "Баяр", "Жавхлан"
    ];
    const lastNames = [
        "Батбаяр", "Мөнхбат", "Цэцэг", "Болд", "Энхбаяр",
        "Сарангэрэл", "Оюунаа", "Ганбат", "Нарангэрэл", "Дэлгэр"
    ];
    const interests = [
        "Математик", "Физик", "Хими", "Биологи", "Англи хэл",
        "Монгол хэл", "Түүх", "География", "Компьютер", "Урлаг"
    ];

    const students = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
        const joinDate = new Date(now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000);
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const grade = grades[Math.floor(Math.random() * grades.length)];
        const totalBookings = Math.floor(Math.random() * 50) + 1;
        const completedBookings = Math.floor(totalBookings * (0.7 + Math.random() * 0.3)); // 70-100% completion
        const totalSpent = completedBookings * (Math.floor(Math.random() * 100) + 50) * 1000; // 50k-150k per booking
        const averageRating = 3.5 + Math.random() * 1.5; // 3.5 - 5.0
        const studentInterests = interests.slice(0, Math.floor(Math.random() * 4) + 1);

        students.push({
            id: `STD${String(i + 1).padStart(4, '0')}`,
            name: `${firstName} ${lastName}`,
            email: `${firstName.toLowerCase()}${lastName.toLowerCase()}${i + 1}@student.mn`,
            phone: `${95000000 + Math.floor(Math.random() * 999999)}`,
            grade,
            school: `${Math.floor(Math.random() * 50) + 1}-р сургууль`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            joinDate: joinDate.toISOString(),
            totalBookings,
            completedBookings,
            canceledBookings: totalBookings - completedBookings,
            totalSpent,
            averageRating: Number(averageRating.toFixed(1)),
            interests: studentInterests,
            profileImage: `https://images.unsplash.com/photo-${1600000000000 + i}?w=64&h=64&fit=crop&crop=face`,
            parentName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} эцэг/эх`,
            parentPhone: `${99000000 + Math.floor(Math.random() * 999999)}`,
            parentEmail: `parent${i + 1}@email.mn`,
            address: `${Math.floor(Math.random() * 9) + 1}-р хороо, ${Math.floor(Math.random() * 20) + 1}-р байр`,
            district: ["Баянзүрх", "Сүхбаатар", "Хан-Уул", "Чингэлтэй", "Баянгол", "Сонгинохайрхан"][Math.floor(Math.random() * 6)],
            emergencyContact: `${99000000 + Math.floor(Math.random() * 999999)}`,
            medicalInfo: Math.random() > 0.8 ? "Харшлын асуудал байна" : "Тусгай анхааралтай асуудал байхгүй",
            preferredTime: ["Өглөө", "Өдөр", "Орой"][Math.floor(Math.random() * 3)],
            learningStyle: ["Визуал", "Аудио", "Кинестетик"][Math.floor(Math.random() * 3)],
            goals: `${grade} ангийн сурлагаа сайжруулах, шалгалтад бэлдэх`,
            lastActive: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            isVerified: Math.random() > 0.1, // 90% verified
            hasParentalConsent: Math.random() > 0.05, // 95% have consent
            subscriptionType: ["Basic", "Premium", "VIP"][Math.floor(Math.random() * 3)],
            referralSource: ["Найз", "Сошиал медиа", "Google", "Зар сурталчилгаа"][Math.floor(Math.random() * 4)],
        });
    }

    return students.sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const status = searchParams.get("status");
        const search = searchParams.get("search");
        const grade = searchParams.get("grade");
        const district = searchParams.get("district");
        const sortBy = searchParams.get("sortBy") || "joinDate";
        const sortOrder = searchParams.get("sortOrder") || "desc";

        // Generate all students
        let allStudents = generateStudents(300);

        // Apply filters
        if (status && status !== "all") {
            allStudents = allStudents.filter(student => student.status === status);
        }

        if (grade && grade !== "all") {
            allStudents = allStudents.filter(student => student.grade === grade);
        }

        if (district && district !== "all") {
            allStudents = allStudents.filter(student => student.district === district);
        }

        if (search) {
            const searchLower = search.toLowerCase();
            allStudents = allStudents.filter(student =>
                student.name.toLowerCase().includes(searchLower) ||
                student.email.toLowerCase().includes(searchLower) ||
                student.school.toLowerCase().includes(searchLower) ||
                student.id.toLowerCase().includes(searchLower) ||
                student.parentName.toLowerCase().includes(searchLower)
            );
        }

        // Apply sorting
        allStudents.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case "name":
                    aValue = a.name;
                    bValue = b.name;
                    break;
                case "totalBookings":
                    aValue = a.totalBookings;
                    bValue = b.totalBookings;
                    break;
                case "totalSpent":
                    aValue = a.totalSpent;
                    bValue = b.totalSpent;
                    break;
                case "averageRating":
                    aValue = a.averageRating;
                    bValue = b.averageRating;
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
        const totalCount = allStudents.length;
        const totalPages = Math.ceil(totalCount / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedStudents = allStudents.slice(startIndex, endIndex);

        // Calculate stats
        const stats = {
            total: allStudents.length,
            active: allStudents.filter(s => s.status === "active").length,
            inactive: allStudents.filter(s => s.status === "inactive").length,
            suspended: allStudents.filter(s => s.status === "suspended").length,
            pending: allStudents.filter(s => s.status === "pending").length,
            verified: allStudents.filter(s => s.isVerified).length,
            withParentalConsent: allStudents.filter(s => s.hasParentalConsent).length,
            totalRevenue: allStudents.reduce((sum, s) => sum + s.totalSpent, 0),
            totalBookings: allStudents.reduce((sum, s) => sum + s.totalBookings, 0),
            averageBookingsPerStudent: allStudents.reduce((sum, s) => sum + s.totalBookings, 0) / allStudents.length,
            averageSpentPerStudent: allStudents.reduce((sum, s) => sum + s.totalSpent, 0) / allStudents.length,
        };

        // Get unique values for filter options
        const grades = [...new Set(allStudents.map(s => s.grade))].sort();
        const districts = [...new Set(allStudents.map(s => s.district))].sort();

        return NextResponse.json({
            success: true,
            data: {
                students: paginatedStudents,
                stats,
                grades,
                districts,
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
                    grade,
                    district,
                    sortBy,
                    sortOrder,
                },
                lastUpdated: new Date().toISOString(),
            }
        });

    } catch (error) {
        console.error("Admin students API error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch students data" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, studentId, data } = body;

        switch (action) {
            case "activate":
                // Activate student
                return NextResponse.json({
                    success: true,
                    message: `Суралцагч ${studentId} идэвхжүүлэгдлээ`,
                });

            case "suspend":
                // Suspend student
                return NextResponse.json({
                    success: true,
                    message: `Суралцагч ${studentId} түр хаагдлаа`,
                });

            case "delete":
                // Delete student (soft delete)
                return NextResponse.json({
                    success: true,
                    message: `Суралцагч ${studentId} устгагдлаа`,
                });

            case "updateProfile":
                // Update student profile
                return NextResponse.json({
                    success: true,
                    message: `Суралцагчийн мэдээлэл шинэчлэгдлээ`,
                    data: { ...data, id: studentId },
                });

            case "sendMessage":
                // Send message to student/parent
                return NextResponse.json({
                    success: true,
                    message: `Суралцагч ${studentId}-д мессеж илгээгдлээ`,
                });

            case "addNote":
                // Add admin note
                return NextResponse.json({
                    success: true,
                    message: `Суралцагчид тэмдэглэл нэмэгдлээ`,
                });

            case "refund":
                // Process refund
                return NextResponse.json({
                    success: true,
                    message: `Суралцагч ${studentId}-д мөнгө буцаагдлаа`,
                    refundId: `REF${Date.now()}`,
                });

            case "export":
                // Generate export
                return NextResponse.json({
                    success: true,
                    exportUrl: `/api/admin/export/students?${new URLSearchParams(data).toString()}`,
                    message: "Суралцагчийн жагсаалт экспорт хийгдлээ",
                });

            default:
                return NextResponse.json(
                    { success: false, error: "Invalid action" },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error("Admin students POST error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to process student action" },
            { status: 500 }
        );
    }
}