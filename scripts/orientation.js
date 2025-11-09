// Orientation module for Formation Lab
import { set, FLAB, PITCH_LAND, PITCH_PORT } from './state.js';

/**
 * Detect if we're on a mobile device vs desktop
 * Mobile devices should auto-rotate, desktop should stay landscape
 */
function isMobileDevice() {
  // Check for touch support AND small screen
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.screen.width <= 1024 || window.screen.height <= 1024;

  // Also check user agent for mobile patterns
  const mobilePattern = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUA = mobilePattern.test(navigator.userAgent);

  return (hasTouch && isSmallScreen) || isMobileUA;
}

export function setOrientation(mode) {
  set('orientation', mode);
  const fieldEl = document.querySelector('.flab-field');
  fieldEl?.classList.toggle('is-portrait', mode === 'portrait');
  // swap pitch asset via CSS var (use relative path from CSS context)
  const pitchPath = mode === 'portrait' ? '../../assets/portrait/pitch-portrait.svg' : '../../assets/landscape/pitch-landscape.svg';
  document.documentElement.style.setProperty('--pitch-url',
    `url("${pitchPath}")`
  );

  // Import render functions when needed
  import('./render.js').then(({ relayoutAllPlayers, renderArrows }) => {
    relayoutAllPlayers();
    renderArrows?.();
  });
}

export function flipSides(){
  for (const p of FLAB.players) p.nx = 1 - p.nx;

  // Import render functions when needed
  import('./render.js').then(({ relayoutAllPlayers, renderArrows }) => {
    relayoutAllPlayers();
    renderArrows?.();
  });
}

export function autoOrientation() {
  const field = document.querySelector('.flab-field');
  const r = field?.clientWidth / Math.max(1, field?.clientHeight || 1);

  // On desktop in fullscreen mode, always use landscape regardless of monitor orientation
  // This prevents incorrect rotation when dragging to portrait monitors
  const isFullscreen = document.body.classList.contains('flab-body--fullscreen');
  if (!isMobileDevice() && isFullscreen) {
    setOrientation('landscape');
    return;
  }

  // Otherwise, auto-detect based on viewport aspect ratio
  setOrientation(r >= 1 ? 'landscape' : 'portrait');
}

window.__mod_orientation = true;