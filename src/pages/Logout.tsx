import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Logout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    
    // Redirect to home page
    navigate("/");
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      toast({
        title: "Not Logged In",
        description: "You are not currently logged in",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Logout</CardTitle>
          <CardDescription className="text-center">
            Are you sure you want to logout?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-3">
            <Button 
              onClick={handleLogout}
              variant="destructive"
              className="w-full"
            >
              Yes, Logout
            </Button>
            <Button 
              onClick={handleCancel}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Logout;
