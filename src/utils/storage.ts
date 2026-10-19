import { BadgeDefinition, MistakeItem, TestResultRecord, UserProgress } from '../types/learning';

const STORAGE_KEY = 'ingliz_tili_level_master_v1';

export const ALL_BADGES: BadgeDefinition[] = [
  {
    id: 'badge_first_step',
    title: 'First Step',
    uzbekTitle: 'Birinchi Qadam',
    description: "Birinchi ingliz tili darsini muvaffaqiyatli yakunladingiz!",
    icon: '🚀',
  },
  {
    id: 'badge_starter_master',
    title: 'Starter Graduate',
    uzbekTitle: '0-Daraja Bitiruvchisi',
    description: "Alifbo va poydevor (Level 0) imtihonidan a'lo o'tdingiz!",
    icon: '🎓',
  },
  {
    id: 'badge_a1_master',
    title: 'A1 Achiever',
    uzbekTitle: 'A1 Boshlang\'ich Ustasi',
    description: 'A1 Beginner bosqichini to\'liq o\'zlashtirib, testni topshirdingiz.',
    icon: '🌟',
  },
  {
    id: 'badge_a2_master',
    title: 'A2 Speaker',
    uzbekTitle: 'A2 Elementar So\'zlashuvchi',
    description: 'Kundalik vaziyatlarda erkin fikrlash bosqichini tamomladingiz.',
    icon: '⚡',
  },
  {
    id: 'badge_perfect_score',
    title: 'Perfect 100%',
    uzbekTitle: '100% Mukammal Natija',
    description: 'Testdagi barcha savollarga bittada xatosiz to\'g\'ri javob berdingiz.',
    icon: '🎯',
  },
  {
    id: 'badge_streak_3',
    title: '3-Day Fire',
    uzbekTitle: '3 Kunlik Olov',
    description: 'Ketma-ket 3 kun davomida ingliz tili o\'rgandingiz.',
    icon: '🔥',
  },
  {
    id: 'badge_vocab_pro',
    title: 'Lexicon Builder',
    uzbekTitle: 'So\'z Boyligi Boy',
    description: 'Kamida 25 ta yangi inglizcha so\'z yodladingiz.',
    icon: '📚',
  },
  {
    id: 'badge_graduation',
    title: 'English Master',
    uzbekTitle: 'Ingliz Tili Magistri',
    description: 'Barcha bosqichlarni muvaffaqiyatli yakunlab sertifikatga ega bo\'ldingiz!',
    icon: '👑',
  },
];

const INITIAL_PROGRESS: UserProgress = {
  userName: 'Talaba',
  avatarSeed: 'scholar',
  currentLevelId: 0,
  completedLessonIds: [],
  completedTestScores: {},
  totalXp: 0,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  mistakes: [],
  unlockedBadgeIds: [],
  bookmarkedWordIds: [],
};

export function loadUserProgress(): UserProgress {
  if (typeof window === 'undefined') return INITIAL_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveUserProgress(INITIAL_PROGRESS);
      return INITIAL_PROGRESS;
    }
    const parsed = JSON.parse(raw) as UserProgress;

    // Check streak
    const today = new Date().toISOString().split('T')[0];
    const lastDate = parsed.lastActiveDate || today;

    if (lastDate !== today) {
      const last = new Date(lastDate);
      const now = new Date(today);
      const diffTime = Math.abs(now.getTime() - last.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        parsed.streakDays = (parsed.streakDays || 0) + 1;
      } else if (diffDays > 1) {
        parsed.streakDays = 1;
      }
      parsed.lastActiveDate = today;
      saveUserProgress(parsed);
    }

    return parsed;
  } catch {
    return INITIAL_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save user progress', e);
  }
}

export function checkAndUnlockBadges(progress: UserProgress): { updatedProgress: UserProgress; newlyUnlocked: BadgeDefinition[] } {
  const newBadges: BadgeDefinition[] = [];
  const currentBadgeIds = new Set(progress.unlockedBadgeIds || []);

  // 1. First lesson
  if (progress.completedLessonIds.length >= 1 && !currentBadgeIds.has('badge_first_step')) {
    currentBadgeIds.add('badge_first_step');
    const b = ALL_BADGES.find((x) => x.id === 'badge_first_step');
    if (b) newBadges.push(b);
  }

  // 2. Level 0 master test passed
  if (progress.completedTestScores['test_level_0']?.passed && !currentBadgeIds.has('badge_starter_master')) {
    currentBadgeIds.add('badge_starter_master');
    const b = ALL_BADGES.find((x) => x.id === 'badge_starter_master');
    if (b) newBadges.push(b);
  }

  // 3. Level 1 master test passed
  if (progress.completedTestScores['test_level_1']?.passed && !currentBadgeIds.has('badge_a1_master')) {
    currentBadgeIds.add('badge_a1_master');
    const b = ALL_BADGES.find((x) => x.id === 'badge_a1_master');
    if (b) newBadges.push(b);
  }

  // 4. Level 2 master test passed
  if (progress.completedTestScores['test_level_2']?.passed && !currentBadgeIds.has('badge_a2_master')) {
    currentBadgeIds.add('badge_a2_master');
    const b = ALL_BADGES.find((x) => x.id === 'badge_a2_master');
    if (b) newBadges.push(b);
  }

  // 5. Perfect 100% score in any test
  const has100 = Object.values(progress.completedTestScores).some((t) => t.percentage === 100);
  if (has100 && !currentBadgeIds.has('badge_perfect_score')) {
    currentBadgeIds.add('badge_perfect_score');
    const b = ALL_BADGES.find((x) => x.id === 'badge_perfect_score');
    if (b) newBadges.push(b);
  }

  // 6. Streak 3 days
  if (progress.streakDays >= 3 && !currentBadgeIds.has('badge_streak_3')) {
    currentBadgeIds.add('badge_streak_3');
    const b = ALL_BADGES.find((x) => x.id === 'badge_streak_3');
    if (b) newBadges.push(b);
  }

  // 7. Vocab pro (completed lessons >= 5)
  if (progress.completedLessonIds.length >= 5 && !currentBadgeIds.has('badge_vocab_pro')) {
    currentBadgeIds.add('badge_vocab_pro');
    const b = ALL_BADGES.find((x) => x.id === 'badge_vocab_pro');
    if (b) newBadges.push(b);
  }

  // 8. English graduation (Level 4 test passed)
  if (progress.completedTestScores['test_level_4']?.passed && !currentBadgeIds.has('badge_graduation')) {
    currentBadgeIds.add('badge_graduation');
    const b = ALL_BADGES.find((x) => x.id === 'badge_graduation');
    if (b) newBadges.push(b);
  }

  const updatedProgress: UserProgress = {
    ...progress,
    unlockedBadgeIds: Array.from(currentBadgeIds),
  };

  if (newBadges.length > 0) {
    saveUserProgress(updatedProgress);
  }

  return { updatedProgress, newlyUnlocked: newBadges };
}
