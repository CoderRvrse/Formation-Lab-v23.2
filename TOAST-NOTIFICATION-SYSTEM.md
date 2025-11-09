# Formation Lab - Professional Toast Notification System Guide

## 📋 Overview

This document provides a comprehensive specification for implementing a professional-grade toast notification system that matches Formation Lab's premium aesthetics. The current system needs enhancement to provide an amazing UI feel with consistent styling across all notification types.

---

## 🎯 Current State Assessment

**Files:**
- `scripts/ui-toast.js` - Core toast logic
- `styles/main.css` - Existing toast CSS (basic implementation)

**Current Issues:**
- Basic styling without premium feel
- Limited animation sophistication
- No progress indicators for timed notifications
- Generic icon usage (emoji)
- No sound/haptic feedback integration
- Limited customization options
- No stacking strategy optimization
- Light mode styling needs enhancement

---

## 🎨 Phase 1: Visual Design & Styling

### 1.1 Toast Container Enhancement

**File:** `styles/components/toast.css` (NEW)

**Goals:**
- Premium container positioning and stacking
- Responsive positioning (desktop vs mobile)
- Optimal spacing and layout

**Specifications:**

```css
/* Professional container */
.flab-toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 520px;
  pointer-events: none;

  /* Responsive adjustments */
  @media (max-width: 768px) {
    top: 16px;
    right: 16px;
    left: 16px;
    max-width: none;
  }
}
```

**Key Features:**
- Responsive left margin on mobile (handle safe area)
- Staggered positioning for multiple toasts
- Backdrop blur compatibility
- Proper z-index layering (above modals but below fullscreen)

---

### 1.2 Individual Toast Card Styling

**Visual Hierarchy:**

```
┌─────────────────────────────────────────────┐
│ ✓ Success Message Text Content Here        │
│   Additional details or action information  │
│   [Progress bar with animation]           ⊗ │
└─────────────────────────────────────────────┘
```

**Style Requirements:**

- **Dark Mode (Default)**
  - Background: `rgba(10, 18, 68, 0.92)` with backdrop blur
  - Border: `rgba(245, 247, 255, 0.15)` gradient edge
  - Text: `#f5f7ff` for messages
  - Icons: Color-coded per type

- **Light Mode**
  - Background: `rgba(255, 255, 255, 0.95)` with backdrop blur
  - Border: `rgba(0, 0, 0, 0.1)` subtle edge
  - Text: `#1a2332` for messages
  - Icons: Darker variants

**Toast Types:**

```
1. SUCCESS (Green)
   - Icon: ✓ (checkmark, not emoji)
   - Color: rgba(76, 175, 80, 0.8)
   - Duration: 3000ms
   - Progress bar: Green gradient

2. ERROR (Red)
   - Icon: ⚠ (warning, not emoji)
   - Color: rgba(244, 67, 54, 0.8)
   - Duration: 5000ms (longer for errors)
   - Progress bar: Red gradient

3. WARNING (Amber)
   - Icon: ! (exclamation, styled)
   - Color: rgba(255, 193, 7, 0.8)
   - Duration: 4000ms
   - Progress bar: Amber gradient

4. INFO (Blue)
   - Icon: ℹ (info icon, styled)
   - Color: rgba(33, 150, 243, 0.8)
   - Duration: 3000ms
   - Progress bar: Blue gradient

5. LOADING (Spinner)
   - Icon: Animated spinner
   - Color: rgba(255, 193, 7, 0.8)
   - Duration: No auto-dismiss
   - Progress: Spinner only
```

---

## 💻 Phase 2: Enhanced Toast Component

### 2.1 Advanced JavaScript Features

**File:** `scripts/ui-toast-enhanced.js` (NEW - or replace current)

**New Methods:**

```javascript
/**
 * Show toast with progress indicator
 * @param {string} message - Message to display
 * @param {string} type - Toast type (success, error, info, warning, loading)
 * @param {Object} options - Advanced options
 * @returns {Object} Toast control API
 */
export function showToast(message, type = 'info', options = {}) {
  // Options:
  // - duration: custom duration
  // - title: optional title for toast
  // - action: { label, callback } for action button
  // - progress: true/false for progress bar
  // - dismissible: true/false for close button
  // - sound: true/false for notification sound
  // - haptic: true/false for haptic feedback
  // - metadata: object for tracking/analytics
}

/**
 * Toast control API
 * @returns {Object} with methods:
 * - dismiss() - manually dismiss
 * - update(newMessage) - update message
 * - addAction(label, callback) - add action button
 * - extend(ms) - extend duration
 */
```

**Features:**

1. **Progress Indicator**
   - Animated progress bar showing time remaining
   - Matches toast color theme
   - Linear animation (no easing)
   - Updated every 50ms for smooth visuals

2. **Action Buttons**
   - Optional primary action button
   - Click callback while toast visible
   - Auto-dismiss on action
   - Proper touch targets (min 44px)

