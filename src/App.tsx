
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Accommodation from "./pages/Accommodation";
import About from "./pages/About";
import Activities from "./pages/Activities";
import Booking from "./pages/Booking";
import BookingSuccess from "./pages/BookingSuccess";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import MyBookings from "./pages/MyBookings";
import ChatBot from "./components/ChatBot";
import WhatsAppButton from "./components/WhatsAppButton";
import { CartProvider } from "./contexts/CartContext";
import { ModifyBookingProvider } from "./contexts/ModifyBookingContext";

// Get the publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}



// Create a new query client instance
const queryClient = new QueryClient();

const App = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <CartProvider>
        <ModifyBookingProvider>
          <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/accommodation" element={<Accommodation />} />
                <Route path="/about" element={<About />} />
                <Route path="/activities" element={<Activities />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/booking-success" element={<BookingSuccess />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Login />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ChatBot />
              <WhatsAppButton />
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ModifyBookingProvider>
      </CartProvider>
    </ClerkProvider>
  );
};

export default App;
