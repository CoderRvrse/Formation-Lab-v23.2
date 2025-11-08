// Social sharing module for Formation Lab v23.2+
// Implements native Web Share API with fallbacks

import { showToast, showErrorToast, showSuccessToast } from './ui-toast.js';
import { showSpinner, hideSpinner } from './loading-spinner.js';
import { announce } from './accessibility.js';

/**
 * Check if Web Share API is supported
 * @returns {boolean}
 */
export function isShareSupported() {
  return navigator.share !== undefined;
}

/**
 * Check if Web Share API supports files
 * @returns {boolean}
 */
export function isShareFilesSupported() {
  return navigator.canShare !== undefined;
}

/**
 * Share formation as image using native Web Share API
 * @param {Blob} imageBlob - PNG blob to share
 * @param {string} title - Share title
 * @param {string} text - Share description
 * @returns {Promise<boolean>} Success
 */
export async function shareFormationImage(imageBlob, title = 'My Formation', text = 'Check out my soccer formation!') {
  if (!isShareSupported()) {
    showErrorToast('Share not supported on this device');
    return false;
  }

  try {
    const file = new File([imageBlob], 'formation.png', { type: 'image/png' });

    const shareData = {
      title,
      text,
      files: [file]
    };

    // Check if we can share this data
    if (navigator.canShare && !navigator.canShare(shareData)) {
      // Fallback: share without file
      await navigator.share({ title, text });
      showToast('Formation link shared! Image saved to clipboard.', 'success');
      return true;
    }

    // Share with file
    await navigator.share(shareData);
    showSuccessToast('Formation shared successfully!');
    announce('Formation shared successfully', 'polite');
    return true;

  } catch (error) {
    if (error.name === 'AbortError') {
      // User cancelled share, not an error
      console.log('Share cancelled by user');
      return false;
    }

    console.error('Share failed:', error);
    showErrorToast('Failed to share formation');
    return false;
  }
}

/**
 * Share formation link (text only)
 * @param {string} url - URL to share
 * @param {string} title - Share title
 * @param {string} text - Share description
 * @returns {Promise<boolean>} Success
 */
export async function shareFormationLink(url = window.location.href, title = 'Formation Lab', text = 'Design soccer formations with Formation Lab') {
  if (!isShareSupported()) {
    // Fallback: copy to clipboard
    return await copyToClipboard(url);
  }

  try {
    await navigator.share({
      title,
      text,
      url
    });

    showSuccessToast('Link shared successfully!');
    announce('Link shared successfully', 'polite');
    return true;

  } catch (error) {
    if (error.name === 'AbortError') {
      // User cancelled share, not an error
      console.log('Share cancelled by user');
      return false;
    }

    console.error('Share failed:', error);
    // Fallback: copy to clipboard
    return await copyToClipboard(url);
  }
}

/**
 * Copy text to clipboard as fallback
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      showSuccessToast('Link copied to clipboard!');
      announce('Link copied to clipboard', 'polite');
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();

      const success = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (success) {
        showSuccessToast('Link copied to clipboard!');
        announce('Link copied to clipboard', 'polite');
        return true;
      } else {
        throw new Error('Copy failed');
      }
    }
  } catch (error) {
    console.error('Copy to clipboard failed:', error);
    showErrorToast('Failed to copy link');
    return false;
  }
}

/**
 * Export and share current formation as PNG
 * @returns {Promise<boolean>} Success
 */
export async function exportAndShare() {
  const spinnerId = showSpinner('Preparing to share...');

  try {
    // Import export module dynamically
    const { exportToPNG } = await import('./export.js');

    // Export formation to PNG blob
    const blob = await exportToPNG();

    if (!blob) {
      throw new Error('Export failed');
    }

    hideSpinner(spinnerId);

    // Share the image
    const success = await shareFormationImage(blob, 'My Formation', 'Check out my soccer formation from Formation Lab!');

    return success;

  } catch (error) {
    hideSpinner(spinnerId);
    console.error('Export and share failed:', error);
    showErrorToast('Failed to export and share formation');
    return false;
  }
}

/**
 * Add share button to UI
 */
