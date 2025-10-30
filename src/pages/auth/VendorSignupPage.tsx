import React, { useState, useEffect } from "react";
// --- Import Redux thunks ---
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { registerUser, submitKyc } from "@/store/slices/authSlice"; // <-- Import both
// --------------------------
import { Link, useNavigate } from "react-router-dom";
import { Camera, Mail, Phone } from "lucide-react";
// --- Firebase logic is no longer needed ---
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
// import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'; // Not needed for now
import { toast } from "sonner";
// --- Import KYC components ---
import { AadhaarKycFlow, KycData } from "@/components/kyc/AadhaarKycFlow";

type SignupMethod = "email" | "phone";

export const VendorSignupPage: React.FC = () => {
  const [signupMethod, setSignupMethod] = useState<SignupMethod>("email");
  // --- Re-introduce the 'step' state ---
  const [step, setStep] = useState<"details" | "kyc">("details");
  // ------------------------------------

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Added password
  const [password2, setPassword2] = useState(""); // Added confirm password
  const [businessName, setBusinessName] = useState("");
  // const [phone, setPhone] = useState(''); // Paused phone
  // const [otp, setOtp] = useState(''); // Paused OTP

  // --- Redux state ---
  const dispatch: AppDispatch = useDispatch();
  const { status } = useSelector((state: RootState) => state.auth);
  const isLoading = status === "loading";
  // -------------------

  const navigate = useNavigate();

  // --- Firebase logic is removed ---

  // Step 1: Register the user with Django
  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupMethod === "phone") {
      toast.info("Phone signup is temporarily disabled. Please use Email.");
      return;
    }

    if (!name || !email || !password || !password2 || !businessName) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== password2) {
      toast.error("Passwords do not match");
      return;
    }

    const nameParts = name.trim().split(" ");
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(" ") || first_name;

    dispatch(
      registerUser({
        email,
        password,
        password2,
        first_name,
        last_name,
        role: "vendor",
        business_name: businessName, // Send business_name
      })
    )
      .unwrap()
      .then((payload) => {
        toast.success("Account created!", {
          description: `Welcome, ${payload.user.first_name}! Please complete KYC.`,
        });
        // --- On success, go to KYC step ---
        setStep("kyc");
        // ----------------------------------
      })
      .catch((errorPayload) => {
        toast.error("Registration failed", {
          description: errorPayload || "An error occurred.",
        });
      });
  };

  // Step 2: Handle KYC completion
  const handleKycComplete = (data: KycData) => {
    // Dispatch the new 'submitKyc' thunk
    dispatch(submitKyc(data))
      .unwrap()
      .then(() => {
        toast.success("KYC Verified!", {
          description: "Your vendor account is now fully active.",
        });
        // Now, finally, navigate to the dashboard
        navigate("/dashboard");
      })
      .catch((errorPayload) => {
        toast.error("KYC Submission Failed", {
          description: errorPayload || "Please try again.",
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
              Vendor Registration
            </CardTitle>
            <CardDescription className="text-center">
              {step === "details"
                ? "Create your vendor account (Step 1 of 2)"
                : "Complete mandatory KYC (Step 2 of 2)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* --- Step 1: Details Form --- */}
            {step === "details" && (
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

                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="Your Business Name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
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
                        placeholder="vendor@example.com"
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
                </Tabs>

                <Button
                  type="submit"
                  className="w-full h-12"
                  variant="gradient"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Continue to KYC"}
                </Button>
              </form>
            )}

            {/* --- Step 2: KYC Form --- */}
            {step === "kyc" && (
              <div className="space-y-4">
                <AadhaarKycFlow
                  onKycComplete={handleKycComplete}
                  userType="vendor"
                />
                {isLoading && (
                  <p className="text-sm text-center text-muted-foreground">
                    Submitting KYC data...
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 text-center space-y-2">
              <span className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/vendor/login"
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
