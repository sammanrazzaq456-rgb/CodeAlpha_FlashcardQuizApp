/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Flashcard, ModalMode, Theme, INITIAL_CARDS } from './types';
import { Header } from './components/Header';
import { ProgressArea } from './components/ProgressArea';
import { FlashcardView } from './components/FlashcardView';
import { Controls } from './components/Controls';
import { EmptyState } from './components/EmptyState';
import { CardModal } from './components/CardModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { DeckManagerModal } from './components/DeckManagerModal';
import { fireMasteryConfetti } from './utils/confetti';
import { getStreakState, recordStudyDay, StreakData, getLocalDateString } from './utils/streak';
import { Live3DBackground } from './components/Live3DBackground';
import { SideMenuDrawer } from './components/SideMenuDrawer';
import { SignInGooglePage, GoogleUser } from './components/SignInGooglePage';
import { ambientAudio, AmbientSoundPreset } from './utils/audio';

const STORAGE_KEY_CARDS = 'memora_flashcards_deck';
const STORAGE_KEY_THEME = 'memora_flashcards_theme';
const STORAGE_KEY_USER = 'memora_google_user';

export default function App() {
  // Theme state: defaults to system preference, persisted in localStorage
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  // Cards deck state: defaults to 10 starter cards, persisted in localStorage
  const [cards, setCards] = useState<Flashcard[]>(() => {
    try {
      const savedCards = localStorage.getItem(STORAGE_KEY_CARDS);
      if (savedCards) {
        const parsed = JSON.parse(savedCards);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If stored cards was the previous 5-card starter set, upgrade to the 10 starter cards
          const isOlderStarterSet =
            parsed.length <= 5 && parsed.every((c: Flashcard) => c.id.startsWith('starter-'));
          if (isOlderStarterSet) {
            return INITIAL_CARDS;
          }

          // Otherwise enrich stored cards with images and tags if matching starter IDs
          return parsed.map((c: Flashcard) => {
            const starterMatch = INITIAL_CARDS.find((s) => s.id === c.id);
            const updated = { ...c };
            if (!updated.imageUrl && starterMatch?.imageUrl) {
              updated.imageUrl = starterMatch.imageUrl;
            }
            if ((!updated.tags || updated.tags.length === 0) && starterMatch?.tags) {
              updated.tags = starterMatch.tags;
            }
            return updated;
          });
        }
      }
    } catch (err) {
      console.error('Failed to load cards from localStorage:', err);
    }
    return INITIAL_CARDS;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('none');
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);
  const [deletingCardIndex, setDeletingCardIndex] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<'none' | 'next' | 'prev'>('none');

  // Page View state ('deck' or 'google_auth')
  const [activeView, setActiveView] = useState<'deck' | 'google_auth'>('deck');

  // Side Drawer state
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  // Google User Session state
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      console.error('Failed to load user session:', e);
    }
    return null;
  });

  // Background Lo-Fi Ambient Audio state (Web Audio API)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioPreset, setAudioPreset] = useState<AmbientSoundPreset>('lofi_piano');
  const [audioVolume, setAudioVolume] = useState(0.4);

  useEffect(() => {
    const unsubscribe = ambientAudio.subscribe((playing) => {
      setIsAudioPlaying(playing);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleAudio = useCallback(() => {
    ambientAudio.toggle(audioPreset);
  }, [audioPreset]);

  const handleChangeAudioPreset = useCallback((preset: AmbientSoundPreset) => {
    setAudioPreset(preset);
    ambientAudio.setPreset(preset);
  }, []);

  const handleChangeAudioVolume = useCallback((val: number) => {
    setAudioVolume(val);
    ambientAudio.setVolume(val);
  }, []);

  const handleSignIn = (user: GoogleUser) => {
    setGoogleUser(user);
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to persist user session:', e);
    }
  };

  const handleSignOut = () => {
    setGoogleUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
    } catch (e) {
      console.error('Failed to remove user session:', e);
    }
  };

  // Daily Streak State: persisted in localStorage, tracks consecutive study days
  const [streak, setStreak] = useState<StreakData>(() => getStreakState());
  const studiedToday = streak.lastStudyDate === getLocalDateString();

  // Helper to record study activity and update streak
  const handleRecordStudy = useCallback(() => {
    const { streak: updated } = recordStudyDay();
    setStreak(updated);
  }, []);

  // Apply theme to document element and persist
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch (err) {
      console.error('Failed to save theme:', err);
    }
  }, [theme]);

  // Persist cards whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(cards));
    } catch (err) {
      console.error('Failed to save cards:', err);
    }
  }, [cards]);

  // Ensure currentIndex stays within bounds when card list changes
  useEffect(() => {
    if (cards.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= cards.length) {
      setCurrentIndex(cards.length - 1);
    }
  }, [cards.length, currentIndex]);

  const allMastered = cards.length > 0 && cards.every((c) => c.status === 'mastered');
  const prevAllMasteredRef = useRef(false);

  // Trigger celebration confetti animation when all cards in the deck are marked as 'mastered'
  useEffect(() => {
    if (allMastered && !prevAllMasteredRef.current) {
      fireMasteryConfetti();
    }
    prevAllMasteredRef.current = allMastered;
  }, [allMastered]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Flip card
  const handleToggleFlip = useCallback(() => {
    if (cards.length === 0) return;
    setIsFlipped((prev) => !prev);
    handleRecordStudy();
  }, [cards.length, handleRecordStudy]);

  // Next card (slides in from right, resets flip to front)
  const handleNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setSlideDirection('next');
      setCurrentIndex((prev) => prev + 1);
      handleRecordStudy();
      setTimeout(() => setSlideDirection('none'), 300);
    }
  }, [currentIndex, cards.length, handleRecordStudy]);

  // Previous card (slides in from left, resets flip to front)
  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setSlideDirection('prev');
      setCurrentIndex((prev) => prev - 1);
      handleRecordStudy();
      setTimeout(() => setSlideDirection('none'), 300);
    }
  }, [currentIndex, handleRecordStudy]);

  // Add Card
  const handleOpenAddModal = useCallback(() => {
    setModalMode('add');
  }, []);

  // Edit current or specific Card
  const handleOpenEditModal = useCallback((index?: number) => {
    const targetIdx = index !== undefined ? index : currentIndex;
    if (cards.length === 0 || !cards[targetIdx]) return;
    setEditingCardIndex(targetIdx);
    setModalMode('edit');
  }, [cards, currentIndex]);

  // Delete current or specific Card
  const handleOpenDeleteModal = useCallback((index?: number) => {
    const targetIdx = index !== undefined ? index : currentIndex;
    if (cards.length === 0 || !cards[targetIdx]) return;
    setDeletingCardIndex(targetIdx);
    setModalMode('delete');
  }, [cards, currentIndex]);

  // Save Card (Add or Edit)
  const handleSaveCard = (
    question: string,
    answer: string,
    imageUrl?: string,
    tags?: string[]
  ) => {
    if (modalMode === 'add') {
      const newCard: Flashcard = {
        id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        question,
        answer,
        imageUrl,
        tags: tags || [],
        createdAt: Date.now(),
        status: 'unrated',
      };
      setCards((prev) => [...prev, newCard]);
      // Jump to the newly created card
      setCurrentIndex(cards.length);
      setIsFlipped(false);
    } else if (modalMode === 'edit' && editingCardIndex !== null) {
      setCards((prev) =>
        prev.map((c, idx) =>
          idx === editingCardIndex
            ? { ...c, question, answer, imageUrl, tags: tags || [] }
            : c
        )
      );
    }
    setModalMode('none');
    setEditingCardIndex(null);
  };

  // Confirm Delete Card
  const handleConfirmDelete = () => {
    if (deletingCardIndex === null || cards.length === 0) return;

    const newCards = cards.filter((_, idx) => idx !== deletingCardIndex);
    setCards(newCards);

    // Update currentIndex:
    // If deleting last card in deck, move to new last card
    if (deletingCardIndex >= newCards.length) {
      setCurrentIndex(Math.max(0, newCards.length - 1));
    } else {
      // Otherwise stay at the same index which now holds the next card
      setCurrentIndex(deletingCardIndex);
    }

    setIsFlipped(false);
    setModalMode('none');
    setDeletingCardIndex(null);
  };

  // Rate Card ("I knew it" / "Still learning")
  const handleRateCard = (rating: 'mastered' | 'learning') => {
    if (cards.length === 0 || !cards[currentIndex]) return;
    setCards((prev) =>
      prev.map((card, idx) =>
        idx === currentIndex ? { ...card, status: rating } : card
      )
    );
    handleRecordStudy();
  };

  // Shuffle Cards Deck
  const handleShuffle = () => {
    if (cards.length <= 1) return;
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Reset to initial sample deck
  const handleResetDeck = () => {
    setCards(INITIAL_CARDS);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Reset ratings for deck to practice again
  const handleResetRatings = () => {
    setCards((prev) => prev.map((c) => ({ ...c, status: 'unrated' })));
  };

  // Import JSON Deck
  const handleImportCards = (imported: Flashcard[]) => {
    setCards(imported);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Jump to specific card from manager list
  const handleSelectCard = (index: number) => {
    if (index >= 0 && index < cards.length) {
      setCurrentIndex(index);
      setIsFlipped(false);
    }
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcut keys if user is typing in input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // If modal is open, don't trigger main screen navigation shortcuts
      if (modalMode !== 'none') {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case ' ':
        case 'Enter':
          e.preventDefault();
          handleToggleFlip();
          break;
        case 'n':
        case 'N':
          e.preventDefault();
          handleOpenAddModal();
          break;
        case 'e':
        case 'E':
          e.preventDefault();
          handleOpenEditModal();
          break;
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          handleOpenDeleteModal();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    modalMode,
    handlePrev,
    handleNext,
    handleToggleFlip,
    handleOpenAddModal,
    handleOpenEditModal,
    handleOpenDeleteModal,
  ]);

  const currentCard = cards[currentIndex] || null;
  const masteredCount = cards.filter((c) => c.status === 'mastered').length;
  const learningCount = cards.filter((c) => c.status === 'learning').length;

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-[var(--primary)] selection:text-white pb-8 overflow-x-hidden">
      {/* 3D and Live Background UI/UX with mouse parallax and floating geometric depth */}
      <Live3DBackground theme={theme} isAudioPlaying={isAudioPlaying} />

      {/* 1. Header with side menu button, ambient audio toggle, streak, and Google sign-in */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onShuffle={handleShuffle}
        onOpenDeckManager={() => setModalMode('search')}
        hasCards={cards.length > 0}
        streak={streak}
        studiedToday={studiedToday}
        onOpenSideMenu={() => setIsSideMenuOpen(true)}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handleToggleAudio}
        googleUser={googleUser}
        onNavigateView={(v) => setActiveView(v)}
        activeView={activeView}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center py-4 w-full">
        {activeView === 'google_auth' ? (
          <SignInGooglePage
            user={googleUser}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
            onBackToDeck={() => setActiveView('deck')}
            totalCards={cards.length}
            masteredCount={masteredCount}
            currentStreak={streak.currentStreak}
          />
        ) : cards.length === 0 ? (
          <EmptyState
            onAddCard={handleOpenAddModal}
            onRestoreDefaults={handleResetDeck}
          />
        ) : (
          <div className="w-full flex flex-col items-center">
            {/* 2. Progress Area */}
            <ProgressArea
              currentIndex={currentIndex}
              totalCards={cards.length}
              masteredCount={masteredCount}
              learningCount={learningCount}
              allMastered={allMastered}
              onRecelebrate={() => fireMasteryConfetti()}
              onResetRatings={handleResetRatings}
            />

            {/* 3. Flashcard */}
            {currentCard && (
              <FlashcardView
                card={currentCard}
                isFlipped={isFlipped}
                slideDirection={slideDirection}
                onFlip={handleToggleFlip}
              />
            )}

            {/* 4, 5, 6. Controls (Show Answer, Prev/Next, Add/Edit/Delete, Ratings) */}
            <Controls
              isFlipped={isFlipped}
              onToggleFlip={handleToggleFlip}
              canPrev={currentIndex > 0}
              canNext={currentIndex < cards.length - 1}
              onPrev={handlePrev}
              onNext={handleNext}
              onAdd={handleOpenAddModal}
              onEdit={() => handleOpenEditModal(currentIndex)}
              onDelete={() => handleOpenDeleteModal(currentIndex)}
              onRateCard={handleRateCard}
              currentRating={currentCard?.status}
            />
          </div>
        )}
      </main>

      {/* Footer / Keyboard Shortcut Legend */}
      {activeView === 'deck' && (
        <footer className="relative z-10 w-full max-w-lg mx-auto px-4 mt-6 text-center">
          <div className="hidden sm:flex items-center justify-center gap-4 text-[11px] text-[var(--text-muted)] font-medium">
            <span><kbd className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] font-mono">Space</kbd> Flip</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] font-mono">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] font-mono">→</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] font-mono">N</kbd> New</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] font-mono">E</kbd> Edit</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] font-mono">Del</kbd> Delete</span>
          </div>
        </footer>
      )}

      {/* 7. Side Menu Drawer (Three lines hamburger) */}
      <SideMenuDrawer
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        activeView={activeView}
        onNavigateView={(v) => {
          setActiveView(v);
          setIsSideMenuOpen(false);
        }}
        googleUser={googleUser}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenDeckManager={() => {
          setIsSideMenuOpen(false);
          setModalMode('search');
        }}
        onOpenAddCard={() => {
          setIsSideMenuOpen(false);
          handleOpenAddModal();
        }}
        onOpenStreakModal={() => {
          setIsSideMenuOpen(false);
        }}
        onShuffle={handleShuffle}
        onResetDeck={handleResetDeck}
        streak={streak}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handleToggleAudio}
        audioPreset={audioPreset}
        onChangeAudioPreset={handleChangeAudioPreset}
        audioVolume={audioVolume}
        onChangeAudioVolume={handleChangeAudioVolume}
        totalCards={cards.length}
      />

      {/* 8. Modals */}
      {/* Add / Edit Modal */}
      <CardModal
        isOpen={modalMode === 'add' || modalMode === 'edit'}
        mode={modalMode === 'edit' ? 'edit' : 'add'}
        initialCard={
          modalMode === 'edit' && editingCardIndex !== null
            ? cards[editingCardIndex]
            : null
        }
        onSave={handleSaveCard}
        onClose={() => {
          setModalMode('none');
          setEditingCardIndex(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={modalMode === 'delete'}
        card={deletingCardIndex !== null ? cards[deletingCardIndex] : null}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setModalMode('none');
          setDeletingCardIndex(null);
        }}
      />

      {/* Deck Overview & Search / Export / Import Modal */}
      <DeckManagerModal
        isOpen={modalMode === 'search'}
        cards={cards}
        currentIndex={currentIndex}
        onSelectCard={handleSelectCard}
        onEditCard={(idx) => {
          handleOpenEditModal(idx);
        }}
        onDeleteCard={(idx) => {
          handleOpenDeleteModal(idx);
        }}
        onImportCards={handleImportCards}
        onResetDeck={handleResetDeck}
        onClose={() => setModalMode('none')}
      />
    </div>
  );
}
