import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AadhaarKycFlowProps {
  onKycComplete: (kycData: KycData) => void;
  userType: 'vendor' | 'customer';
}

export interface KycData {
  aadhaarNumber: string;
  isVerified: boolean;
  name: string;
  dob: string;
  address: string;
  verificationTimestamp: string;
}

type KycStep = 'aadhaar-input' | 'otp-verification' | 'verified';

export const AadhaarKycFlow: React.FC<AadhaarKycFlowProps> = ({ onKycComplete, userType }) => {
  const [step, setStep] = useState<KycStep>('aadhaar-input');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarOtp, setAadhaarOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [kycData, setKycData] = useState<KycData | null>(null);

  // Validate Aadhaar number format (12 digits)
  const validateAadhaar = (value: string): boolean => {
    const cleanedValue = value.replace(/\s/g, '');
    return /^\d{12}$/.test(cleanedValue);
  };

  // Format Aadhaar for display (XXXX XXXX XXXX)
  const formatAadhaarDisplay = (value: string): string => {
    const cleaned = value.replace(/\s/g, '');
    const match = cleaned.match(/(\d{1,4})(\d{1,4})?(\d{1,4})?/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join(' ');
    }
    return value;
  };

  const handleAadhaarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateAadhaar(aadhaarNumber)) {
      toast.error('Please enter a valid 12-digit Aadhaar number');
      setIsLoading(false);
      return;
    }

    // Mock API call to generate Aadhaar OTP
    setTimeout(() => {
      toast.success('OTP sent to your Aadhaar-linked mobile number');
      setStep('otp-verification');
      setIsLoading(false);
    }, 1500);
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (aadhaarOtp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      setIsLoading(false);
      return;
    }

    // Mock API call to verify OTP and fetch e-KYC data
    setTimeout(() => {
      const mockKycData: KycData = {
        aadhaarNumber: aadhaarNumber.replace(/\s/g, ''),
        isVerified: true,
        name: 'John Doe', // Mock data from Aadhaar
        dob: '1990-01-01',
        address: '123 Main Street, Mumbai, Maharashtra - 400001',
        verificationTimestamp: new Date().toISOString(),
      };

      setKycData(mockKycData);
      setStep('verified');
      toast.success('Aadhaar verification successful!');
      setIsLoading(false);
      onKycComplete(mockKycData);
    }, 2000);
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setTimeout(() => {
      toast.success('OTP resent to your Aadhaar-linked mobile');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      {/* KYC Requirement Notice */}
      {userType === 'vendor' && step === 'aadhaar-input' && (
        <Alert className="border-primary/50 bg-primary/5">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <AlertDescription className="text-sm">
            <strong>Vendor KYC Mandatory:</strong> Aadhaar verification is required for all vendors 
            to build trust and ensure platform security.
          </AlertDescription>
        </Alert>
      )}

      {userType === 'customer' && step === 'aadhaar-input' && (
        <Alert className="border-accent/50 bg-accent/5">
          <AlertCircle className="h-5 w-5 text-accent" />
          <AlertDescription className="text-sm">
            <strong>Optional for Customers:</strong> Complete KYC to unlock premium features and 
            increase your trust score with vendors.
          </AlertDescription>
        </Alert>
      )}

      {/* Aadhaar Input Step */}
      {step === 'aadhaar-input' && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              Aadhaar Verification
            </CardTitle>
            <CardDescription>
              Enter your 12-digit Aadhaar number to verify your identity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAadhaarSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aadhaar">Aadhaar Number</Label>
                <Input
                  id="aadhaar"
                  type="text"
                  placeholder="XXXX XXXX XXXX"
                  value={formatAadhaarDisplay(aadhaarNumber)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, '');
                    if (/^\d{0,12}$/.test(value)) {
                      setAadhaarNumber(value);
                    }
                  }}
                  maxLength={14}
                  className="h-12 text-center text-lg tracking-wider"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Your Aadhaar data is encrypted and stored securely
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                variant="default"
                disabled={isLoading || !validateAadhaar(aadhaarNumber)}
              >
                {isLoading ? 'Generating OTP...' : 'Send OTP to Aadhaar Mobile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* OTP Verification Step */}
      {step === 'otp-verification' && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Verify OTP
            </CardTitle>
            <CardDescription>
              Enter the 6-digit OTP sent to your Aadhaar-linked mobile number
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOtpVerification} className="space-y-6">
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <Label>Aadhaar OTP</Label>
                  <p className="text-sm text-muted-foreground">
                    Aadhaar: {formatAadhaarDisplay(aadhaarNumber)}
                  </p>
                </div>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={aadhaarOtp}
                    onChange={(value) => setAadhaarOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                variant="default"
                disabled={isLoading || aadhaarOtp.length !== 6}
              >
                {isLoading ? 'Verifying...' : 'Verify Aadhaar'}
              </Button>

              <div className="text-center space-y-2">
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-sm"
                >
                  Resend OTP
                </Button>
                <div>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => {
                      setStep('aadhaar-input');
                      setAadhaarOtp('');
                    }}
                    className="text-sm"
                  >
                    Change Aadhaar Number
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Verification Success */}
      {step === 'verified' && kycData && (
        <Card className="border-success/50 bg-success/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-success">
              <CheckCircle2 className="h-5 w-5" />
              Aadhaar Verified Successfully
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{kycData.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Aadhaar:</span>
                <span className="font-medium">XXXX XXXX {aadhaarNumber.slice(-4)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium text-success flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Verified
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
