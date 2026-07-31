import { FormEvent, useMemo, useState } from 'react';
import { Calendar, ExternalLink, MapPin, Plane, Send, Sparkles, Users, Wallet } from 'lucide-react';
import axios from 'axios';
import { authStorage } from '../../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
type Message = { role: 'user' | 'assistant'; text: string };

export default function BachelorAICopilot() {
  const [destination, setDestination] = useState('');
  const [origin, setOrigin] = useState('');
  const [dates, setDates] = useState('');
  const [groupSize, setGroupSize] = useState(8);
  const [budgetPerPerson, setBudgetPerPerson] = useState(800);
  const [message, setMessage] = useState('Plan a memorable 3-day weekend itinerary with a balanced mix of food, nightlife, and one daytime activity.');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const totalBudget = useMemo(() => Math.max(1, groupSize) * Math.max(0, budgetPerPerson), [groupSize, budgetPerPerson]);
  const query = encodeURIComponent(`${destination || 'bachelor trip'} ${dates}`.trim());

  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!message.trim()) return;
    const text = message.trim();
    setMessages((current) => [...current, { role: 'user', text }]);
    setMessage('');
    setLoading(true);
    const systemPrompt = `You are Vivaha Trip Copilot. Build practical bachelor, bachelorette, or joint-trip plans.\nTrip context: origin=${origin || 'not set'}; destination=${destination || 'not set'}; dates=${dates || 'flexible'}; group size=${groupSize}; budget per person=$${budgetPerPerson}; total group budget=$${totalBudget}.\nDo all arithmetic explicitly and keep every itinerary within the stated budget. Give a clear day-by-day plan, expected per-person costs, questions to confirm, and tell the user to verify availability on the provided travel search links. Never invent live prices, availability, or bookings.`;
    try {
      const response = await axios.post(`${API_URL}/api/ai/chat`, { message: text, systemPrompt }, {
        headers: { Authorization: `Bearer ${authStorage.getToken() || ''}` },
      });
      setMessages((current) => [...current, { role: 'assistant', text: response.data.reply || 'I could not create a plan. Please try again.' }]);
    } catch {
      setMessages((current) => [...current, { role: 'assistant', text: 'I could not reach your trip copilot. Please try again in a moment.' }]);
    } finally {
      setLoading(false);
    }
  };

  return <div className="max-w-6xl mx-auto space-y-6">
    <section className="rounded-3xl bg-gradient-to-br from-violet-700 via-purple-700 to-pink-600 text-white p-7 md:p-10 shadow-xl">
      <div className="flex items-start gap-4"><div className="rounded-2xl bg-white/15 p-3"><Sparkles /></div><div><p className="font-semibold text-pink-100">Vivaha Trip Copilot</p><h1 className="text-3xl md:text-4xl font-black mt-1">Plan the whole weekend with Claude.</h1><p className="mt-3 max-w-2xl text-violet-100">Set the constraints once. Claude turns them into a realistic itinerary and the calculator keeps the group budget honest.</p></div></div>
    </section>

    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
      <label className="text-sm font-semibold text-gray-700">From<input value={origin} onChange={e => setOrigin(e.target.value)} placeholder="New York, NY" className="mt-1.5 w-full rounded-xl border border-gray-200 p-3 font-normal" /></label>
      <label className="text-sm font-semibold text-gray-700">Destination<input value={destination} onChange={e => setDestination(e.target.value)} placeholder="Miami, FL" className="mt-1.5 w-full rounded-xl border border-gray-200 p-3 font-normal" /></label>
      <label className="text-sm font-semibold text-gray-700">Dates<input value={dates} onChange={e => setDates(e.target.value)} placeholder="May 16–19" className="mt-1.5 w-full rounded-xl border border-gray-200 p-3 font-normal" /></label>
      <label className="text-sm font-semibold text-gray-700">People<input type="number" min="1" value={groupSize} onChange={e => setGroupSize(Number(e.target.value))} className="mt-1.5 w-full rounded-xl border border-gray-200 p-3 font-normal" /></label>
      <label className="text-sm font-semibold text-gray-700">Each person<input type="number" min="0" value={budgetPerPerson} onChange={e => setBudgetPerPerson(Number(e.target.value))} className="mt-1.5 w-full rounded-xl border border-gray-200 p-3 font-normal" /></label>
    </section>

    <section className="grid md:grid-cols-3 gap-4">
      <div className="rounded-2xl bg-white border border-gray-100 p-5"><Users className="text-purple-600" /><p className="mt-3 text-sm text-gray-500">Group size</p><p className="text-2xl font-black">{groupSize || 0} people</p></div>
      <div className="rounded-2xl bg-white border border-gray-100 p-5"><Wallet className="text-emerald-600" /><p className="mt-3 text-sm text-gray-500">Total trip ceiling</p><p className="text-2xl font-black">${totalBudget.toLocaleString()}</p></div>
      <div className="rounded-2xl bg-white border border-gray-100 p-5"><Calendar className="text-pink-600" /><p className="mt-3 text-sm text-gray-500">Budget math</p><p className="text-lg font-bold">${budgetPerPerson.toLocaleString()} × {groupSize || 0}</p></div>
    </section>

    <section className="flex flex-wrap gap-3"><a target="_blank" rel="noreferrer" href={`https://www.google.com/travel/flights?q=${encodeURIComponent(`${origin} to ${destination} ${dates}`)}`} className="inline-flex items-center gap-2 rounded-xl bg-white border px-4 py-3 font-semibold hover:bg-gray-50"><Plane className="w-4 h-4" />Search flights<ExternalLink className="w-4 h-4" /></a><a target="_blank" rel="noreferrer" href={`https://www.google.com/travel/hotels?q=${query}`} className="inline-flex items-center gap-2 rounded-xl bg-white border px-4 py-3 font-semibold hover:bg-gray-50">Search stays<ExternalLink className="w-4 h-4" /></a><a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/things+to+do+in+${query}`} className="inline-flex items-center gap-2 rounded-xl bg-white border px-4 py-3 font-semibold hover:bg-gray-50"><MapPin className="w-4 h-4" />Explore activities<ExternalLink className="w-4 h-4" /></a></section>

    <section className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm"><div className="p-5 border-b"><h2 className="font-bold text-xl">Talk to your trip planner</h2><p className="text-sm text-gray-500 mt-1">Ask for an itinerary, a budget split, rain plan, restaurant ideas, or a different vibe.</p></div><div className="min-h-64 max-h-[440px] overflow-y-auto p-5 space-y-4 bg-gray-50">{messages.length === 0 && <p className="text-gray-500">Try the starter message below, then refine it with your group’s preferences.</p>}{messages.map((item, index) => <div key={index} className={`max-w-3xl rounded-2xl p-4 whitespace-pre-wrap ${item.role === 'user' ? 'ml-auto bg-purple-600 text-white' : 'bg-white border text-gray-800'}`}>{item.text}</div>)}{loading && <div className="bg-white border rounded-2xl p-4 text-gray-500">Claude is planning your weekend…</div>}</div><form onSubmit={submit} className="p-4 flex gap-3 border-t"><input value={message} onChange={e => setMessage(e.target.value)} className="flex-1 rounded-xl border border-gray-300 px-4 py-3" placeholder="What kind of weekend do you want?" /><button disabled={loading} className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-5 text-white font-bold disabled:opacity-50"><Send className="w-5 h-5" /></button></form></section>
  </div>;
}
