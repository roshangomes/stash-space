/*
  File: src/components/layout/TopNavigation.tsx
  - Added safe checks for user data to fix 'charAt' error
  - Added logout functionality
*/
import React from "react";
// --- Import hooks and actions ---
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
// ---------------------------------
import {
  Search,
  Bell,
  LifeBuoy,
  LogOut,
  Settings,
  User as UserIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const TopNavigation: React.FC = () => {
  // Get user from Redux state
  const { user } = useSelector((state: RootState) => state.auth);

  // --- Get dispatch and navigate for logout ---
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // Redirect to landing page after logout
  };

  // --- SAFELY get initials ---
  // This fixes the 'charAt' of undefined error
  const getInitials = () => {
    const first = user?.first_name?.charAt(0) || "";
    const last = user?.last_name?.charAt(0) || "";
    const initials = `${first}${last}`.toUpperCase();
    // Return initials or a fallback icon
    return initials || <UserIcon className="w-5 h-5" />;
  };

  // --- SAFELY get user's full name ---
  const getFullName = () => {
    if (!user?.first_name) {
      return "Loading..."; // Fallback while user is loading
    }
    return `${user.first_name} ${user.last_name || ""}`;
  };

  // --- SAFELY get user's email ---
  const getEmail = () => {
    return user?.email || "...";
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search equipment, bookings..." className="pl-10" />
      </div>

      {/* Right-side Icons & User Menu */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="w-5 h-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer">
              {/* You can add an AvatarImage if you store image URLs */}
              {/* <AvatarImage src={user?.avatarUrl} alt="User" /> */}
              <AvatarFallback className="font-semibold text-sm">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="font-medium">{getFullName()}</div>
              <div className="text-xs text-muted-foreground font-normal">
                {getEmail()}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LifeBuoy className="w-4 h-4 mr-2" />
              Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* --- This is the new logout item --- */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
