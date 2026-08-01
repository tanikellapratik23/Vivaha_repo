import { FormEvent, useEffect, useState } from 'react';
import { Send, Sparkles, MapPin, CalendarDays } from 'lucide-react';
import axios from 'axios';
import { authStorage } from '../../utils/auth';

// Keep the Trip Copilot on the same dedicated AI backend as Vivaha AI.
const API_URL = import.meta.env.PROD
  ? 'https://vivaha-api.vercel.app'
  : (import.meta.env.VITE_API_URL || 'http://localhost:3000');
type Message = { role: 'user' | 'assistant'; text: string };

const tripConversationKey = () => {
  const user = authStorage.getUser();
  const identity = user?.id || user?._id || user?.email || authStorage.getToken()?.slice(-18) || 'guest';
  return `vivaha-trip-conversation-${identity}`;
};

const firstTripMessage: Message = {
  role: 'assistant',
  text: "I’ll build this trip with you, one decision at a time. First: where is everyone traveling from, and where are you thinking of going? If you’re undecided, tell me your group size, vibe, and budget and I’ll suggest destinations."
};

const loadTripConversation = (): Message[] => {
  try {
    const saved = JSON.parse(localStorage.getItem(tripConversationKey()) || '[]');
    return Array.isArray(saved) && saved.length ? saved : [firstTripMessage];
  } catch { return [firstTripMessage]; }
};

export default function BachelorAICopilot() {
  const [messages, setMessages] = useState<Message[]>(loadTripConversation);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [weddingProfile, setWeddingProfile] = useState<any>(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/onboarding`, { headers: { Authorization: `Bearer ${authStorage.getToken() || ''}` } })
      .then(({ data }) => setWeddingProfile(data))
      .catch(() => setWeddingProfile({}));
  }, []);

  useEffect(() => {
    localStorage.setItem(tripConversationKey(), JSON.stringify(messages));
  }, [messages]);

  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    const text = message.trim();
    if (!text || loading) return;
    setMessages(current => [...current, { role: 'user', text }]);
    setMessage(''); setLoading(true);
    const history = [...messages, { role: 'user' as const, text }].slice(-14).map(item => `${item.role === 'user' ? 'Traveler' : 'Vivaha'}: ${item.text}`).join('\n');
    const location = [weddingProfile?.weddingCity || weddingProfile?.city, weddingProfile?.weddingState || weddingProfile?.state].filter(Boolean).join(', ');
    const systemPrompt = `You are Vivaha Trip Copilot, a real Claude-powered conversational trip planner for bachelor, bachelorette and joint trips. You already know this wedding profile: wedding date ${weddingProfile?.weddingDate || 'not set'}, location ${location || 'not set'}, wedding style ${weddingProfile?.weddingStyle || 'not set'}, estimated wedding budget ${weddingProfile?.estimatedBudget ? `$${weddingProfile.estimatedBudget}` : 'not set'}, and guest count ${weddingProfile?.guestCount || 'not set'}. Use relevant details naturally, but never ask the user to repeat any of those.

Ask one focused question at a time until you have origin, destination or destination preferences, trip dates, group size, per-person budget, and vibe. Remember answers from this conversation. Once enough is known, give a polished day-by-day itinerary with a transparent per-person budget split, realistic alternatives, and useful Google search links. Never claim to book anything or invent live availability. Keep replies compact and conversational: a warm opener plus a few bullets when helpful.`;
    try {
      const response = await axios.post(`${API_URL}/api/ai/chat`, { message: history, systemPrompt }, { headers: { Authorization: `Bearer ${authStorage.getToken() || ''}` } });
      setMessages(current => [...current, { role: 'assistant', text: response.data.reply || 'I need one more detail to build this well—what dates are you considering?' }]);
    } catch (error: any) {
      setMessages(current => [...current, { role: 'assistant', text: error.response?.data?.error || 'I could not reach the trip planner. Please try again in a moment.' }]);
    } finally { setLoading(false); }
  };

  const profileLocation = [weddingProfile?.weddingCity || weddingProfile?.city, weddingProfile?.weddingState || weddingProfile?.state].filter(Boolean).join(', ');
  return <div className="max-w-6xl mx-auto space-y-6">
    <section className="rounded-3xl bg-gradient-to-br from-violet-700 via-purple-700 to-pink-600 text-white p-7 md:p-9 shadow-xl"><div className="flex items-start gap-4"><div className="rounded-2xl bg-white/15 p-3"><Sparkles /></div><div><p className="font-semibold text-pink-100">Vivaha Trip Copilot</p><h1 className="text-3xl md:text-4xl font-black mt-1">Plan the whole weekend with Vivaha.</h1><p className="mt-3 max-w-2xl text-violet-100">Tell Vivaha what your crew wants. It will ask the right questions, then build a personalized itinerary and budget.</p></div></div></section>
    <section className="rounded-3xl overflow-hidden border border-violet-100 bg-white shadow-xl"><div className="p-5 md:p-6 border-b bg-gradient-to-r from-violet-50 to-pink-50"><h2 className="font-bold text-xl text-gray-900">Your trip-planning conversation</h2><p className="text-sm text-gray-600 mt-1">Start wherever you are—Vivaha will gather the rest.</p>{(profileLocation || weddingProfile?.weddingDate) && <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-700">{profileLocation && <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 shadow-sm"><MapPin className="h-3.5 w-3.5 text-violet-500" />Wedding in {profileLocation}</span>}{weddingProfile?.weddingDate && <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 shadow-sm"><CalendarDays className="h-3.5 w-3.5 text-pink-500" />{weddingProfile.weddingDate}</span>}</div>}</div><div className="min-h-[540px] max-h-[650px] overflow-y-auto p-5 md:p-7 space-y-4 bg-gradient-to-b from-violet-50/70 via-white to-pink-50/50">{messages.map((item, index) => <div key={index} className={`max-w-3xl rounded-2xl px-5 py-4 whitespace-pre-wrap text-sm leading-relaxed shadow-sm ${item.role === 'user' ? 'ml-auto bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-br-md' : 'bg-white border border-violet-100 text-gray-800 rounded-bl-md'}`}>{item.text}</div>)}{loading && <div className="bg-white border border-violet-100 rounded-2xl p-4 text-gray-600">Vivaha is shaping your trip…</div>}</div><form onSubmit={submit} className="p-4 md:p-5 flex gap-3 border-t border-violet-100 bg-white"><input value={message} onChange={e => setMessage(e.target.value)} className="flex-1 rounded-2xl border border-violet-200 bg-white text-gray-900 placeholder:text-gray-400 px-4 py-3 focus:ring-2 focus:ring-violet-500 focus:outline-none" placeholder="Tell Vivaha about your group or trip idea…" /><button disabled={loading || !message.trim()} className="rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 px-5 text-white font-bold disabled:opacity-50"><Send className="w-5 h-5" /></button></form></section>
  </div>;
}
