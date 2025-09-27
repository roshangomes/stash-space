import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Camera,
  Calendar,
  User,
  Settings,
  BarChart3,
  Film,
  Lightbulb,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Film Equipment',
    url: '/inventory',
    icon: Camera,
  },
  {
    title: 'Rental Bookings',
    url: '/bookings',
    icon: Calendar,
  },
  {
    title: 'Active Rentals',
    url: '/orders',
    icon: Film,
  },
  {
    title: 'Reports',
    url: '/analytics',
    icon: BarChart3,
  },
];

const settingsItems = [
  {
    title: 'Profile',
    url: '/profile',
    icon: User,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => location.pathname === path;

  const getLinkClasses = (path: string) => {
    const baseClasses = "flex items-center w-full transition-smooth rounded-lg";
    return isActive(path)
      ? `${baseClasses} bg-primary text-primary-foreground shadow-primary`
      : `${baseClasses} text-muted-foreground hover:text-foreground hover:bg-accent`;
  };

  return (
    <Sidebar
      className={`${collapsed ? 'w-18' : 'w-64'} bg-card border-r border-border shadow-soft transition-smooth`}
    >
      <SidebarContent className="p-4">
        {/* Logo */}
        <div className="mb-8 px-2">
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-foreground">FilmGear Pro</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
              <Film className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={getLinkClasses(item.url)}
                    >
                      <item.icon className="w-5 h-5" />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Navigation */}
        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={getLinkClasses(item.url)}
                    >
                      <item.icon className="w-5 h-5" />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}