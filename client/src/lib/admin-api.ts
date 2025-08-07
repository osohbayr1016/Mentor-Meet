/**
 * Admin API utility functions with proper error handling
 */

export class AdminAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'AdminAPIError';
  }
}

export async function adminFetch(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // Handle authentication errors
    if (response.status === 401) {
      // Redirect to login with callback URL
      const currentPath = window.location.pathname;
      window.location.href = `/auth/signin?callbackUrl=${encodeURIComponent(currentPath)}`;
      throw new AdminAPIError('Unauthorized access', 401, 'UNAUTHORIZED');
    }

    // Handle other HTTP errors
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // If response is not JSON, use the default message
      }
      
      throw new AdminAPIError(errorMessage, response.status);
    }

    // Parse JSON response
    const data = await response.json();
    
    // Handle API-level errors
    if (!data.success && data.error) {
      throw new AdminAPIError(data.error, response.status, data.code);
    }

    return data;
  } catch (error) {
    if (error instanceof AdminAPIError) {
      throw error;
    }
    
    // Handle network errors
    console.error('Admin API call failed:', error);
    throw new AdminAPIError(
      'Network error occurred. Please check your connection.',
      0,
      'NETWORK_ERROR'
    );
  }
}

// Specific admin API functions
export const adminAPI = {
  // Dashboard
  async getDashboard() {
    return adminFetch('/api/admin/dashboard');
  },

  // Stats
  async getStats() {
    return adminFetch('/api/admin/stats');
  },

  // Students
  async getStudents(params?: URLSearchParams) {
    const url = params ? `/api/admin/students?${params}` : '/api/admin/students';
    return adminFetch(url);
  },

  async createStudent(data: any) {
    return adminFetch('/api/admin/students', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Mentors
  async getMentors(params?: URLSearchParams) {
    const url = params ? `/api/admin/mentors?${params}` : '/api/admin/mentors';
    return adminFetch(url);
  },

  async createMentor(data: any) {
    return adminFetch('/api/admin/mentors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Bookings
  async getBookings(params?: URLSearchParams) {
    const url = params ? `/api/admin/bookings?${params}` : '/api/admin/bookings';
    return adminFetch(url);
  },

  async createBooking(data: any) {
    return adminFetch('/api/admin/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Payments
  async getPayments(params?: URLSearchParams) {
    const url = params ? `/api/admin/payments?${params}` : '/api/admin/payments';
    return adminFetch(url);
  },

  // Reports
  async getReports(params?: URLSearchParams) {
    const url = params ? `/api/admin/reports?${params}` : '/api/admin/reports';
    return adminFetch(url);
  },
};