import React, { useState } from "react";
// --- Import useDispatch and the new thunk ---
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store"; // Assuming you export these from your store
import { loginUser } from "@/store/slices/authSlice";
// ---------------------------------------------
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
// We'll use sonner for error messages from the thunk
import { toast as sonnerToast } from "sonner";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // --- Get dispatch and auth status from Redux ---
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state: RootState) => state.auth);
  const isLoading = status === "loading";
  // ----------------------------------------------

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      sonnerToast.error("Please enter both email and password.");
      return;
    }

    // --- Dispatch the loginUser thunk ---
    // 'unwrap' lets us use .then() and .catch()
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then((payload) => {
        // payload contains the user and tokens
        toast({
          title: "Login successful",
          description: `Welcome back, ${payload.user.first_name}!`,
        });
        navigate("/dashboard"); // Navigate to vendor dashboard
      })
      .catch((errorPayload) => {
        // errorPayload is the string we rejected with (e.g., "Invalid credentials")
        sonnerToast.error("Login failed", {
          description: errorPayload || "Please check your credentials.",
        });
      });
  };

  return (
    <div className="min-h-screen bg-gradient-secondary flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-primary">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">RentPro</span>
          </div>
        </div>

        <Card className="shadow-strong bg-gradient-card border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Vendor Login</CardTitle>
            <CardDescription className="text-center">
              Sign in to your vendor dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vendor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-12 w-12"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full h-12"
                variant="gradient"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button variant="social" className="h-12">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </Button>
              <Button variant="social" className="h-12">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
                  />
                </svg>
              </Button>
              <Button variant="social" className="h-12">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M4.5 12.5A7.5 7.5 0 0 1 12 5a7.47 7.47 0 0 1 5.02 1.91l-2.04 2.04A4.5 4.5 0 0 0 7.5 12.5a4.5 4.5 0 0 0 4.5 4.5c1.93 0 3.57-1.22 4.22-2.91H12v-3h8.5c.08.47.13.97.13 1.5A7.5 7.5 0 0 1 12 20a7.5 7.5 0 0 1-7.5-7.5z"
                  />
                  <path
                    fill="#EA4335"
                    d="M4.5 12.5A7.5 7.5 0 0 1 12 5c1.95 0 3.68.75 5.02 1.97l-2.04 2.04A4.48 4.48 0 0 0 12 7.5a4.5 4.5 0 0 0-4.16 2.78L5.43 8.37A7.47 7.47 0 0 1 4.5 12.5z"
                  />
                </svg>
              </Button>
            </div>

            <div className="mt-6 text-center space-y-2">
              <span className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/vendor/register"
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </Link>
              </span>
              <div className="text-sm text-muted-foreground">
                Are you a customer?{" "}
                <Link
                  to="/customer/login"
                  className="text-primary hover:underline font-medium"
                >
                  Customer Login
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
