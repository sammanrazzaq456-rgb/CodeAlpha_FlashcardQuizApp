import React from 'react';
import { Plus, Sparkles, BookOpen } from 'lucide-react';

interface EmptyStateProps {
  onAddCard: () => void;
  onRestoreDefaults: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onAddCard,
  onRestoreDefaults,
}) => {
  return (
    <div className="w-full max-w-[560px] mx-auto px-4 my-10 flex flex-col items-center justify-center text-center animate-dialog-in">
      {/* Visual illustration container */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-lg flex items-center justify-center mb-6 relative">
        <div className="absolute inset-2 border-2 border-dashed border-[var(--primary)]/30 rounded-xl flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-[var(--primary)] opacity-85" />
        </div>
        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-md">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text)] tracking-tight">
        No cards yet
      </h2>
      <p className="text-sm text-[var(--text-muted)] max-w-sm mt-2 mb-6">
        Your deck is currently empty. Create your own flashcard or load the starter deck to begin studying.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={onAddCard}
          className="btn-interactive h-[44px] px-6 text-sm font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-[10px] flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add your first card</span>
        </button>

        <button
          onClick={onRestoreDefaults}
          className="btn-interactive h-[44px] px-5 text-sm font-medium text-[var(--text)] bg-[var(--surface)] hover:bg-[var(--card-back-accent)] border border-[var(--border)] rounded-[10px] flex items-center gap-2 cursor-pointer"
        >
          <span>Load sample deck</span>
        </button>
      </div>
    </div>
  );
};
