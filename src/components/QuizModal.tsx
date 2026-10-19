import React, { useState } from 'react';
import { X, Award, CheckCircle2, XCircle, RotateCcw, ArrowRight, Volume2, Sparkles, Check, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question, QuizTest, TestResultRecord } from '../types/learning';
import { speakEnglish } from '../utils/speech';

interface QuizModalProps {
  quiz: QuizTest;
  levelTitle: string;
  onClose: () => void;
  onFinishQuiz: (quizId: string, result: TestResultRecord, earnedXp: number) => void;
  onRecordMistake: (question: Question, userAnswer: string, lessonTitle: string, levelId: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  quiz,
  levelTitle,
  onClose,
  onFinishQuiz,
  onRecordMistake,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [sentenceTokens, setSentenceTokens] = useState<string[]>([]);
  const [availableTokens, setAvailableTokens] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [resultRecord, setResultRecord] = useState<TestResultRecord | null>(null);

  const currentQ: Question = quiz.questions[currentIndex];

  // Set tokens when moving to sentence-order questions
  React.useEffect(() => {
    if (currentQ?.type === 'sentence-order' && currentQ.sentencePieces) {
      setAvailableTokens([...currentQ.sentencePieces].sort(() => Math.random() - 0.5));
      setSentenceTokens([]);
    } else {
      setAvailableTokens([]);
      setSentenceTokens([]);
    }
    setSelectedOption(userAnswers[currentQ?.id] || null);
  }, [currentIndex, currentQ]);

  const handleSpeak = (text: string) => {
    speakEnglish(text, { rate: 0.85 });
  };

  const handleAddSentenceToken = (token: string, index: number) => {
    setSentenceTokens([...sentenceTokens, token]);
    const updated = [...availableTokens];
    updated.splice(index, 1);
    setAvailableTokens(updated);
  };

  const handleRemoveSentenceToken = (token: string, index: number) => {
    const updated = [...sentenceTokens];
    updated.splice(index, 1);
    setSentenceTokens(updated);
    setAvailableTokens([...availableTokens, token]);
  };

  const handleSelectOption = (opt: string) => {
    setSelectedOption(opt);
  };

  const handleNext = () => {
    let answer = '';
    if (currentQ.type === 'sentence-order') {
      answer = sentenceTokens.join(' ');
    } else {
      answer = selectedOption || '';
    }

    const updatedAnswers = { ...userAnswers, [currentQ.id]: answer };
    setUserAnswers(updatedAnswers);

    if (currentIndex + 1 < quiz.questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Calculate final score
      let correct = 0;
      quiz.questions.forEach((q) => {
        const ans = updatedAnswers[q.id] || '';
        const isMatch =
          ans.trim().toLowerCase().replace(/[.,?!]/g, '') ===
          q.correctAnswer.trim().toLowerCase().replace(/[.,?!]/g, '');
        if (isMatch) {
          correct += 1;
        } else {
          onRecordMistake(q, ans, quiz.uzbekTitle, quiz.levelId);
        }
      });

      const total = quiz.questions.length;
      const percentage = Math.round((correct / total) * 100);
      const passed = percentage >= quiz.passingPercentage;

      const record: TestResultRecord = {
        score: correct,
        total,
        percentage,
        passed,
        date: new Date().toISOString().split('T')[0],
      };

      setResultRecord(record);
      setIsFinished(true);

      const earnedXp = passed ? quiz.xpReward : Math.round(quiz.xpReward * 0.3);
      onFinishQuiz(quiz.id, record, earnedXp);

      if (passed) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wide">
              <span>{levelTitle}</span>
              <span aria-hidden="true">·</span>
              <span>Yakuniy Imtihon</span>
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900">
              {quiz.uzbekTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!isFinished ? (
            <>
              {/* Progress Tracker */}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  Savol <strong className="text-slate-900">{currentIndex + 1}</strong> / {quiz.questions.length}
                </span>
                <span className="tabular-nums">O'tish chegarasi: {quiz.passingPercentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div>
                <span className="text-xs font-semibold text-blue-600 block mb-1">
                  {currentQ.type === 'multiple-choice' && 'To\'g\'ri variantni belgilang'}
                  {currentQ.type === 'listening' && 'Audio talaffuzni tinglang'}
                  {currentQ.type === 'sentence-order' && 'So\'zlarni to\'g\'ri tartibda joylashtiring'}
                  {currentQ.type === 'fill-blank' && 'Bo\'sh qoldirilgan joyni to\'ldiring'}
                </span>
                <h4 className="text-lg font-bold text-slate-900">
                  {currentQ.promptUz}
                </h4>

                {currentQ.audioPrompt && (
                  <div className="mt-4 flex items-center gap-3 bg-blue-50/70 p-4 rounded-xl border border-blue-100">
                    <button
                      onClick={() => handleSpeak(currentQ.audioPrompt || '')}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Audioni tinglash</span>
                    </button>
                    <span className="text-xs text-slate-600">Quloq solib, eshitilgan so'zni belgilang</span>
                  </div>
                )}
              </div>

              {/* Inputs */}
              {currentQ.type === 'sentence-order' ? (
                <div className="space-y-4">
                  <div className="min-h-[56px] p-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-wrap items-center gap-2">
                    {sentenceTokens.length === 0 ? (
                      <span className="text-xs text-slate-400">So'zlarni bosib jumlani tuzing...</span>
                    ) : (
                      sentenceTokens.map((tok, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleRemoveSentenceToken(tok, idx)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium text-xs hover:bg-rose-600 transition-colors cursor-pointer"
                        >
                          {tok}
                        </button>
                      ))
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {availableTokens.map((tok, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAddSentenceToken(tok, idx)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 font-medium text-xs hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"
                      >
                        {tok}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {currentQ.options?.map((opt, i) => {
                    const isSelected = selectedOption === opt;
                    return (
                      <button
                        key={i}
                        onClick={() => handleSelectOption(opt)}
                        className={`text-left p-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{opt}</span>
                          {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            /* Results Screen */
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <div
                  className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                    resultRecord?.passed
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-rose-100 text-rose-600'
                  }`}
                >
                  {resultRecord?.passed ? (
                    <Award className="w-8 h-8" />
                  ) : (
                    <XCircle className="w-8 h-8" />
                  )}
                </div>

                <h3 className="text-2xl font-bold font-display text-slate-900">
                  {resultRecord?.passed ? "Tabriklaymiz! Imtihondan o'tdingiz" : "Imtihon topshirilmadi"}
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  {resultRecord?.passed
                    ? `Siz ${resultRecord.total} ta savoldan ${resultRecord.score} tasiga to'g'ri javob berdingiz (${resultRecord.percentage}%). Keyingi daraja ochildi!`
                    : `Siz ${resultRecord?.total} ta savoldan ${resultRecord?.score} tasiga to'g'ri javob berdingiz (${resultRecord?.percentage}%). O'tish uchun kamida ${quiz.passingPercentage}% kerak.`}
                </p>
              </div>

              {/* Detailed Breakdown of Mistakes */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Savollar Tahlili va To'g'ri Javoblar:
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {quiz.questions.map((q, idx) => {
                    const uAns = userAnswers[q.id] || '';
                    const isCorrect =
                      uAns.trim().toLowerCase().replace(/[.,?!]/g, '') ===
                      q.correctAnswer.trim().toLowerCase().replace(/[.,?!]/g, '');

                    return (
                      <div
                        key={q.id}
                        className={`p-3 rounded-xl border text-xs space-y-1 ${
                          isCorrect
                            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                            : 'bg-rose-50/60 border-rose-200 text-rose-950'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-slate-900">
                            {idx + 1}. {q.promptUz}
                          </span>
                          {isCorrect ? (
                            <span className="text-emerald-700 font-bold shrink-0">✓ To'g'ri</span>
                          ) : (
                            <span className="text-rose-700 font-bold shrink-0">✗ Xato</span>
                          )}
                        </div>
                        {!isCorrect && (
                          <div className="text-slate-600 pt-1">
                            <span>Sizning javobingiz: <strong className="text-rose-700">{uAns || '(javob berilmadi)'}</strong></span>
                            <span className="block mt-0.5">To'g'ri javob: <strong className="text-emerald-800">{q.correctAnswer}</strong></span>
                            <span className="block text-slate-500 italic mt-0.5">💡 {q.explanationUz}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          {!isFinished ? (
            <>
              <button
                onClick={onClose}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Chiqish
              </button>
              <button
                disabled={
                  currentQ.type === 'sentence-order'
                    ? sentenceTokens.length === 0
                    : !selectedOption
                }
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
              >
                <span>{currentIndex + 1 === quiz.questions.length ? 'Imtihonni Yakunlash' : 'Keyingi Savol'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setUserAnswers({});
                  setIsFinished(false);
                  setResultRecord(null);
                }}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Qayta urinish</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Yopish va Davom Etish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
