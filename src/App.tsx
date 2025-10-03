import React, { useState } from 'react';

interface QuoteResponse {
  result: {
    quote: string;
    metadata: {
      cardNumber: number;
      timestamp: string;
      isOriginal: boolean;
    };
  };
  confidence: number;
  metadata: {
    processing_time: string;
    source: string;
  };
}

interface Card {
  id: number;
  title: string;
  quote: string;
  isLoading: boolean;
}

const AGENT_ID = '68df95d0ed4f542c5e8e100c';

export default function App() {
  const [cards, setCards] = useState<Card[]>([
    { id: 1, title: 'Inspiration', quote: '', isLoading: false },
    { id: 2, title: 'Motivation', quote: '', isLoading: false },
    { id: 3, title: 'Wisdom', quote: '', isLoading: false }
  ]);

  const generateRandomId = () => Math.random().toString(36).substring(7);

  const fetchQuote = async (cardNumber: number): Promise<string> => {
    try {
      const userId = `${generateRandomId()}@test.com`;
      const sessionId = `${AGENT_ID}-${generateRandomId()}`;

      const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'sk-default-obhGvAo6gG9YT9tu6ChjyXLqnw7TxSGY'
        },
        body: JSON.stringify({
          user_id: userId,
          agent_id: AGENT_ID,
          session_id: sessionId,
          message: `Generate motivational quote for card ${cardNumber}`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quote');
      }

      const data = await response.json();
      const quoteData = data as QuoteResponse;

      return quoteData.result?.quote || 'Stay motivated and keep moving forward!';
    } catch (error) {
      console.error('Error fetching quote:', error);
      return 'Every journey begins with a single step.';
    }
  };

  const handleCardClick = async (cardId: number) => {
    setCards(prev => prev.map(card =>
      card.id === cardId ? { ...card, isLoading: true } : card
    ));

    try {
      const quote = await fetchQuote(cardId);
      setCards(prev => prev.map(card =>
        card.id === cardId ? { ...card, quote, isLoading: false } : card
      ));
    } catch (error) {
      setCards(prev => prev.map(card =>
        card.id === cardId ? { ...card, isLoading: false, quote: 'Click to generate a quote!' } : card
      ));
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent, cardId: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick(cardId);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{background: 'linear-gradient(135deg, #F5FAFF 0%, #E8F4FF 100%)'}}>
      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl w-full">
        {cards.map((card) => (
          <div
            key={card.id}
            className="relative group cursor-pointer"
            onClick={() => handleCardClick(card.id)}
            onKeyPress={(e) => handleKeyPress(e, card.id)}
            tabIndex={0}
            role="button"
            aria-label={`${card.title} card, press enter to generate quote`}
          >
            <div
              className="h-80 w-full lg:w-80 bg-white bg-opacity-30 backdrop-blur-xl rounded-3xl border border-white border-opacity-40 shadow-2xl p-8 transform transition-all duration-500 hover:scale-105 hover:bg-opacity-40 hover:shadow-3xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-70 active:scale-95 group-hover:shadow-xl"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.4)'
              }}
            >
              <div className="h-full flex flex-col">
                <h3 className="text-2xl font-bold text-center mb-6" style={{ color: '#243143', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  {card.title}
                </h3>

                <div className="flex-1 flex items-center justify-center">
                  {card.isLoading ? (
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-2 border-gray-700 border-t-transparent rounded-full animate-spin mb-4" style={{boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}></div>
                      <p className="text-gray-700 text-opacity-90 text-sm" style={{textShadow: '0 1px 2px rgba(0,0,0,0.1)'}}>Generating quote...</p>
                    </div>
                  ) : card.quote ? (
                    <p className="text-gray-900 text-center text-lg leading-relaxed font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                      {card.quote}
                    </p>
                  ) : (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-700 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{boxShadow: '0 4px 16px rgba(0,0,0,0.1)'}}>
                        <span className="text-2xl text-gray-700" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>{card.id}</span>
                      </div>
                      <p className="text-gray-700 text-opacity-80" style={{textShadow: '0 1px 2px rgba(0,0,0,0.1)'}}>Click to generate a motivational quote</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
