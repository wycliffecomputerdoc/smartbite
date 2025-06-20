
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Plus } from 'lucide-react';
import { useRecommendations } from '@/hooks/useRecommendations';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

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

interface MenuRecommendationsProps {
  menuItems: MenuItem[];
  userPreferences?: {
    dietary: string[];
    favoriteCategories: string[];
    priceRange: [number, number];
  };
}

const MenuRecommendations = ({ menuItems, userPreferences }: MenuRecommendationsProps) => {
  const { recommendations, isLoading } = useRecommendations(menuItems, userPreferences);
  const { addItem } = useCart();

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      description: item.description
    });
    toast.success(`${item.name} added to cart!`);
  };

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Finding perfect recommendations...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Recommended for You
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map(item => (
            <Card key={item.id} className="card-hover overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img
                  src={item.image || '/placeholder.svg'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-sm">{item.name}</h4>
                  <span className="text-sm font-bold text-primary">${item.price}</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.dietary.slice(0, 2).map(diet => (
                    <Badge key={diet} variant="secondary" className="text-xs">
                      {diet}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs">{item.rating}</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(item)}
                    className="h-8 px-3"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuRecommendations;
