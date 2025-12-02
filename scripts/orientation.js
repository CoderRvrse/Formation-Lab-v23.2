// Orientation module for Formation Lab
import { set, FLAB, PITCH_LAND } from './state.js';

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
  
  // Use absolute paths to prevent 404s
  const getPath = (p) => {
    const base = new URL('.', window.location.href).href;
    return `url("${base}${p}")`;
  };

  if (mode === 'portrait') {
    fieldEl?.classList.add('is-portrait');
    document.documentElement.style.setProperty('--pitch-url',
      getPath('assets/portrait/pitch-portrait.svg')
    );
  } else {
    fieldEl?.classList.remove('is-portrait');
    document.documentElement.style.setProperty('--pitch-url',
      getPath('assets/landscape/pitch-landscape.svg')
    );
  }

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
  // If it's a mobile device, respect the screen orientation
  if (isMobileDevice()) {
    const isPortrait = window.innerHeight > window.innerWidth;
    setOrientation(isPortrait ? 'portrait' : 'landscape');
  } else {
    // Desktop defaults to landscape
    setOrientation('landscape');
  }
}

// Listen for orientation changes
window.addEventListener('resize', () => {
  // Debounce slightly
  clearTimeout(window._orientTimer);
  window._orientTimer = setTimeout(autoOrientation, 200);
});

window.addEventListener('orientationchange', () => {
  setTimeout(autoOrientation, 100);
});

window.__mod_orientation = true;
