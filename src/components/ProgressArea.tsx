import React from 'react';
import { Trophy, Sparkles, RotateCcw } from 'lucide-react';

interface ProgressAreaProps {
  currentIndex: number;
  totalCards: number;
  masteredCount: number;
  learningCount: number;
  allMastered?: boolean;
  onRecelebrate?: () => void;
  onResetRatings?: () => void;
}

export const ProgressArea: React.FC<ProgressAreaProps> = ({
  currentIndex,
  totalCards,
  masteredCount,
  learningCount,
  allMastered,
  onRecelebrate,
  onResetRatings,
}) => {
  if (totalCards === 0) {
    return null;
  }

  const currentNumber = currentIndex + 1;
  const progressPercent = Math.min(100, Math.max(0, (currentNumber / totalCards) * 100));

  return (
    <div className="w-full max-w-[560px] mx-auto px-4 mt-6 mb-4">
      {/* Top text row: Card X of Y and optional learning stats */}
      <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-[var(--text-muted)] mb-2">
        <span className="font-semibold text-[var(--text)]">
          Card {currentNumber} of {totalCards}
        </span>
        <div className="flex items-center gap-2 text-xs">
          {masteredCount > 0 && (
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              {masteredCount} mastered
            </span>
          )}
          {masteredCount > 0 && learningCount > 0 && <span aria-hidden="true" className="text-[var(--border)]">·</span>}
          {learningCount > 0 && (
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              {learningCount} learning
            </span>
          )}
        </div>
      </div>

      {/* Thin animated progress bar */}
      <div 
        className="w-full h-1.5 bg-[var(--border)] rounded-full overflow-hidden" 
        role="progressbar" 
        aria-valuenow={currentNumber} 
        aria-valuemin={1} 
        aria-valuemax={totalCards}
        aria-label={`Study progress: ${currentNumber} of ${totalCards} cards`}
      >
        <div
          className={`h-full rounded-full transition-all duration-400 ease-out ${
            allMastered ? 'bg-emerald-500' : 'bg-[var(--primary)]'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* All Mastered Celebration Banner */}
      {allMastered && (
        <div className="mt-3.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex flex-wrap items-center justify-between gap-2.5 animate-dialog-in shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-emerald-950 dark:text-emerald-100 leading-tight">
                Deck Mastered! 🎉
              </p>
              <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80">
                You've mastered all {totalCards} cards!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {onRecelebrate && (
              <button
                onClick={onRecelebrate}
                className="btn-interactive px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 shadow-xs cursor-pointer"
                title="Fire celebratory confetti again"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Confetti</span>
              </button>
            )}
            {onResetRatings && (
              <button
                onClick={onResetRatings}
                className="btn-interactive px-2.5 py-1 text-xs font-medium rounded-lg bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--card-back-accent)] flex items-center gap-1 cursor-pointer"
                title="Reset study ratings to practice again"
              >
                <RotateCcw className="w-3 h-3 text-[var(--text-muted)]" />
                <span>Practice again</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
