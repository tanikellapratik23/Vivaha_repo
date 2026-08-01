import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, GripHorizontal, HelpCircle, CalendarDays, MapPin, Users } from 'lucide-react';
import axios from 'axios';
import { userDataStorage } from '../utils/userDataStorage';
import { authStorage } from '../utils/auth';

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
// AI always uses the dedicated API deployment in production. This avoids a
// stale frontend rewrite ever sending a chat request to an older function.
const API_URL = import.meta.env.PROD
  ? 'https://vivaha-api.vercel.app'
  : (import.meta.env.VITE_API_URL || 'http://localhost:3000');

const conversationKey = () => {
  const user = authStorage.getUser();
  const identity = user?.id || user?._id || user?.email || authStorage.getToken()?.slice(-18) || 'guest';
  return `vivaha-ai-conversation-${identity}`;
};

const loadConversation = (): Message[] => {
  try {
    const saved = JSON.parse(localStorage.getItem(conversationKey()) || '[]');
    return Array.isArray(saved) ? saved.map((item) => ({ ...item, timestamp: new Date(item.timestamp) })) : [];
  } catch { return []; }
};

// Quick prompts for different topics
const QUICK_PROMPTS = [
  { icon: '💸', text: 'Find savings', query: 'Use my budget, location, and guest count to find three specific ways I can save money without hurting the guest experience.' },
  { icon: '🧮', text: 'Budget math', query: 'Break my budget into venue, food, photo, music, florals, attire, and contingency. Show dollars and per-guest cost.' },
  { icon: '📍', text: 'Local vendor plan', query: 'Build a vendor shortlist strategy for my location, including what to ask, a reasonable price range, and the next two actions.' },
  { icon: '✅', text: 'This week’s plan', query: 'Based on my wedding details, give me a prioritized plan for this week with the three highest-impact tasks.' },
];

export default function AIAssistant({ embedded = false }: { embedded?: boolean }) {
  const [isOpen, setIsOpen] = useState(embedded);
  const [messages, setMessages] = useState<Message[]>(loadConversation);
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
        const response = await axios.get(`${API_URL}/api/onboarding`, {
          headers: { Authorization: `Bearer ${authStorage.getToken() || ''}` },
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

  useEffect(() => {
    localStorage.setItem(conversationKey(), JSON.stringify(messages));
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

  const weddingDate = userSettings?.weddingDate || userSettings?.date;
  const weddingLocation = [userSettings?.weddingCity || userSettings?.city, userSettings?.weddingState || userSettings?.state, userSettings?.weddingCountry || userSettings?.country].filter(Boolean).join(', ');
  const couplesNames = [userSettings?.coupleName1, userSettings?.coupleName2].filter(Boolean).join(' and ');
  const systemPrompt = `You are Vivaha AI, an exceptionally practical, warm wedding planner. This is a real conversation with a couple; write naturally, confidently, and never like a questionnaire. Give advice tailored to this couple, never generic filler.

User's wedding details:
- Role: ${userSettings?.role || 'Not specified'}
- Couple: ${couplesNames || 'Not specified'}
- Wedding date: ${weddingDate || 'Not specified'}
- Wedding time: ${userSettings?.weddingTime || 'Not specified'}
- Wedding style: ${userSettings?.weddingStyle || 'Not specified'}
- Location: ${weddingLocation || 'Not specified'}
- Budget: $${userSettings?.estimatedBudget || 'Not specified'}
- Guest count: ${userSettings?.guestCount || 'Not specified'}
- Top priorities: ${Array.isArray(userSettings?.topPriority) ? userSettings.topPriority.join(', ') : 'Not specified'}

Use every populated detail above automatically. Never say their details are missing or ask them to repeat data that appears above. Start with the answer, then use only a few short bullets if useful. Use concrete cost math when discussing money. Keep most replies under 130 words, with one thoughtful follow-up question at most. For venue or vendor requests, provide useful Google Maps search links and say availability/pricing must be verified.`;

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
        const conversation = [...messages, userMessage]
          .slice(-12)
          .map((item) => `${item.type === 'user' ? 'Couple' : 'Vivaha'}: ${item.content}`)
          .join('\n');
        const response = await axios.post(
          `${API_URL}/api/ai/chat`,
          {
            message: `Conversation so far:\n${conversation}\n\nRespond to the couple's latest message naturally.`,
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
    } catch (error: any) {
      console.error('Failed to get AI response:', error);
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        type: 'assistant',
        content: error.response?.data?.error || 'Sorry, I couldn\'t process your request. Please try again.',
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
          className={`${embedded ? 'relative w-full h-[calc(100vh-11rem)] min-h-[720px]' : 'fixed'} z-40 bg-white text-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-rose-100`}
          style={embedded ? undefined : { left: `${position.x}px`, top: `${position.y}px`, width: `${size.width}px`, height: `${size.height}px` }}
        >
          {/* Header - Draggable */}
          <div
            onMouseDown={embedded ? undefined : handleHeaderMouseDown}
            className={`bg-gradient-to-r from-primary-500 via-fuchsia-500 to-purple-600 text-white p-5 flex items-center justify-between ${embedded ? '' : 'cursor-move'} transition-all`}
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
          <div className="flex-1 overflow-y-auto p-5 md:p-7 space-y-4 bg-gradient-to-b from-rose-50/80 via-white to-violet-50/40">
            {messages.length === 0 && showQuickPrompts ? (
              <div className="max-w-4xl mx-auto py-4">
                <div className="rounded-2xl border border-rose-100 bg-white/90 p-5 mb-5 shadow-sm">
                  <p className="font-semibold text-gray-900">I know your wedding plan.</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-700">
                    {weddingDate && <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1.5"><CalendarDays className="h-3.5 w-3.5 text-rose-500" />{weddingDate}</span>}
                    {weddingLocation && <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1.5"><MapPin className="h-3.5 w-3.5 text-violet-500" />{weddingLocation}</span>}
                    {userSettings?.guestCount && <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-3 py-1.5"><Users className="h-3.5 w-3.5 text-pink-500" />{userSettings.guestCount} guests</span>}
                    {!userSettings && <span className="rounded-full bg-gray-100 px-3 py-1.5">Loading your wedding profile…</span>}
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-800 mb-3">What would you like to work through?</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        handleSendMessage(prompt.query);
                      }}
                      className="w-full px-4 py-4 text-sm bg-white border border-rose-100 text-gray-800 hover:border-primary-300 hover:-translate-y-0.5 hover:shadow-md rounded-2xl transition flex items-center gap-3 text-left"
                    >
                      <span className="text-sm">{prompt.icon}</span>
                      <span className="font-semibold">{prompt.text}</span>
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
                  className={`max-w-[85%] px-5 py-4 rounded-2xl text-sm shadow-sm ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-r from-primary-500 to-fuchsia-500 text-white rounded-br-md'
                      : 'bg-white text-gray-900 border border-rose-100 rounded-bl-md'
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
          <div className="p-4 border-t border-rose-100 bg-white/95">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about your budget, guests, vendors, timeline, or trip..."
                className="flex-1 px-4 py-3 border border-rose-200 bg-white text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                disabled={loading}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={loading || !input.trim()}
                className="px-4 py-3 bg-gradient-to-r from-primary-500 to-fuchsia-500 text-white rounded-2xl hover:shadow-lg disabled:opacity-50 transition"
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
