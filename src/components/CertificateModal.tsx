import React from 'react';
import { X, Printer, Award, CheckCircle2, ShieldCheck } from 'lucide-react';
import { UserProgress } from '../types/learning';

interface CertificateModalProps {
  progress: UserProgress;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  progress,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  // Determine highest completed level
  const highestLevelPassed = Object.entries(progress.completedTestScores)
    .filter(([_, rec]) => rec.passed)
    .map(([testId]) => {
      if (testId.includes('level_4')) return 4;
      if (testId.includes('level_3')) return 3;
      if (testId.includes('level_2')) return 2;
      if (testId.includes('level_1')) return 1;
      return 0;
    })
    .sort((a, b) => b - a)[0] ?? 0;

  const levelTitles: Record<number, { code: string; name: string; cefr: string }> = {
    0: { code: 'Level 0', name: 'Starter Foundations (Poydevor)', cefr: 'CEFR Pre-A1' },
    1: { code: 'Level 1', name: 'Beginner Everyday English', cefr: 'CEFR A1' },
    2: { code: 'Level 2', name: 'Elementary Fluency', cefr: 'CEFR A2' },
    3: { code: 'Level 3', name: 'Pre-Intermediate Mastery', cefr: 'CEFR B1' },
    4: { code: 'Level 4', name: 'Upper-Intermediate Fluency', cefr: 'CEFR B2' },
  };

  const currentLevelInfo = levelTitles[highestLevelPassed];
  const certDate = new Date().toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full flex flex-col overflow-hidden my-auto">
        {/* Modal Controls Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 no-print">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Muvaffaqiyat Sertifikati</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Chop etish / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas Area */}
        <div id="printable-certificate" className="p-8 sm:p-12 bg-white relative">
          <div className="border-8 border-double border-amber-600/30 p-8 sm:p-10 rounded-2xl relative bg-gradient-to-b from-amber-50/20 via-white to-amber-50/30">
            {/* Top Emblem Seal */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-200/80">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-blue-700" />
                <div>
                  <span className="font-display font-extrabold text-lg tracking-tight text-slate-900">
                    INGLIZ TILI 0+ ACADEMY
                  </span>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                    Standardized Language Proficiency
                  </span>
                </div>
              </div>

              {/* Gold seal image */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                <img
                  src="/src/assets/images/certificate_badge_gold_1792381505655.jpg"
                  alt="Gold Academic Seal"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain drop-shadow"
                />
              </div>
            </div>

            {/* Certificate Body */}
            <div className="text-center py-8 space-y-4">
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
                Certificate of Completion & Excellence
              </span>

              <h2 className="text-xl sm:text-2xl font-serif text-slate-700 italic">
                Ushbu sertifikat berildi:
              </h2>

              <div className="py-2">
                <span className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight border-b-2 border-slate-900 pb-1 inline-block min-w-[280px]">
                  {progress.userName}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Ingliz tili noldan boshlab bosqichma-bosqich o'quv dasturining <strong>{currentLevelInfo.code} ({currentLevelInfo.name})</strong> bosqichini barcha interaktiv darslar va yakuniy standart imtihonlarni topshirib, <strong>{currentLevelInfo.cefr}</strong> darajasini muvaffaqiyatli yakunlaganligi tasdiqlanadi.
              </p>
            </div>

            {/* Bottom Signatures & Verification */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-600 items-end">
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Sana:</span>
                <span className="font-semibold text-slate-800">{certDate}</span>
              </div>

              <div className="text-center">
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">To'plangan XP:</span>
                <span className="font-bold text-blue-700 tabular-nums">{progress.totalXp} XP</span>
              </div>

              <div className="text-right">
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Sertifikat ID:</span>
                <span className="font-mono text-[11px] text-slate-700 font-semibold">
                  ENG-{progress.avatarSeed.toUpperCase()}-{highestLevelPassed}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
