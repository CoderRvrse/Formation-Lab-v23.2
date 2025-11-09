/**
 * Sidepanel Collapse/Expand Functionality
 * Allows users to toggle the sidepanel visibility to maximize pitch space
 */

let isSidepanelCollapsed = false;

/**
 * Initialize sidepanel collapse functionality
 */
export function initSidepanelCollapse() {
  const hoverBar = document.getElementById('sidepanelHoverBar');
  const app = document.querySelector('.flab-app');

  if (!hoverBar || !app) {
    console.warn('Sidepanel hover bar or app container not found');
    return;
  }

  // Check localStorage for saved state (default to expanded/false)
  const savedState = localStorage.getItem('flab-sidepanel-collapsed');
  if (savedState === 'true') {
    isSidepanelCollapsed = true;
    collapseSidepanel(app);
  } else {
    // Ensure expanded state
    isSidepanelCollapsed = false;
    localStorage.setItem('flab-sidepanel-collapsed', 'false');
  }

  // Add hover handler - expand on hover when collapsed
  hoverBar.addEventListener('mouseenter', () => {
    if (isSidepanelCollapsed) {
      expandSidepanel(app);
    }
  });

  // Allow double-click to collapse again
  hoverBar.addEventListener('dblclick', () => {
    if (!isSidepanelCollapsed) {
      collapseSidepanel(app);
    }
  });

  console.log('✅ Sidepanel collapse functionality initialized');
}

/**
 * Collapse the sidepanel
 */
function collapseSidepanel(app) {
  app.classList.add('flab-app--sidepanel-collapsed');
  isSidepanelCollapsed = true;
  localStorage.setItem('flab-sidepanel-collapsed', 'true');
  console.log('Sidepanel collapsed');

  // Auto-trigger fullscreen when sidepanel collapses
  import('./fullscreen.js').then(({ enterFullscreen }) => {
    enterFullscreen();
  });
}

/**
 * Expand the sidepanel
 */
function expandSidepanel(app) {
  app.classList.remove('flab-app--sidepanel-collapsed');
  isSidepanelCollapsed = false;
  localStorage.setItem('flab-sidepanel-collapsed', 'false');
  console.log('Sidepanel expanded');

  // Auto-exit fullscreen when sidepanel expands
  import('./fullscreen.js').then(({ exitFullscreen }) => {
    exitFullscreen();
  });
}

/**
 * Get sidepanel state
 */
export function isSidepanelHidden() {
  return isSidepanelCollapsed;
}
