# Mentor Calendar - Disabled Time Slots Functionality

## Overview

This implementation adds functionality to disable time slots in the mentor calendar that are either:

1. Already booked by other students
2. Past time slots (for today's date)

## Features

### 1. Visual Indicators

- **White borders**: Available time slots
- **Green borders**: Selected time slots
- **Red borders**: Dates with booked time slots
- **Gray slots**: Disabled time slots (booked or past)

### 2. Smart Disabling Logic

- Automatically disables time slots that are already booked
- Disables past time slots for today's date
- Prevents users from selecting disabled slots
- Shows tooltips explaining why a slot is disabled

### 3. Real-time Updates

- Fetches booked slots from the server
- Updates the calendar when bookings are completed
- Handles loading states and error cases

## API Endpoints

### GET `/mentor-booked-slots/:mentorId`

Returns booked time slots for a specific mentor.

**Response:**

```json
{
  "success": true,
  "message": "Booked slots retrieved successfully",
  "data": {
    "04": ["09:00", "10:00"],
    "05": ["14:00", "15:00"]
  }
}
```

## Components

### 1. MentorCalendar.tsx

Main calendar component with disabled slots functionality.

**Props:**

- `mentorId`: ID of the mentor
- `onTimeSelect`: Callback when time slot is selected
- `selectedTimesByDate`: Currently selected time slots
- `onBookingComplete`: Callback when booking is completed

### 2. TimeSlotStatus.tsx

Individual time slot component with tooltips and disabled states.

**Props:**

- `time`: Time slot (e.g., "09:00")
- `date`: Date (e.g., "04")
- `isDisabled`: Whether the slot is disabled
- `isSelected`: Whether the slot is selected
- `onClick`: Click handler
- `disabledReason`: Reason for being disabled

## Usage Example

```tsx
import MentorCalendar from "@/components/MentorCalendar";

function MentorPage() {
  const [selectedTimesByDate, setSelectedTimesByDate] = useState({});

  const handleTimeSelect = (date: string, time: string) => {
    // Handle time selection
  };

  const handleBookingComplete = () => {
    // Refresh calendar after booking
  };

  return (
    <MentorCalendar
      mentorId="mentor-123"
      onTimeSelect={handleTimeSelect}
      selectedTimesByDate={selectedTimesByDate}
      onBookingComplete={handleBookingComplete}
    />
  );
}
```

## Database Schema

The booking model includes:

- `mentorId`: Reference to mentor
- `studentId`: Reference to student
- `date`: Booking date
- `times`: Array of time slots
- `status`: Booking status (PENDING, CONFIRMED, CANCELLED, COMPLETED)

## Error Handling

- Network errors are handled gracefully
- Loading states are shown during API calls
- Invalid mentor IDs return appropriate error messages
- Duplicate time slots are automatically removed

## Testing

Visit `/test-calendar` to see a working demo of the functionality.

## Future Improvements

1. Add real-time updates using WebSocket
2. Implement recurring bookings
3. Add timezone support
4. Add booking conflicts detection
5. Implement booking cancellation functionality
