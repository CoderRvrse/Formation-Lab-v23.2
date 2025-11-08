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
  }

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
  }

  // Trigger any resize handlers
  window.dispatchEvent(new Event('resize'));

  isFullscreen = false;
  console.log('✅ Fullscreen mode disabled');
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
      bottom: 20px;
      right: 20px;
      background: rgba(76, 175, 80, 0.9);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      z-index: 10001;
      font-family: sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      animation: slideIn 0.3s ease-out;
    `;
    toast.textContent = 'Press Esc to exit fullscreen or click Fullscreen button';
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }, 100);
}

/**
 * Handle Escape key to exit fullscreen
 */
function handleEscapeKey(e) {
  if (e.key === 'Escape' && isFullscreen) {
    e.preventDefault();
    exitFullscreen();
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

  // Handle Escape key
  document.addEventListener('keydown', handleEscapeKey);

  // Track fullscreen state
  FLAB.fullscreenEnabled = true;

  console.log('✅ Fullscreen feature initialized');
}

/**
 * Cleanup fullscreen feature
 */
export function destroyFullscreen() {
  const button = document.getElementById('btnFullscreen');

  if (button) {
    button.removeEventListener('click', toggleFullscreen);
  }

  document.removeEventListener('keydown', handleEscapeKey);

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
