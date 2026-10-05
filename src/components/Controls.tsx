import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Plus,
  Pencil,
  Trash2,
  Check,
  RotateCw,
} from 'lucide-react';

interface ControlsProps {
  isFlipped: boolean;
  onToggleFlip: () => void;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRateCard: (rating: 'mastered' | 'learning') => void;
  currentRating?: 'unrated' | 'learning' | 'mastered';
}

export const Controls: React.FC<ControlsProps> = ({
  isFlipped,
  onToggleFlip,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onAdd,
  onEdit,
  onDelete,
  onRateCard,
  currentRating,
}) => {
  return (
    <div className="w-full max-w-[560px] mx-auto px-4 sm:px-0 mt-5 flex flex-col items-center gap-4">
      {/* 4. Show Answer Button (Centered under card) */}
      <div className="w-full flex justify-center">
        <button
          onClick={onToggleFlip}
          className="btn-interactive min-w-[200px] h-[46px] px-6 text-[15px] font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-[10px] shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          aria-label={isFlipped ? 'Hide Answer' : 'Show Answer'}
        >
          {isFlipped ? (
            <>
              <EyeOff className="w-4 h-4" />
              <span>Hide Answer</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              <span>Show Answer</span>
            </>
          )}
        </button>
      </div>

      {/* Optional Knowledge Rating: "I knew it!" / "Still learning" when flipped */}
      {isFlipped && (
        <div className="w-full flex items-center justify-center gap-3 pt-1 animate-dialog-in">
          <button
            onClick={() => onRateCard('learning')}
            className={`btn-interactive px-3.5 py-2 text-xs sm:text-sm font-medium rounded-[10px] border flex items-center gap-1.5 cursor-pointer ${
              currentRating === 'learning'
                ? 'bg-amber-100 border-amber-400 text-amber-900 dark:bg-amber-950/60 dark:border-amber-700 dark:text-amber-200'
                : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:text-amber-600 dark:hover:text-amber-400'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Still learning</span>
          </button>
          <button
            onClick={() => onRateCard('mastered')}
            className={`btn-interactive px-3.5 py-2 text-xs sm:text-sm font-medium rounded-[10px] border flex items-center gap-1.5 cursor-pointer ${
              currentRating === 'mastered'
                ? 'bg-emerald-100 border-emerald-400 text-emerald-900 dark:bg-emerald-950/60 dark:border-emerald-700 dark:text-emerald-200'
                : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>I knew it!</span>
          </button>
        </div>
      )}

      {/* 5. Navigation Row: Previous (left), Next (right) */}
      <div className="w-full flex items-center justify-between gap-3 pt-1">
        <button
          onClick={onPrev}
          disabled={!canPrev}
          className="btn-interactive flex-1 h-[44px] px-4 text-[15px] font-semibold text-[var(--text)] bg-[var(--surface)] hover:bg-[var(--card-back-accent)] disabled:opacity-40 disabled:pointer-events-none border border-[var(--border)] rounded-[10px] flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          aria-label="Previous card"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg)] border border-[var(--border)] rounded ml-1">
            ←
          </kbd>
        </button>

        <button
          onClick={onNext}
          disabled={!canNext}
          className="btn-interactive flex-1 h-[44px] px-4 text-[15px] font-semibold text-[var(--text)] bg-[var(--surface)] hover:bg-[var(--card-back-accent)] disabled:opacity-40 disabled:pointer-events-none border border-[var(--border)] rounded-[10px] flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          aria-label="Next card"
        >
          <span>Next</span>
          <ChevronRight className="w-5 h-5" />
          <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg)] border border-[var(--border)] rounded ml-1">
            →
          </kbd>
        </button>
      </div>

      {/* 6. Card Actions Row: Add, Edit, Delete */}
      <div className="w-full flex items-center justify-center gap-2 sm:gap-3 pt-3 border-t border-[var(--border)]">
        <button
          onClick={onAdd}
          className="btn-interactive min-h-[42px] px-3.5 py-2 text-xs sm:text-sm font-medium text-[var(--text)] bg-[var(--surface)] hover:bg-[var(--card-back-accent)] border border-[var(--border)] rounded-[10px] flex items-center gap-1.5 cursor-pointer"
          title="Add a new card (Shortcut: N)"
          aria-label="Add a new card"
        >
          <Plus className="w-4 h-4 text-[var(--primary)]" />
          <span>Add Card</span>
          <kbd className="hidden sm:inline-block px-1 py-0.2 text-[10px] font-mono text-[var(--text-muted)] rounded bg-[var(--bg)] border border-[var(--border)] ml-1">
            N
          </kbd>
        </button>

        <button
          onClick={onEdit}
          className="btn-interactive min-h-[42px] px-3.5 py-2 text-xs sm:text-sm font-medium text-[var(--text)] bg-[var(--surface)] hover:bg-[var(--card-back-accent)] border border-[var(--border)] rounded-[10px] flex items-center gap-1.5 cursor-pointer"
          title="Edit current card (Shortcut: E)"
          aria-label="Edit current card"
        >
          <Pencil className="w-4 h-4 text-[var(--text-muted)]" />
          <span>Edit</span>
          <kbd className="hidden sm:inline-block px-1 py-0.2 text-[10px] font-mono text-[var(--text-muted)] rounded bg-[var(--bg)] border border-[var(--border)] ml-1">
            E
          </kbd>
        </button>

        <button
          onClick={onDelete}
          className="btn-interactive min-h-[42px] px-3.5 py-2 text-xs sm:text-sm font-medium text-[var(--danger)] hover:bg-red-50 dark:hover:bg-red-950/40 border border-transparent hover:border-red-200 dark:hover:border-red-900 rounded-[10px] flex items-center gap-1.5 cursor-pointer"
          title="Delete current card (Shortcut: Del)"
          aria-label="Delete current card"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};