export function addShareButton() {
  // Check if button already exists
  if (document.getElementById('share-btn')) {
    return;
  }

  // Find actions container
  const actionsContainer = document.querySelector('.flab-actions');
  if (!actionsContainer) {
    console.warn('Could not find .flab-actions container for share button');
    return;
  }

  // Create share button
  const shareBtn = document.createElement('button');
  shareBtn.id = 'share-btn';
  shareBtn.className = 'flab-action';

  // Use different text based on device support
  const shareText = isShareSupported() ? 'Share' : 'Copy Link';
  const shareIcon = isShareSupported() ? '📤' : '🔗';

  shareBtn.innerHTML = `
    <span style="font-size: 18px;">${shareIcon}</span>
    <span>${shareText}</span>
  `;

  shareBtn.setAttribute('aria-label', isShareSupported() ? 'Share formation' : 'Copy link to clipboard');
  shareBtn.title = isShareSupported() ? 'Share formation' : 'Copy link to clipboard';

  shareBtn.addEventListener('click', async () => {
    if (isShareSupported() && isShareFilesSupported()) {
      // Use native share with image
      await exportAndShare();
    } else if (isShareSupported()) {
      // Share link only
      await shareFormationLink();
    } else {
      // Copy link to clipboard
      await copyToClipboard(window.location.href);
    }
  });

  // Find export button and insert share button after it
  const exportBtn = Array.from(actionsContainer.children).find(
    child => child.id === 'exportButton' || child.textContent.includes('Export')
  );

  if (exportBtn) {
    exportBtn.insertAdjacentElement('afterend', shareBtn);
  } else {
    // Insert near the beginning
    actionsContainer.insertBefore(shareBtn, actionsContainer.children[1]);
  }
}

/**
 * Initialize share system
 */
export function initShare() {
  console.log('📤 Initializing share system...');

  // Add share button to UI
  addShareButton();

  // Log share support
  console.log(`   Share API supported: ${isShareSupported()}`);
  console.log(`   Share files supported: ${isShareFilesSupported()}`);

  console.log('✅ Share system initialized');
}

/**
 * Show share modal (desktop fallback)
 * @param {string} url - URL to share
 */
export function showShareModal(url = window.location.href) {
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'flab-modal visible';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-label', 'Share formation');
  modal.setAttribute('aria-modal', 'true');

  modal.innerHTML = `
    <div class="flab-modal-content">
      <div class="flab-modal-header">
        <h2>Share Formation</h2>
        <button class="flab-modal-close" aria-label="Close">&times;</button>
      </div>
      <div class="flab-modal-body">
        <p style="margin-bottom: 16px;">Share your formation with others:</p>
        <div style="display: flex; gap: 8px; margin-bottom: 20px;">
          <input
            type="text"
            value="${url}"
            readonly
            style="flex: 1; padding: 10px; border: 1px solid var(--flab-outline); border-radius: 6px; background: var(--flab-tool-bg); color: var(--flab-text); font-family: monospace; font-size: 13px;"
            id="share-url-input"
          />
          <button
            class="flab-modal-btn primary"
            id="copy-url-btn"
            style="padding: 10px 20px; white-space: nowrap;"
          >
            Copy
          </button>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px;">
          <button class="flab-modal-btn secondary" id="share-twitter">Twitter</button>
          <button class="flab-modal-btn secondary" id="share-facebook">Facebook</button>
          <button class="flab-modal-btn secondary" id="share-whatsapp">WhatsApp</button>
          <button class="flab-modal-btn secondary" id="share-email">Email</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Trap focus in modal
  import('./accessibility.js').then(({ trapFocus }) => {
    trapFocus(modal.querySelector('.flab-modal-content'));
  });

  // Close button
  const closeBtn = modal.querySelector('.flab-modal-close');
  closeBtn.addEventListener('click', () => {
    modal.remove();
  });

  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  // Escape key to close
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);

  // Copy URL button
  const copyBtn = modal.querySelector('#copy-url-btn');
  const urlInput = modal.querySelector('#share-url-input');

  copyBtn.addEventListener('click', async () => {
    urlInput.select();
    const success = await copyToClipboard(url);
    if (success) {
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 2000);
    }
  });

  // Social share buttons
  const title = 'Check out my formation from Formation Lab!';
  const text = 'I designed this soccer formation using Formation Lab';

  modal.querySelector('#share-twitter').addEventListener('click', () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  });

  modal.querySelector('#share-facebook').addEventListener('click', () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  });

  modal.querySelector('#share-whatsapp').addEventListener('click', () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  });

  modal.querySelector('#share-email').addEventListener('click', () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
  });
}
