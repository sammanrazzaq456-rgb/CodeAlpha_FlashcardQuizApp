export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null; // YYYY-MM-DD
  studyDates: string[]; // history of YYYY-MM-DD
}

const STORAGE_KEY_STREAK = 'memora_study_streak';

export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getLocalDateString(d);
}

/**
 * Loads current streak state from localStorage and verifies whether
 * a day was missed. If more than 1 day has passed since lastStudyDate,
 * currentStreak resets to 0.
 */
export function getStreakState(): StreakData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STREAK);
    if (raw) {
      const parsed: StreakData = JSON.parse(raw);
      const today = getLocalDateString();
      const yesterday = getYesterdayDateString();

      // Check if user missed yesterday and today
      if (parsed.lastStudyDate && parsed.lastStudyDate !== today && parsed.lastStudyDate !== yesterday) {
        // Missed a day! Reset current streak
        const updated: StreakData = {
          ...parsed,
          currentStreak: 0,
        };
        localStorage.setItem(STORAGE_KEY_STREAK, JSON.stringify(updated));
        return updated;
      }

      return {
        currentStreak: parsed.currentStreak || 0,
        longestStreak: parsed.longestStreak || 0,
        lastStudyDate: parsed.lastStudyDate || null,
        studyDates: Array.isArray(parsed.studyDates) ? parsed.studyDates : [],
      };
    }
  } catch (err) {
    console.error('Failed to parse streak data:', err);
  }

  // Default initial state
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: null,
    studyDates: [],
  };
}

/**
 * Records that the user studied today.
 * - If already studied today: no-op, returns existing streak.
 * - If studied yesterday: increments currentStreak by 1.
 * - If missed a day or first time: sets currentStreak to 1.
 */
export function recordStudyDay(): { streak: StreakData; justIncremented: boolean } {
  const current = getStreakState();
  const today = getLocalDateString();
  const yesterday = getYesterdayDateString();

  if (current.lastStudyDate === today) {
    // Already studied today
    return { streak: current, justIncremented: false };
  }

  let newCurrentStreak = 1;
  if (current.lastStudyDate === yesterday) {
    newCurrentStreak = (current.currentStreak || 0) + 1;
  }

  const newLongestStreak = Math.max(current.longestStreak || 0, newCurrentStreak);
  const updatedDates = current.studyDates.includes(today)
    ? current.studyDates
    : [...current.studyDates, today];

  const updated: StreakData = {
    currentStreak: newCurrentStreak,
    longestStreak: newLongestStreak,
    lastStudyDate: today,
    studyDates: updatedDates,
  };

  try {
    localStorage.setItem(STORAGE_KEY_STREAK, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save streak data:', err);
  }

  return { streak: updated, justIncremented: true };
}
