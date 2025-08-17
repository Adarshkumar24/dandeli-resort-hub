import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, Calendar, Users, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Cart = () => {
  const { state, removeItem, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCheckout = () => {
    if (state.items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add some items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }
    
    // Navigate to checkout/payment page
    navigate('/payment');
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'Not selected';
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-12">
              <ShoppingBag size={64} className="mx-auto text-gray-400 mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-8">
                Start exploring our amazing accommodations and activities to add them to your cart!
              </p>
              <div className="space-y-4">
                <Button onClick={() => navigate('/accommodation')} className="w-full">
                  Browse Accommodations
                </Button>
                <Button onClick={() => navigate('/activities')} variant="outline" className="w-full">
                  Explore Activities
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Your Booking Cart</h1>
            <Button
              onClick={clearCart}
              variant="outline"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 size={16} className="mr-2" />
              Clear Cart
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {state.items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-48 h-48 md:h-auto">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3">
                              {item.description}
                            </p>
                            
                            {/* Item Details */}
                            <div className="space-y-2 text-sm text-gray-600">
                              {item.type === 'room' && (
                                <>
                                  {item.checkIn && (
                                    <div className="flex items-center gap-2">
                                      <Calendar size={14} />
                                      <span>Check-in: {formatDate(item.checkIn)}</span>
                                    </div>
                                  )}
                                  {item.checkOut && (
                                    <div className="flex items-center gap-2">
                                      <Calendar size={14} />
                                      <span>Check-out: {formatDate(item.checkOut)}</span>
                                    </div>
                                  )}
                                  {item.guests && (
                                    <div className="flex items-center gap-2">
                                      <Users size={14} />
                                      <span>{item.guests} guests</span>
                                    </div>
                                  )}
                                </>
                              )}
                              
                              {item.type === 'activity' && (
                                <>
                                  {item.selectedDate && (
                                    <div className="flex items-center gap-2">
                                      <Calendar size={14} />
                                      <span>Date: {formatDate(item.selectedDate)}</span>
                                    </div>
                                  )}
                                  {item.duration && (
                                    <div className="flex items-center gap-2">
                                      <Clock size={14} />
                                      <span>Duration: {item.duration}</span>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          
                          <Button
                            onClick={() => removeItem(item.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Minus size={14} />
                            </Button>
                            <span className="font-medium">{item.quantity}</span>
                            <Button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Plus size={14} />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">
                              ₹{item.price.toLocaleString()} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-xl">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Items ({state.itemCount})</span>
                      <span>₹{state.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Service Fee</span>
                      <span>₹{Math.round(state.total * 0.05).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Taxes</span>
                      <span>₹{Math.round(state.total * 0.12).toLocaleString()}</span>
                    </div>
                    <hr className="my-4" />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>₹{Math.round(state.total * 1.17).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <Button onClick={handleCheckout} className="w-full" size="lg">
                      Proceed to Checkout
                    </Button>
                    <Button
                      onClick={() => navigate('/accommodation')}
                      variant="outline"
                      className="w-full"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                  
                  <div className="text-xs text-gray-600 pt-4">
                    <p>• Free cancellation up to 24 hours before check-in</p>
                    <p>• Secure payment processing</p>
                    <p>• Customer support available 24/7</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
