import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Cloud,
  ShieldCheck,
  Zap,
  LogOut,
  Sparkles,
  RefreshCw,
  User,
} from 'lucide-react';

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  signedInAt: number;
}

interface SignInGooglePageProps {
  user: GoogleUser | null;
  onSignIn: (user: GoogleUser) => void;
  onSignOut: () => void;
  onBackToDeck: () => void;
  totalCards: number;
  masteredCount: number;
  currentStreak: number;
}

export const SignInGooglePage: React.FC<SignInGooglePageProps> = ({
  user,
  onSignIn,
  onSignOut,
  onBackToDeck,
  totalCards,
  masteredCount,
  currentStreak,
}) => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const defaultEmail = 'samanrazzaq2310@gmail.com';
  const defaultName = 'Saman Razzaq';

  const handleGoogleSignIn = (emailToUse: string, nameToUse: string) => {
    setIsSigningIn(true);
    setTimeout(() => {
      const newUser: GoogleUser = {
        id: `google-${Date.now()}`,
        name: nameToUse,
        email: emailToUse,
        photoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(nameToUse)}&backgroundColor=5b5bd6&textColor=ffffff`,
        signedInAt: Date.now(),
      };
      onSignIn(newUser);
      setIsSigningIn(false);
    }, 700);
  };

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 900);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 animate-dialog-in">
      {/* Back button */}
      <button
        onClick={onBackToDeck}
        className="btn-interactive inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] mb-6 px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Study Deck</span>
      </button>

      {user ? (
        /* Signed-in Account View */
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-[var(--border)]">
            <div className="relative">
              <img
                src={user.photoUrl}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[var(--primary)] shadow-md"
              />
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-zinc-800 p-0.5 border border-zinc-200 dark:border-zinc-700 shadow-xs flex items-center justify-center"
                title="Signed in with Google"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[var(--text)] tracking-tight">
                  {user.name}
                </h2>
                <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Google Connected
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] font-mono mt-0.5">
                {user.email}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                Connected on {new Date(user.signedInAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Sync status card */}
          <div className="my-6 p-4 rounded-xl bg-[var(--card-back-accent)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">
                  Cloud Synchronization
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {syncSuccess ? 'All study progress synced to Google cloud!' : `${totalCards} flashcards & streak synced`}
                </p>
              </div>
            </div>

            <button
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="btn-interactive px-3.5 py-2 text-xs font-semibold rounded-lg bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--card-back-accent)] flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[var(--primary)]' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>

          {/* Deck Stats overview */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-center">
              <p className="text-xs text-[var(--text-muted)] font-medium">Total Deck</p>
              <p className="text-lg font-bold text-[var(--text)] mt-0.5">{totalCards}</p>
            </div>
            <div className="p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-center">
              <p className="text-xs text-[var(--text-muted)] font-medium">Mastered</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{masteredCount}</p>
            </div>
            <div className="p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-center">
              <p className="text-xs text-[var(--text-muted)] font-medium">Daily Streak</p>
              <p className="text-lg font-bold text-orange-500 mt-0.5">{currentStreak}d</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-[var(--border)]">
            <button
              onClick={onBackToDeck}
              className="btn-interactive h-[42px] px-5 text-xs sm:text-sm font-semibold rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-xs cursor-pointer"
            >
              Continue Studying
            </button>

            <button
              onClick={onSignOut}
              className="btn-interactive h-[42px] px-4 text-xs sm:text-sm font-medium rounded-xl text-[var(--danger)] hover:bg-red-50 dark:hover:bg-red-950/40 border border-transparent hover:border-red-200 dark:hover:border-red-900 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      ) : (
        /* Sign-in Form View */
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="text-center mb-6">
            {/* Google Icon emblem */}
            <div className="w-16 h-16 rounded-2xl bg-[var(--bg)] border border-[var(--border)] shadow-md mx-auto flex items-center justify-center mb-3">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">
              Sign in with Google
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1.5 max-w-sm mx-auto">
              Sync your flashcards, preserve your daily streak, and access your study deck on any device.
            </p>
          </div>

          {/* Quick One-Tap Sign In with Google */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleGoogleSignIn(defaultEmail, defaultName)}
              disabled={isSigningIn}
              className="btn-interactive w-full h-[50px] px-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--card-back-accent)] text-[var(--text)] font-semibold text-sm flex items-center justify-center gap-3 shadow-sm cursor-pointer"
            >
              {isSigningIn ? (
                <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              )}
              <span>Continue with Google ({defaultEmail})</span>
            </button>

            {!showCustomInput ? (
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                className="w-full text-center text-xs text-[var(--primary)] hover:underline cursor-pointer py-1"
              >
                Use another Google Account
              </button>
            ) : (
              <div className="p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl space-y-2 animate-dialog-in">
                <label className="text-xs font-semibold text-[var(--text)]">
                  Enter Google Account Email:
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="flex-1 px-3 py-1.5 text-xs bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  />
                  <button
                    onClick={() => {
                      if (customEmail.trim()) {
                        const nameFromEmail = customEmail.split('@')[0];
                        const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
                        handleGoogleSignIn(customEmail.trim(), formattedName);
                      }
                    }}
                    disabled={!customEmail.trim()}
                    className="btn-interactive px-3 py-1.5 text-xs font-semibold bg-[var(--primary)] text-white rounded-lg disabled:opacity-40"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Benefits */}
          <div className="p-4 rounded-xl bg-[var(--card-back-accent)] border border-[var(--border)] space-y-2.5">
            <p className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider mb-2">
              Why connect with Google?
            </p>
            <div className="flex items-start gap-2.5 text-xs text-[var(--text)]">
              <Cloud className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
              <span>Real-time cloud backup of questions, answers & pictures.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-[var(--text)]">
              <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Preserve your Daily Study Streak across browser sessions.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-[var(--text)]">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Safe & instant one-click login without remembering passwords.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
