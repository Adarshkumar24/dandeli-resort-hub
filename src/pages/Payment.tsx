import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, QrCode, Smartphone, ArrowLeft, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const Payment = () => {
  const { state, clearCart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'qr' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const subtotal = state.total;
  const tax = Math.round(state.total * 0.18); // 18% GST
  const total = subtotal + tax;

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (!user) {
      toast.error('Please sign in to complete payment');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Save booking to localStorage
      const bookingId = `DHR-${Date.now().toString().slice(-6)}`;
      const userEmail = user.emailAddresses[0]?.emailAddress;
      
      const booking = {
        id: `booking_${Date.now()}`,
        bookingId,
        userEmail,
        items: state.items,
        subtotal,
        tax,
        total,
        paymentMethod: paymentMethod === 'upi' ? 'UPI' : 'QR Code',
        status: 'confirmed',
        bookedAt: new Date()
      };

      // Get existing bookings for this user
      const existingBookings = JSON.parse(
        localStorage.getItem(`bookings_${userEmail}`) || '[]'
      );
      
      // Add new booking
      existingBookings.push(booking);
      
      // Save back to localStorage
      localStorage.setItem(`bookings_${userEmail}`, JSON.stringify(existingBookings));
      
      setIsProcessing(false);
      setPaymentComplete(true);
      toast.success('Payment successful! Your booking is confirmed.');
      
      // Clear cart after successful payment
      setTimeout(() => {
        clearCart();
        navigate('/');
      }, 3000);
    }, 2000);
  };

  if (state.items.length === 0 && !paymentComplete) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button onClick={() => navigate('/')}>
              Continue Browsing
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentComplete) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Booking Confirmed! 🎉
            </h2>
            <p className="text-muted-foreground mb-6">
              Thank you for your payment. Your booking has been confirmed successfully.
              You will receive a confirmation email shortly.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                <strong>Booking ID:</strong> DHR-{Date.now().toString().slice(-6)}
              </p>
              <p className="text-sm text-green-800">
                <strong>Total Paid:</strong> ₹{total.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Redirecting to home page in a few seconds...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Complete Payment</h1>
            <p className="text-muted-foreground">Secure payment for your booking</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Methods */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Methods
                </CardTitle>
                <CardDescription>
                  Choose your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* UPI ID Option */}
                <Card 
                  className={`cursor-pointer transition-all ${
                    paymentMethod === 'upi' 
                      ? 'ring-2 ring-primary border-primary' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-8 w-8 text-primary" />
                      <div className="flex-1">
                        <h3 className="font-semibold">UPI Payment</h3>
                        <p className="text-sm text-muted-foreground">
                          Pay using UPI ID: <span className="font-mono">8260230183@ibl</span>
                        </p>
                      </div>
                      {paymentMethod === 'upi' && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* QR Code Option */}
                <Card 
                  className={`cursor-pointer transition-all ${
                    paymentMethod === 'qr' 
                      ? 'ring-2 ring-primary border-primary' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setPaymentMethod('qr')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <QrCode className="h-8 w-8 text-primary" />
                      <div className="flex-1">
                        <h3 className="font-semibold">QR Code Scanner</h3>
                        <p className="text-sm text-muted-foreground">
                          Scan UPI QR code for 8260230183@ibl
                        </p>
                      </div>
                      {paymentMethod === 'qr' && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Instructions */}
                {paymentMethod === 'upi' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">UPI Payment Instructions:</h4>
                    <ol className="text-sm text-blue-700 space-y-1">
                      <li>1. Open your UPI app (GPay, PhonePe, Paytm, etc.)</li>
                      <li>2. Enter UPI ID: <span className="font-mono bg-white px-1 rounded">8260230183@ibl</span></li>
                      <li>3. Enter amount: ₹{total.toLocaleString()}</li>
                      <li>4. Complete the payment and click "Confirm Payment" below</li>
                    </ol>
                  </div>
                )}

                {paymentMethod === 'qr' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="bg-white rounded-lg p-4 inline-block mb-4 shadow-md">
                      <img 
                        src="/lovable-uploads/scanner.jpeg" 
                        alt="UPI QR Code Scanner"
                        className="h-48 w-48 object-contain mx-auto"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        QR Code for UPI Payment
                      </p>
                    </div>
                    <h4 className="font-semibold text-green-800 mb-2">QR Code Payment:</h4>
                    <p className="text-sm text-green-700 mb-2">
                      Scan this QR code with any UPI app to pay ₹{total.toLocaleString()}
                    </p>
                    <div className="bg-white rounded-md p-2 text-xs text-gray-600">
                      <strong>UPI ID:</strong> 8260230183@ibl
                    </div>
                  </div>
                )}

                {/* Payment Button */}
                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={!paymentMethod || isProcessing}
                  onClick={handlePayment}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </>
                  ) : (
                    `Confirm Payment - ₹${total.toLocaleString()}`
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  Review your booking details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                {state.items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {item.type === 'room' ? 'Accommodation' : 'Activity'}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <Badge variant="secondary" className="text-xs">
                          Qty: {item.quantity}
                        </Badge>
                        <span className="font-semibold text-sm">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxes & Fees</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-gray-50 border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">
                    🔒 Your payment is secured with bank-grade encryption. 
                    We never store your payment information.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
