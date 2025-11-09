/**
 * Keyboard Shortcuts Handler
 * Displays keyboard shortcuts as a formatted toast notification
 */

import { showInfoToast } from './ui-toast.js';

const SHORTCUTS = [
  { key: 'Tab', action: 'Cycle through players' },
  { key: 'Enter', action: 'Select/confirm' },
  { key: 'Alt + Drag', action: 'Draw curved passes' },
  { key: '← ↑ → ↓', action: 'Move player (Shift ×10)' },
  { key: 'Esc', action: 'Cancel / exit mode' },
];

/**
 * Show keyboard shortcuts as a toast notification
 */
export function showKeyboardShortcuts() {
  const shortcutLines = SHORTCUTS
    .map(s => `${s.key.padEnd(12)} – ${s.action}`)
    .join('\n');

  showInfoToast(
    `⌨️  Keyboard Shortcuts:\n\n${shortcutLines}`,
    4000
  );
}

/**
 * Initialize keyboard shortcuts button
 */
export function initKeyboardShortcuts() {
  const keytipsBtn = document.getElementById('keytipsButton');

  if (keytipsBtn) {
    keytipsBtn.addEventListener('click', showKeyboardShortcuts);

    // Also show on click
    keytipsBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showKeyboardShortcuts();
      }
    });
  }
}

// Auto-initialize when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initKeyboardShortcuts);
} else {
  initKeyboardShortcuts();
}
