import React from 'react';
import { Badge } from './badge';
import { CheckCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SkillBadgeProps {
  name: string;
  level?: number;
  verified?: boolean;
  className?: string;
}

export function SkillBadge({ name, level, verified, className }: SkillBadgeProps) {
  return (
    <div className={cn("inline-flex items-center space-x-1", className)}>
      <Badge 
        variant={verified ? "default" : "secondary"}
        className={cn(
          "flex items-center space-x-1",
          verified && "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
        )}
      >
        <span>{name}</span>
        {verified && <CheckCircle className="w-3 h-3" />}
      </Badge>
      {level && (
        <div className="flex items-center">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={cn(
                "w-3 h-3",
                i < level 
                  ? "text-yellow-400 fill-current" 
                  : "text-gray-300 dark:text-gray-600"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}