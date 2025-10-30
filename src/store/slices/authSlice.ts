/*
  File: src/store/slices/authSlice.ts
  - This is the fully updated file with the 'submitKyc' thunk.
*/
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "@/lib/apiConfig";

// --- ADDED: Interface for KYC data ---
// This must match the interface in AadhaarKycFlow.tsx
export interface KycData {
  aadhaarNumber: string;
  isVerified: boolean;
  name: string;
  dob: string;
  address: string;
  verificationTimestamp: string;
}
// ------------------------------------

// Define the shape of the user object
interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "vendor" | "customer" | "admin";
  // --- ADDED: New fields from CustomUser model ---
  business_name: string | null;
  is_kyc_verified: boolean;
  // ---------------------------------------------
}

// Define the shape of the auth tokens
interface AuthTokens {
  access: string;
  refresh: string;
}

// Define the shape of the auth state
interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// loginData and registerData should have proper interfaces:
interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  role: "vendor" | "customer" | "admin";
  // --- ADDED: business_name for vendor signup ---
  business_name?: string;
  // --------------------------------------------
}

interface ApiResponse {
  access: string;
  refresh: string;
  user: User;
  detail?: string;
}

// Get user/tokens from localStorage if they exist
const storedUser = localStorage.getItem("user");
const storedTokens = localStorage.getItem("tokens");

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  tokens: storedTokens ? JSON.parse(storedTokens) : null,
  isAuthenticated: !!storedUser,
  status: "idle",
  error: null,
};

// --- Async Thunk for User Login ---
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginData: LoginData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.detail || "Login failed");
      }

      const { access, refresh, user } = data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("tokens", JSON.stringify({ access, refresh }));

      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }
);

// --- Async Thunk for User Registration ---
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (registerData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        const errorMessages =
          typeof data === "object"
            ? Object.values(data).join(", ")
            : "Registration failed";
        return rejectWithValue(errorMessages);
      }

      const { access, refresh, user } = data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("tokens", JSON.stringify({ access, refresh }));

      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }
);

// --- ADDED: Async Thunk for Submitting KYC ---
export const submitKyc = createAsyncThunk(
  "auth/submitKyc",
  async (kycData: KycData, { getState, rejectWithValue }) => {
    // Get the auth token from our own state
    const state = (getState() as { auth: AuthState }).auth;
    const token = state.tokens?.access;

    if (!token) {
      return rejectWithValue("No auth token found. Please log in.");
    }

    try {
      const response = await fetch(`${API_URL}/kyc/submit/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include the auth token
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(kycData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.detail || "KYC submission failed");
      }

      const data = await response.json();
      // On success, we just return the KYC data
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }
);
// -------------------------------------------

// --- The Auth Slice ---
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("tokens");
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.status = "succeeded";
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Login Cases ---
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.tokens = {
          access: action.payload.access,
          refresh: action.payload.refresh,
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // --- Registration Cases ---
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.tokens = {
          access: action.payload.access,
          refresh: action.payload.refresh,
        };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // --- ADDED: KYC Submission Cases ---
      .addCase(submitKyc.pending, (state) => {
        state.status = "loading"; // Use auth loading state
        state.error = null;
      })
      .addCase(submitKyc.fulfilled, (state) => {
        state.status = "succeeded";
        if (state.user) {
          // Manually update the user's KYC status in Redux
          state.user.is_kyc_verified = true;
          // Also update the user in localStorage
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      })
      .addCase(submitKyc.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
    // -------------------------------------
  },
});

export const { logout, loginSuccess } = authSlice.actions;
export default authSlice.reducer;
