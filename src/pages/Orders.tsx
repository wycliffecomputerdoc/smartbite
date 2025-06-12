
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const Orders = () => {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    
    // Here you would typically process the order
    toast.success('Order placed successfully! We\'ll prepare your food right away.');
    clearCart();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-8 pb-16 px-4 bg-background">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <ShoppingCart className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Add some delicious items from our menu to get started!
            </p>
            <Link to="/menu">
              <Button className="btn-primary text-lg px-8 py-4">
                Browse Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-16 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">Your Order</h1>
          <p className="text-xl text-muted-foreground">Review your items before checkout</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <Card key={item.id} className="shadow-md">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {item.description && (
                        <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          
                          <Badge variant="secondary" className="px-3 py-1">
                            {item.quantity}
                          </Badge>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8.5%)</span>
                    <span>${(total * 0.085).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>$3.99</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${(total + (total * 0.085) + 3.99).toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleCheckout}
                  className="w-full btn-primary text-lg py-6"
                >
                  Place Order
                </Button>

                <div className="text-center">
                  <Link to="/menu">
                    <Button variant="outline" className="w-full">
                      Add More Items
                    </Button>
                  </Link>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  <p>Estimated delivery time: 25-35 minutes</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
