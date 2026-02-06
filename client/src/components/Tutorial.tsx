import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronRight, ChevronLeft, LayoutGrid, Users, DollarSign, 
  CheckSquare, Church, Music, Search, Briefcase, Settings, PartyPopper, Split, Sparkles, CheckCircle
} from 'lucide-react';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  position: 'center' | 'top' | 'bottom';
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: '📊 Overview',
    description: 'Your wedding dashboard hub with quick actions and AI suggestions.',
    icon: <LayoutGrid className="w-12 h-12 text-blue-600" />,
    features: [
      'See days until your wedding at a glance',
      'Quick actions for common tasks (Add Guest, Add Expense)',
      'AI Budget Optimization suggestions based on your city',
      'Welcome banner with wedding date and location',
      'Always-visible AI tips for better planning'
    ],
    position: 'center'
  },
  {
    id: 2,
    title: '👥 Guest List',
    description: 'Manage your wedding guests with RSVP tracking and meal preferences.',
    icon: <Users className="w-12 h-12 text-pink-600" />,
    features: [
      'Add guests with contact info and meal preferences',
      'Track RSVP status (Confirmed, Pending, Declined)',
      'Plus-one management for each guest',
      'Dietary restrictions and special notes',
      'Export guest list for vendors'
    ],
    position: 'center'
  },
  {
    id: 3,
    title: '💰 Budget Tracker',
    description: 'Track wedding expenses by category with real-time totals.',
    icon: <DollarSign className="w-12 h-12 text-green-600" />,
    features: [
      'Create custom budget categories (Venue, Catering, etc.)',
      'Set estimated amounts and track actual spending',
      'Mark expenses as paid with payment tracking',
      'See total spent vs estimated budget',
      'Auto-save keeps your data safe'
    ],
    position: 'center'
  },
  {
    id: 4,
    title: '🔀 Vivaha Split',
    description: 'Split wedding costs fairly among family and friends.',
    icon: <Split className="w-12 h-12 text-purple-600" />,
    features: [
      'Create expenses and assign payers',
      'Track who owes what with running balances',
      'Settle up transactions when paid',
      'Like Splitwise but for your wedding',
      'Export settlement summary'
    ],
    position: 'center'
  },
  {
    id: 5,
    title: '✅ To-Dos',
    description: 'Never miss a wedding task with organized to-do lists.',
    icon: <CheckSquare className="w-12 h-12 text-orange-600" />,
    features: [
      'Create tasks with due dates and priorities',
      'Mark tasks complete as you go',
      'High/Medium/Low priority levels',
      'Filter by status or search tasks',
      'Stay organized throughout planning'
    ],
    position: 'center'
  },
  {
    id: 6,
    title: '⛪ Ceremony Planning',
    description: 'Plan ceremony details and cultural traditions.',
    icon: <Church className="w-12 h-12 text-indigo-600" />,
    features: [
      'Add multiple ceremonies (Religious, Reception, etc.)',
      'Set venue, time, and dress code for each',
      'Track ceremony-specific details',
      'Cultural tradition planning',
      'Generate ceremony schedules'
    ],
    position: 'center'
  },
  {
    id: 7,
    title: '🎵 Sound & Music',
    description: 'Curate your wedding playlists and music preferences.',
    icon: <Music className="w-12 h-12 text-pink-600" />,
    features: [
      'Create playlists for different parts of wedding',
      'Add songs with artist names',
      'First dance, ceremony, reception music',
      'Share playlist with DJ or band',
      'Genre and mood suggestions'
    ],
    position: 'center'
  },
  {
    id: 8,
    title: '🔍 Vendor Search',
    description: 'Find wedding vendors near you with ratings and pricing.',
    icon: <Search className="w-12 h-12 text-cyan-600" />,
    features: [
      'Search photographers, DJs, venues, caterers, florists',
      'Filter by location, price, and rating',
      'Save favorites with heart button',
      'Real vendor data from your area',
      'Contact info and estimated costs'
    ],
    position: 'center'
  },
  {
    id: 9,
    title: '📋 My Vendors',
    description: 'Manage your selected vendors and track contracts.',
    icon: <Briefcase className="w-12 h-12 text-blue-600" />,
    features: [
      'View all your favorited vendors',
      'Track contract status and payments',
      'Vendor contact information',
      'Notes and communication history',
      'Payment schedules and deposits'
    ],
    position: 'center'
  },
  {
    id: 10,
    title: '🎉 Bachelor/Bachelorette',
    description: 'Plan bachelor or bachelorette trips with flights and lodging.',
    icon: <PartyPopper className="w-12 h-12 text-purple-600" />,
    features: [
      'Search destinations and compare costs',
      'Find flights from your location',
      'Browse Airbnb lodging options',
      'Generate trip budget estimates',
      'Drive directions for road trips'
    ],
    position: 'center'
  },
  {
    id: 11,
    title: '⚙️ Settings',
    description: 'Manage account settings and wedding preferences.',
    icon: <Settings className="w-12 h-12 text-gray-600" />,
    features: [
      'Update wedding date and location',
      'Change email and password',
      'Manage notification preferences',
      'Delete account if needed',
      'Privacy and data settings'
    ],
    position: 'center'
  }
];

