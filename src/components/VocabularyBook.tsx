import React, { useState, useMemo } from 'react';
import { Search, Volume2, BookOpen, Filter, Bookmark, Check } from 'lucide-react';
import { CURRICULUM_LEVELS } from '../data/curriculumData';
import { VocabularyItem } from '../types/learning';
import { speakEnglish } from '../utils/speech';

interface VocabularyBookProps {
  bookmarkedIds: string[];
  onToggleBookmark: (wordId: string) => void;
}

export const VocabularyBook: React.FC<VocabularyBookProps> = ({
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all');
  const [selectedPartOfSpeech, setSelectedPartOfSpeech] = useState<string>('all');
  const [playingWordId, setPlayingWordId] = useState<string | null>(null);

  // Collect all vocabulary items across all levels
  const allWords: VocabularyItem[] = useMemo(() => {
    const list: VocabularyItem[] = [];
    CURRICULUM_LEVELS.forEach((lvl) => {
      lvl.lessons.forEach((lsn) => {
        lsn.vocabulary.forEach((w) => {
          if (!list.some((existing) => existing.id === w.id)) {
            list.push(w);
          }
        });
      });
    });
    return list;
  }, []);

  const filteredWords = useMemo(() => {
    return allWords.filter((w) => {
      const matchQuery =
        w.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.uzbek.toLowerCase().includes(searchQuery.toLowerCase());

      const matchLevel = selectedLevel === 'all' || w.levelId === selectedLevel;
      const matchPos = selectedPartOfSpeech === 'all' || w.partOfSpeech === selectedPartOfSpeech;

      return matchQuery && matchLevel && matchPos;
    });
  }, [allWords, searchQuery, selectedLevel, selectedPartOfSpeech]);

  const handleSpeak = (text: string, id: string) => {
    setPlayingWordId(id);
    speakEnglish(text, {
      rate: 0.85,
      onEnd: () => setPlayingWordId(null),
      onError: () => setPlayingWordId(null),
    });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">
            Ingliz Tili Lug'at Kitobi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            0-darajadan B2 gacha bo'lgan barcha yangi so'zlar, to'g'ri audio talaffuz va namunaviy gaplar to'plami.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid md:grid-cols-12 gap-3 pt-2">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Inglizcha yoki o'zbekcha so'z qidiring..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 bg-slate-50/50"
            />
          </div>

          {/* Level Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50/50 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Barcha Darajalar (All Levels)</option>
              <option value="0">Level 0: Starter (Poydevor)</option>
              <option value="1">Level 1: A1 Beginner</option>
              <option value="2">Level 2: A2 Elementary</option>
              <option value="3">Level 3: B1 Pre-Intermediate</option>
              <option value="4">Level 4: B2 Intermediate</option>
            </select>
          </div>

          {/* Part of Speech Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedPartOfSpeech}
              onChange={(e) => setSelectedPartOfSpeech(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50/50 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Barcha So'z Turukumlari</option>
              <option value="noun">Otlar (Nouns)</option>
              <option value="verb">Fe'llar (Verbs)</option>
              <option value="adjective">Sifatlar (Adjectives)</option>
              <option value="adverb">Ravishlar (Adverbs)</option>
              <option value="phrase">Iboralar (Phrases)</option>
            </select>
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Topilgan so'zlar: <strong className="text-slate-900 tabular-nums">{filteredWords.length}</strong> ta
          </span>
          <span className="text-slate-400">Har bir so'z yonidagi karnay belgisini bosib audio tinglang</span>
        </div>
      </div>

      {/* Words Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWords.map((word) => {
          const isPlaying = playingWordId === word.id;
          const isBookmarked = bookmarkedIds.includes(word.id);

          return (
            <div
              key={word.id}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-slate-900">{word.english}</span>
                      <span className="text-xs text-blue-600 font-mono">{word.phonetic}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="capitalize">{word.partOfSpeech}</span>
                      <span aria-hidden="true">·</span>
                      <span>Level {word.levelId}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSpeak(word.english, word.id)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                        isPlaying
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                      title="Ovozli tinglash"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onToggleBookmark(word.id)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                        isBookmarked
                          ? 'text-amber-500 hover:text-amber-600'
                          : 'text-slate-300 hover:text-slate-600'
                      }`}
                      title="Lug'atga saqlash"
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="text-sm font-semibold text-emerald-800">
                    {word.uzbek}
                  </div>
                  <div className="mt-2 text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <p className="font-medium text-slate-800">"{word.exampleEn}"</p>
                    <p className="text-slate-500 not-italic mt-0.5">{word.exampleUz}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredWords.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800">So'z topilmadi</h3>
          <p className="text-xs text-slate-500 mt-1">
            Qidiruv so'zini o'zgartiring yoki filtrlarni qayta sozlang.
          </p>
        </div>
      )}
    </div>
  );
};
