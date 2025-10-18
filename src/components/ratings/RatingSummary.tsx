import React from 'react';
import { Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface RatingSummaryProps {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  userRole?: 'renter' | 'vendor';
  className?: string;
}

export const RatingSummary: React.FC<RatingSummaryProps> = ({
  averageRating,
  totalReviews,
  ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  userRole,
  className = '',
}) => {
  const getRatingColor = (rating: number): string => {
    if (rating >= 4.5) return 'text-success';
    if (rating >= 3.5) return 'text-warning';
    return 'text-destructive';
  };

  const getRatingLabel = (rating: number): string => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 3.5) return 'Good';
    if (rating >= 2.5) return 'Fair';
    return 'Needs Improvement';
  };

  const getPercentage = (count: number): number => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          {userRole === 'vendor' ? 'Vendor Rating' : userRole === 'renter' ? 'Renter Rating' : 'Rating Summary'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Rating */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold ${getRatingColor(averageRating)}`}>
                {averageRating.toFixed(1)}
              </span>
              <span className="text-muted-foreground text-sm">/5.0</span>
            </div>
            <p className="text-sm text-muted-foreground">{getRatingLabel(averageRating)}</p>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(averageRating)
                    ? 'fill-warning text-warning'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Total Reviews */}
        <div className="text-sm text-muted-foreground">
          Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
        </div>

        {/* Rating Breakdown */}
        <div className="space-y-2 pt-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12">
                <span className="text-sm font-medium">{star}</span>
                <Star className="h-3 w-3 fill-warning text-warning" />
              </div>
              <Progress 
                value={getPercentage(ratingBreakdown[star as keyof typeof ratingBreakdown])} 
                className="h-2 flex-1" 
              />
              <span className="text-sm text-muted-foreground w-12 text-right">
                {ratingBreakdown[star as keyof typeof ratingBreakdown]}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
