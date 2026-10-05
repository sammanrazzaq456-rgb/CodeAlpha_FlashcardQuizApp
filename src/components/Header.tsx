import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Shuffle,
  ListFilter,
  Flame,
  Menu,
  Volume2,
  VolumeX,
  User,
} from 'lucide-react';
import { Theme } from '../types';
import { StreakData } from '../utils/streak';
import { StreakDetailsModal } from './StreakDetailsModal';
import { GoogleUser } from './SignInGooglePage';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  onShuffle: () => void;
  onOpenDeckManager: () => void;
  hasCards: boolean;
  streak: StreakData;
  studiedToday: boolean;
  onOpenSideMenu: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  googleUser: GoogleUser | null;
  onNavigateView: (view: 'deck' | 'google_auth') => void;
  activeView: 'deck' | 'google_auth';
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onShuffle,
  onOpenDeckManager,
  hasCards,
  streak,
  studiedToday,
  onOpenSideMenu,
  isAudioPlaying,
  onToggleAudio,
  googleUser,
  onNavigateView,
  activeView,
}) => {
  const [showStreakModal, setShowStreakModal] = useState(false);

  return (
    <>
      <header className="w-full max-w-4xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between border-b border-[var(--border)] relative z-10 backdrop-blur-md bg-[var(--surface)]/75">
        {/* Left: Side Menu Hamburger Button (Three lines) + Brand Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenSideMenu}
            className="btn-interactive p-2 text-[var(--text)] hover:text-[var(--primary)] bg-[var(--surface)] hover:bg-[var(--card-back-accent)] border border-[var(--border)] rounded-[10px] flex items-center justify-center cursor-pointer min-w-[38px] min-h-[38px]"
            title="Open side menu"
            aria-label="Open side navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => onNavigateView('deck')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
            title="Return to Study Deck"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white shadow-xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <h1 className="text-[17px] sm:text-[20px] font-semibold tracking-tight text-[var(--text)] whitespace-nowrap">
              Memora
            </h1>
          </div>
        </div>

        {/* Right Tools: Shuffle, Ambient Audio, Streak, Google Auth, Theme */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Shuffle Button at the top */}
          {hasCards && (
            <button
              onClick={onShuffle}
              title="Shuffle flashcards deck"
              aria-label="Shuffle flashcards deck"
              className="btn-interactive h-[38px] px-2 sm:px-3 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] bg-[var(--surface)] hover:bg-[var(--card-back-accent)] border border-[var(--border)] rounded-[10px] flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Shuffle className="w-4 h-4" />
              <span className="hidden sm:inline font-semibold">Shuffle</span>
            </button>
          )}

          {/* Ambient Lo-Fi Sound Toggle (Web Audio API) */}
          <button
            onClick={onToggleAudio}
            className={`btn-interactive h-[38px] px-2.5 sm:px-3 text-xs font-semibold rounded-[10px] border flex items-center gap-1.5 cursor-pointer transition-all ${
              isAudioPlaying
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/50 dark:border-indigo-800 dark:text-indigo-400 shadow-xs'
                : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--card-back-accent)]'
            }`}
            title={
              isAudioPlaying
                ? 'Pause Lo-Fi Ambient Study Music (Web Audio API)'
                : 'Play Lo-Fi Ambient Study Music (Web Audio API)'
            }
            aria-label={
              isAudioPlaying
                ? 'Pause Lo-Fi Ambient Sound'
                : 'Play Lo-Fi Ambient Sound'
            }
          >
            {isAudioPlaying ? (
              <>
                <Volume2 className="w-4 h-4 text-[var(--primary)] animate-pulse" />
                <span className="hidden sm:inline">Lo-Fi</span>
                <span className="flex items-end gap-0.5 h-3 ml-0.5" aria-hidden="true">
                  <span className="w-0.5 bg-[var(--primary)] rounded-full animate-bounce h-3" />
                  <span className="w-0.5 bg-[var(--primary)] rounded-full animate-bounce h-2" style={{ animationDelay: '0.15s' }} />
                  <span className="w-0.5 bg-[var(--primary)] rounded-full animate-bounce h-2.5" style={{ animationDelay: '0.3s' }} />
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="hidden sm:inline">Lo-Fi</span>
              </>
            )}
          </button>

          {/* Daily Streak Counter */}
          <button
            onClick={() => setShowStreakModal(true)}
            className={`btn-interactive h-[38px] px-2.5 sm:px-3 text-xs font-semibold rounded-[10px] border flex items-center gap-1.5 cursor-pointer transition-all ${
              studiedToday
                ? 'bg-orange-50 border-orange-200 text-orange-600 dark:bg-orange-950/40 dark:border-orange-800 dark:text-orange-400 shadow-xs'
                : streak.currentStreak > 0
                ? 'bg-[var(--surface)] border-orange-300 dark:border-orange-800/60 text-orange-500 hover:bg-orange-50/50 dark:hover:bg-orange-950/20'
                : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--card-back-accent)]'
            }`}
            title={`Daily Streak: ${streak.currentStreak} day${streak.currentStreak === 1 ? '' : 's'}. Click for history.`}
            aria-label={`Daily Streak: ${streak.currentStreak} days. ${studiedToday ? 'Completed today' : 'Needs study today'}. Click to view details.`}
          >
            <Flame
              className={`w-4 h-4 ${
                studiedToday
                  ? 'fill-orange-500 text-orange-500 animate-pulse'
                  : streak.currentStreak > 0
                  ? 'fill-orange-400/30 text-orange-500'
                  : 'text-[var(--text-muted)]'
              }`}
            />
            <span className="font-bold">{streak.currentStreak}</span>
            <span className="hidden sm:inline font-medium">
              {streak.currentStreak === 1 ? 'd' : 'd'}
            </span>
            {studiedToday && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Studied today" />
            )}
          </button>

          {/* Sign in with Google / User Avatar Button */}
          <button
            onClick={() => onNavigateView(activeView === 'google_auth' ? 'deck' : 'google_auth')}
            className={`btn-interactive h-[38px] px-2 sm:px-2.5 rounded-[10px] border flex items-center gap-1.5 cursor-pointer ${
              activeView === 'google_auth'
                ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs'
                : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text)] hover:bg-[var(--card-back-accent)]'
            }`}
            title={googleUser ? `Signed in as ${googleUser.name}` : 'Sign in with Google page'}
            aria-label={googleUser ? 'Google Account Settings' : 'Sign in with Google'}
          >
            {googleUser ? (
              <img
                src={googleUser.photoUrl}
                alt={googleUser.name}
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover border border-white dark:border-zinc-700"
              />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            )}
            <span className="hidden md:inline text-xs font-medium">
              {googleUser ? googleUser.name.split(' ')[0] : 'Sign In'}
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="btn-interactive p-2 text-[var(--text)] bg-[var(--surface)] hover:bg-[var(--card-back-accent)] border border-[var(--border)] rounded-[10px] flex items-center justify-center min-w-[38px] min-h-[38px]"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500" />
            )}
          </button>
        </div>
      </header>

      {/* Streak Details Modal */}
      <StreakDetailsModal
        isOpen={showStreakModal}
        streak={streak}
        studiedToday={studiedToday}
        onClose={() => setShowStreakModal(false)}
      />
    </>
  );
};
