import React from 'react';
import { ClothingItem } from '../../types/recommendations';

interface ClothingCardProps {
  item: ClothingItem;
}

export const ClothingCard: React.FC<ClothingCardProps> = ({ item }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'top':
        return '👕';
      case 'bottom':
        return '👖';
      case 'outerwear':
        return '🧥';
      case 'footwear':
        return '👟';
      case 'accessories':
        return '🧤';
      default:
        return '👔';
    }
  };

  const getWarmthColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-blue-100 text-blue-800';
      case 2:
        return 'bg-green-100 text-green-800';
      case 3:
        return 'bg-yellow-100 text-yellow-800';
      case 4:
        return 'bg-orange-100 text-orange-800';
      case 5:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3">
        <div className="text-2xl">{getCategoryIcon(item.category)}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{item.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {item.category}
            </span>
            <span 
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getWarmthColor(item.warmthLevel)}`}
            >
              Warmth: {item.warmthLevel}/5
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};