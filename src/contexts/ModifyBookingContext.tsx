import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BookingItem {
  id: string;
  type: 'room' | 'activity';
  title: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
  selectedDate?: Date;
  duration?: string;
}

interface Booking {
  id: string;
  bookingId: string;
  userEmail: string;
  items: BookingItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  bookedAt: Date;
}

interface ModifyBookingContextType {
  modifyingBooking: Booking | null;
  startModification: (booking: Booking) => void;
  cancelModification: () => void;
  completeModification: (newItems: BookingItem[]) => void;
  isModifying: boolean;
}

const ModifyBookingContext = createContext<ModifyBookingContextType | undefined>(undefined);

export function ModifyBookingProvider({ children }: { children: ReactNode }) {
  const [modifyingBooking, setModifyingBooking] = useState<Booking | null>(null);

  const startModification = (booking: Booking) => {
    setModifyingBooking(booking);
    // Store in sessionStorage for persistence across navigation
    sessionStorage.setItem('modifyingBooking', JSON.stringify(booking));
  };

  const cancelModification = () => {
    setModifyingBooking(null);
    sessionStorage.removeItem('modifyingBooking');
  };

  const completeModification = (newItems: BookingItem[]) => {
    if (!modifyingBooking) return;

    // Calculate new totals
    const newSubtotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newTax = Math.round(newSubtotal * 0.18);
    const newTotal = newSubtotal + newTax;

    // Update the booking
    const updatedBooking: Booking = {
      ...modifyingBooking,
      items: newItems,
      subtotal: newSubtotal,
      tax: newTax,
      total: newTotal,
    };

    // Get user email from existing booking
    const userEmail = modifyingBooking.userEmail;
    
    // Get existing bookings
    const existingBookings = JSON.parse(
      localStorage.getItem(`bookings_${userEmail}`) || '[]'
    );

    // Update the specific booking
    const updatedBookings = existingBookings.map((booking: Booking) =>
      booking.id === modifyingBooking.id ? updatedBooking : booking
    );

    // Save back to localStorage
    localStorage.setItem(`bookings_${userEmail}`, JSON.stringify(updatedBookings));

    // Clear modification state
    cancelModification();
  };

  const isModifying = modifyingBooking !== null;

  // Restore modification state on mount
  React.useEffect(() => {
    const saved = sessionStorage.getItem('modifyingBooking');
    if (saved) {
      try {
        const booking = JSON.parse(saved);
        setModifyingBooking({
          ...booking,
          bookedAt: new Date(booking.bookedAt),
          items: booking.items.map((item: any) => ({
            ...item,
            checkIn: item.checkIn ? new Date(item.checkIn) : undefined,
            checkOut: item.checkOut ? new Date(item.checkOut) : undefined,
            selectedDate: item.selectedDate ? new Date(item.selectedDate) : undefined,
          }))
        });
      } catch (error) {
        console.error('Error restoring modification state:', error);
        sessionStorage.removeItem('modifyingBooking');
      }
    }
  }, []);

  return (
    <ModifyBookingContext.Provider
      value={{
        modifyingBooking,
        startModification,
        cancelModification,
        completeModification,
        isModifying,
      }}
    >
      {children}
    </ModifyBookingContext.Provider>
  );
}

export function useModifyBooking() {
  const context = useContext(ModifyBookingContext);
  if (context === undefined) {
    throw new Error('useModifyBooking must be used within a ModifyBookingProvider');
  }
  return context;
}
