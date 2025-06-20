
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import MenuRecommendations from '@/components/MenuRecommendations';

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

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDietary, setSelectedDietary] = useState('all');
  const { addItem } = useCart();

  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Truffle Burger',
      description: 'Premium beef patty with truffle sauce, arugula, and aged cheddar',
      price: 24.99,
      category: 'mains',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center',
      dietary: ['gluten-free-option'],
      rating: 4.8
    },
    {
      id: '2',
      name: 'Mediterranean Bowl',
      description: 'Quinoa, roasted vegetables, feta cheese, and tahini dressing',
      price: 18.99,
      category: 'mains',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center',
      dietary: ['vegetarian', 'gluten-free'],
      rating: 4.6
    },
    {
      id: '3',
      name: 'Artisan Salad',
      description: 'Mixed greens, seasonal fruits, nuts, and house vinaigrette',
      price: 14.99,
      category: 'appetizers',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop&crop=center',
      dietary: ['vegan', 'gluten-free'],
      rating: 4.4
    },
    {
      id: '4',
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with molten center and vanilla ice cream',
      price: 12.99,
      category: 'desserts',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop&crop=center',
      dietary: ['vegetarian'],
      rating: 4.9
    },
    {
      id: '5',
      name: 'Grilled Salmon',
      description: 'Atlantic salmon with lemon herb butter and roasted vegetables',
      price: 26.99,
      category: 'mains',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop&crop=center',
      dietary: ['gluten-free', 'keto'],
      rating: 4.7
    },
    {
      id: '6',
      name: 'Margherita Pizza',
      description: 'Wood-fired pizza with fresh mozzarella, basil, and San Marzano tomatoes',
      price: 19.99,
      category: 'mains',
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop&crop=center',
      dietary: ['vegetarian'],
      rating: 4.5
    },
    {
      id: '7',
      name: 'Caesar Salad',
      description: 'Crisp romaine lettuce, parmesan cheese, croutons, and caesar dressing',
      price: 16.99,
      category: 'appetizers',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop&crop=center',
      dietary: ['vegetarian'],
      rating: 4.3
    },
    {
      id: '8',
      name: 'Tiramisu',
      description: 'Classic Italian dessert with mascarpone, coffee, and cocoa',
      price: 10.99,
      category: 'desserts',
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop&crop=center',
      dietary: ['vegetarian'],
      rating: 4.6
    }
  ];

  const categories = ['all', 'appetizers', 'mains', 'desserts', 'beverages'];
  const dietaryOptions = ['all', 'vegetarian', 'vegan', 'gluten-free'];

  // Add user preferences (in a real app, this would come from user profile)
  const userPreferences = {
    dietary: ['vegetarian'],
    favoriteCategories: ['mains'],
    priceRange: [10, 30] as [number, number]
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesDietary = selectedDietary === 'all' || item.dietary.includes(selectedDietary);
    
    return matchesSearch && matchesCategory && matchesDietary;
  });

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

  return (
    <div className="min-h-screen pt-8 pb-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">Our Menu</h1>
          <p className="text-xl text-muted-foreground">Discover our carefully curated selection of dishes</p>
        </div>

        {/* AI Recommendations */}
        <MenuRecommendations 
          menuItems={menuItems} 
          userPreferences={userPreferences}
        />

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2">
              {dietaryOptions.map(option => (
                <Button
                  key={option}
                  variant={selectedDietary === option ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDietary(option)}
                  className="capitalize"
                >
                  {option === 'all' ? 'All Dietary' : option}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <Card key={item.id} className="card-hover overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <span className="text-lg font-bold text-primary">${item.price}</span>
                </div>
                <p className="text-muted-foreground mb-4">{item.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {item.dietary.map(diet => (
                    <Badge key={diet} variant="secondary" className="text-xs">
                      {diet}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                  <Button
                    onClick={() => handleAddToCart(item)}
                    className="btn-primary"
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No items found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
