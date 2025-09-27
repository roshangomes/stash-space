import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Package,
  Eye,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RootState } from '@/store/store';
import { setSearchTerm, setCategoryFilter } from '@/store/slices/inventorySlice';

// Mock data for demonstration
const mockEquipment = [
  {
    id: '1',
    name: 'JCB Excavator 320',
    category: 'Heavy Machinery',
    description: 'Heavy-duty excavator for construction',
    dailyRate: 2500,
    availability: 'available' as const,
    images: [],
    specifications: { weight: '20 tons', power: '170 HP' },
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Concrete Mixer Large',
    category: 'Construction Equipment',
    description: 'Industrial concrete mixer',
    dailyRate: 800,
    availability: 'rented' as const,
    images: [],
    specifications: { capacity: '500L', power: '15 HP' },
    createdAt: '2024-01-02',
  },
  {
    id: '3',
    name: 'Tower Crane',
    category: 'Heavy Machinery',
    description: 'High-capacity tower crane',
    dailyRate: 5000,
    availability: 'maintenance' as const,
    images: [],
    specifications: { height: '60m', capacity: '12 tons' },
    createdAt: '2024-01-03',
  },
];

const categories = ['All Categories', 'Heavy Machinery', 'Construction Equipment', 'Power Tools', 'Safety Equipment'];

export const InventoryPage: React.FC = () => {
  const dispatch = useDispatch();
  const { searchTerm, categoryFilter } = useSelector((state: RootState) => state.inventory);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'available':
        return <Badge className="bg-success text-success-foreground">Available</Badge>;
      case 'rented':
        return <Badge className="bg-warning text-warning-foreground">Rented</Badge>;
      case 'maintenance':
        return <Badge className="bg-destructive text-destructive-foreground">Maintenance</Badge>;
      default:
        return <Badge variant="outline">{availability}</Badge>;
    }
  };

  const filteredEquipment = mockEquipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || categoryFilter === 'All Categories' || 
                           item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Equipment Inventory</h1>
          <p className="text-muted-foreground">
            Manage your equipment catalog and availability
          </p>
        </div>
        <Button variant="gradient" className="shadow-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-soft bg-gradient-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Equipment</p>
                <p className="text-2xl font-bold text-foreground">47</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft bg-gradient-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Package className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-foreground">32</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft bg-gradient-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Package className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rented</p>
                <p className="text-2xl font-bold text-foreground">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft bg-gradient-card border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Maintenance</p>
                <p className="text-2xl font-bold text-foreground">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-soft bg-gradient-card border-0">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={categoryFilter}
              onValueChange={(value) => dispatch(setCategoryFilter(value))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Table */}
      <Card className="shadow-soft bg-gradient-card border-0">
        <CardHeader>
          <CardTitle>Equipment List</CardTitle>
          <CardDescription>
            Comprehensive list of all your equipment with current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Daily Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipment.map((equipment) => (
                <TableRow key={equipment.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{equipment.name}</p>
                      <p className="text-sm text-muted-foreground">{equipment.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{equipment.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-foreground">₹{equipment.dailyRate.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">/day</span>
                  </TableCell>
                  <TableCell>
                    {getAvailabilityBadge(equipment.availability)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};