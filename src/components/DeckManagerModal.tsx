import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Search,
  Download,
  Upload,
  RotateCcw,
  Pencil,
  Trash2,
  CheckCircle2,
  Bookmark,
  FileText,
  Copy,
  Check,
  Image as ImageIcon,
  Tag,
  Filter,
} from 'lucide-react';
import { Flashcard } from '../types';

interface DeckManagerModalProps {
  isOpen: boolean;
  cards: Flashcard[];
  currentIndex: number;
  onSelectCard: (index: number) => void;
  onEditCard: (index: number) => void;
  onDeleteCard: (index: number) => void;
  onImportCards: (cards: Flashcard[]) => void;
  onResetDeck: () => void;
  onClose: () => void;
}

export const DeckManagerModal: React.FC<DeckManagerModalProps> = ({
  isOpen,
  cards,
  currentIndex,
  onSelectCard,
  onEditCard,
  onDeleteCard,
  onImportCards,
  onResetDeck,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | 'all'>('all');
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportArea, setShowImportArea] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedTag('all');
      setShowImportArea(false);
      setImportError(null);
      setImportJsonText('');
      setExportNotice(null);
    }
  }, [isOpen]);

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

  // Compute all unique tags with card counts
  const allUniqueTags = useMemo(() => {
    const tagMap = new Map<string, number>();
    cards.forEach((c) => {
      c.tags?.forEach((t) => {
        tagMap.set(t, (tagMap.get(t) || 0) + 1);
      });
    });
    return Array.from(tagMap.entries()).sort((a, b) => b[1] - a[1]);
  }, [cards]);

  if (!isOpen) return null;

  const filteredCards = cards
    .map((card, originalIndex) => ({ card, originalIndex }))
    .filter(({ card }) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        card.question.toLowerCase().includes(q) ||
        card.answer.toLowerCase().includes(q) ||
        (card.tags && card.tags.some((t) => t.toLowerCase().includes(q)));

      const matchesTag =
        selectedTag === 'all' || (card.tags && card.tags.includes(selectedTag));

      return matchesSearch && matchesTag;
    });

  const handleExportJson = () => {
    try {
      const jsonString = JSON.stringify(cards, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      const filename = `memora_flashcards_backup_${new Date().toISOString().slice(0, 10)}.json`;
      downloadAnchor.setAttribute('href', url);
      downloadAnchor.setAttribute('download', filename);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
      URL.revokeObjectURL(url);

      setExportNotice(`Backup downloaded! ${cards.length} cards saved as JSON file.`);
      setTimeout(() => setExportNotice(null), 4000);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(cards, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        validateAndImport(parsed);
      } catch (err) {
        setImportError('Invalid JSON format. Please select a valid flashcard deck file.');
      }
    };
    reader.readAsText(file);
  };

  const handleTextImport = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      validateAndImport(parsed);
    } catch (err) {
      setImportError('Invalid JSON format. Check syntax and try again.');
    }
  };

  const validateAndImport = (data: any) => {
    if (!Array.isArray(data)) {
      setImportError('Import data must be a JSON array of flashcards.');
      return;
    }

    const validCards: Flashcard[] = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (
        typeof item === 'object' &&
        item !== null &&
        typeof item.question === 'string' &&
        typeof item.answer === 'string' &&
        item.question.trim().length > 0 &&
        item.answer.trim().length > 0
      ) {
        validCards.push({
          id: item.id || `card-${Date.now()}-${i}`,
          question: item.question.trim(),
          answer: item.answer.trim(),
          imageUrl: typeof item.imageUrl === 'string' && item.imageUrl.trim().length > 0 ? item.imageUrl.trim() : undefined,
          createdAt: typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
          status: item.status === 'mastered' || item.status === 'learning' ? item.status : 'unrated',
          tags: Array.isArray(item.tags)
            ? item.tags.filter((t: any) => typeof t === 'string' && t.trim().length > 0).map((t: string) => t.trim())
            : undefined,
        });
      }
    }

    if (validCards.length === 0) {
      setImportError('No valid flashcards found in the imported file/text.');
      return;
    }

    onImportCards(validCards);
    setShowImportArea(false);
    setImportError(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-backdrop-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="deck-manager-title"
    >
      <div
        className="w-full max-w-2xl bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl p-5 sm:p-6 relative max-h-[90vh] flex flex-col animate-dialog-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <h2
              id="deck-manager-title"
              className="text-base sm:text-lg font-semibold text-[var(--text)] tracking-tight"
            >
              Deck Overview & Management
            </h2>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              ({cards.length} cards)
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] rounded-lg hover:bg-[var(--card-back-accent)] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dedicated Backup & Export Banner */}
        <div className="mt-3 p-3 rounded-xl bg-[var(--card-back-accent)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[var(--text)] leading-tight">
                Export Deck Backup (.json)
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                Download your cards with questions, answers, and pictures for offline backup.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportJson}
              disabled={cards.length === 0}
              className="btn-interactive px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white disabled:opacity-40 flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Download full deck as JSON file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON</span>
            </button>
            <button
              onClick={handleCopyJson}
              disabled={cards.length === 0}
              className="btn-interactive px-2.5 py-1.5 text-xs font-medium rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--card-back-accent)] disabled:opacity-40 flex items-center gap-1 cursor-pointer"
              title="Copy JSON data to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Export Success Notification */}
        {exportNotice && (
          <div className="mt-2.5 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs font-medium text-emerald-900 dark:text-emerald-200 flex items-center gap-2 animate-dialog-in">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{exportNotice}</span>
          </div>
        )}

        {/* Toolbar: Search & Action buttons */}
        <div className="py-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search question, answer, or #topic..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-[var(--bg)] border border-[var(--border)] rounded-[10px] text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowImportArea(!showImportArea)}
              className="btn-interactive px-2.5 py-1.5 text-xs font-medium text-[var(--text)] bg-[var(--surface)] hover:bg-[var(--card-back-accent)] border border-[var(--border)] rounded-[8px] flex items-center gap-1 cursor-pointer"
              title="Import cards from JSON backup"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
            </button>
          </div>
        </div>

        {/* Topic / Tag Filter Bar */}
        {allUniqueTags.length > 0 && (
          <div className="pb-2.5 flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-thin">
            <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1 shrink-0 mr-0.5">
              <Tag className="w-3 h-3 text-[var(--primary)]" />
              Topics:
            </span>

            {/* All Topics Chip */}
            <button
              onClick={() => setSelectedTag('all')}
              className={`btn-interactive px-2.5 py-1 text-xs rounded-lg font-medium shrink-0 border transition-all cursor-pointer ${
                selectedTag === 'all'
                  ? 'bg-[var(--primary)] text-white border-transparent shadow-xs'
                  : 'bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] border-[var(--border)] hover:bg-[var(--card-back-accent)]'
              }`}
            >
              All Topics ({cards.length})
            </button>

            {/* Individual Tag Chips */}
            {allUniqueTags.map(([tag, count]) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(isSelected ? 'all' : tag)}
                  className={`btn-interactive px-2.5 py-1 text-xs rounded-lg font-medium shrink-0 border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--primary)] text-white border-transparent shadow-xs'
                      : 'bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text)] border-[var(--border)] hover:bg-[var(--card-back-accent)]'
                  }`}
                >
                  #{tag} ({count})
                </button>
              );
            })}

            {selectedTag !== 'all' && (
              <button
                onClick={() => setSelectedTag('all')}
                className="text-[11px] text-[var(--primary)] hover:underline shrink-0 ml-1 cursor-pointer"
              >
                Clear filter
              </button>
            )}
          </div>
        )}

        {/* Collapsible Import Drawer */}
        {showImportArea && (
          <div className="mb-3 p-3 bg-[var(--bg)] border border-[var(--border)] rounded-[10px] text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[var(--text)]">Import Deck from JSON</span>
              <label className="btn-interactive px-2 py-1 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--text)] cursor-pointer flex items-center gap-1">
                <FileText className="w-3 h-3" />
                <span>Upload .json</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={handleFileImport}
                />
              </label>
            </div>
            <textarea
              rows={3}
              value={importJsonText}
              onChange={(e) => {
                setImportJsonText(e.target.value);
                setImportError(null);
              }}
              placeholder='Or paste JSON array here: [{"question": "...", "answer": "...", "imageUrl": "..."}]'
              className="w-full p-2 bg-[var(--surface)] border border-[var(--border)] rounded font-mono text-[11px] text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
            {importError && <p className="text-[var(--danger)] text-xs">{importError}</p>}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowImportArea(false)}
                className="px-2.5 py-1 text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                Cancel
              </button>
              <button
                onClick={handleTextImport}
                disabled={!importJsonText.trim()}
                className="btn-interactive px-3 py-1 bg-[var(--primary)] text-white rounded font-medium disabled:opacity-40"
              >
                Apply Import
              </button>
            </div>
          </div>
        )}

        {/* Card List View */}
        <div className="flex-1 overflow-y-auto min-h-[220px] max-h-[380px] divide-y divide-[var(--border)] border border-[var(--border)] rounded-[10px]">
          {filteredCards.length === 0 ? (
            <div className="p-8 text-center text-xs sm:text-sm text-[var(--text-muted)] space-y-2">
              {selectedTag !== 'all' ? (
                <div>
                  <p>
                    No flashcards found tagged with <strong className="text-[var(--text)]">#{selectedTag}</strong>.
                  </p>
                  <button
                    onClick={() => setSelectedTag('all')}
                    className="mt-2 text-xs font-semibold text-[var(--primary)] hover:underline cursor-pointer"
                  >
                    View All Topics
                  </button>
                </div>
              ) : searchQuery ? (
                <p>No flashcards match your search.</p>
              ) : (
                <p>No cards in deck.</p>
              )}
            </div>
          ) : (
            filteredCards.map(({ card, originalIndex }) => {
              const isSelected = originalIndex === currentIndex;
              return (
                <div
                  key={card.id}
                  className={`p-3 sm:p-3.5 flex items-start justify-between gap-3 hover:bg-[var(--card-back-accent)]/50 transition-colors ${
                    isSelected ? 'bg-[var(--card-back-accent)] border-l-4 border-l-[var(--primary)]' : ''
                  }`}
                >
                  {/* Picture Thumbnail if present */}
                  {card.imageUrl ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--surface)] shrink-0 flex items-center justify-center shadow-xs">
                      <img
                        src={card.imageUrl}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg)] shrink-0 flex items-center justify-center text-[var(--text-muted)] opacity-60">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => {
                      onSelectCard(originalIndex);
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[11px] font-mono text-[var(--text-muted)]">
                        #{originalIndex + 1}
                      </span>
                      {card.imageUrl && (
                        <span className="text-[10px] bg-[var(--primary)]/10 text-[var(--primary)] font-medium px-1.5 py-0.2 rounded">
                          Picture
                        </span>
                      )}
                      {card.status === 'mastered' && (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 font-medium">
                          <CheckCircle2 className="w-3 h-3" /> Mastered
                        </span>
                      )}
                      {card.status === 'learning' && (
                        <span className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-0.5 font-medium">
                          <Bookmark className="w-3 h-3" /> Learning
                        </span>
                      )}
                      {isSelected && (
                        <span className="text-[10px] uppercase tracking-wide text-[var(--primary)] font-semibold">
                          (Current)
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-[var(--text)] line-clamp-1">
                      {card.question}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-1 mt-0.5">
                      {card.answer}
                    </p>

                    {/* Card Tags / Topic Badges */}
                    {card.tags && card.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 mt-1.5">
                        {card.tags.map((t) => (
                          <span
                            key={t}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTag(t);
                            }}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium border transition-colors cursor-pointer ${
                              selectedTag === t
                                ? 'bg-[var(--primary)] text-white border-transparent'
                                : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
                            }`}
                            title={`Filter cards by #${t}`}
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0 pt-1">
                    <button
                      onClick={() => {
                        onEditCard(originalIndex);
                        onClose();
                      }}
                      className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] rounded hover:bg-[var(--surface)] transition-colors cursor-pointer"
                      title="Edit card"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        onDeleteCard(originalIndex);
                        onClose();
                      }}
                      className="p-1.5 text-[var(--danger)] hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors cursor-pointer"
                      title="Delete card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm('Reset deck to 10 starter sample cards?')) {
                onResetDeck();
                onClose();
              }
            }}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--danger)] flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Starter Deck</span>
          </button>

          <button
            onClick={onClose}
            className="btn-interactive h-[36px] px-4 text-xs font-medium text-[var(--text)] bg-[var(--surface)] hover:bg-[var(--card-back-accent)] border border-[var(--border)] rounded-[8px] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
