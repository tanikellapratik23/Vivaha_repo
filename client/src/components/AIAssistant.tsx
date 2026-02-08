import { useState, useEffect } from 'react';
import { MessageCircle, X, Sparkles, Send, Plus, Trash2 } from 'lucide-react';

interface CeremonyStep {
  time: string;
  ritual: string;
}

interface CeremonyResponse {
  ceremony: CeremonyStep[];
  notes: string[];
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  type?: string;
}

interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

// Page navigation mappings
const PAGE_NAVIGATION: { [key: string]: string } = {
  'bachelor': '/dashboard/bachelor',
  'bachelorette': '/dashboard/bachelorette',
  'guests': '/dashboard/guests',
  'guest': '/dashboard/guests',
  'seating': '/dashboard/seating',
  'budget': '/dashboard/budget',
  'overview': '/dashboard/overview',
  'timeline': '/dashboard/timeline',
  'vendors': '/dashboard/vendors',
  'wedding info': '/dashboard/wedding-info',
  'ceremony': '/dashboard/ceremony',
  'rsvp': '/dashboard/rsvp',
};

// Use server-side AI proxy endpoints to avoid embedding secrets in the client
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const AI_CHAT_ENDPOINT = `${API_URL}/api/ai/chat`;

// System prompt for VivahaPlan AI
const SYSTEM_PROMPT = `You are VivahaPlan AI, an expert assistant helping couples plan interfaith weddings. You provide:
1. Ceremony suggestions as JSON with 'ceremony' (array of {time, ritual}) and 'notes' (array of strings)
2. Factual, culturally respectful FAQ answers
3. Culturally sensitive invitation and email copy

Always be respectful of both traditions, consider dietary restrictions, and provide practical advice.`;

