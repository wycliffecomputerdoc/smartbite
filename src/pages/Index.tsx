
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowDown, Book, Clock, User } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Book,
      title: 'Smart Menu',
      description: 'AI-powered recommendations based on your preferences and dietary needs.',
    },
    {
      icon: Clock,
      title: 'Quick Reservations',
      description: 'Book your table instantly with our intelligent booking system.',
    },
    {
      icon: User,
      title: 'Personal Assistant',
      description: 'Our AI chatbot is here to help with orders, questions, and recommendations.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Welcome to <span className="text-yellow-300">SmartBite</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in">
            Experience the future of dining with AI-powered ordering, personalized recommendations, and seamless service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <Link to="/menu">
              <Button size="lg" className="btn-primary text-lg px-8 py-4">
                Explore Menu
              </Button>
            </Link>
            <Link to="/reservations">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900 text-lg px-8 py-4">
                Make Reservation
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-white/70" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              Revolutionizing Your Dining Experience
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover how AI technology enhances every aspect of your restaurant visit, from ordering to service.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-accent/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience SmartBite?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of satisfied customers who've discovered the future of dining.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/orders">
              <Button size="lg" className="btn-primary text-lg px-8 py-4">
                Order Now
              </Button>
            </Link>
            <Link to="/menu">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                View Full Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
