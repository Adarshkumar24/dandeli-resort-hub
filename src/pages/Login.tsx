import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Login = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // Determine the mode based on URL parameters or path
  useEffect(() => {
    const modeParam = searchParams.get('mode');
    const signUpParam = searchParams.get('signup');
    const pathHasSignup = location.pathname.includes('signup') || location.search.includes('signup');
    
    if (modeParam === 'signup' || signUpParam !== null || pathHasSignup) {
      setMode('signup');
    } else {
      setMode('signin');
    }
  }, [searchParams, location]);

  useEffect(() => {
    if (isSignedIn) {
      // Redirect to booking page after successful sign in
      navigate("/booking");
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === 'signup' ? 'Create Account' : 'Sign In to Book'}
          </h1>
          <p className="text-gray-600">
            {mode === 'signup' 
              ? 'Create an account to start booking' 
              : 'Sign in to continue with your booking'
            }
          </p>
        </div>
        
        {/* Mode Toggle Buttons */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === 'signin'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === 'signup'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign Up
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          {mode === 'signin' ? (
            <SignIn 
              routing="hash"
              redirectUrl="/booking"
              appearance={{
                elements: {
                  formButtonPrimary: 
                    "bg-green-600 hover:bg-green-700 text-sm normal-case",
                  socialButtonsBlockButton:
                    "bg-white border-gray-300 hover:bg-gray-50 text-gray-600 text-sm normal-case",
                  socialButtonsBlockButtonText: "font-normal",
                  formFieldInput: "border-gray-300 focus:border-green-500 focus:ring-green-500",
                  footerActionLink: "text-green-600 hover:text-green-700"
                }
              }}
            />
          ) : (
            <SignUp 
              routing="hash"
              redirectUrl="/booking"
              appearance={{
                elements: {
                  formButtonPrimary: 
                    "bg-green-600 hover:bg-green-700 text-sm normal-case",
                  socialButtonsBlockButton:
                    "bg-white border-gray-300 hover:bg-gray-50 text-gray-600 text-sm normal-case",
                  socialButtonsBlockButtonText: "font-normal",
                  formFieldInput: "border-gray-300 focus:border-green-500 focus:ring-green-500",
                  footerActionLink: "text-green-600 hover:text-green-700"
                }
              }}
            />
          )}
        </div>
        
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-800 underline"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
