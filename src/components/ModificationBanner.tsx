import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, X, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useModifyBooking } from '../contexts/ModifyBookingContext';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

const ModificationBanner = () => {
  const { modifyingBooking, cancelModification, completeModification, isModifying } = useModifyBooking();
  const { state, clearCart } = useCart();
  const navigate = useNavigate();

  if (!isModifying || !modifyingBooking) return null;

  const handleSaveModifications = () => {
    if (state.items.length === 0) {
      toast.error('Please add at least one item to your booking.');
      return;
    }

    // Convert cart items to booking items format
    const newBookingItems = state.items.map(item => ({
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.description,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
      checkIn: item.checkIn,
      checkOut: item.checkOut,
      guests: item.guests,
      selectedDate: item.selectedDate,
      duration: item.duration,
    }));

    // Complete the modification
    completeModification(newBookingItems);
    
    // Clear cart
    clearCart();
    
    toast.success('Booking modified successfully! Returning to My Bookings.');
    
    // Navigate back to bookings
    setTimeout(() => {
      navigate('/my-bookings');
    }, 1000);
  };

  const handleCancelModification = () => {
    cancelModification();
    clearCart();
    toast.info('Booking modification cancelled.');
    navigate('/my-bookings');
  };

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-orange-600" />
              <span className="font-semibold text-orange-800">Modifying Booking</span>
              <Badge variant="outline" className="border-orange-300 text-orange-700">
                #{modifyingBooking.bookingId}
              </Badge>
            </div>
            <div className="text-sm text-orange-700">
              Original: {modifyingBooking.items.length} item(s) • ₹{modifyingBooking.total.toLocaleString()}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelModification}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveModifications}
              className="bg-green-600 hover:bg-green-700"
              disabled={state.items.length === 0}
            >
              <Save className="h-4 w-4 mr-1" />
              Save Changes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/my-bookings')}
              className="border-gray-300"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Bookings
            </Button>
          </div>
        </div>
        
        <div className="mt-3 text-sm text-orange-700 bg-orange-100 rounded-md p-2">
          <strong>Modification Mode:</strong> Add or remove items from your booking. 
          Your current cart will replace the original booking items. 
          {state.items.length > 0 && (
            <span className="ml-2">
              Current cart: {state.items.length} item(s) • ₹{state.total.toLocaleString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModificationBanner;
