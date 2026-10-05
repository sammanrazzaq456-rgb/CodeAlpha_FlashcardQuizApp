import confetti from 'canvas-confetti';

/**
 * Fires an energetic, multi-stage celebratory confetti explosion
 * when the user masters all cards in the current deck.
 */
export function fireMasteryConfetti() {
  const isReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isReducedMotion) {
    // Gentle single burst for reduced motion
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#5B5BD6', '#8B8BF5', '#10B981'],
      disableForReducedMotion: false,
    });
    return;
  }

  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;

  // Immediate center pop
  confetti({
    particleCount: 80,
    spread: 100,
    origin: { y: 0.6 },
    colors: ['#5B5BD6', '#8B8BF5', '#10B981', '#F59E0B', '#EC4899', '#3B82F6'],
  });

  // Dual side cannons that fire alternately until duration ends
  const interval: any = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 40 * (timeLeft / duration);

    // Left cannon
    confetti({
      particleCount: Math.floor(particleCount),
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.75 },
      colors: ['#5B5BD6', '#8B8BF5', '#10B981', '#F59E0B', '#EC4899'],
    });

    // Right cannon
    confetti({
      particleCount: Math.floor(particleCount),
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.75 },
      colors: ['#5B5BD6', '#8B8BF5', '#10B981', '#F59E0B', '#EC4899'],
    });
  }, 250);
}
