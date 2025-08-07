import { NextRequest, NextResponse } from "next/server";

// Mock payment data generator
function generatePayments(count: number = 50) {
  const statuses = ["completed", "pending", "failed", "refunded"];
  const methods = ["card", "bank", "wallet"];
  const students = [
    "Болд Батбаяр", "Цэцэг Мөнхбат", "Ганбат Төмөр", "Нарангэрэл Баяр", 
    "Мөнхзул Батсайхан", "Оюунаа Дэлгэр", "Энхбаяр Цагаан", "Сарангэрэл Бат"
  ];
  const mentors = [
    "Доктор Сарангэрэл", "Профессор Энхбаяр", "Магистр Оюунаа", 
    "Доктор Батбаяр", "Профессор Цэцэг", "Багш Мөнхбат"
  ];

  const payments = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const randomDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const amount = Math.floor(Math.random() * 300000) + 50000; // 50k - 350k
    
    payments.push({
      id: `PAY${String(i + 1).padStart(4, '0')}`,
      studentName: students[Math.floor(Math.random() * students.length)],
      mentorName: mentors[Math.floor(Math.random() * mentors.length)],
      amount,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      method: methods[Math.floor(Math.random() * methods.length)],
      date: randomDate.toISOString(),
      bookingId: `BK${String(i + 1).padStart(4, '0')}`,
      transactionId: `TXN${Date.now()}${i}`,
      fees: Math.floor(amount * 0.03), // 3% fee
      netAmount: Math.floor(amount * 0.97),
    });
  }

  return payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const dateRange = searchParams.get("dateRange") || "30d";

    // Generate all payments
    let allPayments = generatePayments(200);

    // Apply filters
    if (status && status !== "all") {
      allPayments = allPayments.filter(payment => payment.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      allPayments = allPayments.filter(payment => 
        payment.studentName.toLowerCase().includes(searchLower) ||
        payment.mentorName.toLowerCase().includes(searchLower) ||
        payment.transactionId.toLowerCase().includes(searchLower) ||
        payment.bookingId.toLowerCase().includes(searchLower)
      );
    }

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

    allPayments = allPayments.filter(payment => 
      new Date(payment.date) >= startDate
    );

    // Calculate pagination
    const totalCount = allPayments.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPayments = allPayments.slice(startIndex, endIndex);

    // Calculate stats
    const stats = {
      totalRevenue: allPayments
        .filter(p => p.status === "completed")
        .reduce((sum, p) => sum + p.amount, 0),
      totalTransactions: allPayments.length,
      completedTransactions: allPayments.filter(p => p.status === "completed").length,
      pendingAmount: allPayments
        .filter(p => p.status === "pending")
        .reduce((sum, p) => sum + p.amount, 0),
      refundedAmount: allPayments
        .filter(p => p.status === "refunded")
        .reduce((sum, p) => sum + p.amount, 0),
      successRate: allPayments.length > 0 
        ? (allPayments.filter(p => p.status === "completed").length / allPayments.length * 100)
        : 0,
      totalFees: allPayments
        .filter(p => p.status === "completed")
        .reduce((sum, p) => sum + p.fees, 0),
    };

    return NextResponse.json({
      success: true,
      data: {
        payments: paginatedPayments,
        stats,
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
          dateRange,
        },
        lastUpdated: new Date().toISOString(),
      }
    });

  } catch (error) {
    console.error("Admin payments API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch payments data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, paymentId, data } = body;

    switch (action) {
      case "refund":
        // Process refund
        return NextResponse.json({
          success: true,
          message: `Payment ${paymentId} refunded successfully`,
          refundId: `REF${Date.now()}`
        });

      case "retry":
        // Retry failed payment
        return NextResponse.json({
          success: true,
          message: `Payment ${paymentId} retry initiated`
        });

      case "export":
        // Generate export
        return NextResponse.json({
          success: true,
          exportUrl: `/api/admin/export/payments?${new URLSearchParams(data).toString()}`,
          message: "Payment export generated successfully"
        });

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Admin payments POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process payment action" },
      { status: 500 }
    );
  }
}