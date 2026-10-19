import React from 'react';
import { Flame, Sparkles, Award } from 'lucide-react';
import { UserProgress } from '../types/learning';

interface NavbarProps {
  currentTab: 'levels' | 'tests' | 'vocabulary' | 'progress';
  onSelectTab: (tab: 'levels' | 'tests' | 'vocabulary' | 'progress') => void;
  onOpenPlacementTest: () => void;
  onOpenCertificate: () => void;
  progress: UserProgress;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenPlacementTest,
  onOpenCertificate,
  progress,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab('levels')}
          className="text-left group cursor-pointer focus-visible:outline-none"
        >
          <span className="text-xl font-bold font-display tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors whitespace-nowrap shrink-0">
            InglizTili<span className="text-blue-600">0+</span>
          </span>
        </button>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectTab('levels')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              currentTab === 'levels'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'hover:text-slate-900'
            }`}
          >
            Darslar
          </button>
          <button
            onClick={() => onSelectTab('tests')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              currentTab === 'tests'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'hover:text-slate-900'
            }`}
          >
            Testlar & Imtihonlar
          </button>
          <button
            onClick={() => onSelectTab('vocabulary')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              currentTab === 'vocabulary'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'hover:text-slate-900'
            }`}
          >
            Lug'at & So'zlar
          </button>
          <button
            onClick={() => onSelectTab('progress')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              currentTab === 'progress'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'hover:text-slate-900'
            }`}
          >
            Progress & Tahlil
          </button>
          <button
            onClick={onOpenPlacementTest}
            className="text-slate-500 hover:text-blue-600 transition-colors whitespace-nowrap shrink-0"
          >
            Daraja Testi
          </button>
        </nav>

        {/* Zone 3: 1 primary action / status metric */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-3 text-xs font-medium text-slate-700 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="flex items-center gap-1 text-amber-600 font-semibold" title="Kunlik streak">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span className="tabular-nums">{progress.streakDays} kun</span>
            </span>
            <span className="text-slate-300" aria-hidden="true">|</span>
            <span className="flex items-center gap-1 text-blue-600 font-semibold" title="Umumiy XP ballari">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="tabular-nums">{progress.totalXp} XP</span>
            </span>
          </div>

          <button
            onClick={onOpenCertificate}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Sertifikat</span>
          </button>
        </div>
      </div>

      {/* Mobile nav subbar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 bg-white px-2 py-2 text-xs font-medium">
        <button
          onClick={() => onSelectTab('levels')}
          className={`px-2 py-1 rounded ${currentTab === 'levels' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
        >
          Darslar
        </button>
        <button
          onClick={() => onSelectTab('tests')}
          className={`px-2 py-1 rounded ${currentTab === 'tests' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
        >
          Testlar
        </button>
        <button
          onClick={() => onSelectTab('vocabulary')}
          className={`px-2 py-1 rounded ${currentTab === 'vocabulary' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
        >
          Lug'at
        </button>
        <button
          onClick={() => onSelectTab('progress')}
          className={`px-2 py-1 rounded ${currentTab === 'progress' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
        >
          Progress
        </button>
        <button
          onClick={onOpenPlacementTest}
          className="px-2 py-1 text-slate-500"
        >
          Daraja
        </button>
      </div>
    </header>
  );
};