interface TutorialProps {
  onClose: () => void;
}

export default function Tutorial({ onClose }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const currentStepData = tutorialSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tutorialSteps.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleFinish = () => {
    handleClose();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowRight' && !isLastStep) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && !isFirstStep) {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep]);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={handleClose}
          />

          {/* Exit Button - Top Left */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={handleClose}
            className="fixed top-6 left-6 z-[102] flex items-center gap-2 px-4 py-2 bg-white/95 hover:bg-white text-gray-700 font-semibold rounded-lg shadow-lg transition-all hover:scale-105"
          >
            <X className="w-5 h-5" />
            Exit Tutorial
          </motion.button>

          {/* Progress Indicator - Top Right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-6 right-6 z-[102] bg-white/95 px-4 py-2 rounded-lg shadow-lg"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">
                {currentStep + 1} / {tutorialSteps.length}
              </span>
              <div className="flex gap-1">
                {tutorialSteps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentStep
                        ? 'bg-gradient-to-r from-primary-500 to-pink-500 w-4'
                        : idx < currentStep
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Tutorial Content Box */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-primary-500 via-pink-500 to-purple-600 p-6 text-white flex-shrink-0">
                <div className="flex items-center justify-center mb-3">
                  {currentStepData.icon}
                </div>
                <h2 className="text-2xl font-bold text-center mb-2">
                  {currentStepData.title}
                </h2>
                <p className="text-white/90 text-center text-base">
                  {currentStepData.description}
                </p>
              </div>

              {/* Content - Scrollable */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-2">
                  {currentStepData.features.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 bg-gradient-to-r from-gray-50 to-white p-3 rounded-lg border border-gray-200 hover:border-primary-300 transition-all"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700 text-sm leading-relaxed">{feature}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Why It Matters Badge */}
                <div className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-bold text-purple-900">Why This Matters</span>
                  </div>
                  <p className="text-sm text-purple-800 leading-relaxed">
                    {currentStep === 0 && 'Your wedding at a glance with AI-powered suggestions for your city.'}
                    {currentStep === 1 && 'Track RSVPs, meal preferences, and plus-ones all in one place.'}
                    {currentStep === 2 && 'Never lose track of spending - see exactly where every dollar goes.'}
                    {currentStep === 3 && 'Split costs fairly with family and friends, like Splitwise for weddings.'}
                    {currentStep === 4 && 'Stay organized with tasks, priorities, and due dates.'}
                    {currentStep === 5 && 'Plan multiple ceremonies with different venues and traditions.'}
                    {currentStep === 6 && 'Create the perfect soundtrack for every moment of your day.'}
                    {currentStep === 7 && 'Find trusted vendors in your area with real pricing and reviews.'}
                    {currentStep === 8 && 'Keep all your vendor details and contracts organized.'}
                    {currentStep === 9 && 'Plan the perfect bachelor or bachelorette trip with cost estimates.'}
                    {currentStep === 10 && 'Manage your account and wedding preferences in one place.'}
                  </p>
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200 flex-shrink-0">
                <button
                  onClick={handlePrev}
                  disabled={isFirstStep}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    isFirstStep
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>

                <div className="text-xs text-gray-500 font-medium">
                  Use ← → keys
                </div>

                {!isLastStep ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary-500 to-pink-500 hover:from-primary-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all hover:scale-105 shadow-lg"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all hover:scale-105 shadow-lg"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Got It!
                  </button>
                )}
              </div>
            </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
