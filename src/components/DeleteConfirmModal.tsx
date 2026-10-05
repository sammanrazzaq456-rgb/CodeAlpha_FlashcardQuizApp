import React, { useEffect } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { Flashcard } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  card: Flashcard | null;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  card,
  onConfirm,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onConfirm, onClose]);

  if (!isOpen || !card) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-backdrop-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div
        className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl p-6 relative animate-dialog-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/60 text-[var(--danger)] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <h3
              id="delete-modal-title"
              className="text-base font-semibold text-[var(--text)] tracking-tight"
            >
              Delete this card?
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1.5">
              Are you sure you want to remove this flashcard from your deck? This action cannot be undone.
            </p>

            {/* Card preview quote */}
            <div className="mt-3 p-3 bg-[var(--bg)] border border-[var(--border)] rounded-[10px] text-xs font-medium text-[var(--text)] line-clamp-2 italic">
              "{card.question}"
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text)] rounded-lg hover:bg-[var(--card-back-accent)] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="btn-interactive h-[38px] px-4 text-xs sm:text-sm font-medium text-[var(--text)] bg-[var(--surface)] hover:bg-[var(--card-back-accent)] border border-[var(--border)] rounded-[10px] cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn-interactive h-[38px] px-4 text-xs sm:text-sm font-semibold text-white bg-[var(--danger)] hover:bg-[var(--danger-hover)] rounded-[10px] flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
