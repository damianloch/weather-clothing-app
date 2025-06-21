import React from 'react';
import { DailyClothingRecommendation } from '../../types/recommendations';
import { ClothingCard } from './ClothingCard';

interface RecommendationListProps {
  recommendation: DailyClothingRecommendation;
}

export const RecommendationList: React.FC<RecommendationListProps> = ({ 
  recommendation 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Clothing Recommendations
        </h2>
        <p className="text-gray-600">{recommendation.summary}</p>
      </div>

      {recommendation.layeringAdvice && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg 
                className="h-5 w-5 text-blue-400 mt-0.5" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Layering Strategy
              </h3>
              <p className="mt-1 text-sm text-blue-700">
                {recommendation.layeringAdvice}
              </p>
            </div>
          </div>
        </div>
      )}

      {recommendation.recommendations.map((rec, index) => (
        <div key={rec.id} className="mb-6">
          {rec.timeOfDay !== 'all-day' && (
            <h3 className="text-lg font-semibold text-gray-800 mb-3 capitalize">
              {rec.timeOfDay} Outfit
            </h3>
          )}
          
          {rec.layeringStrategy && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Layering Strategy:</strong> {rec.layeringStrategy}
              </p>
            </div>
          )}

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {rec.items.map((item) => (
              <ClothingCard key={item.id} item={item} />
            ))}
          </div>

          {rec.notes && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> {rec.notes}
              </p>
            </div>
          )}
        </div>
      ))}

      {recommendation.specialNotes && (
        <div className="border-t pt-4 mt-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg 
                  className="h-5 w-5 text-orange-400 mt-0.5" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-orange-800">
                  Special Considerations
                </h3>
                <p className="mt-1 text-sm text-orange-700">
                  {recommendation.specialNotes}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};