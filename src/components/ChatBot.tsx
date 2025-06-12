
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X, MessageCircle, Send, Mic, MicOff } from 'lucide-react';
import { OpenAIService } from '@/services/openai';
import { VoiceService } from '@/services/voiceService';
import { useCart } from '@/contexts/CartContext';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your SmartBite AI assistant. I can help you with orders, reservations, menu questions, and more! You can type or use voice commands.",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [openAIKey, setOpenAIKey] = useState('');
  const { items: cartItems, addItem } = useCart();

  const voiceService = new VoiceService();

  const restaurantContext = `You are an AI assistant for SmartBite restaurant. You can help with:
  - Menu questions and recommendations
  - Making reservations 
  - Order assistance
  - Restaurant information (hours: Mon-Thu 11am-10pm, Fri-Sat 11am-11pm, Sun 12pm-9pm)
  - Location: 123 Main Street, Downtown
  - Phone: (555) 123-4567
  
  Current menu items: Truffle Burger ($24.99), Mediterranean Bowl ($18.99), Artisan Salad ($14.99), Chocolate Lava Cake ($12.99)
  
  Be helpful, friendly, and concise. If asked about orders, mention items can be added through the menu page.`;

  const getBotResponse = async (userMessage: string): Promise<string> => {
    const message = userMessage.toLowerCase();
    
    // Check for voice ordering commands
    if (message.includes('add') && (message.includes('cart') || message.includes('order'))) {
      return handleVoiceOrder(userMessage);
    }

    // Use OpenAI if API key is provided
    if (openAIKey.trim()) {
      try {
        const openAI = new OpenAIService(openAIKey);
        const response = await openAI.generateChatResponse([
          { role: 'system', content: restaurantContext },
          { role: 'user', content: userMessage }
        ]);
        return response;
      } catch (error) {
        console.error('AI response error:', error);
      }
    }

    // Fallback to predefined responses
    return getFallbackResponse(message);
  };

  const handleVoiceOrder = (command: string): string => {
    const menuItems = [
      { id: '1', name: 'Truffle Burger', price: 24.99 },
      { id: '2', name: 'Mediterranean Bowl', price: 18.99 },
      { id: '3', name: 'Artisan Salad', price: 14.99 },
      { id: '4', name: 'Chocolate Lava Cake', price: 12.99 }
    ];

    const lowerCommand = command.toLowerCase();
    
    for (const item of menuItems) {
      if (lowerCommand.includes(item.name.toLowerCase())) {
        addItem({
          id: item.id,
          name: item.name,
          price: item.price,
          description: `Added via voice command`
        });
        return `Great! I've added ${item.name} to your cart. Anything else you'd like to order?`;
      }
    }

    return "I didn't catch which item you'd like to add. Could you please specify the dish name clearly?";
  };

  const getFallbackResponse = (message: string): string => {
    if (message.includes('hours') || message.includes('open')) {
      return "We're open Monday-Thursday 11am-10pm, Friday-Saturday 11am-11pm, and Sunday 12pm-9pm.";
    }
    
    if (message.includes('location') || message.includes('address')) {
      return "We're located at 123 Main Street, Downtown. You can find us easily with GPS!";
    }
    
    if (message.includes('reservation')) {
      return "You can make a reservation through our Reservations page or call us at (555) 123-4567.";
    }
    
    if (message.includes('recommend')) {
      return "Based on our popular items, I'd recommend our Truffle Burger or Mediterranean Bowl. Both are customer favorites!";
    }

    return "I'm here to help! You can ask me about our menu, hours, location, reservations, or let me help you place an order. For the best experience, consider providing an OpenAI API key in the settings.";
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Get bot response
    const botResponseText = await getBotResponse(inputText);
    
    // Speak the response if voice service is available
    if (voiceService.isSupported()) {
      voiceService.speak(botResponseText);
    }

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponseText,
      isBot: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botResponse]);
    setInputText('');
  };

  const handleVoiceInput = async () => {
    if (!voiceService.isSupported()) {
      alert('Voice input is not supported in your browser.');
      return;
    }

    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
      return;
    }

    try {
      setIsListening(true);
      const transcript = await voiceService.startListening();
      setInputText(transcript);
      setIsListening(false);
      
      // Auto-send voice input
      if (transcript.trim()) {
        setTimeout(() => {
          setInputText(transcript);
          // Trigger send after setting the text
          const userMessage: Message = {
            id: Date.now().toString(),
            text: transcript,
            isBot: false,
            timestamp: new Date()
          };

          setMessages(prev => [...prev, userMessage]);
          
          getBotResponse(transcript).then(botResponseText => {
            if (voiceService.isSupported()) {
              voiceService.speak(botResponseText);
            }

            const botResponse: Message = {
              id: (Date.now() + 1).toString(),
              text: botResponseText,
              isBot: true,
              timestamp: new Date()
            };
            
            setMessages(prev => [...prev, botResponse]);
          });
          
          setInputText('');
        }, 100);
      }
    } catch (error) {
      console.error('Voice input error:', error);
      setIsListening(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-40 transition-all duration-300 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
        size="sm"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 z-50 animate-scale-in">
          <Card className="h-full flex flex-col shadow-2xl">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2 bg-primary text-primary-foreground rounded-t-lg">
              <CardTitle className="text-lg">SmartBite AI Assistant</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* API Key Input */}
              {!openAIKey && (
                <div className="p-3 bg-accent/50 border-b">
                  <Input
                    placeholder="Optional: Enter OpenAI API key for enhanced AI"
                    value={openAIKey}
                    onChange={(e) => setOpenAIKey(e.target.value)}
                    className="text-xs"
                    type="password"
                  />
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        message.isBot
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t flex gap-2">
                <Input
                  placeholder="Type your message or use voice..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                {voiceService.isSupported() && (
                  <Button
                    onClick={handleVoiceInput}
                    size="sm"
                    variant={isListening ? "destructive" : "outline"}
                    className="px-3"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                )}
                <Button onClick={handleSendMessage} size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ChatBot;
