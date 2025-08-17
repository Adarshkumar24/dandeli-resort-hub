import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Users, Clock, MapPin, Phone, Mail, Download, Edit, MessageCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useModifyBooking } from '../contexts/ModifyBookingContext';

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

const MyBookings = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const { startModification } = useModifyBooking();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - In a real app, this would come from your backend
  useEffect(() => {
    if (isLoaded && user) {
      // Simulate fetching bookings from localStorage or API
      const savedBookings = localStorage.getItem(`bookings_${user.emailAddresses[0]?.emailAddress}`);
      if (savedBookings) {
        const parsedBookings = JSON.parse(savedBookings).map((booking: any) => ({
          ...booking,
          bookedAt: new Date(booking.bookedAt),
          items: booking.items.map((item: any) => ({
            ...item,
            checkIn: item.checkIn ? new Date(item.checkIn) : undefined,
            checkOut: item.checkOut ? new Date(item.checkOut) : undefined,
            selectedDate: item.selectedDate ? new Date(item.selectedDate) : undefined,
          }))
        }));
        setBookings(parsedBookings);
      }
      setLoading(false);
    }
  }, [isLoaded, user]);

  const formatDate = (date?: Date) => {
    if (!date) return 'Not specified';
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownloadReceipt = (booking: Booking) => {
    // Generate receipt content
    const receiptContent = `
DANDELI RESORT HUB - BOOKING RECEIPT
=======================================

Booking ID: ${booking.bookingId}
Booking Date: ${formatDate(booking.bookedAt)}
Customer Email: ${booking.userEmail}
Status: ${booking.status.toUpperCase()}
Payment Method: ${booking.paymentMethod.toUpperCase()}

BOOKING DETAILS:
${booking.items.map((item, index) => `
${index + 1}. ${item.title}
   Type: ${item.type === 'room' ? 'Accommodation' : 'Activity'}
   Quantity: ${item.quantity}
   Price: ₹${(item.price * item.quantity).toLocaleString()}
   ${item.checkIn ? `Check-in: ${formatDate(item.checkIn)}` : ''}
   ${item.checkOut ? `Check-out: ${formatDate(item.checkOut)}` : ''}
   ${item.selectedDate && !item.checkIn ? `Date: ${formatDate(item.selectedDate)}` : ''}
   ${item.guests ? `Guests: ${item.guests}` : ''}
   ${item.duration ? `Duration: ${item.duration}` : ''}
`).join('')}

PRICE BREAKDOWN:
Subtotal: ₹${booking.subtotal.toLocaleString()}
Taxes & Fees: ₹${booking.tax.toLocaleString()}
Total Paid: ₹${booking.total.toLocaleString()}

CONTACT INFORMATION:
Phone: +91 8260230183
Email: pradhanadarsh727@gmail.com
Location: Dandeli, Karnataka

Thank you for choosing Dandeli Resort Hub!
Generated on: ${new Date().toLocaleString()}
    `;

    // Create and download the receipt
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt_${booking.bookingId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success('Receipt downloaded successfully!');
  };

  const handleModifyBooking = (booking: Booking) => {
    // Check if booking can be modified
    const canModify = booking.status === 'confirmed';
    
    if (!canModify) {
      toast.error('This booking cannot be modified at this time.');
      return;
    }

    // Start modification process
    startModification(booking);
    
    toast.success(
      'Modification mode activated! You can now browse and modify your booking items. Your changes will be saved when you return.',
      { duration: 4000 }
    );

    // Navigate to home page for modification
    navigate('/', { state: { modifying: true } });
  };

  const handleEmailSupport = (booking: Booking) => {
    // Create pre-filled support message
    const subject = `Support Request - Booking ${booking.bookingId}`;
    const body = `Dear Dandeli Resort Hub Support Team,

I need assistance with my booking:

Booking ID: ${booking.bookingId}
Booking Date: ${formatDate(booking.bookedAt)}
Status: ${booking.status.toUpperCase()}
Total Amount: ₹${booking.total.toLocaleString()}

Please describe your issue or request below:
[Your message here]

Best regards,
${user?.firstName || 'Guest'}
${user?.emailAddresses[0]?.emailAddress}`;

    // Open email client
    const emailUrl = `mailto:pradhanadarsh727@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl, '_blank');
    toast.success('Email client opened with pre-filled message!');
  };

  const handleWhatsAppSupport = (booking: Booking) => {
    // Create WhatsApp message
    const whatsappMessage = `Hi! I need help with my booking.

Booking ID: ${booking.bookingId}
Status: ${booking.status.toUpperCase()}
Total Amount: ₹${booking.total.toLocaleString()}
Booking Date: ${formatDate(booking.bookedAt)}

Please assist me with my inquiry.`;

    const whatsappUrl = `https://wa.me/918260230183?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('WhatsApp opened with pre-filled message!');
  };

  const refreshBookings = () => {
    setLoading(true);
    // Simulate refresh delay
    setTimeout(() => {
      if (user) {
        const savedBookings = localStorage.getItem(`bookings_${user.emailAddresses[0]?.emailAddress}`);
        if (savedBookings) {
          const parsedBookings = JSON.parse(savedBookings).map((booking: any) => ({
            ...booking,
            bookedAt: new Date(booking.bookedAt),
            items: booking.items.map((item: any) => ({
              ...item,
              checkIn: item.checkIn ? new Date(item.checkIn) : undefined,
              checkOut: item.checkOut ? new Date(item.checkOut) : undefined,
              selectedDate: item.selectedDate ? new Date(item.selectedDate) : undefined,
            }))
          }));
          setBookings(parsedBookings);
        }
      }
      setLoading(false);
      toast.success('Bookings refreshed!');
    }, 1000);
  };

  // Auto-refresh when component mounts or user changes
  useEffect(() => {
    if (isLoaded && user) {
      refreshBookings();
    }
  }, [isLoaded, user]);

  if (!isLoaded || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading your bookings...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">Please sign in to view your bookings</p>
            <Button onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
              <p className="text-muted-foreground">
                Manage and view your booking history for {user.emailAddresses[0]?.emailAddress}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshBookings}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          {/* Booking Stats */}
          {bookings.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {bookings.filter(b => b.status === 'confirmed').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Confirmed</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {bookings.filter(b => b.status === 'pending').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    ₹{bookings.reduce((sum, b) => sum + b.total, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Spent</div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {bookings.length === 0 ? (
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="mb-4">
                <CalendarDays className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Bookings Yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't made any bookings yet. Start exploring our amazing accommodations and activities!
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate('/accommodation')}>
                    Browse Rooms
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/activities')}>
                    View Activities
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Booking #{booking.bookingId}
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.toUpperCase()}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Booked on {formatDate(booking.bookedAt)} • {booking.items.length} item(s)
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">₹{booking.total.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        Paid via {booking.paymentMethod.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Booking Items */}
                  <div className="space-y-4">
                    {booking.items.map((item, index) => (
                      <div key={index} className="flex gap-4 p-4 border rounded-lg">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {item.type === 'room' ? 'Accommodation' : 'Activity'}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">
                                ₹{(item.price * item.quantity).toLocaleString()}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Qty: {item.quantity}
                              </div>
                            </div>
                          </div>
                          
                          {/* Item Details */}
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            {item.checkIn && (
                              <div className="flex items-center gap-1">
                                <CalendarDays className="h-4 w-4" />
                                <span>Check-in: {formatDate(item.checkIn)}</span>
                              </div>
                            )}
                            {item.checkOut && (
                              <div className="flex items-center gap-1">
                                <CalendarDays className="h-4 w-4" />
                                <span>Check-out: {formatDate(item.checkOut)}</span>
                              </div>
                            )}
                            {item.selectedDate && !item.checkIn && (
                              <div className="flex items-center gap-1">
                                <CalendarDays className="h-4 w-4" />
                                <span>Date: {formatDate(item.selectedDate)}</span>
                              </div>
                            )}
                            {item.guests && (
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{item.guests} guest(s)</span>
                              </div>
                            )}
                            {item.duration && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{item.duration}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* Price Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Price Breakdown</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>₹{booking.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Taxes & Fees</span>
                          <span>₹{booking.tax.toLocaleString()}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                          <span>Total Paid</span>
                          <span>₹{booking.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Need Help?</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <a 
                            href="tel:+918260230183"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <Phone className="h-4 w-4" />
                            <span>+91 8260230183</span>
                          </a>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleWhatsAppSupport(booking)}
                            className="text-xs px-2 py-1 h-auto"
                          >
                            WhatsApp
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <a 
                            href="mailto:pradhanadarsh727@gmail.com"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <Mail className="h-4 w-4" />
                            <span>pradhanadarsh727@gmail.com</span>
                          </a>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEmailSupport(booking)}
                            className="text-xs px-2 py-1 h-auto"
                          >
                            Email
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>Dandeli, Karnataka</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mt-6">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadReceipt(booking)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download Receipt
                    </Button>
                    {booking.status === 'confirmed' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleModifyBooking(booking)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Modify Booking
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEmailSupport(booking)}
                      className="flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Email Support
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleWhatsAppSupport(booking)}
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
