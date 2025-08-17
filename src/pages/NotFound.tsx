import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    
    // Check if user is trying to access auth-related routes
    if (path.includes('signup') || path.includes('sign-up') || path.includes('register')) {
      console.log("Redirecting signup attempt to login page with signup mode");
      navigate('/login?mode=signup', { replace: true });
      return;
    }
    
    if (path.includes('signin') || path.includes('sign-in')) {
      console.log("Redirecting signin attempt to login page");
      navigate('/login', { replace: true });
      return;
    }

    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md mx-auto p-6">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <p className="text-gray-500 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-3">
          <Link 
            to="/" 
            className="block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Return to Home
          </Link>
          
          <div className="flex gap-3 justify-center">
            <Link 
              to="/login" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Sign In
            </Link>
            <span className="text-gray-400">|</span>
            <Link 
              to="/login?mode=signup" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
