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
    <div className="min-h-screen flex items-center justify-center p-8" style={{background: '#E0E8F0'}}>
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
              className="h-80 w-full lg:w-80 bg-gray-200 rounded-3xl p-8 transform transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: '#E0E8F0',
                boxShadow: `
                  inset -6px -6px 12px rgba(255, 255, 255, 0.7),
                  inset 6px 6px 12px rgba(0, 0, 0, 0.1),
                  -8px 8px 16px rgba(0, 0, 0, 0.1)
                `
              }}
            >
              <div className="h-full flex flex-col">
                <h3 className="text-2xl font-bold text-center mb-6" style={{ color: '#243143', textShadow: '-1px -1px 2px rgba(255,255,255,0.8), 1px 1px 2px rgba(0,0,0,0.2)' }}>
                  {card.title}
                </h3>

                <div className="flex-1 flex items-center justify-center">
                  {card.isLoading ? (
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 border-2 border-gray-700 border-t-transparent rounded-full animate-spin mb-4"
                        style={{
                          boxShadow: `
                            inset 2px 2px 4px rgba(0, 0, 0, 0.1),
                            inset -2px -2px 4px rgba(255, 255, 255, 0.8)
                          `
                        }}
                      ></div>
                      <p className="text-gray-700" style={{textShadow: '-1px -1px 1px rgba(255,255,255,0.8), 1px 1px 1px rgba(0,0,0,0.1)'}}>Generating quote...</p>
                    </div>
                  ) : card.quote ? (
                    <p
                      className="text-gray-800 text-center text-lg leading-relaxed font-medium"
                      style={{
                        textShadow: `
                          -1px -1px 1px rgba(255, 255, 255, 0.8),
                          1px 1px 1px rgba(0, 0, 0, 0.1)
                        `
                      }}
                    >
                      {card.quote}
                    </p>
                  ) : (
                    <div className="text-center">
                      <div
                        className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{
                          boxShadow: `
                            inset 3px 3px 6px rgba(0, 0, 0, 0.1),
                            inset -3px -3px 6px rgba(255, 255, 255, 0.8)
                          `
                        }}
                      >
                        <span className="text-2xl text-gray-700" style={{ textShadow: '-1px -1px 1px rgba(255,255,255,0.8), 1px 1px 1px rgba(0,0,0,0.2)' }}>{card.id}</span>
                      </div>
                      <p
                        className="text-gray-700 text-sm"
                        style={{
                          textShadow: `
                            -1px -1px 1px rgba(255, 255, 255, 0.8),
                            1px 1px 1px rgba(0, 0, 0, 0.1)
                          `
                        }}
                      >
                        Click to generate a motivational quote
                      </p>
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