3. **Stacking Strategy**
   - Max 3 visible toasts on desktop
   - Max 2 visible toasts on mobile
   - Queue system for additional toasts
   - Automatic show next when dismissed

4. **Accessibility Features**
   - ARIA live regions with `role="alert"`
   - `aria-atomic="true"` for complete updates
   - Keyboard dismissal (ESC key)
   - Screen reader announcements
   - Focus management

5. **Sound & Haptic**
   - Optional notification sound (success beep)
   - Optional haptic feedback (mobile)
   - System-aware (respect `prefers-reduced-motion`)
   - Configurable per toast type

---

### 2.2 Enhanced Animation System

**Entrance Animation:**
```css
@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateX(420px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}
/* Duration: 280ms, Easing: cubic-bezier(0.34, 1.56, 0.64, 1) */
```

**Exit Animation:**
```css
@keyframes toastSlideOut {
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(420px) scale(0.95);
  }
}
/* Duration: 220ms, Easing: cubic-bezier(0.4, 0, 0.2, 1) */
```

**Progress Bar Animation:**
```css
@keyframes progressFill {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
/* Duration: Matches toast duration, Linear timing */
```

**Icon Pulse (Loading):**
```css
@keyframes spinnerRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
/* Duration: 1s, Infinite, Linear */
```

---

### 2.3 Light Mode Overrides

**File:** `styles/light-mode.css` (APPEND)

```css
/* Light mode toast styling */
:root[data-theme="light"] .flab-toast-container,
body.theme-light .flab-toast-container {
  /* Container adjustments for light mode */
}

:root[data-theme="light"] .flab-toast,
body.theme-light .flab-toast {
  background: rgba(255, 255, 255, 0.98);
  border-color: rgba(0, 0, 0, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

:root[data-theme="light"] .flab-toast-message,
body.theme-light .flab-toast-message {
  color: #1a2332;
}

/* Type-specific light mode colors */
:root[data-theme="light"] .flab-toast-success,
body.theme-light .flab-toast-success {
  border-left: 4px solid rgba(76, 175, 80, 0.6);
}

:root[data-theme="light"] .flab-toast-error,
body.theme-light .flab-toast-error {
  border-left: 4px solid rgba(244, 67, 54, 0.6);
}
/* etc for warning, info */
```

---

## 🎭 Phase 3: Advanced Features

### 3.1 Toast Themes & Variants

**Variants:**

```javascript
// Compact variant (less padding, smaller text)
showToast('Message', 'success', { variant: 'compact' })

// Large variant (more prominent)
showToast('Message', 'success', { variant: 'large' })

// Title + Description variant
showToast('Success!', 'success', {
  title: 'Operation Complete',
  description: 'Your changes have been saved to the server'
})

// With action button
showToast('Undo action?', 'info', {
  action: {
    label: 'Undo',
    callback: () => { /* undo logic */ }
  }
})
```

### 3.2 Persistence & Analytics

```javascript
// Track toast events
const toast = showToast('Message', 'success', {
  metadata: {
    source: 'player-editor',
    action: 'save',
    timestamp: Date.now()
  }
})

// Global toast event listener
window.addEventListener('flab-toast', (e) => {
  // e.detail contains: { type, message, action, duration, metadata }
  // Send to analytics service
})
```

### 3.3 Smart Auto-Dismiss

```javascript
// Pause on hover
.flab-toast:hover {
  /* Pause progress bar animation */
  animation-play-state: paused;
}

// Pause on focus
.flab-toast:focus-within {
  animation-play-state: paused;
}

// Resume on mouse leave/blur
```

---

## 🧪 Phase 4: Testing & Integration

### 4.1 Test Scenarios

**Visual Tests:**
- [ ] All 5 toast types render correctly
- [ ] Dark and light mode styling works
- [ ] Animations smooth and performant (60fps)
- [ ] Stacking works with 3+ toasts
- [ ] Mobile responsive positioning
- [ ] Progress bars animate correctly
- [ ] Action buttons clickable and functional

**Interaction Tests:**
- [ ] ESC key dismisses toast
- [ ] Close button works
- [ ] Action button invokes callback
- [ ] Hover pauses progress bar
- [ ] Multiple toasts queue properly

**Accessibility Tests:**
- [ ] ARIA alerts announced by screen readers
- [ ] Keyboard navigation works
- [ ] Color not sole indicator
- [ ] Focus visible on buttons
- [ ] Motion preferences respected

### 4.2 Integration Points

**Where toasts should appear:**
1. Player editor save/error
2. Export completion/error
3. Settings saved confirmation
4. Formation load/save events
5. Undo/redo actions
6. Network operations (API calls)
7. File uploads
8. Validation errors
9. Session expiry warnings
10. Server sync status

### 4.3 Usage Examples

