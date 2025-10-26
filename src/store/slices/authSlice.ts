import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API_URL } from "@/lib/apiConfig";

// Define the shape of the user object
interface User {
  id: string;
  email: string;
  first_name: string; // Django sends snake_case
  last_name: string; // Django sends snake_case
  role: "vendor" | "customer" | "admin";
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
// This will be called from your LoginPage.tsx
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

// --- The Auth Slice ---
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Standard reducer for logging out
    logout: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("tokens");
    },
    // You can keep your original loginSuccess if needed for other things
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
        state.user = action.payload.user; // User object from Django
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
        state.user = action.payload.user; // User object from Django
        state.tokens = {
          access: action.payload.access,
          refresh: action.payload.refresh,
        };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

// Export the actions
export const { logout, loginSuccess } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;
