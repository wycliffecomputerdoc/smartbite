
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, ShoppingCart, Calendar, Star } from 'lucide-react';

const Admin = () => {
  const [orders] = useState([
    { id: '001', customer: 'John Doe', items: 3, total: 45.99, status: 'preparing' },
    { id: '002', customer: 'Jane Smith', items: 2, total: 32.50, status: 'ready' },
    { id: '003', customer: 'Mike Johnson', items: 1, total: 18.99, status: 'delivered' },
  ]);

  const [reservations] = useState([
    { id: '001', name: 'Sarah Wilson', date: '2024-06-15', time: '7:00 PM', guests: 4, status: 'confirmed' },
    { id: '002', name: 'David Brown', date: '2024-06-15', time: '8:30 PM', guests: 2, status: 'pending' },
    { id: '003', name: 'Emma Davis', date: '2024-06-16', time: '6:00 PM', guests: 6, status: 'confirmed' },
  ]);

  const [reviews] = useState([
    { id: '001', customer: 'Alex Thompson', rating: 5, comment: 'Amazing food and service!', sentiment: 'positive' },
    { id: '002', customer: 'Lisa Garcia', rating: 4, comment: 'Good food, but slow service.', sentiment: 'neutral' },
    { id: '003', customer: 'Chris Lee', rating: 5, comment: 'Best restaurant in town!', sentiment: 'positive' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'bg-yellow-500';
      case 'ready': return 'bg-green-500';
      case 'delivered': return 'bg-blue-500';
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'positive': return 'bg-green-500';
      case 'neutral': return 'bg-yellow-500';
      case 'negative': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen pt-8 pb-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">Admin Dashboard</h1>
          <p className="text-xl text-muted-foreground">Manage your restaurant operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <ShoppingCart className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">24</p>
              <p className="text-muted-foreground">Orders Today</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">18</p>
              <p className="text-muted-foreground">Reservations</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <User className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">156</p>
              <p className="text-muted-foreground">Customers</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Star className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">4.8</p>
              <p className="text-muted-foreground">Avg Rating</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-muted-foreground">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">{order.items} items • ${order.total}</p>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} text-white`}>
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reservations">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Reservations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reservations.map(reservation => (
                    <div key={reservation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{reservation.name}</p>
                        <p className="text-muted-foreground">{reservation.date} at {reservation.time}</p>
                        <p className="text-sm text-muted-foreground">{reservation.guests} guests</p>
                      </div>
                      <Badge className={`${getStatusColor(reservation.status)} text-white`}>
                        {reservation.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews & Sentiment Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{review.customer}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex text-yellow-500">
                            {'★'.repeat(review.rating)}
                          </div>
                          <Badge className={`${getStatusColor(review.sentiment)} text-white`}>
                            {review.sentiment}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