```javascript
// Import in files that need notifications
import { showToast, showSuccessToast, showErrorToast } from './ui-toast.js';

// Success after player edit
showSuccessToast('Player updated successfully');

// Error handling
try {
  await saveFormation();
} catch (error) {
  showErrorToast(`Save failed: ${error.message}`);
}

// Async operation with loading
const loadingToast = showToast('Loading formation...', 'loading');
try {
  await loadFormation();
  loadingToast.dismiss();
  showSuccessToast('Formation loaded');
} catch (error) {
  loadingToast.dismiss();
  showErrorToast('Failed to load formation');
}
```

---

## 📁 File Structure

**New files to create:**
```
styles/components/
  └── toast.css (PROFESSIONAL STYLING)

scripts/
  └── ui-toast-enhanced.js (ENHANCED VERSION)
```

**Files to update:**
```
styles/light-mode.css - Add light mode toast overrides
styles/main.css - Import new toast.css
scripts/main.js - Import ui-toast-enhanced (if replacing)
```

---

## 🎯 Success Criteria

- [ ] All 5 toast types styled professionally
- [ ] Progress bars animate smoothly
- [ ] Dark and light mode fully supported
- [ ] Mobile responsive (100% width on mobile, max-width on desktop)
- [ ] Animations under 300ms (feel instant)
- [ ] Accessibility WCAG AA compliant
- [ ] No performance degradation (maintain 60fps)
- [ ] Stacking strategy handles 5+ queued toasts
- [ ] Light mode text readable on white backgrounds
- [ ] Action buttons responsive to touch (min 44x44px)
- [ ] Sound/haptic feedback configurable
- [ ] Integration with existing export, save, load features

---

## 🎨 Color Palette Reference

### Dark Mode (Current)
```css
--flab-bg-start: #05122e
--flab-bg-end: #0b2b72
--flab-surface: rgba(10, 18, 68, 0.6)
--flab-accent: #ffd447
--flab-text: #f5f7ff
--flab-outline: rgba(245, 247, 255, 0.4)
```

### Light Mode
```css
--light-bg: #ffffff
--light-text: #1a2332
--light-border: rgba(0, 0, 0, 0.08)
--light-surface: rgba(255, 255, 255, 0.98)
```

### Toast Type Colors
```
Success: rgba(76, 175, 80, 0.8)   - Green
Error:   rgba(244, 67, 54, 0.8)   - Red
Warning: rgba(255, 193, 7, 0.8)   - Amber
Info:    rgba(33, 150, 243, 0.8)  - Blue
Loading: rgba(255, 193, 7, 0.8)   - Amber
```

---

## 📊 Performance Considerations

- **Animation GPU Acceleration**: Use `transform` and `opacity` only
- **Progress Bar**: Use CSS animations, not JavaScript intervals
- **Queue Processing**: Debounce with 100ms minimum between shows
- **Memory**: Limit max DOM elements (delete dismissed toasts)
- **Repaints**: Minimize style recalculations
- **Accessibility**: Use `will-change: transform, opacity` for animations

---

## 🔗 Dependencies

- **No new external libraries required**
- Existing animation framework (CSS)
- Modern browser APIs:
  - ES6 Modules
  - Template literals
  - Promise-based API (optional)
  - `requestAnimationFrame` for timing

---

## 📝 Implementation Timeline

**Phase 1 (Styling):** 4-6 hours
- Create `styles/components/toast.css`
- Implement all 5 toast type styles
- Dark and light mode variants

**Phase 2 (Enhanced JS):** 6-8 hours
- Enhance `ui-toast.js` with new features
- Progress bar animation system
- Stacking and queue management
- Accessibility improvements

**Phase 3 (Advanced Features):** 4-6 hours
- Toast variants (compact, large)
- Action buttons and callbacks
- Sound/haptic integration
- Analytics hooks

**Phase 4 (Testing & Integration):** 6-8 hours
- Visual and interaction testing
- Accessibility audit
- Integration with existing features
- Documentation and examples

**Total Estimate: 20-28 hours**

---

## 👥 Team Assignments

**UI Developer:**
- Create `styles/components/toast.css`
- Implement all visual styles
- Dark/light mode variants
- Animation keyframes

**Frontend Developer:**
- Enhance `scripts/ui-toast.js`
- Implement new API methods
- Stacking and queue logic
- Progress bar timing

**QA & Testing:**
- Visual regression testing
- Accessibility compliance
- Cross-browser testing
- Integration verification

---

## 📚 References

- [MDN - CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/animation)
- [WCAG 2.1 - Alerts & Notifications](https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html)
- [Web.dev - User-centric Performance Metrics](https://web.dev/user-centric-performance-metrics/)
- [Material Design - Snackbars](https://material.io/components/snackbars)

---

## 📅 Next Steps

1. **Design Review**: Get team approval on visual specs
2. **Create CSS Component**: Build `styles/components/toast.css`
3. **Enhance JavaScript**: Update notification system with new features
4. **Implement Light Mode**: Add theme-specific overrides
5. **Integration Testing**: Test with real user workflows
6. **Documentation**: Create usage guide for developers
7. **Deploy & Monitor**: Roll out and track user feedback

---

**Last Updated:** 2025-11-09
**Status:** Ready for Implementation
**Owner:** UI Development Team
