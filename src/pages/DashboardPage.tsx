import React from 'react';
import { useSelector } from 'react-redux';
import { 
  Package, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RootState } from '@/store/store';

const stats = [
  {
    title: 'Total Equipment',
    value: '47',
    change: '+12%',
    changeType: 'positive' as const,
    icon: Package,
  },
  {
    title: 'Active Bookings',
    value: '23',
    change: '+8%',
    changeType: 'positive' as const,
    icon: Calendar,
  },
  {
    title: 'Monthly Revenue',
    value: '₹45,230',
    change: '+23%',
    changeType: 'positive' as const,
    icon: DollarSign,
  },
  {
    title: 'Utilization Rate',
    value: '73%',
    change: '+5%',
    changeType: 'positive' as const,
    icon: TrendingUp,
  },
];

const recentBookings = [
  {
    id: '1',
    equipment: 'JCB Excavator 320',
    customer: 'Sharma Construction',
    date: '2024-01-15',
    status: 'confirmed' as const,
    amount: '₹12,500',
  },
  {
    id: '2',
    equipment: 'Concrete Mixer Large',
    customer: 'BuildCorp Ltd',
    date: '2024-01-16',
    status: 'pending' as const,
    amount: '₹8,900',
  },
  {
    id: '3',
    equipment: 'Tower Crane',
    customer: 'Metro Projects',
    date: '2024-01-17',
    status: 'completed' as const,
    amount: '₹25,000',
  },
];

const alerts = [
  {
    id: '1',
    message: 'Hydraulic Pump needs maintenance',
    type: 'warning' as const,
    time: '2 hours ago',
  },
  {
    id: '2',
    message: 'New booking request for Excavator',
    type: 'info' as const,
    time: '4 hours ago',
  },
  {
    id: '3',
    message: 'Payment received from BuildCorp',
    type: 'success' as const,
    time: '6 hours ago',
  },
];

export const DashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-success text-success-foreground">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-primary text-primary-foreground">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-success" />;
      default:
        return <Clock className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.name || 'Vendor'}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your equipment rental business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-soft bg-gradient-card border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-success">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Bookings */}
        <Card className="shadow-soft bg-gradient-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Recent Bookings
            </CardTitle>
            <CardDescription>
              Latest equipment rental requests and bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-background shadow-soft"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{booking.equipment}</p>
                    <p className="text-sm text-muted-foreground">{booking.customer}</p>
                    <p className="text-xs text-muted-foreground">{booking.date}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-semibold text-foreground">{booking.amount}</p>
                    {getStatusBadge(booking.status)}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Bookings
            </Button>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card className="shadow-soft bg-gradient-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Alerts & Notifications
            </CardTitle>
            <CardDescription>
              Important updates and maintenance reminders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-background shadow-soft"
                >
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Alerts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-soft bg-gradient-card border-0">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts for managing your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Button variant="gradient" className="h-12">
              <Package className="w-4 h-4 mr-2" />
              Add Equipment
            </Button>
            <Button variant="outline" className="h-12">
              <Users className="w-4 h-4 mr-2" />
              Manage Customers
            </Button>
            <Button variant="outline" className="h-12">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};