import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Heart, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const BrowseEquipment: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const equipment = [
    {
      id: '1',
      name: 'Canon EOS R5',
      brand: 'Canon',
      category: 'cameras',
      dailyRate: 150,
      weeklyRate: 900,
      rating: 4.9,
      reviewCount: 42,
      availability: 'available',
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop',
      vendor: 'Pro Rental Co.',
      description: '45MP Full-Frame Mirrorless Camera with 8K Video'
    },
    {
      id: '2',
      name: 'Sony A7S III',
      brand: 'Sony',
      category: 'cameras',
      dailyRate: 140,
      weeklyRate: 840,
      rating: 4.8,
      reviewCount: 38,
      availability: 'available',
      image: 'https://images.unsplash.com/photo-1606983340090-0b32c6d81e1e?w=400&h=300&fit=crop',
      vendor: 'Film Studio Gear',
      description: '4K Full-Frame Mirrorless Camera for Video'
    },
    {
      id: '3',
      name: 'Canon 24-70mm f/2.8L',
      brand: 'Canon',
      category: 'lenses',
      dailyRate: 80,
      weeklyRate: 480,
      rating: 4.9,
      reviewCount: 56,
      availability: 'available',
      image: 'https://images.unsplash.com/photo-1606983340200-8f6c38a31e0e?w=400&h=300&fit=crop',
      vendor: 'Lens Masters',
      description: 'Professional Standard Zoom Lens'
    },
    {
      id: '4',
      name: 'Arri SkyPanel S60-C',
      brand: 'Arri',
      category: 'lighting',
      dailyRate: 120,
      weeklyRate: 720,
      rating: 4.9,
      reviewCount: 24,
      availability: 'available',
      image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop',
      vendor: 'Lighting Masters',
      description: 'Full-Color LED Panel with Remote Control'
    },
    {
      id: '5',
      name: 'Rode VideoMic Pro+',
      brand: 'Rode',
      category: 'audio',
      dailyRate: 35,
      weeklyRate: 210,
      rating: 4.7,
      reviewCount: 31,
      availability: 'rented',
      image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop',
      vendor: 'Sound Solutions',
      description: 'Professional On-Camera Microphone'
    },
    {
      id: '6',
      name: 'DJI Ronin 4D',
      brand: 'DJI',
      category: 'stabilization',
      dailyRate: 200,
      weeklyRate: 1200,
      rating: 4.8,
      reviewCount: 19,
      availability: 'available',
      image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop',
      vendor: 'Motion Pictures',
      description: 'Cinema Camera Gimbal System'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'cameras', label: 'Cameras' },
    { value: 'lenses', label: 'Lenses' },
    { value: 'lighting', label: 'Lighting' },
    { value: 'audio', label: 'Audio' },
    { value: 'stabilization', label: 'Stabilization' },
    { value: 'accessories', label: 'Accessories' },
  ];

  const filteredEquipment = equipment
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.dailyRate - b.dailyRate;
        case 'price-high':
          return b.dailyRate - a.dailyRate;
        case 'rating':
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Browse Equipment</h1>
        <p className="text-muted-foreground">
          Find and rent professional filmmaking gear
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredEquipment.length} results
        </p>
      </div>

      {/* Equipment Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEquipment.map((item) => (
          <Card key={item.id} className="group hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Badge 
                className={`absolute top-2 left-2 ${
                  item.availability === 'available' 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-orange-500 hover:bg-orange-600'
                }`}
              >
                {item.availability === 'available' ? 'Available' : 'Rented'}
              </Badge>
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.vendor}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current text-yellow-400" />
                    <span className="text-xs font-medium">{item.rating}</span>
                    <span className="text-xs text-muted-foreground">({item.reviewCount})</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-lg font-bold">${item.dailyRate}/day</p>
                    <p className="text-xs text-muted-foreground">${item.weeklyRate}/week</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/customer/equipment/${item.id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="gradient"
                      disabled={item.availability !== 'available'}
                    >
                      <Calendar className="mr-1 h-3 w-3" />
                      {item.availability === 'available' ? 'Book Now' : 'Unavailable'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No equipment found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};