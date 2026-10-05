import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Image as ImageIcon, Upload, Trash2, Tag, Plus } from 'lucide-react';
import { Flashcard } from '../types';

interface CardModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialCard?: Flashcard | null;
  onSave: (question: string, answer: string, imageUrl?: string, tags?: string[]) => void;
  onClose: () => void;
}

const MAX_CHARS = 300;
const SUGGESTED_TOPICS = ['Science', 'Geography', 'History', 'Language', 'Computer Science', 'Arts', 'Biology', 'Medicine'];

export const CardModal: React.FC<CardModalProps> = ({
  isOpen,
  mode,
  initialCard,
  onSave,
  onClose,
}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const questionInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialCard) {
        setQuestion(initialCard.question);
        setAnswer(initialCard.answer);
        setImageUrl(initialCard.imageUrl || '');
        setTags(initialCard.tags || []);
        setShowImageInput(!!initialCard.imageUrl);
      } else {
        setQuestion('');
        setAnswer('');
        setImageUrl('');
        setTags([]);
        setShowImageInput(false);
      }
      setTagInput('');
      setHasInteracted(false);
      // Auto-focus question field
      setTimeout(() => {
        questionInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, mode, initialCard]);

  // Keyboard handling: Escape to close, Ctrl/Cmd + Enter to save
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        const trimmedQ = question.trim();
        const trimmedA = answer.trim();
        if (
          trimmedQ.length > 0 &&
          trimmedA.length > 0 &&
          question.length <= MAX_CHARS &&
          answer.length <= MAX_CHARS
        ) {
          e.preventDefault();
          onSave(trimmedQ, trimmedA, imageUrl.trim() || undefined, tags);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, question, answer, imageUrl, tags, onSave, onClose]);

  if (!isOpen) return null;

  const trimmedQuestion = question.trim();
  const trimmedAnswer = answer.trim();
  const isQuestionValid = trimmedQuestion.length > 0 && question.length <= MAX_CHARS;
  const isAnswerValid = trimmedAnswer.length > 0 && answer.length <= MAX_CHARS;
  const isFormValid = isQuestionValid && isAnswerValid;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 3MB for localStorage safety)
    if (file.size > 3 * 1024 * 1024) {
      alert('Please choose an image under 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setImageUrl(event.target.result);
        setShowImageInput(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddTag = (tagToAdd?: string) => {
    const raw = tagToAdd || tagInput;
    const cleanTag = raw.trim().replace(/^#/, '');
    if (!cleanTag) return;

    // Avoid duplicates case-insensitively
    const exists = tags.some((t) => t.toLowerCase() === cleanTag.toLowerCase());
    if (!exists) {
      setTags([...tags, cleanTag]);
    }
    if (!tagToAdd) {
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasInteracted(true);
    if (!isFormValid) return;
    onSave(trimmedQuestion, trimmedAnswer, imageUrl.trim() || undefined, tags);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-backdrop-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="card-modal-title"
    >
      <div
        className="w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto animate-dialog-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <h2
            id="card-modal-title"
            className="text-lg font-semibold text-[var(--text)] tracking-tight"
          >
            {mode === 'add' ? 'Add New Flashcard' : 'Edit Flashcard'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] rounded-lg hover:bg-[var(--card-back-accent)] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Question input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="card-question"
                className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider"
              >
                Question <span className="text-[var(--danger)]">*</span>
              </label>
              <span
                className={`text-xs font-mono ${
                  question.length > MAX_CHARS
                    ? 'text-[var(--danger)] font-bold'
                    : 'text-[var(--text-muted)]'
                }`}
              >
                {question.length}/{MAX_CHARS}
              </span>
            </div>
            <textarea
              id="card-question"
              ref={questionInputRef}
              rows={2}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What is the powerhouse of the cell?"
              className="w-full px-3.5 py-2.5 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-[10px] text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              required
            />
            {hasInteracted && trimmedQuestion.length === 0 && (
              <p className="text-xs text-[var(--danger)] mt-1">
                Question cannot be empty
              </p>
            )}
            {question.length > MAX_CHARS && (
              <p className="text-xs text-[var(--danger)] mt-1">
                Question must be under {MAX_CHARS} characters
              </p>
            )}
          </div>

          {/* Picture with Question section */}
          <div className="p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--text)] flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[var(--primary)]" />
                Question Picture (Optional)
              </span>

              <div className="flex items-center gap-2">
                <label className="btn-interactive px-2 py-1 text-xs font-medium bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] rounded-md flex items-center gap-1 cursor-pointer">
                  <Upload className="w-3 h-3 text-[var(--text-muted)]" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
                {!showImageInput && !imageUrl && (
                  <button
                    type="button"
                    onClick={() => setShowImageInput(true)}
                    className="text-xs text-[var(--primary)] hover:underline"
                  >
                    Image URL
                  </button>
                )}
              </div>
            </div>

            {(showImageInput || imageUrl) && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Enter image URL or paste an image link..."
                    className="flex-1 px-3 py-1.5 text-xs bg-[var(--surface)] border border-[var(--border)] rounded-[8px] text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  />
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('');
                        setShowImageInput(false);
                      }}
                      className="p-1.5 text-[var(--danger)] hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Image preview */}
                {imageUrl && (
                  <div className="relative rounded-lg overflow-hidden border border-[var(--border)] max-h-32 bg-[var(--surface)] flex items-center justify-center">
                    <img
                      src={imageUrl}
                      alt="Question preview"
                      referrerPolicy="no-referrer"
                      className="max-h-32 w-auto object-contain"
                      onError={() => {
                        // ignore broken image display gracefully
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Answer input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="card-answer"
                className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider"
              >
                Answer <span className="text-[var(--danger)]">*</span>
              </label>
              <span
                className={`text-xs font-mono ${
                  answer.length > MAX_CHARS
                    ? 'text-[var(--danger)] font-bold'
                    : 'text-[var(--text-muted)]'
                }`}
              >
                {answer.length}/{MAX_CHARS}
              </span>
            </div>
            <textarea
              id="card-answer"
              rows={2}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="e.g. Mitochondria"
              className="w-full px-3.5 py-2.5 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-[10px] text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              required
            />
            {hasInteracted && trimmedAnswer.length === 0 && (
              <p className="text-xs text-[var(--danger)] mt-1">
                Answer cannot be empty
              </p>
            )}
            {answer.length > MAX_CHARS && (
              <p className="text-xs text-[var(--danger)] mt-1">
                Answer must be under {MAX_CHARS} characters
              </p>
            )}
          </div>

          {/* Topics / Tags Section */}
          <div className="p-3.5 bg-[var(--bg)] border border-[var(--border)] rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="card-tags"
                className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider flex items-center gap-1.5"
              >
                <Tag className="w-3.5 h-3.5 text-[var(--primary)]" />
                Topics & Tags (Optional)
              </label>
              <span className="text-[11px] text-[var(--text-muted)]">
                e.g. Science, Language
              </span>
            </div>

            {/* Existing tags chip list */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] shadow-xs animate-dialog-in"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="p-0.5 text-[var(--text-muted)] hover:text-[var(--danger)] rounded cursor-pointer"
                      title={`Remove tag ${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Tag text input and add button */}
            <div className="flex gap-2">
              <input
                id="card-tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  } else if (e.key === ',') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Type a topic (e.g. Science) and press Enter..."
                className="flex-1 px-3 py-1.5 text-xs bg-[var(--surface)] border border-[var(--border)] rounded-[8px] text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              />
              <button
                type="button"
                onClick={() => handleAddTag()}
                disabled={!tagInput.trim()}
                className="btn-interactive px-3 py-1.5 text-xs font-semibold bg-[var(--surface)] hover:bg-[var(--card-back-accent)] text-[var(--text)] border border-[var(--border)] rounded-[8px] flex items-center gap-1 disabled:opacity-40 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>Add</span>
              </button>
            </div>

            {/* Quick suggested topic tags */}
            <div className="pt-1">
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold block mb-1.5">
                Suggested Topics:
              </span>
              <div className="flex flex-wrap gap-1">
                {SUGGESTED_TOPICS.map((topic) => {
                  const isAdded = tags.some((t) => t.toLowerCase() === topic.toLowerCase());
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => (isAdded ? handleRemoveTag(topic) : handleAddTag(topic))}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                        isAdded
                          ? 'bg-[var(--primary)] text-white border-transparent shadow-xs'
                          : 'bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] border-[var(--border)] hover:bg-[var(--card-back-accent)]'
                      }`}
                    >
                      {isAdded ? `✓ ${topic}` : `+ ${topic}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
            <span className="text-xs text-[var(--text-muted)] hidden sm:inline">
              Tip: Press <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[var(--bg)] border border-[var(--border)]">Ctrl+Enter</kbd> to save
            </span>

            <div className="flex items-center gap-2.5 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="btn-interactive h-[40px] px-4 text-xs sm:text-sm font-medium text-[var(--text)] bg-[var(--surface)] hover:bg-[var(--card-back-accent)] border border-[var(--border)] rounded-[10px] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid}
                className="btn-interactive h-[40px] px-5 text-xs sm:text-sm font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-40 disabled:pointer-events-none rounded-[10px] flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Card</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
