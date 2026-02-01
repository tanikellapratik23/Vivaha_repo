import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Heart } from 'lucide-react';
import Welcome from './onboarding/steps/Welcome';
import RoleSelection from './onboarding/steps/RoleSelection';
import WeddingDate from './onboarding/steps/WeddingDate';
import Location from './onboarding/steps/Location';
import Preferences from './onboarding/steps/Preferences';
import CeremonyDetails from './onboarding/steps/CeremonyDetails';
import Goals from './onboarding/steps/Goals';
import Summary from './onboarding/steps/Summary';
import { OnboardingData } from './onboarding/Onboarding';

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
              <DemoLauncher />
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

function DemoLauncher() {
  const [playing, setPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setPlaying(true)} className="px-6 py-3 bg-white text-primary-700 rounded-lg font-semibold border">View demo</button>
      {playing && <DemoPlayer onClose={() => setPlaying(false)} />}
    </>
  );
}

function DemoPlayer({ onClose }: { onClose: () => void }) {
  // Demo shows a modal with the real onboarding components on the left
  // and a dashboard mock on the right. It auto-fills fields and advances.
  const [demoStep, setDemoStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({ role: '', weddingStyle: '', topPriority: [], goals: '' });
  const [showDashboard, setShowDashboard] = useState(false);

  const script = useRef<Array<{ delay: number; run: () => void }>>([]);

  useEffect(() => {
    // Prepare scripted actions
    let t = 0;
    const push = (delay: number, fn: () => void) => {
      t += delay;
      script.current.push({ delay: t, run: fn });
    };

    push(1200, () => { setData(d => ({ ...d, role: 'self' })); });
    push(800, () => setDemoStep(2)); // next to WeddingDate
    push(1200, () => { setData(d => ({ ...d, weddingDate: new Date().toISOString().split('T')[0] })); });
    push(800, () => setDemoStep(3));
    push(1000, () => { setData(d => ({ ...d, weddingCity: 'San Francisco', weddingState: 'CA' })); });
    push(800, () => setDemoStep(4));
    push(1000, () => { setData(d => ({ ...d, religions: ['Hindu'], isReligious: true })); });
    push(800, () => setDemoStep(5));
    push(900, () => { setData(d => ({ ...d, estimatedBudget: 15000, guestCount: 120 })); });
    push(800, () => setDemoStep(6));
    push(1000, () => { setData(d => ({ ...d, goals: 'Beautiful cultural ceremony' })); });
    push(700, () => setDemoStep(7));
    push(900, () => setDemoStep(8));
    push(900, () => { setShowDashboard(true); });

    let timers: number[] = [];
    script.current.forEach(({ delay, run }) => {
      const id = window.setTimeout(run, delay) as unknown as number;
      timers.push(id);
    });

    // auto-close after 30s
    const finish = window.setTimeout(() => onClose(), 30_000) as unknown as number;
    timers.push(finish);

    return () => timers.forEach((id) => clearTimeout(id));
  }, []);

  const updateData = (d: Partial<OnboardingData>) => setData(prev => ({ ...prev, ...d }));
  const next = () => setDemoStep(s => Math.min(s + 1, 8));
  const back = () => setDemoStep(s => Math.max(s - 1, 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative max-w-5xl w-full mx-4 bg-white rounded-2xl p-6 shadow-xl grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Vivaha Demo — Onboarding</h2>
              <p className="text-sm text-gray-600">Watch the onboarding run automatically</p>
            </div>
            <button onClick={onClose} className="text-sm text-gray-500">Close</button>
          </div>

          <div className="mt-4 bg-white rounded-2xl shadow p-6">
            {demoStep === 1 && <RoleSelection data={data} updateData={updateData} onNext={next} onBack={back} />}
            {demoStep === 2 && <WeddingDate data={data} updateData={updateData} onNext={next} onBack={back} />}
            {demoStep === 3 && <Location data={data} updateData={updateData} onNext={next} onBack={back} />}
            {demoStep === 4 && <Preferences data={data} updateData={updateData} onNext={next} onBack={back} />}
            {demoStep === 5 && <CeremonyDetails data={data} updateData={updateData} onNext={next} onBack={back} />}
            {demoStep === 6 && <Goals data={data} updateData={updateData} onNext={next} onBack={back} />}
            {demoStep === 7 && <Summary data={data} onBack={back} onComplete={() => { setDemoStep(8); }} />}
            {demoStep === 8 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold">Finishing…</h3>
                <p className="text-sm text-gray-500 mt-2">Opening your personalized dashboard now.</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Dashboard Preview</h3>
          <div className="bg-gray-50 rounded-xl p-4 space-y-4">
            <div className="p-3 bg-white rounded-md border">
              <div className="text-xs text-gray-500">Location</div>
              <div className="text-lg font-bold">{data.weddingCity || 'San Francisco'}, {data.weddingState || 'CA'}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-primary-50 rounded-md">
                <div className="text-xs text-gray-500">Guests</div>
                <div className="text-2xl font-bold">{data.guestCount || 120}</div>
              </div>
              <div className="p-3 bg-white rounded-md border">
                <div className="text-xs text-gray-500">Budget</div>
                <div className="text-2xl font-bold">${(data.estimatedBudget || 15000).toLocaleString()}</div>
              </div>
            </div>

            <div className="p-3 bg-white rounded-md border">
              <div className="text-xs text-gray-500">Favorites</div>
              <div className="mt-2">SF Elite Photography · Grand SF Ballroom</div>
            </div>

            {showDashboard && (
              <div className="p-3 bg-green-50 rounded-md border border-green-100 text-green-700">
                Demo complete — this is how your dashboard will look.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
