import React, { useState } from 'react';
import { X, Compass, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PLACEMENT_TEST_QUESTIONS } from '../data/curriculumData';

interface PlacementTestModalProps {
  onClose: () => void;
  onSelectRecommendedLevel: (levelId: number) => void;
}

export const PlacementTestModal: React.FC<PlacementTestModalProps> = ({
  onClose,
  onSelectRecommendedLevel,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState(0);

  const currentQ = PLACEMENT_TEST_QUESTIONS[currentIdx];

  const handleNext = () => {
    if (!selectedOption) return;

    const updated = { ...userAnswers, [currentQ.id]: selectedOption };
    setUserAnswers(updated);
    setSelectedOption(null);

    if (currentIdx + 1 < PLACEMENT_TEST_QUESTIONS.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Calculate
      let score = 0;
      PLACEMENT_TEST_QUESTIONS.forEach((q) => {
        if (updated[q.id] === q.correctAnswer) {
          score += 1;
        }
      });
      setCalculatedScore(score);
      setIsFinished(true);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const getRecommendedLevel = (score: number) => {
    if (score >= 9) {
      return {
        id: 4,
        code: 'Level 4 (B2)',
        name: 'Upper-Intermediate / Ilg\'or',
        desc: 'Sizda grammatika va lug\'at yaxshi shakllangan. B2 darajasidagi murakkab konstruksiyalardan boshlashingiz mumkin.',
      };
    }
    if (score >= 7) {
      return {
        id: 3,
        code: 'Level 3 (B1)',
        name: 'Pre-Intermediate / O\'rta',
        desc: 'Oddiy zamonlarni bilasiz. Present Perfect, shart mayllari va boyroq muloqot bosqichidan boshlash tavsiya etiladi.',
      };
    }
    if (score >= 5) {
      return {
        id: 2,
        code: 'Level 2 (A2)',
        name: 'Elementary / Elementar',
        desc: 'Asosiy tushunchalar bor. O\'tgan zamon (Past Simple) va sifat darajalaridan boshlash ayni muddao.',
      };
    }
    if (score >= 3) {
      return {
        id: 1,
        code: 'Level 1 (A1)',
        name: 'Beginner / Boshlang\'ich',
        desc: 'Alifboni bilasiz. Present Simple va kundalik muloqot iboralarini to\'liq o\'rganish uchun Level 1 dan boshlang.',
      };
    }
    return {
      id: 0,
      code: 'Level 0 (Starter)',
      name: 'Noldan Boshlash: Poydevor',
      desc: 'Ingliz tilini mustahkam poydevor bilan o\'rganish uchun alifbo va eng birinchi darslardan boshlang.',
    };
  };

  const recommended = getRecommendedLevel(calculatedScore);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                Diagnostik Sinov
              </span>
              <h3 className="text-lg font-bold font-display text-slate-900">
                Ingliz Tili Darajangizni Aniqlash
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!isFinished ? (
            <>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  Savol <strong className="text-slate-900">{currentIdx + 1}</strong> / {PLACEMENT_TEST_QUESTIONS.length}
                </span>
                <span className="tabular-nums">Jami 10 ta savol</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{
                    width: `${((currentIdx + 1) / PLACEMENT_TEST_QUESTIONS.length) * 100}%`,
                  }}
                />
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900">
                  {currentQ.promptUz}
                </h4>
              </div>

              <div className="grid gap-2.5">
                {currentQ.options?.map((opt, i) => {
                  const isSelected = selectedOption === opt;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedOption(opt)}
                      className={`text-left p-3.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  Test Yakunlandi
                </span>
                <h3 className="text-2xl font-bold font-display text-slate-900 mt-1">
                  Natija: {calculatedScore} / 10 to'g'ri javob
                </h3>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-100 text-left space-y-2">
                <span className="text-xs font-bold text-blue-700 uppercase">
                  Tavsiya etilgan daraja:
                </span>
                <h4 className="text-lg font-extrabold text-blue-950">
                  {recommended.code} - {recommended.name}
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {recommended.desc}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setCurrentIdx(0);
                    setSelectedOption(null);
                    setUserAnswers({});
                    setIsFinished(false);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Qayta topshirish</span>
                </button>

                <button
                  onClick={() => {
                    onSelectRecommendedLevel(recommended.id);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{recommended.code} darslarini boshlash</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isFinished && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Bekor qilish
            </button>
            <button
              disabled={!selectedOption}
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
            >
              <span>{currentIdx + 1 === PLACEMENT_TEST_QUESTIONS.length ? 'Natijani Ko\'rish' : 'Keyingisi'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
