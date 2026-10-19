import React, { useState } from 'react';
import { ArrowLeft, Volume2, CheckCircle2, XCircle, RotateCcw, ArrowRight, Sparkles, BookOpen, Layers, Check, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lesson, Level, Question, VocabularyItem } from '../types/learning';
import { speakEnglish } from '../utils/speech';

interface LessonViewProps {
  lesson: Lesson;
  level: Level;
  onBack: () => void;
  onCompleteLesson: (lessonId: string, earnedXp: number) => void;
  onRecordMistake: (question: Question, userAnswer: string, lessonTitle: string, levelId: number) => void;
  onNextLesson?: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lesson,
  level,
  onBack,
  onCompleteLesson,
  onRecordMistake,
  onNextLesson,
}) => {
  const [activeTab, setActiveTab] = useState<'grammar' | 'vocab' | 'practice'>('grammar');
  const [speechSpeed, setSpeechSpeed] = useState<number>(0.9);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  // Practice state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [sentenceTokens, setSentenceTokens] = useState<string[]>([]);
  const [availableTokens, setAvailableTokens] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  // Active flashcard in vocab tab
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

  const currentQuestion: Question | undefined = lesson.practiceQuestions[currentQuestionIndex];

  // Initialize sentence ordering question tokens
  React.useEffect(() => {
    if (currentQuestion && currentQuestion.type === 'sentence-order' && currentQuestion.sentencePieces) {
      // Shuffle tokens
      const shuffled = [...currentQuestion.sentencePieces].sort(() => Math.random() - 0.5);
      setAvailableTokens(shuffled);
      setSentenceTokens([]);
    } else {
      setSentenceTokens([]);
      setAvailableTokens([]);
    }
    setSelectedAnswer(null);
    setShowExplanation(false);
  }, [currentQuestionIndex, currentQuestion]);

  const handleSpeak = (text: string, idKey?: string) => {
    if (idKey) setPlayingAudio(idKey);
    speakEnglish(text, {
      rate: speechSpeed,
      onEnd: () => setPlayingAudio(null),
      onError: () => setPlayingAudio(null),
    });
  };

  const handleAddSentenceToken = (token: string, index: number) => {
    if (showExplanation) return;
    setSentenceTokens([...sentenceTokens, token]);
    const updated = [...availableTokens];
    updated.splice(index, 1);
    setAvailableTokens(updated);
  };

  const handleRemoveSentenceToken = (token: string, index: number) => {
    if (showExplanation) return;
    const updated = [...sentenceTokens];
    updated.splice(index, 1);
    setSentenceTokens(updated);
    setAvailableTokens([...availableTokens, token]);
  };

  const handleSubmitAnswer = () => {
    if (!currentQuestion) return;

    let finalUserAnswer = '';
    if (currentQuestion.type === 'sentence-order') {
      finalUserAnswer = sentenceTokens.join(' ');
    } else {
      finalUserAnswer = selectedAnswer || '';
    }

    if (!finalUserAnswer) return;

    const isCorrect =
      finalUserAnswer.trim().toLowerCase().replace(/[.,?!]/g, '') ===
      currentQuestion.correctAnswer.trim().toLowerCase().replace(/[.,?!]/g, '');

    setShowExplanation(true);

    if (isCorrect) {
      setCorrectAnswersCount((prev) => prev + 1);
    } else {
      onRecordMistake(currentQuestion, finalUserAnswer, lesson.uzbekTitle, level.id);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < lesson.practiceQuestions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Finished practice
      setPracticeCompleted(true);
      onCompleteLesson(lesson.id, lesson.xpReward);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Darslar ro'yxatiga qaytish</span>
        </button>

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>{level.code}: {level.uzbekTitle}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1 text-amber-600 font-semibold tabular-nums">
            <Sparkles className="w-3.5 h-3.5" />
            +{lesson.xpReward} XP
          </span>
          <span aria-hidden="true">·</span>
          <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded border border-slate-200">
            <span className="text-slate-600">Tezlik:</span>
            <button
              onClick={() => setSpeechSpeed(speechSpeed === 0.9 ? 0.75 : 0.9)}
              className="font-bold text-blue-600 hover:underline tabular-nums"
              title="Nutq tezligini o'zgartirish"
            >
              {speechSpeed === 0.9 ? 'Normal (0.9x)' : 'Sekin (0.75x)'}
            </button>
          </div>
        </div>
      </div>

      {/* Lesson Title Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          <span>Dars {lesson.order}</span>
          <span aria-hidden="true">·</span>
          <span>{lesson.title}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
          {lesson.uzbekTitle}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {lesson.description}
        </p>

        {/* Tab Switcher */}
        <div className="mt-6 flex items-center gap-1 p-1 bg-slate-100 rounded-xl max-w-md border border-slate-200">
          <button
            onClick={() => setActiveTab('grammar')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'grammar'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Qoidalar (Grammar)</span>
          </button>
          <button
            onClick={() => setActiveTab('vocab')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'vocab'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>So'zlar ({lesson.vocabulary.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'practice'
                ? 'bg-white text-blue-600 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mashqlar ({lesson.practiceQuestions.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Grammar & Rules */}
      {activeTab === 'grammar' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900 mb-2">
                {lesson.grammar.title}
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed bg-blue-50/60 p-4 rounded-xl border border-blue-100">
                {lesson.grammar.uzbekExplanation}
              </p>
            </div>

            {lesson.grammar.ruleBlocks.map((block, idx) => (
              <div key={idx} className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  {block.title}
                </h3>
                <div className="text-sm text-slate-700 whitespace-pre-line font-mono bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {block.content}
                </div>

                {block.table && (
                  <div className="overflow-x-auto rounded-xl border border-slate-200 mt-3">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                        <tr>
                          {block.table.headers.map((h, hi) => (
                            <th key={hi} className="p-3">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        {block.table.rows.map((row, ri) => (
                          <tr key={ri} className="hover:bg-slate-50">
                            {row.map((cell, ci) => (
                              <td key={ci} className="p-3">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="space-y-2 mt-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Namunaviy jumlalar va talaffuz:
                  </span>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {block.examples.map((ex, exIdx) => (
                      <div
                        key={exIdx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between group hover:border-blue-300 transition-colors"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                            <span>{ex.en}</span>
                          </div>
                          <div className="text-xs text-slate-500">{ex.uz}</div>
                        </div>

                        <button
                          onClick={() => handleSpeak(ex.en, `ex_${idx}_${exIdx}`)}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-colors shrink-0 cursor-pointer"
                          title="Tinglash"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setActiveTab('vocab')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
              >
                <span>Yangi so'zlarni o'rganish</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Vocabulary Flashcards */}
      {activeTab === 'vocab' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold font-display text-slate-900">
                  Ushbu Darsning Asosiy So'zlari
                </h2>
                <p className="text-xs text-slate-500">
                  Har bir so'zning ovozli talaffuzini tinglang va namunaviy gapini o'qing.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-500 tabular-nums">
                Jami: {lesson.vocabulary.length} ta so'z
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {lesson.vocabulary.map((v) => {
                const isFlipped = flippedCardId === v.id;
                return (
                  <div
                    key={v.id}
                    className="p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-slate-900">{v.english}</span>
                            <span className="text-xs text-blue-600 font-mono">{v.phonetic}</span>
                          </div>
                          <span className="text-xs text-slate-400 capitalize">{v.partOfSpeech}</span>
                        </div>

                        <button
                          onClick={() => handleSpeak(v.english, v.id)}
                          className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                          title="Talaffuzni tinglash"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <div className="text-sm font-semibold text-emerald-800">
                          {v.uzbek}
                        </div>
                        <div className="mt-2 text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <p className="font-medium text-slate-800">"{v.exampleEn}"</p>
                          <p className="text-slate-500 not-italic mt-0.5">{v.exampleUz}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setActiveTab('grammar')}
                className="text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                ← Qoidalarga qaytish
              </button>
              <button
                onClick={() => setActiveTab('practice')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
              >
                <span>Mashqlarga o'tish</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Interactive Practice */}
      {activeTab === 'practice' && (
        <div className="space-y-6">
          {!practiceCompleted && currentQuestion ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              {/* Question progress */}
              <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
                <span className="font-semibold text-slate-800">
                  Savol {currentQuestionIndex + 1} / {lesson.practiceQuestions.length}
                </span>
                <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{
                      width: `${((currentQuestionIndex + 1) / lesson.practiceQuestions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Question Prompt */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">
                  {currentQuestion.type === 'multiple-choice' && 'To\'g\'ri javobni tanlang'}
                  {currentQuestion.type === 'sentence-order' && 'So\'zlarni tartib bilan tuzing'}
                  {currentQuestion.type === 'fill-blank' && 'Bo\'sh joyni to\'ldiring'}
                  {currentQuestion.type === 'listening' && 'Audio tinglang va toping'}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                  {currentQuestion.promptUz}
                </h3>

                {currentQuestion.audioPrompt && (
                  <div className="mt-4 flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <button
                      onClick={() => handleSpeak(currentQuestion.audioPrompt || '', 'q_audio')}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Audioni qayta tinglash</span>
                    </button>
                    <span className="text-xs text-slate-500">Quloq soling va pastdagi javobni tanlang</span>
                  </div>
                )}
              </div>

              {/* Interaction zone depending on question type */}
              {currentQuestion.type === 'sentence-order' ? (
                <div className="space-y-5">
                  {/* Formed sentence area */}
                  <div className="min-h-[60px] p-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/70 flex flex-wrap items-center gap-2">
                    {sentenceTokens.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">Pastdagi so'zlarni bosib jumlani shakllantiring...</span>
                    ) : (
                      sentenceTokens.map((token, idx) => (
                        <button
                          key={idx}
                          disabled={showExplanation}
                          onClick={() => handleRemoveSentenceToken(token, idx)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium text-xs hover:bg-rose-600 transition-colors cursor-pointer"
                        >
                          {token}
                        </button>
                      ))
                    )}
                  </div>

                  {/* Available tokens pool */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {availableTokens.map((token, idx) => (
                      <button
                        key={idx}
                        disabled={showExplanation}
                        onClick={() => handleAddSentenceToken(token, idx)}
                        className="px-3 py-2 rounded-lg bg-white border border-slate-300 hover:border-blue-400 text-slate-800 font-medium text-xs shadow-sm hover:bg-blue-50 transition-all cursor-pointer"
                      >
                        {token}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {currentQuestion.options?.map((opt, oIdx) => {
                    const isSelected = selectedAnswer === opt;
                    return (
                      <button
                        key={oIdx}
                        disabled={showExplanation}
                        onClick={() => setSelectedAnswer(opt)}
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

              {/* Explanation & Feedback Card */}
              {showExplanation && (
                <div
                  className={`p-4 rounded-xl border text-xs sm:text-sm space-y-2 ${
                    (selectedAnswer || sentenceTokens.join(' '))
                      .trim()
                      .toLowerCase()
                      .replace(/[.,?!]/g, '') ===
                    currentQuestion.correctAnswer.trim().toLowerCase().replace(/[.,?!]/g, '')
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {(selectedAnswer || sentenceTokens.join(' '))
                      .trim()
                      .toLowerCase()
                      .replace(/[.,?!]/g, '') ===
                    currentQuestion.correctAnswer.trim().toLowerCase().replace(/[.,?!]/g, '') ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Barakalla! To'g'ri javob.</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-600" />
                        <span>Afsuski xato. To'g'ri javob: <strong className="underline">{currentQuestion.correctAnswer}</strong></span>
                      </>
                    )}
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    <strong>Tushuntirish:</strong> {currentQuestion.explanationUz}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  Aniq va xatosiz bajarishga harakat qiling
                </div>

                {!showExplanation ? (
                  <button
                    disabled={
                      currentQuestion.type === 'sentence-order'
                        ? sentenceTokens.length === 0
                        : !selectedAnswer
                    }
                    onClick={handleSubmitAnswer}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
                  >
                    Javobni Tekshirish
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
                  >
                    <span>Keyingi Savol</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Practice Completed screen */
            <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 text-center shadow-sm space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                  Dars muvaffaqiyatli yakunlandi!
                </span>
                <h3 className="text-2xl font-bold font-display text-slate-900 mt-1">
                  Ajoyib natija! +{lesson.xpReward} XP to'pladingiz
                </h3>
                <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                  Siz darsdagi {lesson.practiceQuestions.length} ta mashqdan {correctAnswersCount} tasiga to'g'ri javob berdingiz.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    setPracticeCompleted(false);
                    setCorrectAnswersCount(0);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Mashqlarni qayta ishlash</span>
                </button>

                {onNextLesson ? (
                  <button
                    onClick={onNextLesson}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <span>Keyingi darsga o'tish</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={onBack}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
                  >
                    Darslar ro'yxatiga qaytish
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
