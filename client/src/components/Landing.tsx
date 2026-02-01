import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

const Feature = ({ title, desc }: { title: string; desc: string }) => (
  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md">
    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    <p className="text-sm text-gray-600 mt-2">{desc}</p>
  </div>
);

function OnboardingPreview() {
  const steps = [
    { title: 'Role', text: 'Who are you planning for? (Getting Married / Parent / Planner)' },
    { title: 'Religion', text: 'Do you have religious or cultural preferences?' },
    { title: 'Location', text: "Where's the wedding? We use this to find local vendors." },
    { title: 'Vendors', text: 'We find photographers, DJs, venues and caterers near you.' },
    { title: 'Summary', text: 'Quick summary and dashboard preview — you are ready to go!' },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((s) => (s + 1) % steps.length), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="h-40 relative">
      <div className="absolute inset-0 transition-transform duration-500" style={{ transform: `translateY(${-i * 100}%)` }}>
        {steps.map((s, idx) => (
          <div key={idx} className="h-40 flex items-center p-4 border-b last:border-b-0">
            <div className="w-full">
              <div className="text-sm text-primary-700 font-semibold">{s.title}</div>
              <div className="mt-2 text-gray-700 text-sm">{s.text}</div>
              <div className="mt-3 text-xs text-gray-500">Example: "Show me photographers near San Francisco"</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Landing() {
  const [step, setStep] = useState(0);
  const lines = [
    'Welcome to Vivaha — plan your perfect wedding with ease.',
    'Smart onboarding that presets your dashboard.',
    'Autosave & offline backups keep your plans safe.',
    'Search trusted vendors or get curated local suggestions.',
  ];

  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % lines.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-100 text-gray-900 flex flex-col">
      <header className="w-full border-b border-white/20 py-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary-500 text-white p-2 rounded-md">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Vivaha</h1>
              <p className="text-xs text-white/80">Your Wedding Planner</p>
            </div>
          </div>
          <nav className="space-x-3">
            <Link to="/login" className="px-4 py-2 bg-white/90 text-primary-700 rounded-md font-medium">Log in</Link>
            <Link to="/register" className="px-4 py-2 bg-primary-600 text-white rounded-md font-medium">Sign up</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
          <section className="space-y-6">
            <div className="text-4xl md:text-5xl font-extrabold leading-tight">
              <span className="block text-primary-700">{lines[step]}</span>
            </div>
            <p className="text-gray-700 text-lg">Vivaha helps you manage guests, budget, vendors and ceremony details — all in one beautiful dashboard.</p>

            <div className="flex gap-3">
              <Link to="/register" className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold">Get started — it's free</Link>
              <Link to="/dashboard" className="px-6 py-3 bg-white text-primary-700 rounded-lg font-semibold border">View demo</Link>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Feature title="Fast Onboarding" desc="Answer a few quick questions and we customize your dashboard instantly." />
              <Feature title="Autosave & Backup" desc="Automatic local saves and exportable backups (JSON + Word)." />
            </div>
          </section>

          <aside className="bg-white/90 rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold mb-3">Onboarding Preview</h3>
            <div className="overflow-hidden rounded-md border p-2 bg-white">
              <OnboardingPreview />
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700">How it helps</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>We ask a few quick questions (role, religion, location, date).</li>
                <li>We use your location to suggest nearby vendors (photographers, DJs, venues).</li>
                <li>Favorites and saved vendors show up instantly on your dashboard.</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <footer className="py-6">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-600">
          <p>Already have an account? <Link to="/login" className="text-primary-700 font-semibold">Sign in</Link></p>
        </div>
      </footer>

      {/* helper error pointer to login/signup area */}
      <div className="fixed right-6 bottom-6">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 shadow">
          <div className="font-semibold">Need help?</div>
          <div className="text-sm">Use the top-right buttons to Sign up or Log in.</div>
        </div>
      </div>
    </div>
  );
}
