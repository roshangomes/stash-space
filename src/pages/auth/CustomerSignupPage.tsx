/*
  File: src/pages/auth/CustomerSignupPage.tsx
  Updated to use Redux thunk for Django registration
*/
import React, { useState } from "react";
// --- Import Redux thunk ---
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { registerUser } from "@/store/slices/authSlice";
// --------------------------
import { Link, useNavigate } from "react-router-dom";
import { Camera, Mail, Phone } from "lucide-react";
// --- Firebase/KYC logic is paused for now ---
// import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
// import { auth } from '@/lib/firebase';
// ----------------------------------------
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from "sonner";
// import { loginSuccess } from '@/store/slices/authSlice';
// import { AadhaarKycFlow, KycData } from '@/components/kyc/AadhaarKycFlow';

type SignupMethod = "email" | "phone";

export const CustomerSignupPage: React.FC = () => {
  const [signupMethod, setSignupMethod] = useState<SignupMethod>("email");
  // --- Simplified to one step ---
  // const [step, setStep] = useState<'details' | 'otp' | 'kyc-optional'>('details');

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Added password
  const [password2, setPassword2] = useState(""); // Added confirm password
  // const [phone, setPhone] = useState('');
  // const [otp, setOtp] = useState('');

  // --- Redux state ---
  const dispatch: AppDispatch = useDispatch();
  const { status } = useSelector((state: RootState) => state.auth);
  const isLoading = status === "loading";
  // -------------------

  // const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  // const [kycData, setKycData] = useState<KycData | null>(null);
  const navigate = useNavigate();

  // --- Firebase reCAPTCHA paused ---
  // useEffect(() => { ... });

  // This function now handles the *entire* registration
  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupMethod === "phone") {
      toast.info("Phone signup is temporarily disabled. Please use Email.");
      return;
    }

    // --- Validate all fields for Django ---
    if (!name || !email || !password || !password2) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== password2) {
      toast.error("Passwords do not match");
      return;
    }

    // Split name into first_name and last_name for Django
    const nameParts = name.trim().split(" ");
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(" ") || first_name; // Handle single names
    // ----------------------------------------

    // --- Dispatch the registerUser thunk ---
    dispatch(
      registerUser({
        email,
        password,
        password2,
        first_name,
        last_name,
        role: "customer", // Hard-code the role for this page
      })
    )
      .unwrap()
      .then((payload) => {
        toast.success("Registration successful!", {
          description: `Welcome, ${payload.user.first_name}!`,
        });
        // Navigate to customer dashboard
        navigate("/customer/dashboard");
      })
      .catch((errorPayload) => {
        toast.error("Registration failed", {
          description: errorPayload || "An error occurred.",
        });
      });
  };

  return (
    <div className="min-h-screen bg-gradient-secondary flex items-center justify-center p-6">
      {/* <div id="recaptcha-container"></div> */}
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-primary">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">
              FilmGear Pro
            </span>
          </div>
        </div>

        <Card className="shadow-strong bg-gradient-card border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Create Account
            </CardTitle>
            <CardDescription className="text-center">
              Join FilmGear Pro to rent professional equipment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegistrationSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <Tabs
                value={signupMethod}
                onValueChange={(v) => setSignupMethod(v as SignupMethod)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email" className="gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </TabsTrigger>
                  <TabsTrigger value="phone" className="gap-2" disabled>
                    <Phone className="w-4 h-4" />
                    Phone (soon)
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="email" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="customer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password2">Confirm Password</Label>
                    <Input
                      id="password2"
                      type="password"
                      placeholder="Confirm your password"
                      value={password2}
                      onChange={(e) => setPassword2(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="phone" className="space-y-2 mt-4">
                  {/* Phone input logic paused */}
                </TabsContent>
              </Tabs>

              <Button
                type="submit"
                className="w-full h-12"
                variant="gradient"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <span className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/customer/login"
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </span>
              <div className="text-sm text-muted-foreground">
                Are you a vendor?{" "}
                <Link
                  to="/vendor/login"
                  className="text-primary hover:underline font-medium"
                >
                  Vendor Login
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
