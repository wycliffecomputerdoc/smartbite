
interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export class OpenAIService {
  private apiKey: string;
  private baseURL = 'https://api.openai.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateChatResponse(messages: OpenAIMessage[]): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages,
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data: ChatCompletionResponse = await response.json();
      return data.choices[0]?.message?.content || 'I apologize, but I cannot provide a response right now.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      return 'I apologize, but I\'m having trouble processing your request. Please try again later.';
    }
  }

  async analyzeSentiment(text: string): Promise<{ sentiment: 'positive' | 'negative' | 'neutral'; score: number }> {
    try {
      const response = await this.generateChatResponse([
        {
          role: 'system',
          content: 'You are a sentiment analysis AI. Analyze the sentiment of the given text and respond with a JSON object containing "sentiment" (positive/negative/neutral) and "score" (0-1 where 0 is very negative, 0.5 is neutral, 1 is very positive).'
        },
        {
          role: 'user',
          content: text
        }
      ]);

      const result = JSON.parse(response);
      return {
        sentiment: result.sentiment,
        score: result.score
      };
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      return { sentiment: 'neutral', score: 0.5 };
    }
  }

  async generateMenuRecommendations(
    userPreferences: any,
    menuItems: any[],
    orderHistory: any[] = []
  ): Promise<string[]> {
    try {
      const prompt = `Based on user preferences: ${JSON.stringify(userPreferences)}, 
                     available menu items: ${JSON.stringify(menuItems.map(item => ({ id: item.id, name: item.name, category: item.category, dietary: item.dietary })))}, 
                     and order history: ${JSON.stringify(orderHistory)}, 
                     recommend 3-5 menu item IDs that the user would likely enjoy. 
                     Respond with a JSON array of item IDs only.`;

      const response = await this.generateChatResponse([
        {
          role: 'system',
          content: 'You are a restaurant recommendation AI. Provide personalized menu recommendations based on user data.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]);

      return JSON.parse(response);
    } catch (error) {
      console.error('Recommendation generation error:', error);
      return [];
    }
  }
}
