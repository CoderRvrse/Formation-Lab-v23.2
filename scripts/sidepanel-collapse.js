/**
 * Sidepanel Collapse/Expand Functionality
 * Allows users to toggle the sidepanel visibility to maximize pitch space
 */

let isSidepanelCollapsed = false;

/**
 * Initialize sidepanel collapse functionality
 */
export function initSidepanelCollapse() {
  const toggleBtn = document.getElementById('btnCollapseSidepanel');
  const app = document.querySelector('.flab-app');

  if (!toggleBtn || !app) {
    console.warn('Sidepanel collapse button or app container not found');
    return;
  }

  // Check localStorage for saved state (default to expanded/false)
  const savedState = localStorage.getItem('flab-sidepanel-collapsed');
  if (savedState === 'true') {
    isSidepanelCollapsed = true;
    collapseSidepanel(app, toggleBtn);
  } else {
    // Ensure expanded state
    isSidepanelCollapsed = false;
    localStorage.setItem('flab-sidepanel-collapsed', 'false');
  }

  // Add click handler
  toggleBtn.addEventListener('click', () => {
    if (isSidepanelCollapsed) {
      expandSidepanel(app, toggleBtn);
    } else {
      collapseSidepanel(app, toggleBtn);
    }
  });

  console.log('✅ Sidepanel collapse functionality initialized');
}

/**
 * Collapse the sidepanel
 */
function collapseSidepanel(app, toggleBtn) {
  app.classList.add('flab-app--sidepanel-collapsed');
  toggleBtn.setAttribute('aria-expanded', 'false');
  toggleBtn.setAttribute('title', 'Expand sidepanel');
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
function expandSidepanel(app, toggleBtn) {
  app.classList.remove('flab-app--sidepanel-collapsed');
  toggleBtn.setAttribute('aria-expanded', 'true');
  toggleBtn.setAttribute('title', 'Collapse sidepanel');
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
