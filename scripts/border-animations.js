/**
 * Dynamic border and corner animations
 * Adds interactive pulse effects and visual feedback to the pitch border
 */

let activeAnimationTimeout = null;

export function initBorderAnimations() {
  const field = document.querySelector('.flab-field');
  const pitchWrapper = document.querySelector('.flab-pitch-wrapper');

  if (!field || !pitchWrapper) {
    console.warn('Border animation: field or pitch-wrapper not found');
    return;
  }

  // Trigger pulse on player drag
  field.addEventListener('pointerdown', () => {
    triggerActivePulse(field);
  });

  field.addEventListener('pointerup', () => {
    clearActivePulse(field);
  });

  // Trigger pulse on pass arrow creation
  const arrowLayer = document.querySelector('#arrow-layer');
  if (arrowLayer) {
    const originalAppendChild = arrowLayer.appendChild;
    arrowLayer.appendChild = function (...args) {
      triggerActivePulse(field);
      clearTimeout(activeAnimationTimeout);
      activeAnimationTimeout = setTimeout(() => clearActivePulse(field), 800);
      return originalAppendChild.apply(this, args);
    };
  }

  // Add corner accent animation markers
  createCornerMarkers(pitchWrapper);

  console.log('✨ Border animations initialized');
}

/**
 * Trigger the active pulse animation
 */
function triggerActivePulse(field) {
  field.setAttribute('data-active', 'true');
}

/**
 * Clear the active pulse animation
 */
function clearActivePulse(field) {
  field.removeAttribute('data-active');
}

/**
 * Create animated corner markers for visual enhancement
 */
function createCornerMarkers(wrapper) {
  // Top-left corner already created via ::before pseudo-element
  // Bottom-right corner already created via ::after pseudo-element
  // This function can be extended for additional corner effects

  // Add subtle accent indicators at each corner
  const corners = [
    { position: 'top-left', side: 'top left' },
    { position: 'top-right', side: 'top right' },
    { position: 'bottom-left', side: 'bottom left' },
    { position: 'bottom-right', side: 'bottom right' }
  ];

  corners.forEach(corner => {
    const marker = document.createElement('div');
    marker.className = `border-corner-marker border-corner-${corner.position}`;
    marker.style.cssText = `
      position: absolute;
      width: 3px;
      height: 3px;
      background: rgba(255, 193, 7, 0.4);
      border-radius: 50%;
      pointer-events: none;
      z-index: 2;
      ${corner.side === 'top left' ? 'top: 12px; left: 12px;' : ''}
      ${corner.side === 'top right' ? 'top: 12px; right: 12px;' : ''}
      ${corner.side === 'bottom left' ? 'bottom: 12px; left: 12px;' : ''}
      ${corner.side === 'bottom right' ? 'bottom: 12px; right: 12px;' : ''}
      animation: dotPulse 2s ease-in-out infinite;
    `;

    // Add staggered animation delays
    const delays = { 'top-left': '0s', 'top-right': '0.5s', 'bottom-left': '1s', 'bottom-right': '1.5s' };
    marker.style.animationDelay = delays[corner.position];

    wrapper.appendChild(marker);
  });
}

/**
 * Manually trigger a visual burst effect (for events like pass creation)
 */
export function triggerBurstEffect(x, y) {
  const burst = document.createElement('div');
  burst.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    width: 40px;
    height: 40px;
    border: 2px solid rgba(255, 193, 7, 0.8);
    border-radius: 50%;
    pointer-events: none;
    z-index: 100;
    animation: burstExpand 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    box-shadow: 0 0 15px rgba(255, 193, 7, 0.6);
  `;

  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 600);
}

/**
 * Initialize keyframe animations in a style tag
 */
function initializeKeyframes() {
  if (document.getElementById('border-animation-keyframes')) return;

  const style = document.createElement('style');
  style.id = 'border-animation-keyframes';
  style.textContent = `
    @keyframes dotPulse {
      0%, 100% {
        opacity: 0.3;
        transform: scale(1);
      }
      50% {
        opacity: 0.8;
        transform: scale(1.5);
      }
    }

    @keyframes burstExpand {
      0% {
        opacity: 1;
        transform: scale(0.5);
      }
      100% {
        opacity: 0;
        transform: scale(3);
      }
    }
  `;
  document.head.appendChild(style);
}

// Initialize keyframes on script load
initializeKeyframes();

window.__mod_border_animations = true;
