// Theme switcher module for Formation Lab v23.2+
// Provides dark/light mode toggle with persistence

import { announce } from './accessibility.js';
import { showToast } from './ui-toast.js';

/**
 * Available themes
 */
const THEMES = {
  DARK: 'dark',
  LIGHT: 'light'
};

/**
 * Get current theme from localStorage or system preference
 * @returns {string} Current theme ('dark' or 'light')
 */
export function getCurrentTheme() {
  // Check localStorage first
  const saved = localStorage.getItem('flab-theme');
  if (saved && (saved === THEMES.DARK || saved === THEMES.LIGHT)) {
    return saved;
  }

  // Fall back to system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return THEMES.LIGHT;
  }

  // Default to dark
  return THEMES.DARK;
}

/**
 * Apply theme to document
 * @param {string} theme - Theme to apply ('dark' or 'light')
 */
export function applyTheme(theme) {
  const root = document.documentElement;

  if (theme === THEMES.LIGHT) {
    root.setAttribute('data-theme', 'light');
    document.body.classList.remove('theme-dark');
    document.body.classList.add('theme-light');
  } else {
    root.setAttribute('data-theme', 'dark');
    document.body.classList.remove('theme-light');
    document.body.classList.add('theme-dark');
  }

  // Save to localStorage
  localStorage.setItem('flab-theme', theme);

  // Update toggle button state if it exists
  updateToggleButton(theme);

  console.log(`🎨 Applied theme: ${theme}`);
}

/**
 * Toggle between dark and light themes
 * @returns {string} New theme
 */
export function toggleTheme() {
  const current = getCurrentTheme();
  const next = current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;

  applyTheme(next);

  // Announce to screen readers
  announce(`Switched to ${next} mode`, 'polite');

  // Show toast
  const icon = next === THEMES.LIGHT ? '☀️' : '🌙';
  showToast(`${icon} ${next === THEMES.LIGHT ? 'Light' : 'Dark'} mode enabled`, 'info');

  return next;
}

/**
 * Update toggle button to reflect current theme
 * @param {string} theme - Current theme
 */
function updateToggleButton(theme) {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const icon = toggleBtn.querySelector('.theme-icon');
  const label = toggleBtn.querySelector('.theme-label');

  if (theme === THEMES.LIGHT) {
    toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
    toggleBtn.title = 'Switch to dark mode';
    if (icon) icon.textContent = '🌙';
    if (label) label.textContent = 'Dark';
  } else {
    toggleBtn.setAttribute('aria-label', 'Switch to light mode');
    toggleBtn.title = 'Switch to light mode';
    if (icon) icon.textContent = '☀️';
    if (label) label.textContent = 'Light';
  }
}

/**
 * Initialize theme system
 */
export function initTheme() {
  console.log('🎨 Initializing theme system...');

  // Apply saved or default theme
  const theme = getCurrentTheme();
  applyTheme(theme);

  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a theme
      const saved = localStorage.getItem('flab-theme');
      if (!saved) {
        const newTheme = e.matches ? THEMES.DARK : THEMES.LIGHT;
        applyTheme(newTheme);
        announce(`System theme changed to ${newTheme} mode`, 'polite');
      }
    });
  }

  console.log('✅ Theme system initialized');
}

/**
 * Add theme toggle button to the UI
 */
function addThemeToggleButton() {
  // Check if button already exists
  if (document.getElementById('theme-toggle')) {
    return;
  }

  // Find settings or actions container
  const actionsContainer = document.querySelector('.flab-actions');
  if (!actionsContainer) {
    console.warn('Could not find .flab-actions container for theme toggle');
    return;
  }

  // Create toggle button
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'theme-toggle';
  toggleBtn.className = 'flab-action theme-toggle';

  const theme = getCurrentTheme();
  const icon = theme === THEMES.LIGHT ? '🌙' : '☀️';
  const label = theme === THEMES.LIGHT ? 'Dark' : 'Light';

  toggleBtn.innerHTML = `
    <span class="theme-icon">${icon}</span>
    <span class="theme-label">${label}</span>
  `;

  toggleBtn.setAttribute('aria-label', `Switch to ${theme === THEMES.LIGHT ? 'dark' : 'light'} mode`);
  toggleBtn.title = `Switch to ${theme === THEMES.LIGHT ? 'dark' : 'light'} mode`;

  toggleBtn.addEventListener('click', () => {
    toggleTheme();
  });

  // Add to actions container (near the end, before export/download)
  const exportBtn = Array.from(actionsContainer.children).find(
    child => child.textContent.includes('Export') || child.textContent.includes('Download')
  );

  if (exportBtn) {
    actionsContainer.insertBefore(toggleBtn, exportBtn);
  } else {
    actionsContainer.appendChild(toggleBtn);
  }
}

/**
 * Get theme preference for other modules
 * @returns {boolean} True if dark mode is active
 */
export function isDarkMode() {
  return getCurrentTheme() === THEMES.DARK;
}

/**
 * Get theme preference for other modules
 * @returns {boolean} True if light mode is active
 */
export function isLightMode() {
  return getCurrentTheme() === THEMES.LIGHT;
}

// Export theme constants
export { THEMES };
