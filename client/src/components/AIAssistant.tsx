import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader, ChevronDown, GripHorizontal, HelpCircle } from 'lucide-react';
import axios from 'axios';
import { userDataStorage } from '../utils/userDataStorage';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

// Use server-side AI proxy endpoints to avoid embedding secrets in the client
const API_URL = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:3000');

// Quick prompts for different topics
const QUICK_PROMPTS = [
  { icon: '💸', text: 'Find savings', query: 'Use my budget, location, and guest count to find three specific ways I can save money without hurting the guest experience.' },
  { icon: '🧮', text: 'Budget math', query: 'Break my budget into venue, food, photo, music, florals, attire, and contingency. Show dollars and per-guest cost.' },
  { icon: '📍', text: 'Local vendor plan', query: 'Build a vendor shortlist strategy for my location, including what to ask, a reasonable price range, and the next two actions.' },
  { icon: '✅', text: 'This week’s plan', query: 'Based on my wedding details, give me a prioritized plan for this week with the three highest-impact tasks.' },
];

export default function AIAssistant({ embedded = false }: { embedded?: boolean }) {
  const [isOpen, setIsOpen] = useState(embedded);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userSettings, setUserSettings] = useState<any>(null);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [size, setSize] = useState<Size>({ width: 384, height: 384 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Initialize position to bottom right on first mount
  useEffect(() => {
    setPosition({ x: window.innerWidth - 420, y: window.innerHeight - 420 });
  }, []);

  // Load position and size from user-specific storage on mount
  useEffect(() => {
    const saved = userDataStorage.getData('aiAssistantState');
    if (saved) {
      try {
        const { position: savedPos, size: savedSize } = saved;
        setPosition(savedPos || { x: window.innerWidth - 420, y: window.innerHeight - 420 });
        setSize(savedSize || { width: 384, height: 384 });
      } catch (e) {
        // Use defaults on parse error
      }
    }
  }, []);

  useEffect(() => {
    // Load user settings for context
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('/api/onboarding', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserSettings(response.data);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save position and size when they change
  useEffect(() => {
    userDataStorage.setData('aiAssistantState', { position, size });
  }, [position, size]);

  // Handle mouse down on header to start dragging
  const handleHeaderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!widgetRef.current) return;
    const rect = widgetRef.current.getBoundingClientRect();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - rect.left + position.x,
      y: e.clientY - rect.top + position.y,
    });
  };

  // Handle mouse move for dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Handle resize
  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!widgetRef.current) return;
    const rect = widgetRef.current.getBoundingClientRect();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    });
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;

      setSize({
        width: Math.max(300, resizeStart.width + deltaX),
        height: Math.max(300, resizeStart.height + deltaY),
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeStart]);

  const systemPrompt = `You are Vivaha AI, an exceptionally practical wedding planner. Give advice tailored to this couple, never generic filler.

User's wedding details:
- Role: ${userSettings?.role || 'Not specified'}
- Wedding style: ${userSettings?.weddingStyle || 'Not specified'}
- Location: ${userSettings?.weddingCity || 'Not specified'}, ${userSettings?.weddingState || ''}
- Budget: $${userSettings?.estimatedBudget || 'Not specified'}
- Guest count: ${userSettings?.guestCount || 'Not specified'}
- Top priorities: ${Array.isArray(userSettings?.topPriority) ? userSettings.topPriority.join(', ') : 'Not specified'}

Start with the recommendation, then use short sections or bullets. Use the actual location, budget, guest count and style where relevant. Include concrete cost math when discussing money. State assumptions clearly and ask one useful follow-up question. Keep responses under 120 words unless the user explicitly asks for a detailed plan. Never dump a full plan before confirming the key preference. For venue or vendor requests, provide Google Maps search links the user can open and say availability/pricing must be verified.`;

  const handleSendMessage = async (messageText = input) => {
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShowQuickPrompts(false);
    setLoading(true);

    try {
      // Budget modification detection
      const budgetAddPattern = /add\s+(\d{1,9})\s+(?:to\s+the\s+budget|to\s+([\w\s]+)\s+budget)/i;
      const budgetSetPattern = /set\s+([\w\s]+)?\s*budget\s*(?:to|=)\s*(\d{1,9})/i;
      let reply = '';
      let updated = false;
      let newBudget = null;
      let budgetType = null;

      if (budgetAddPattern.test(messageText)) {
        const match = messageText.match(budgetAddPattern);
        if (match) {
          const amount = parseInt(match[1], 10);
          budgetType = match[2] ? match[2].trim() : 'general';
          // Update budget in userDataStorage
          let budgets = userDataStorage.getData('budgets') || {};
          budgets[budgetType] = (budgets[budgetType] || 0) + amount;
          userDataStorage.setData('budgets', budgets);
          reply = `Added $${amount.toLocaleString()} to ${budgetType} budget. New total: $${budgets[budgetType].toLocaleString()}`;
          updated = true;
        }
      } else if (budgetSetPattern.test(messageText)) {
        const match = messageText.match(budgetSetPattern);
        if (match) {
          budgetType = match[1] ? match[1].trim() : 'general';
          newBudget = parseInt(match[2], 10);
          let budgets = userDataStorage.getData('budgets') || {};
          budgets[budgetType] = newBudget;
          userDataStorage.setData('budgets', budgets);
          reply = `Set ${budgetType} budget to $${newBudget.toLocaleString()}.`;
          updated = true;
        }
      }

      if (!updated) {
        // ...existing navigation and AI logic...
        const response = await axios.post(
          `${API_URL}/api/ai/chat`,
          {
            message: messageText,
            systemPrompt,
          }
        );

        reply = response.data.reply || 'I encountered an issue. Please try again.';

      }

      const assistantMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        type: 'assistant',
        content: reply,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        type: 'assistant',
        content: 'Sorry, I couldn\'t process your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!embedded && <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
        title="AI Assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
          </div>
        )}
        <div className="absolute -top-12 right-0 bg-gray-900 text-white px-3 py-1 rounded-lg whitespace-nowrap text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          Ask AI anything
        </div>
      </button>}

      {/* Chat Widget */}
      {isOpen && (
        <div
          ref={widgetRef}
          className={`${embedded ? 'relative w-full h-[calc(100vh-11rem)] min-h-[680px]' : 'fixed'} z-40 bg-white text-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200`}
          style={embedded ? undefined : { left: `${position.x}px`, top: `${position.y}px`, width: `${size.width}px`, height: `${size.height}px` }}
        >
          {/* Header - Draggable */}
          <div
            onMouseDown={embedded ? undefined : handleHeaderMouseDown}
            className={`bg-gradient-to-r from-primary-500 to-purple-600 text-white p-4 flex items-center justify-between ${embedded ? '' : 'cursor-move'} hover:from-primary-600 hover:to-purple-700 transition-all`}
          >
            <div className="flex items-center gap-2 pointer-events-none">
              <GripHorizontal className="w-4 h-4" />
              <Sparkles className="w-5 h-5" />
              <div>
                <h3 className="font-bold text-sm">Vivaha AI</h3>
                <p className="text-xs text-white/80">Your personalized planning partner</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
            {messages.length === 0 && showQuickPrompts ? (
              <div className="text-center py-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Start with a personalized planning move</p>
                <div className="space-y-2">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        handleSendMessage(prompt.query);
                      }}
                      className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 text-gray-700 hover:border-primary-300 hover:bg-primary-50 rounded-xl transition flex items-center gap-2"
                    >
                      <span className="text-sm">{prompt.icon}</span>
                      <span className="text-left">{prompt.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                    msg.type === 'user'
                      ? 'bg-primary-500 text-white rounded-br-none'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-900 border border-gray-200 px-3 py-2 rounded-lg rounded-bl-none flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about your budget, guests, vendors, timeline, or trip..."
                className="flex-1 px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                disabled={loading}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={loading || !input.trim()}
                className="px-3 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Resize Handle */}
          {!embedded && <div
            onMouseDown={handleResizeStart}
            className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-tl from-primary-500 to-transparent cursor-nwse-resize rounded-tl-lg opacity-50 hover:opacity-100 transition-opacity"
            title="Drag to resize"
          />}
          {embedded && <button onClick={() => setShowHelp(!showHelp)} className="absolute bottom-4 left-4 p-2.5 rounded-full bg-white text-primary-600 shadow-lg border border-primary-100 hover:bg-primary-50" title="How Vivaha AI can help"><HelpCircle className="w-5 h-5" /></button>}
          {embedded && showHelp && <div className="absolute bottom-16 left-4 max-w-sm bg-white rounded-xl border border-gray-200 shadow-xl p-4 text-sm text-gray-700"><button onClick={() => setShowHelp(false)} className="absolute top-2 right-2 text-gray-400"><X className="w-4 h-4" /></button><p className="font-bold text-gray-900 mb-2">How to get the best answer</p><ul className="space-y-1 list-disc pl-4"><li>Ask for a budget breakdown or per-guest math.</li><li>Ask it to compare choices and name trade-offs.</li><li>Request a local vendor outreach plan.</li><li>Ask for a week-by-week timeline or bachelor-trip itinerary.</li></ul></div>}
        </div>
      )}
    </>
  );
}
