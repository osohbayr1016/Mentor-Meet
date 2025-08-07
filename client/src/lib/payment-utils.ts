/**
 * Utility functions for handling payment success flow with Google Meet integration
 */

interface BookingDetails {
    bookingId: string;
    mentorEmail: string;
    studentEmail: string;
    date: string; // YYYY-MM-DD format
    time: string; // HH:MM format
    duration: number; // minutes
}

/**
 * Generates the payment success URL with booking details for Google Meet generation
 */
export function generatePaymentSuccessUrl(bookingDetails: BookingDetails): string {
    const baseUrl = '/payment-successfully';
    const params = new URLSearchParams({
        bookingId: bookingDetails.bookingId,
        mentorEmail: bookingDetails.mentorEmail,
        studentEmail: bookingDetails.studentEmail,
        date: bookingDetails.date,
        time: bookingDetails.time,
        duration: bookingDetails.duration.toString()
    });

    return `${baseUrl}?${params.toString()}`;
}

/**
 * Redirects to payment success page with booking details
 */
export function redirectToPaymentSuccess(bookingDetails: BookingDetails) {
    const url = generatePaymentSuccessUrl(bookingDetails);
    window.location.href = url;
}

/**
 * Example usage in your payment completion handler:
 * 
 * // After successful payment
 * const bookingDetails = {
 *   bookingId: "booking_123",
 *   mentorEmail: "mentor@example.com",
 *   studentEmail: "student@example.com",
 *   date: "2025-08-10",
 *   time: "14:00",
 *   duration: 60
 * };
 * 
 * redirectToPaymentSuccess(bookingDetails);
 */