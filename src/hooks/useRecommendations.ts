
import { useState, useEffect } from 'react';
import { OpenAIService } from '@/services/openai';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  dietary: string[];
  rating: number;
}

interface UserPreferences {
  dietary: string[];
  favoriteCategories: string[];
  priceRange: [number, number];
}

export const useRecommendations = (
  menuItems: MenuItem[],
  userPreferences?: UserPreferences,
  orderHistory: any[] = []
) => {
  const [recommendations, setRecommendations] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateRecommendations = async (openAIKey?: string) => {
    setIsLoading(true);
    try {
      let recommendedItems: MenuItem[] = [];

      if (openAIKey && userPreferences) {
        // Use AI recommendations if API key is available
        const openAI = new OpenAIService(openAIKey);
        const recommendedIds = await openAI.generateMenuRecommendations(
          userPreferences,
          menuItems,
          orderHistory
        );
        recommendedItems = menuItems.filter(item => recommendedIds.includes(item.id));
      } else {
        // Fallback to rule-based recommendations
        recommendedItems = getBasicRecommendations(menuItems, userPreferences);
      }

      setRecommendations(recommendedItems.slice(0, 6));
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Fallback to basic recommendations
      setRecommendations(getBasicRecommendations(menuItems, userPreferences).slice(0, 6));
    } finally {
      setIsLoading(false);
    }
  };

  const getBasicRecommendations = (
    items: MenuItem[],
    preferences?: UserPreferences
  ): MenuItem[] => {
    let filtered = [...items];

    if (preferences) {
      // Filter by dietary preferences
      if (preferences.dietary.length > 0) {
        filtered = filtered.filter(item =>
          preferences.dietary.some(diet => item.dietary.includes(diet))
        );
      }

      // Filter by favorite categories
      if (preferences.favoriteCategories.length > 0) {
        filtered = filtered.filter(item =>
          preferences.favoriteCategories.includes(item.category)
        );
      }

      // Filter by price range
      filtered = filtered.filter(item =>
        item.price >= preferences.priceRange[0] && item.price <= preferences.priceRange[1]
      );
    }

    // Sort by rating if no specific preferences
    return filtered.sort((a, b) => b.rating - a.rating);
  };

  useEffect(() => {
    if (menuItems.length > 0) {
      generateRecommendations();
    }
  }, [menuItems, userPreferences]);

  return {
    recommendations,
    isLoading,
    generateRecommendations
  };
};