// Example prompts for quick access
const EXAMPLE_PROMPTS = [
  {
    label: 'Add Guest',
    prompt: 'add pratik as a guest no plus one',
    type: 'guest'
  },
  {
    label: 'Budget Command',
    prompt: 'add 200000 to budget for venue',
    type: 'budget'
  },
  {
    label: 'Navigate',
    prompt: 'take me to the guests page',
    type: 'navigate'
  },
  {
    label: 'Ceremony',
    prompt: 'Generate a 3-hour Hindu-Christian ceremony schedule',
    type: 'ceremony'
  },
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatConversation[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [editableResponse, setEditableResponse] = useState<CeremonyResponse | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aiChatHistory');
      if (saved) {
        const history = JSON.parse(saved);
        setChatHistory(history);
        if (history.length > 0 && !currentChatId) {
          setCurrentChatId(history[0].id);
        }
      }
    } catch (e) {
      console.error('Failed to load chat history:', e);
    }
  }, []);

  // Start a new chat
  const startNewChat = () => {
    const newChat: ChatConversation = {
      id: `chat-${Date.now()}`,
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updated = [newChat, ...chatHistory];
    setChatHistory(updated);
    setCurrentChatId(newChat.id);
    setEditableResponse(null);
    localStorage.setItem('aiChatHistory', JSON.stringify(updated));
  };

  // Delete a chat
  const deleteChat = (id: string) => {
    const updated = chatHistory.filter(chat => chat.id !== id);
    setChatHistory(updated);
    if (currentChatId === id && updated.length > 0) {
      setCurrentChatId(updated[0].id);
      setEditableResponse(null);
    }
    localStorage.setItem('aiChatHistory', JSON.stringify(updated));
  };

  // Switch to a chat
  const switchChat = (id: string) => {
    setCurrentChatId(id);
    setEditableResponse(null);
  };

  // Get current chat
  const currentChat = chatHistory.find(c => c.id === currentChatId);
  const messages = currentChat?.messages || [];

  // Update current chat messages
  const updateCurrentChat = (newMessages: ChatMessage[]) => {
    const updated = chatHistory.map(chat =>
      chat.id === currentChatId
        ? {
            ...chat,
            messages: newMessages,
            updatedAt: Date.now(),
            // Auto-generate title from first user message if it's still "New Chat"
            title: chat.title === 'New Chat' && newMessages.length > 0
              ? newMessages[0].content.substring(0, 40) + (newMessages[0].content.length > 40 ? '...' : '')
              : chat.title,
          }
        : chat
    );
    setChatHistory(updated);
    localStorage.setItem('aiChatHistory', JSON.stringify(updated));
  };

  // Parse and execute navigation commands
  const executeNavigationCommand = (prompt: string): { executed: boolean; page?: string; message?: string } => {
    const lowerPrompt = prompt.toLowerCase();
    
    // Match patterns like "take me to X", "go to X", "open X", "navigate to X"
    const navMatch = lowerPrompt.match(/(?:take|go|navigate|send|bring|open)\s+(?:me\s+)?to\s+(?:the\s+)?([a-z\s]+?)(?:\s+page)?(?:\s+tab)?$/);
    
    if (!navMatch) return { executed: false };
    
    const requestedPage = navMatch[1].trim();
    const page = PAGE_NAVIGATION[requestedPage];
    
    if (page) {
      return {
        executed: true,
        page,
        message: `Navigating to ${requestedPage}...`
      };
    }
    
    return { executed: false };
  };

  // Parse and execute budget commands
  const executeBudgetCommand = (prompt: string): { executed: boolean; message?: string } => {
    const lowerPrompt = prompt.toLowerCase();
    
    const addMatch = lowerPrompt.match(/add\s+(\d+(?:,\d{3})*(?:\.\d{2})?)\s+(?:to\s+)?(?:budget\s+)?(?:for\s+)?(\w+)/i);
    const setMatch = lowerPrompt.match(/set\s+(\w+)\s+(?:to|budget)\s+(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
    
    let categoryName = '';
    let amount = 0;
    
    if (addMatch) {
      amount = parseFloat(addMatch[1].replace(/,/g, ''));
      categoryName = addMatch[2];
    } else if (setMatch) {
      categoryName = setMatch[1];
      amount = parseFloat(setMatch[2].replace(/,/g, ''));
    } else {
      return { executed: false };
    }
    
    try {
      const cached = localStorage.getItem('budget');
      const budget = cached ? JSON.parse(cached) : [];
      const categoryIndex = budget.findIndex((cat: any) => cat.name.toLowerCase() === categoryName.toLowerCase());
      
      if (categoryIndex >= 0) {
        budget[categoryIndex].estimatedAmount = amount;
      } else {
        budget.push({
          id: `local-${Date.now()}`,
          name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
          estimatedAmount: amount,
          actualAmount: 0,
          paid: 0,
        });
      }
      
      localStorage.setItem('budget', JSON.stringify(budget));
      
      const event = new CustomEvent('budgetChanged', {
        detail: { categories: budget }
      });
      window.dispatchEvent(event);
      
      return { 
        executed: true, 
        message: `Budget updated! Added ${categoryName} to ₹${amount.toLocaleString()}.` 
      };
    } catch (error) {
      console.error('Failed to execute budget command:', error);
      return { executed: false };
    }
  };

  // Parse and execute guest commands
  const executeGuestCommand = (prompt: string): { executed: boolean; message?: string; navigateTo?: string } => {
    const lowerPrompt = prompt.toLowerCase();
    
    const guestMatch = lowerPrompt.match(/add\s+([\w\s]+?)\s+(?:as\s+)?(?:a\s+)?guest(?:s)?(?:\s+(no\s+)?plus\s+one)?/i);
    
    if (!guestMatch) return { executed: false };
    
    const guestNames = guestMatch[1].split(/\s+(?:and|,)\s+/);
    const hasPlusOne = !lowerPrompt.includes('no plus one');
    
    try {
      const cached = localStorage.getItem('guests');
      const guests = cached ? JSON.parse(cached) : [];
      
      const newGuests: any[] = [];
      guestNames.forEach((name) => {
        const trimmedName = name.trim();
        if (trimmedName) {
          newGuests.push({
            id: `local-${Date.now()}-${Math.random()}`,
            name: trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1),
            email: '',
            phone: '',
            rsvpStatus: 'pending',
            mealPreference: '',
            plusOne: hasPlusOne,
            group: '',
          });
        }
      });
      
      const updatedGuests = [...guests, ...newGuests];
      localStorage.setItem('guests', JSON.stringify(updatedGuests));
      
      const event = new CustomEvent('guestsChanged', {
        detail: { guests: updatedGuests }
      });
      window.dispatchEvent(event);
      
      const guestText = newGuests.length === 1 ? '1 guest' : `${newGuests.length} guests`;
      const plusOneText = hasPlusOne ? 'with plus one' : 'no plus one';
      
      return {
        executed: true,
        message: `Added ${guestText}! ${newGuests.map(g => g.name).join(', ')} (${plusOneText}). Taking you to the guest list...`,
        navigateTo: '/dashboard/guests'
      };
    } catch (error) {
      console.error('Failed to execute guest command:', error);
      return { executed: false };
    }
  };

  const callAIAPI = async (prompt: string): Promise<{ reply: string; structured?: any }> => {
    try {
      const response = await fetch(AI_CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, systemPrompt: SYSTEM_PROMPT }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI proxy error:', errorText);
        throw new Error(`AI proxy error: ${response.status}`);
      }

      const data = await response.json();
      if (data?.reply) return { reply: data.reply, structured: data.structured };
      if (data?.choices && data.choices[0]?.message?.content) {
        return { reply: data.choices[0].message.content };
      }
      if (data?.text) return { reply: data.text };

      throw new Error('Unexpected AI proxy response format');
    } catch (err) {
      console.error('Call AI API failed:', err);
      throw err;
    }
  };

  // Handle sending message
  const handleSend = async () => {
    if (!userInput.trim() || loading) return;

    // Create new chat if none exists
    if (!currentChatId) {
      startNewChat();
      return;
    }

    const prompt = userInput.trim();
    setUserInput('');
    const newMessages = [...messages, { role: 'user' as const, content: prompt }];
    updateCurrentChat(newMessages);
    setLoading(true);
    setEditableResponse(null);

    try {
      // Check for navigation command
      const navResult = executeNavigationCommand(prompt);
      if (navResult.executed && navResult.page) {
        updateCurrentChat([...newMessages, {
          role: 'assistant',
          content: 'Navigating to ' + navResult.page + '...',
          type: 'text'
        }]);
        setTimeout(() => {
          window.location.hash = `#${navResult.page}`;
          setIsOpen(false);
        }, 500);
        return;
      }

      // Check budget command
      const budgetResult = executeBudgetCommand(prompt);
      if (budgetResult.executed) {
        updateCurrentChat([...newMessages, {
          role: 'assistant',
          content: budgetResult.message || 'Budget updated!',
          type: 'text'
        }]);
      } else {
        // Check guest command
        const guestResult = executeGuestCommand(prompt);
        
        if (guestResult.executed) {
          updateCurrentChat([...newMessages, {
            role: 'assistant',
            content: guestResult.message || 'Guest added!',
            type: 'text'
          }]);
          
          if (guestResult.navigateTo) {
            setTimeout(() => {
              window.location.hash = `#${guestResult.navigateTo}`;
              setIsOpen(false);
            }, 1000);
          }
        } else {
          // Otherwise, call AI
          const aiResult = await callAIAPI(prompt);
          const responseText = aiResult.reply || '';
          let responseType = 'text';

          if (aiResult.structured && aiResult.structured.ceremony && Array.isArray(aiResult.structured.ceremony)) {
            responseType = 'ceremony';
            setEditableResponse(aiResult.structured as CeremonyResponse);
          } else {
            try {
              const parsed = JSON.parse(responseText);
              if (parsed.ceremony && Array.isArray(parsed.ceremony)) {
                responseType = 'ceremony';
                setEditableResponse(parsed);
              }
            } catch {
              // not JSON
            }
          }

          const cleaned = String(responseText).replace(/```[\s\S]*?```/g, '').replace(/`+/g, '').trim();

          updateCurrentChat([...newMessages, { 
            role: 'assistant', 
            content: cleaned,
            type: responseType
          }]);
        }
      }
    } catch (error) {
      updateCurrentChat([...newMessages, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        type: 'error'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (prompt: string) => {
    setUserInput(prompt);
  };

  const updateCeremonyStep = (index: number, field: 'time' | 'ritual', value: string) => {
    if (!editableResponse) return;
    
    const newCeremony = [...editableResponse.ceremony];
    newCeremony[index] = { ...newCeremony[index], [field]: value };
    setEditableResponse({ ...editableResponse, ceremony: newCeremony });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-pink-500/50 hover:scale-110 transition-all duration-300 flex items-center gap-2"
        aria-label="Open AI Assistant"
      >
        <Sparkles className="h-6 w-6" />
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex overflow-hidden">
        
        {/* Sidebar - Chat History */}
        {showSidebar && (
          <div className="w-64 bg-gray-900 text-white flex flex-col border-r border-gray-800">
            <div className="p-4 border-b border-gray-800">
              <button
                onClick={startNewChat}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>New Chat</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {chatHistory.map(chat => (
                <div
                  key={chat.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                    currentChatId === chat.id
                      ? 'bg-gray-700'
                      : 'hover:bg-gray-800 bg-gray-800/50'
                  }`}
                >
                  <button
                    onClick={() => switchChat(chat.id)}
                    className="w-full text-left text-sm truncate"
                  >
                    {chat.title}
                  </button>
                  <button
                    onClick={() => deleteChat(chat.id)}
                    className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4 text-red-400 hover:text-red-300" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-white" />
              <div>
                <h2 className="text-xl font-bold text-white">VivahaPlan AI</h2>
                <p className="text-white/90 text-sm">Wedding Planning Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Example Prompts */}
          {messages.length === 0 && (
            <div className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 border-b">
              <p className="text-gray-700 font-medium mb-3">Quick actions:</p>
              <div className="grid grid-cols-1 gap-2">
                {EXAMPLE_PROMPTS.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExampleClick(example.prompt)}
                    className="text-left p-3 bg-white rounded-lg border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all text-sm"
                  >
                    <span className="font-semibold text-purple-700">{example.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                <p className="text-lg font-medium">Ask me anything about your wedding!</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                        : msg.type === 'error'
                        ? 'bg-red-50 text-red-800 border border-red-200'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {msg.role === 'assistant' && msg.type === 'ceremony' && editableResponse ? (
                      <div className="space-y-3">
                        <p className="font-semibold text-purple-700 mb-2">Ceremony Schedule (Editable)</p>
                        {editableResponse.ceremony.map((step, stepIdx) => (
                          <div key={stepIdx} className="bg-white rounded-lg p-3 border border-purple-200">
                            <div className="flex gap-2 mb-2">
                              <input
                                type="text"
                                value={step.time}
                                onChange={(e) => updateCeremonyStep(stepIdx, 'time', e.target.value)}
                                className="w-24 px-2 py-1 border rounded text-sm font-mono"
                                placeholder="00:00"
                              />
                              <input
                                type="text"
                                value={step.ritual}
                                onChange={(e) => updateCeremonyStep(stepIdx, 'ritual', e.target.value)}
                                className="flex-1 px-2 py-1 border rounded text-sm"
                                placeholder="Ritual name"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))
            )}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-gray-600 text-sm">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t bg-gray-50 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about ceremonies, budget, guests, navigation..."
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:outline-none"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !userInput.trim()}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
