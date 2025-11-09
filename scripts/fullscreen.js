/**
 * Fullscreen mode for Formation Lab
 * Allows users to expand the pitch to fill the entire screen for better visibility
 */

import { FLAB } from './state.js';

let isFullscreen = false;
let originalSidepanelDisplay = null;
let originalBodyPadding = null;

/**
 * Toggle fullscreen mode
 */
export function toggleFullscreen() {
  if (isFullscreen) {
    exitFullscreen();
  } else {
    enterFullscreen();
  }
}

/**
 * Enter fullscreen mode
 */
export function enterFullscreen() {
  const app = document.querySelector('.flab-app');
  const sidepanel = document.querySelector('.flab-sidepanel');
  const button = document.getElementById('btnFullscreen');

  if (!app || !sidepanel) return;

  // Store original styles
  originalSidepanelDisplay = sidepanel.style.display;
  originalBodyPadding = document.body.style.padding;

  // Hide sidepanel and expand app
  sidepanel.style.display = 'none';
  app.classList.add('flab-app--fullscreen');
  document.body.classList.add('flab-body--fullscreen');
  document.body.style.padding = '0';

  // Update button appearance
  if (button) {
    button.setAttribute('aria-pressed', 'true');
    button.classList.add('flab-action--active');
    // Update button title for overlay version
    button.setAttribute('title', 'Exit fullscreen mode');
    // Update span text if it exists (for non-overlay versions)
    const span = button.querySelector('span');
    if (span) span.textContent = 'Exit Fullscreen';
  }

  // Add close X button
  addCloseButton();

  // Ensure proper orientation for device type (desktop stays landscape)
  import('./orientation.js').then(({ autoOrientation }) => {
    autoOrientation();
  });

  // Trigger any resize handlers
  window.dispatchEvent(new Event('resize'));

  isFullscreen = true;
  console.log('✅ Fullscreen mode enabled');

  // Notify user
  showFullscreenHint();
}

/**
 * Exit fullscreen mode
 */
export function exitFullscreen() {
  const app = document.querySelector('.flab-app');
  const sidepanel = document.querySelector('.flab-sidepanel');
  const button = document.getElementById('btnFullscreen');

  if (!app || !sidepanel) return;

  // Restore original styles
  sidepanel.style.display = originalSidepanelDisplay || '';
  if (originalBodyPadding !== null) {
    document.body.style.padding = originalBodyPadding;
  } else {
    document.body.style.padding = '';
  }

  app.classList.remove('flab-app--fullscreen');
  document.body.classList.remove('flab-body--fullscreen');

  // Update button appearance
  if (button) {
    button.setAttribute('aria-pressed', 'false');
    button.classList.remove('flab-action--active');
    // Update button title for overlay version
    button.setAttribute('title', 'Fullscreen mode');
    // Update span text if it exists (for non-overlay versions)
    const span = button.querySelector('span');
    if (span) span.textContent = 'Fullscreen';
  }

  // Remove close X button
  removeCloseButton();

  // Re-check orientation after restoring normal layout
  // Wait for sidepanel to be restored before checking orientation
  setTimeout(() => {
    import('./orientation.js').then(({ autoOrientation }) => {
      autoOrientation();
    });
  }, 50);

  // Trigger any resize handlers
  window.dispatchEvent(new Event('resize'));

  isFullscreen = false;
  console.log('✅ Fullscreen mode disabled');
}

/**
 * Add close X button in fullscreen mode
 */
function addCloseButton() {
  // Remove existing if any
  removeCloseButton();

  const closeBtn = document.createElement('button');
  closeBtn.id = 'fullscreen-close-btn';
  closeBtn.className = 'fullscreen-close-btn';
  closeBtn.innerHTML = '×';
  closeBtn.setAttribute('aria-label', 'Exit fullscreen');
  closeBtn.setAttribute('title', 'Exit fullscreen (Esc or F11)');
  closeBtn.addEventListener('click', exitFullscreen);

  document.body.appendChild(closeBtn);
}

/**
 * Remove close X button
 */
function removeCloseButton() {
  const existing = document.getElementById('fullscreen-close-btn');
  if (existing) {
    existing.remove();
  }
}

/**
 * Show hint about fullscreen controls
 */
function showFullscreenHint() {
  const { showToast } = import('./ui.js').then(m => m.showToast);
  setTimeout(() => {
    const toast = document.createElement('div');
    toast.className = 'flab-toast flab-toast--info';
    toast.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 20px;
      background: rgba(76, 175, 80, 0.95);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      z-index: 10001;
      font-family: sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      animation: slideIn 0.3s ease-out;
    `;
    toast.textContent = 'Press Esc or F11 to exit fullscreen';
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }, 100);
}

/**
 * Handle keyboard shortcuts for fullscreen
 */
function handleFullscreenKeys(e) {
  // Escape to exit fullscreen
  if (e.key === 'Escape' && isFullscreen) {
    e.preventDefault();
    exitFullscreen();
    return;
  }

  // F11 to toggle fullscreen
  if (e.key === 'F11') {
    e.preventDefault();
    toggleFullscreen();
    return;
  }
}

/**
 * Initialize fullscreen feature
 */
export function initFullscreen() {
  const button = document.getElementById('btnFullscreen');

  if (!button) {
    console.warn('Fullscreen button not found');
    return;
  }

  // Wire up button click
  button.addEventListener('click', toggleFullscreen);

  // Handle keyboard shortcuts (Esc and F11)
  document.addEventListener('keydown', handleFullscreenKeys);

  // Track fullscreen state
  FLAB.fullscreenEnabled = true;

  console.log('✅ Fullscreen feature initialized (Hotkeys: F11 toggle, Esc exit)');
}

/**
 * Cleanup fullscreen feature
 */
export function destroyFullscreen() {
  const button = document.getElementById('btnFullscreen');

  if (button) {
    button.removeEventListener('click', toggleFullscreen);
  }

  document.removeEventListener('keydown', handleFullscreenKeys);

  if (isFullscreen) {
    exitFullscreen();
  }

  console.log('✅ Fullscreen feature destroyed');
}

/**
 * Get fullscreen state
 */
export function isFullscreenMode() {
  return isFullscreen;
}

window.__mod_fullscreen = true;
