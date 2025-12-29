export const BUSINESS_HOURS = {
  start: 9, // 9 AM
  end: 17, // 5 PM
  timezone: 'America/New_York',
};

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30'
];

export const APPOINTMENT_DURATION = 45; // minutes

export const DAYS_OFF = [0, 6]; // Sunday and Saturday

// Mock booked appointments (date string -> array of time strings)
export const MOCK_BOOKED_APPOINTMENTS: Record<string, string[]> = {
  // Today's date with some slots booked
  [new Date().toISOString().split('T')[0]]: ['09:00', '10:30', '14:00'],
  // Tomorrow with different slots
  [new Date(Date.now() + 86400000).toISOString().split('T')[0]]: ['11:00', '15:30'],
  // Day after tomorrow
  [new Date(Date.now() + 172800000).toISOString().split('T')[0]]: ['09:30', '13:00', '16:00'],
};

// Helper to check if date is available
export const isDateAvailable = (date: Date): boolean => {
  const day = date.getDay();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (date < today) return false;
  if (DAYS_OFF.includes(day)) return false;
  
  return true;
};

// Helper to check if time slot is still available today
export const isTimeSlotAvailable = (date: Date, timeSlot: string): boolean => {
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (date.getTime() !== today.getTime()) return true;
  
  const [hours, minutes] = timeSlot.split(':').map(Number);
  const slotTime = new Date();
  slotTime.setHours(hours, minutes, 0, 0);
  
  return slotTime.getTime() > now.getTime() + (2 * 60 * 60 * 1000);
};

// Mock function to get booked slots for a date
export const getMockBookedSlots = (date: Date): Promise<string[]> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const dateStr = date.toISOString().split('T')[0];
      resolve(MOCK_BOOKED_APPOINTMENTS[dateStr] || []);
    }, 500); // 500ms delay to simulate API call
  });
};

// Mock function to create booking
export const createMockBooking = (bookingData: any): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      console.log('Mock booking created:', bookingData);
      
      // Add to mock data
      const dateStr = bookingData.date;
      if (!MOCK_BOOKED_APPOINTMENTS[dateStr]) {
        MOCK_BOOKED_APPOINTMENTS[dateStr] = [];
      }
      MOCK_BOOKED_APPOINTMENTS[dateStr].push(bookingData.time);
      
      resolve({ success: true });
    }, 1000); // 1 second delay to simulate API call
  });
};

// Get availability info for a specific date
export const getDateAvailability = (date: Date): {
  hasAvailable: boolean;
  availableCount: number;
  totalSlots: number;
} => {
  if (!isDateAvailable(date)) {
    return { hasAvailable: false, availableCount: 0, totalSlots: 0 };
  }
  
  const dateStr = date.toISOString().split('T')[0];
  const bookedSlots = MOCK_BOOKED_APPOINTMENTS[dateStr] || [];
  
  const availableSlots = TIME_SLOTS.filter(slot => 
    isTimeSlotAvailable(date, slot) && !bookedSlots.includes(slot)
  );
  
  return {
    hasAvailable: availableSlots.length > 0,
    availableCount: availableSlots.length,
    totalSlots: TIME_SLOTS.length
  };
};

// Batch check for calendar display (optimize for rendering)
export const getMonthAvailability = (month: Date): Record<string, boolean> => {
  const availability: Record<string, boolean> = {};
  const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
  const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dateStr = date.toISOString().split('T')[0];
    const bookedSlots = MOCK_BOOKED_APPOINTMENTS[dateStr] || [];
    const availableCount = TIME_SLOTS.filter(slot => 
      isTimeSlotAvailable(new Date(date), slot) && !bookedSlots.includes(slot)
    ).length;
    
    availability[dateStr] = availableCount > 0 && isDateAvailable(new Date(date));
  }
  
  return availability;
};
