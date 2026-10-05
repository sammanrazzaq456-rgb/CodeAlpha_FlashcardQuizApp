import React, { useEffect } from 'react';
import { Flame, Trophy, Calendar, Check, X, Sparkles } from 'lucide-react';
import { StreakData, getLocalDateString } from '../utils/streak';

interface StreakDetailsModalProps {
  isOpen: boolean;
  streak: StreakData;
  studiedToday: boolean;
  onClose: () => void;
}

export const StreakDetailsModal: React.FC<StreakDetailsModalProps> = ({
  isOpen,
  streak,
  studiedToday,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Generate last 7 days for visual tracker
  const todayStr = getLocalDateString();
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = getLocalDateString(d);
    const dayLabel = d.toLocaleDateString(undefined, { weekday: 'short' });
    const isCompleted = streak.studyDates.includes(dateStr);
    const isToday = dateStr === todayStr;

    return {
      dateStr,
      dayLabel,
      dayNum: d.getDate(),
      isCompleted,
      isToday,
    };
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-backdrop-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="streak-modal-title"
    >
      <div
        className="w-full max-w-sm bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl p-5 sm:p-6 relative animate-dialog-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <Flame className="w-5 h-5 fill-orange-500" />
            </div>
            <h2
              id="streak-modal-title"
              className="text-base font-semibold text-[var(--text)] tracking-tight"
            >
              Daily Study Streak
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] rounded-lg hover:bg-[var(--card-back-accent)] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big Counter Presentation */}
        <div className="py-5 text-center flex flex-col items-center">
          <div className="relative mb-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md">
              <Flame className="w-9 h-9 fill-white" />
            </div>
            {studiedToday && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-[var(--surface)] shadow-xs">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </div>

          <div className="text-3xl font-bold text-[var(--text)] tracking-tight">
            {streak.currentStreak}{' '}
            <span className="text-xl font-medium text-[var(--text-muted)]">
              {streak.currentStreak === 1 ? 'day' : 'days'}
            </span>
          </div>

          <p className="text-xs text-[var(--text-muted)] mt-1 max-w-[240px]">
            {studiedToday
              ? 'Awesome! You studied today and kept your streak alive.'
              : streak.currentStreak > 0
              ? 'Flip or review cards today to keep your streak from resetting!'
              : 'Study a card today to kickstart your daily learning habit.'}
          </p>
        </div>

        {/* 7-Day Activity History */}
        <div className="p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl mb-4">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Last 7 Days
            </span>
            <span className="normal-case font-medium">
              {streak.studyDates.length} total study {streak.studyDates.length === 1 ? 'day' : 'days'}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {past7Days.map((day) => (
              <div key={day.dateStr} className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-[var(--text-muted)] font-medium">
                  {day.dayLabel}
                </span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    day.isCompleted
                      ? 'bg-orange-500 text-white shadow-xs'
                      : day.isToday
                      ? 'border-2 border-dashed border-orange-400 text-orange-500 bg-orange-50 dark:bg-orange-950/30'
                      : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)]'
                  }`}
                  title={`${day.dateStr}: ${day.isCompleted ? 'Studied' : 'Not studied'}`}
                >
                  {day.isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <span>{day.dayNum}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Row: Longest Streak */}
        <div className="flex items-center justify-between p-3 bg-[var(--card-back-accent)] rounded-xl border border-[var(--border)] text-xs mb-4">
          <span className="text-[var(--text-muted)] flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            Personal Best:
          </span>
          <span className="font-bold text-[var(--text)]">
            {streak.longestStreak} {streak.longestStreak === 1 ? 'day' : 'days'}
          </span>
        </div>

        <button
          onClick={onClose}
          className="btn-interactive w-full h-[40px] text-xs font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-[10px] cursor-pointer"
        >
          Keep Studying
        </button>
      </div>
    </div>
  );
};
