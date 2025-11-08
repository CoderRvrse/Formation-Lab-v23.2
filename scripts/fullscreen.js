// Fullscreen module for Formation Lab
// Provides fullscreen mode for maximum pitch viewing area

import { showToast } from './ui-toast.js';
import { announce } from './accessibility.js';

let isFullscreen = false;
let fullscreenButton = null;

/**
 * Check if fullscreen API is supported
 */
function isFullscreenSupported() {
  return document.fullscreenEnabled ||
         document.webkitFullscreenEnabled ||
         document.mozFullScreenEnabled ||
         document.msFullscreenEnabled;
}

/**
 * Request fullscreen for an element
 */
async function requestFullscreen(element) {
  try {
    if (element.requestFullscreen) {
      await element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      await element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      await element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      await element.msRequestFullscreen();
    }
    return true;
  } catch (error) {
    console.error('Fullscreen request failed:', error);
    return false;
  }
}

/**
 * Exit fullscreen
 */
async function exitFullscreen() {
  try {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      await document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      await document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      await document.msExitFullscreen();
    }
    return true;
  } catch (error) {
    console.error('Exit fullscreen failed:', error);
    return false;
  }
}

/**
 * Toggle fullscreen mode for the pitch
 */
export async function toggleFullscreen() {
  const pitchWrapper = document.querySelector('.flab-pitch-wrapper');

  if (!pitchWrapper) {
    showToast('Pitch element not found', 'error');
    return;
  }

  if (!isFullscreenSupported()) {
    showToast('Fullscreen not supported on this device', 'error');
    return;
  }

  const currentlyFullscreen = document.fullscreenElement ||
                               document.webkitFullscreenElement ||
                               document.mozFullScreenElement ||
                               document.msFullscreenElement;

  if (currentlyFullscreen) {
    // Exit fullscreen
    const success = await exitFullscreen();
    if (success) {
      isFullscreen = false;
      updateFullscreenButton();
      showToast('Exited fullscreen', 'info');
      announce('Exited fullscreen mode', 'polite');
    }
  } else {
    // Enter fullscreen
    const success = await requestFullscreen(pitchWrapper);
    if (success) {
      isFullscreen = true;
      updateFullscreenButton();
      showToast('Entered fullscreen - Press ESC to exit', 'info');
      announce('Entered fullscreen mode', 'polite');
    } else {
      showToast('Could not enter fullscreen', 'error');
    }
  }
}

/**
 * Update fullscreen button text and icon
 */
function updateFullscreenButton() {
  if (!fullscreenButton) return;

  const icon = fullscreenButton.querySelector('.fullscreen-icon');
  const label = fullscreenButton.querySelector('.fullscreen-label');

  if (isFullscreen) {
    fullscreenButton.setAttribute('aria-label', 'Exit fullscreen');
    fullscreenButton.title = 'Exit fullscreen (ESC)';
    if (icon) icon.textContent = '⤓';
    if (label) label.textContent = 'Exit';
  } else {
    fullscreenButton.setAttribute('aria-label', 'Enter fullscreen');
    fullscreenButton.title = 'View pitch in fullscreen';
    if (icon) icon.textContent = '⤢';
    if (label) label.textContent = 'Fullscreen';
  }
}

/**
 * Add fullscreen button to UI
 */
function addFullscreenButton() {
  // Check if button already exists
  if (document.getElementById('fullscreen-btn')) {
    return;
  }

  // Find toolbar row with Landscape/Portrait buttons
  const toolbarRows = document.querySelectorAll('.toolbar-row');
  let orientationRow = null;

  toolbarRows.forEach(row => {
    if (row.querySelector('#btnLandscape')) {
      orientationRow = row;
    }
  });

  if (!orientationRow) {
    console.warn('Could not find orientation toolbar row for fullscreen button');
    return;
  }

  // Create fullscreen button
  fullscreenButton = document.createElement('button');
  fullscreenButton.id = 'fullscreen-btn';
  fullscreenButton.className = 'flab-action';
  fullscreenButton.type = 'button';

  fullscreenButton.innerHTML = `
    <span class="fullscreen-icon" style="font-size: 18px;">⤢</span>
    <span class="fullscreen-label">Fullscreen</span>
  `;

  fullscreenButton.setAttribute('aria-label', 'Enter fullscreen');
  fullscreenButton.title = 'View pitch in fullscreen';

  fullscreenButton.addEventListener('click', toggleFullscreen);

  // Add to toolbar row
  orientationRow.appendChild(fullscreenButton);
}

/**
 * Handle fullscreen change events
 */
function handleFullscreenChange() {
  const currentlyFullscreen = document.fullscreenElement ||
                               document.webkitFullscreenElement ||
                               document.mozFullScreenElement ||
                               document.msFullscreenElement;

  isFullscreen = !!currentlyFullscreen;
  updateFullscreenButton();

  // CSS :fullscreen pseudo-class handles styling automatically
  // No need to manually add/remove classes
}

/**
 * Initialize fullscreen system
 */
export function initFullscreen() {
  console.log('⤢ Initializing fullscreen system...');

  if (!isFullscreenSupported()) {
    console.warn('Fullscreen API not supported on this device');
    return;
  }

  // Add fullscreen button
  addFullscreenButton();

  // Listen for fullscreen changes
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('mozfullscreenchange', handleFullscreenChange);
  document.addEventListener('MSFullscreenChange', handleFullscreenChange);

  // Handle ESC key (browser automatically exits, we just need to update UI)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isFullscreen) {
      // Fullscreen will exit automatically, just update our state
      setTimeout(() => {
        if (!document.fullscreenElement) {
          isFullscreen = false;
          updateFullscreenButton();
        }
      }, 100);
    }
  });

  console.log('✅ Fullscreen system initialized');
}

/**
 * Get fullscreen state
 */
export function getFullscreenState() {
  return isFullscreen;
}
