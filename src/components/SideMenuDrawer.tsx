import React, { useEffect } from 'react';
import {
  X,
  BookOpen,
  ListFilter,
  Plus,
  Flame,
  Volume2,
  VolumeX,
  Download,
  Moon,
  Sun,
  Shuffle,
  RotateCcw,
  Sparkles,
  Music,
} from 'lucide-react';
import { Theme } from '../types';
import { GoogleUser } from './SignInGooglePage';
import { StreakData } from '../utils/streak';
import { AmbientSoundPreset } from '../utils/audio';

interface SideMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: 'deck' | 'google_auth';
  onNavigateView: (view: 'deck' | 'google_auth') => void;
  googleUser: GoogleUser | null;
  theme: Theme;
  onToggleTheme: () => void;
  onOpenDeckManager: () => void;
  onOpenAddCard: () => void;
  onOpenStreakModal: () => void;
  onShuffle: () => void;
  onResetDeck: () => void;
  streak: StreakData;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  audioPreset: AmbientSoundPreset;
  onChangeAudioPreset: (preset: AmbientSoundPreset) => void;
  audioVolume: number;
  onChangeAudioVolume: (volume: number) => void;
  totalCards: number;
}

export const SideMenuDrawer: React.FC<SideMenuDrawerProps> = ({
  isOpen,
  onClose,
  activeView,
  onNavigateView,
  googleUser,
  theme,
  onToggleTheme,
  onOpenDeckManager,
  onOpenAddCard,
  onOpenStreakModal,
  onShuffle,
  onResetDeck,
  streak,
  isAudioPlaying,
  onToggleAudio,
  audioPreset,
  onChangeAudioPreset,
  audioVolume,
  onChangeAudioVolume,
  totalCards,
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

  return (
    <div
      className="fixed inset-0 z-50 flex bg-black/50 backdrop-blur-xs animate-backdrop-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
    >
      <div
        className="w-full max-w-xs sm:max-w-sm bg-[var(--surface)] border-r border-[var(--border)] shadow-2xl h-full flex flex-col justify-between animate-dialog-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div>
          <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[var(--border)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white shadow-xs">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-[var(--text)] tracking-tight">
                  Memora Flashcards
                </h2>
                <p className="text-[11px] text-[var(--text-muted)]">Study & Mastery</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] rounded-lg hover:bg-[var(--card-back-accent)] transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Account / Sign In with Google Banner */}
          <div className="p-4 border-b border-[var(--border)] bg-[var(--bg)]">
            {googleUser ? (
              <div
                onClick={() => {
                  onNavigateView('google_auth');
                  onClose();
                }}
                className="flex items-center gap-3 p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)] transition-all cursor-pointer shadow-xs"
              >
                <img
                  src={googleUser.photoUrl}
                  alt={googleUser.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover border border-[var(--primary)]"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[var(--text)] truncate">
                    {googleUser.name}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] truncate font-mono">
                    {googleUser.email}
                  </p>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Google Connected
                  </span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  onNavigateView('google_auth');
                  onClose();
                }}
                className="btn-interactive w-full p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)] text-left flex items-center gap-3 shadow-xs cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-[var(--bg)] flex items-center justify-center shrink-0 border border-[var(--border)]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--text)]">
                    Sign in with Google
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Backup deck & sync streak
                  </p>
                </div>
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => {
                onNavigateView('deck');
                onClose();
              }}
              className={`btn-interactive w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-3 text-left cursor-pointer ${
                activeView === 'deck'
                  ? 'bg-[var(--primary)] text-white shadow-xs'
                  : 'text-[var(--text)] hover:bg-[var(--card-back-accent)]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Study Deck ({totalCards} cards)</span>
            </button>

            <button
              onClick={() => {
                onOpenDeckManager();
                onClose();
              }}
              className="btn-interactive w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-[var(--text)] hover:bg-[var(--card-back-accent)] flex items-center gap-3 text-left cursor-pointer"
            >
              <ListFilter className="w-4 h-4 text-[var(--text-muted)]" />
              <span>Deck Overview & Search</span>
            </button>

            <button
              onClick={() => {
                onOpenAddCard();
                onClose();
              }}
              className="btn-interactive w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-[var(--text)] hover:bg-[var(--card-back-accent)] flex items-center gap-3 text-left cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[var(--primary)]" />
              <span>Add New Flashcard</span>
            </button>

            <button
              onClick={() => {
                onOpenStreakModal();
                onClose();
              }}
              className="btn-interactive w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-[var(--text)] hover:bg-[var(--card-back-accent)] flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span>Daily Streak</span>
              </div>
              <span className="font-bold text-xs text-orange-500 font-mono">
                {streak.currentStreak}d
              </span>
            </button>

            <button
              onClick={() => {
                onNavigateView('google_auth');
                onClose();
              }}
              className={`btn-interactive w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-3 text-left cursor-pointer ${
                activeView === 'google_auth'
                  ? 'bg-[var(--primary)] text-white shadow-xs'
                  : 'text-[var(--text)] hover:bg-[var(--card-back-accent)]'
              }`}
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{googleUser ? 'Google Account & Sync' : 'Sign in with Google Page'}</span>
            </button>
          </nav>

          {/* Lo-Fi Background Sound Controls in Side Drawer */}
          <div className="p-3 mx-3 my-2 rounded-xl bg-[var(--card-back-accent)] border border-[var(--border)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--text)] flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-[var(--primary)]" />
                Lo-Fi Study Sound
              </span>
              <button
                onClick={onToggleAudio}
                className={`btn-interactive px-2 py-1 text-[11px] font-semibold rounded-md flex items-center gap-1 cursor-pointer ${
                  isAudioPlaying
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] hover:text-[var(--text)]'
                }`}
              >
                {isAudioPlaying ? (
                  <>
                    <Volume2 className="w-3 h-3" /> Playing
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3 h-3" /> Off
                  </>
                )}
              </button>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-1 mb-2.5">
              <button
                onClick={() => onChangeAudioPreset('lofi_piano')}
                className={`py-1 text-[10px] rounded font-medium border text-center cursor-pointer transition-colors ${
                  audioPreset === 'lofi_piano'
                    ? 'bg-[var(--primary)] text-white border-transparent'
                    : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)]'
                }`}
              >
                Lo-Fi Piano
              </button>
              <button
                onClick={() => onChangeAudioPreset('gentle_rain')}
                className={`py-1 text-[10px] rounded font-medium border text-center cursor-pointer transition-colors ${
                  audioPreset === 'gentle_rain'
                    ? 'bg-[var(--primary)] text-white border-transparent'
                    : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)]'
                }`}
              >
                Soft Rain
              </button>
              <button
                onClick={() => onChangeAudioPreset('binaural_focus')}
                className={`py-1 text-[10px] rounded font-medium border text-center cursor-pointer transition-colors ${
                  audioPreset === 'binaural_focus'
                    ? 'bg-[var(--primary)] text-white border-transparent'
                    : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)]'
                }`}
              >
                432Hz Focus
              </button>
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-2">
              <VolumeX className="w-3 h-3 text-[var(--text-muted)]" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={audioVolume}
                onChange={(e) => onChangeAudioVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-[var(--border)] rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
                aria-label="Lo-Fi audio volume"
              />
              <Volume2 className="w-3 h-3 text-[var(--text-muted)]" />
            </div>
          </div>
        </div>

        {/* Footer controls: Theme, Shuffle, Reset */}
        <div className="p-4 border-t border-[var(--border)] space-y-2.5 bg-[var(--bg)]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)] font-medium">Theme Mode</span>
            <button
              onClick={onToggleTheme}
              className="btn-interactive px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-medium text-[var(--text)] flex items-center gap-1.5 cursor-pointer"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> Light
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-500" /> Dark
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
            <button
              onClick={() => {
                onShuffle();
                onClose();
              }}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-1 cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Shuffle</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset deck to 10 starter sample cards?')) {
                  onResetDeck();
                  onClose();
                }
              }}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--danger)] flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Deck</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
