import { NextRequest, NextResponse } from "next/server";

// Mock booking data generator
function generateBookings(count: number = 200) {
    const statuses = ["confirmed", "pending", "completed", "cancelled", "no-show"];
    const subjects = [
        "Математик", "Физик", "Хими", "Биологи", "Англи хэл",
        "Монгол хэл", "Түүх", "География", "Компьютер", "Эдийн засаг"
    ];
    const mentorNames = [
        "Доктор Сарангэрэл", "Профессор Энхбаяр", "Магистр Оюунаа",
        "Доктор Батбаяр", "Профессор Цэцэг", "Багш Мөнхбат",
        "Доктор Энхжин", "Профессор Болд", "Магистр Цэцэг"
    ];
    const studentNames = [
        "Болд Батбаяр", "Цэцэг Мөнхбат", "Ганбат Төмөр", "Нарангэрэл Баяр",
        "Мөнхзул Батсайхан", "Оюунаа Дэлгэр", "Энхбаяр Цагаан", "Сарангэрэл Бат",
        "Батбаяр Мөнх", "Төмөр Болд", "Баяр Цэцэг", "Жавхлан Энх"
    ];
    const sessionTypes = ["Ганцаарчилсан", "Бүлгийн", "Онлайн", "Биечлэн"];
    const paymentMethods = ["Карт", "Дансаар", "Бэлэн", "Цахим хэтэвч"];

    const bookings = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
        const bookingDate = new Date(now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000);
        const sessionDate = new Date(bookingDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
        const duration = [60, 90, 120][Math.floor(Math.random() * 3)]; // 1, 1.5, or 2 hours
        const hourlyRate = (Math.floor(Math.random() * 150) + 50) * 1000; // 50k - 200k
        const totalAmount = (hourlyRate * duration) / 60;
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const mentorName = mentorNames[Math.floor(Math.random() * mentorNames.length)];
        const studentName = studentNames[Math.floor(Math.random() * studentNames.length)];
        const sessionType = sessionTypes[Math.floor(Math.random() * sessionTypes.length)];
        const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

        // Calculate session end time
        const sessionEndDate = new Date(sessionDate.getTime() + duration * 60 * 1000);

        bookings.push({
            id: `BK${String(i + 1).padStart(4, '0')}`,
            studentId: `STD${String(Math.floor(Math.random() * 300) + 1).padStart(4, '0')}`,
            studentName,
            mentorId: `MNT${String(Math.floor(Math.random() * 200) + 1).padStart(4, '0')}`,
            mentorName,
            subject,
            sessionType,
            status,
            bookingDate: bookingDate.toISOString(),
            sessionDate: sessionDate.toISOString(),
            sessionEndDate: sessionEndDate.toISOString(),
            duration, // in minutes
            hourlyRate,
            totalAmount,
            paymentStatus: status === "completed" ? "paid" :
                status === "cancelled" ? "refunded" :
                    status === "no-show" ? "paid" : "pending",
            paymentMethod,
            paymentId: `PAY${String(i + 1).padStart(6, '0')}`,
            meetingLink: sessionType === "Онлайн" ? `https://meet.google.com/xyz-${i + 1}` : null,
            location: sessionType === "Биечлэн" ? `${Math.floor(Math.random() * 9) + 1}-р хороо, ${Math.floor(Math.random() * 20) + 1}-р байр` : null,
            notes: Math.random() > 0.7 ? "Тусгай анхааралтай асуудал байна" : "",
            rating: status === "completed" ? Math.floor(Math.random() * 2) + 4 : null, // 4 or 5 stars for completed
            feedback: status === "completed" && Math.random() > 0.5 ? "Маш сайн хичээл байлаа" : "",
            cancellationReason: status === "cancelled" ?
                ["Цаг тохирохгүй болсон", "Эмнэлэгт очих шаардлагатай", "Гэнэтийн ажил гарсан"][Math.floor(Math.random() * 3)] : null,
            noShowReason: status === "no-show" ?
                ["Суралцагч ирээгүй", "Багш ирээгүй", "Техникийн асуудал"][Math.floor(Math.random() * 3)] : null,
            rescheduleCount: Math.floor(Math.random() * 3), // 0-2 times rescheduled
            isRecurring: Math.random() > 0.8, // 20% are recurring sessions
            recurringPattern: Math.random() > 0.8 ? ["Долоо хоног бүр", "2 долоо хоног бүр"][Math.floor(Math.random() * 2)] : null,
            preparationMaterials: Math.random() > 0.6 ? "Математикийн даалгаварын ном, тэмдэглэлийн дэвтэр" : "",
            sessionGoals: `${subject} хичээлийн ${Math.floor(Math.random() * 5) + 1}-р бүлгийг судлах`,
            actualDuration: status === "completed" ? duration + Math.floor(Math.random() * 20) - 10 : null, // ±10 minutes
            attendanceStatus: status === "completed" ? "Бүрэн" :
                status === "no-show" ? "Ирээгүй" :
                    status === "cancelled" ? "Цуцлагдсан" : "Хүлээгдэж буй",
            sessionRecording: sessionType === "Онлайн" && status === "completed" && Math.random() > 0.7 ?
                `https://recordings.mentor.mn/session-${i + 1}.mp4` : null,
            homeworkAssigned: status === "completed" && Math.random() > 0.5 ? "Дараагийн хичээлд бэлдэх даалгавар" : null,
            nextSessionDate: status === "completed" && Math.random() > 0.6 ?
                new Date(sessionDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() : null,
        });
    }

    return bookings.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const status = searchParams.get("status");
        const search = searchParams.get("search");
        const subject = searchParams.get("subject");
        const sessionType = searchParams.get("sessionType");
        const dateRange = searchParams.get("dateRange") || "30d";
        const sortBy = searchParams.get("sortBy") || "bookingDate";
        const sortOrder = searchParams.get("sortOrder") || "desc";

        // Generate all bookings
        let allBookings = generateBookings(500);

        // Apply date range filter
        const now = new Date();
        let startDate: Date;
        switch (dateRange) {
            case "7d":
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case "30d":
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case "90d":
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case "1y":
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        allBookings = allBookings.filter(booking =>
            new Date(booking.bookingDate) >= startDate
        );

        // Apply filters
        if (status && status !== "all") {
            allBookings = allBookings.filter(booking => booking.status === status);
        }

        if (subject && subject !== "all") {
            allBookings = allBookings.filter(booking => booking.subject === subject);
        }

        if (sessionType && sessionType !== "all") {
            allBookings = allBookings.filter(booking => booking.sessionType === sessionType);
        }

        if (search) {
            const searchLower = search.toLowerCase();
            allBookings = allBookings.filter(booking =>
                booking.studentName.toLowerCase().includes(searchLower) ||
                booking.mentorName.toLowerCase().includes(searchLower) ||
                booking.subject.toLowerCase().includes(searchLower) ||
                booking.id.toLowerCase().includes(searchLower)
            );
        }

        // Apply sorting
        allBookings.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case "studentName":
                    aValue = a.studentName;
                    bValue = b.studentName;
                    break;
                case "mentorName":
                    aValue = a.mentorName;
                    bValue = b.mentorName;
                    break;
                case "sessionDate":
                    aValue = new Date(a.sessionDate).getTime();
                    bValue = new Date(b.sessionDate).getTime();
                    break;
                case "totalAmount":
                    aValue = a.totalAmount;
                    bValue = b.totalAmount;
                    break;
                case "bookingDate":
                default:
                    aValue = new Date(a.bookingDate).getTime();
                    bValue = new Date(b.bookingDate).getTime();
                    break;
            }

            if (sortOrder === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        // Calculate pagination
        const totalCount = allBookings.length;
        const totalPages = Math.ceil(totalCount / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedBookings = allBookings.slice(startIndex, endIndex);

        // Calculate stats
        const stats = {
            total: allBookings.length,
            confirmed: allBookings.filter(b => b.status === "confirmed").length,
            pending: allBookings.filter(b => b.status === "pending").length,
            completed: allBookings.filter(b => b.status === "completed").length,
            cancelled: allBookings.filter(b => b.status === "cancelled").length,
            noShow: allBookings.filter(b => b.status === "no-show").length,
            totalRevenue: allBookings.filter(b => b.paymentStatus === "paid").reduce((sum, b) => sum + b.totalAmount, 0),
            averageBookingValue: allBookings.reduce((sum, b) => sum + b.totalAmount, 0) / allBookings.length,
            completionRate: (allBookings.filter(b => b.status === "completed").length / allBookings.length) * 100,
            cancellationRate: (allBookings.filter(b => b.status === "cancelled").length / allBookings.length) * 100,
            noShowRate: (allBookings.filter(b => b.status === "no-show").length / allBookings.length) * 100,
            averageRating: allBookings.filter(b => b.rating).reduce((sum, b) => sum + (b.rating || 0), 0) /
                allBookings.filter(b => b.rating).length || 0,
        };

        // Get unique values for filter options
        const subjects = [...new Set(allBookings.map(b => b.subject))].sort();
        const sessionTypes = [...new Set(allBookings.map(b => b.sessionType))].sort();

        return NextResponse.json({
            success: true,
            data: {
                bookings: paginatedBookings,
                stats,
                subjects,
                sessionTypes,
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
                    subject,
                    sessionType,
                    dateRange,
                    sortBy,
                    sortOrder,
                },
                lastUpdated: new Date().toISOString(),
            }
        });

    } catch (error) {
        console.error("Admin bookings API error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch bookings data" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, bookingId, data } = body;

        switch (action) {
            case "confirm":
                // Confirm pending booking
                return NextResponse.json({
                    success: true,
                    message: `Захиалга ${bookingId} баталгаажлаа`,
                });

            case "cancel":
                // Cancel booking
                return NextResponse.json({
                    success: true,
                    message: `Захиалга ${bookingId} цуцлагдлаа`,
                });

            case "reschedule":
                // Reschedule booking
                return NextResponse.json({
                    success: true,
                    message: `Захиалга ${bookingId} дахин товлогдлоо`,
                    newSessionDate: data.newSessionDate,
                });

            case "markCompleted":
                // Mark as completed
                return NextResponse.json({
                    success: true,
                    message: `Захиалга ${bookingId} дууссан гэж тэмдэглэгдлээ`,
                });

            case "markNoShow":
                // Mark as no-show
                return NextResponse.json({
                    success: true,
                    message: `Захиалга ${bookingId} ирээгүй гэж тэмдэглэгдлээ`,
                });

            case "addNote":
                // Add admin note to booking
                return NextResponse.json({
                    success: true,
                    message: `Захиалгад тэмдэглэл нэмэгдлээ`,
                });

            case "processRefund":
                // Process refund for cancelled booking
                return NextResponse.json({
                    success: true,
                    message: `Захиалга ${bookingId}-д мөнгө буцаагдлаа`,
                    refundId: `REF${Date.now()}`,
                });

            case "sendReminder":
                // Send reminder to student/mentor
                return NextResponse.json({
                    success: true,
                    message: `Захиалга ${bookingId}-д сануулга илгээгдлээ`,
                });

            case "export":
                // Generate export
                return NextResponse.json({
                    success: true,
                    exportUrl: `/api/admin/export/bookings?${new URLSearchParams(data).toString()}`,
                    message: "Захиалгын жагсаалт экспорт хийгдлээ",
                });

            default:
                return NextResponse.json(
                    { success: false, error: "Invalid action" },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error("Admin bookings POST error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to process booking action" },
            { status: 500 }
        );
    }
}