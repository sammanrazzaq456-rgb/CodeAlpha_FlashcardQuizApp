import React from 'react';
import { Flashcard } from '../types';
import { Sparkles, CheckCircle2, Bookmark } from 'lucide-react';

interface FlashcardViewProps {
  card: Flashcard;
  isFlipped: boolean;
  slideDirection: 'none' | 'next' | 'prev';
  onFlip: () => void;
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({
  card,
  isFlipped,
  slideDirection,
  onFlip,
}) => {
  const slideClass =
    slideDirection === 'next'
      ? 'slide-next'
      : slideDirection === 'prev'
      ? 'slide-prev'
      : '';

  return (
    <div className="w-full max-w-[560px] mx-auto px-4 sm:px-0">
      <div
        className={`card-container w-full min-h-[360px] sm:h-[380px] select-none cursor-pointer ${slideClass}`}
        onClick={onFlip}
        role="button"
        tabIndex={0}
        aria-label={`Flashcard: ${isFlipped ? 'Answer shown' : 'Question shown'}. Click or press Space to flip.`}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onFlip();
          }
        }}
      >
        <div className={`card-inner ${isFlipped ? 'is-flipped' : ''}`}>
          {/* Card Front: Question + Picture */}
          <div
            className="card-face card-face-front p-5 sm:p-7 flex flex-col justify-between"
            aria-live="polite"
          >
            {/* Top kicker / metadata */}
            <div className="flex items-center justify-between text-xs tracking-wider font-semibold uppercase text-[var(--text-muted)] mb-2">
              <span className="flex items-center gap-1.5 text-[var(--primary)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                Question
              </span>
              {card.status === 'mastered' && (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium normal-case tracking-normal">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mastered
                </span>
              )}
              {card.status === 'learning' && (
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium normal-case tracking-normal">
                  <Bookmark className="w-3.5 h-3.5" />
                  Learning
                </span>
              )}
            </div>

            {/* Center Area: Picture (if any) and Question text */}
            <div className="my-auto flex flex-col items-center justify-center w-full py-1">
              {/* Topic Tags Badge */}
              {card.tags && card.tags.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-1.5 mb-2">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium bg-[var(--surface)] text-[var(--primary)] border border-[var(--border)] shadow-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {card.imageUrl && (
                <div className="w-full max-h-[145px] sm:max-h-[165px] rounded-xl overflow-hidden border border-[var(--border)] shadow-xs mx-auto mb-3 bg-[var(--bg)] shrink-0 flex items-center justify-center">
                  <img
                    src={card.imageUrl}
                    alt={card.question}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover max-h-[145px] sm:max-h-[165px]"
                  />
                </div>
              )}

              {/* Question Text */}
              <div className="w-full overflow-y-auto max-h-[130px] pr-1">
                <h2
                  className={`${
                    card.imageUrl ? 'text-[19px] sm:text-[23px]' : 'text-[22px] sm:text-[28px]'
                  } font-semibold text-[var(--text)] leading-[1.3] text-center text-balance`}
                >
                  {card.question}
                </h2>
              </div>
            </div>

            {/* Bottom cue */}
            <div className="text-center text-xs text-[var(--text-muted)] flex items-center justify-center gap-1.5 mt-2">
              <span>Click to flip</span>
              <span aria-hidden="true">·</span>
              <kbd className="px-1.5 py-0.5 text-[11px] font-mono rounded bg-[var(--bg)] border border-[var(--border)]">
                Space
              </kbd>
            </div>
          </div>

          {/* Card Back: Answer */}
          <div
            className="card-face card-face-back p-6 sm:p-8 flex flex-col justify-between"
            aria-live="polite"
          >
            {/* Top kicker */}
            <div className="flex items-center justify-between text-xs tracking-wider font-semibold uppercase text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5 text-[var(--primary)]">
                <Sparkles className="w-3.5 h-3.5" />
                Answer
              </span>
              <span className="text-[11px] normal-case tracking-normal text-[var(--text-muted)]">
                Card Answer
              </span>
            </div>

            {/* Answer Content Container with Accent border */}
            <div className="my-auto py-2">
              <div className="card-back-content p-4 sm:p-5 overflow-y-auto max-h-[220px]">
                <p className="text-[18px] sm:text-[22px] font-normal text-[var(--text)] leading-[1.4] text-center">
                  {card.answer}
                </p>
              </div>
            </div>

            {/* Bottom flip prompt */}
            <div className="text-center text-xs text-[var(--text-muted)] flex items-center justify-center gap-1.5">
              <span>Click to return to question</span>
              <span aria-hidden="true">·</span>
              <kbd className="px-1.5 py-0.5 text-[11px] font-mono rounded bg-[var(--bg)] border border-[var(--border)]">
                Space
              </kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
