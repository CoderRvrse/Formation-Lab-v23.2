# Toast Notification System - Visual & Design Guide

## 🎨 Toast Anatomy

```
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  ✓  Message Title / Primary Message                  ⊗  │
│  Additional context or supporting information            │
│                                                           │
│  [████████████░░░░░░░░░░░░░░░░] 3 seconds remaining     │
│                                                           │
└─────────────────────────────────────────────────────────┘
  ↑                                                        ↑
  Icon (16px)                                      Close button
  Color-coded                                      (optional)
```

### Component Breakdown

| Component | Purpose | Size | Notes |
|-----------|---------|------|-------|
| **Icon** | Visual indicator of type | 20px | SVG or styled, color-coded |
| **Title/Message** | Primary content | 14px | Max 2 lines recommended |
| **Description** | Secondary content | 13px | Optional, max 1 line |
| **Progress Bar** | Time remaining | 100% width | Optional, linear animation |
| **Action Button** | Call-to-action | 32px height | Optional, right-aligned |
| **Close Button** | Manual dismiss | 24px | Always available |

---

## 📦 Toast Types - Visual Specifications

### SUCCESS (Green)

```
┌─────────────────────────────────────────────────────┐
│ ✓ Player updated successfully                    ⊗  │
│ Changes saved to your formation                      │
│ [████████████████████████░░░░░░░] 3s remaining      │
└─────────────────────────────────────────────────────┘
```

**Visual Properties:**
- Background: `rgba(10, 18, 68, 0.92)` (dark) / `rgba(255, 255, 255, 0.98)` (light)
- Left Border: `4px solid rgba(76, 175, 80, 0.9)`
- Icon Color: `#4caf50` (bright green)
- Progress Bar: `linear-gradient(90deg, #4caf50, #66bb6a)`
- Duration: 3000ms
- Icon: SVG checkmark or `✓`

**When to use:**
- Form submissions (save, update)
- File operations (export, import, upload)
- User actions that succeeded
- Settings changes confirmed
- Operations completed successfully

---

### ERROR (Red)

```
┌─────────────────────────────────────────────────────┐
│ ⚠ Failed to save player                          ⊗  │
│ Network error. Please check your connection.         │
│ [████████████████░░░░░░░░░░░░░░░░] 5s remaining    │
└─────────────────────────────────────────────────────┘
```

**Visual Properties:**
- Background: `rgba(10, 18, 68, 0.92)` (dark) / `rgba(255, 255, 255, 0.98)` (light)
- Left Border: `4px solid rgba(244, 67, 54, 0.9)`
- Icon Color: `#f44336` (bright red)
- Progress Bar: `linear-gradient(90deg, #f44336, #ef5350)`
- Duration: 5000ms (longer for errors)
- Icon: SVG warning or `⚠`

**When to use:**
- Failed operations (save, export, import)
- Network/API errors
- Validation failures
- File format errors
- Critical failures requiring attention

**Enhanced Features:**
- Can include action button: "Retry" or "Report"
- Should not auto-dismiss if critical (remove progress bar)
- Optional sound: Error beep

---

### WARNING (Amber)

```
┌─────────────────────────────────────────────────────┐
│ ! Unsaved changes in editor                     ⊗  │
│ Your formation has been modified.                   │
│ [████████████████████░░░░░░░░░░░] 4s remaining    │
└─────────────────────────────────────────────────────┘
```

**Visual Properties:**
- Background: `rgba(10, 18, 68, 0.92)` (dark) / `rgba(255, 255, 255, 0.98)` (light)
- Left Border: `4px solid rgba(255, 193, 7, 0.9)`
- Icon Color: `#ffc107` (bright amber)
- Progress Bar: `linear-gradient(90deg, #ffc107, #ffb74d)`
- Duration: 4000ms
- Icon: SVG exclamation or `!`

**When to use:**
- Unsaved changes warnings
- Deprecated features
- Resource limitations
- Performance warnings
- Non-critical alerts

**Enhanced Features:**
- Can include action button: "Save" or "Dismiss"
- Yellow/amber theme matches app accent color

---

### INFO (Blue)

```
┌─────────────────────────────────────────────────────┐
│ ℹ Tip: Double-click players to edit them        ⊗  │
│ This makes team setup faster and easier.            │
│ [████████████████████████░░░░░░░] 3s remaining    │
└─────────────────────────────────────────────────────┘
```

**Visual Properties:**
- Background: `rgba(10, 18, 68, 0.92)` (dark) / `rgba(255, 255, 255, 0.98)` (light)
- Left Border: `4px solid rgba(33, 150, 243, 0.9)`
- Icon Color: `#2196f3` (bright blue)
- Progress Bar: `linear-gradient(90deg, #2196f3, #42a5f5)`
- Duration: 3000ms
- Icon: SVG info or `ℹ`

**When to use:**
- Tips and tricks
- Feature announcements
- General information
- Help prompts
- Onboarding messages

**Enhanced Features:**
- Lower priority (neutral color)
- Can have action button: "Learn more"

---

### LOADING (Spinner)

```
┌─────────────────────────────────────────────────────┐
│ ⟳ Loading formation...                          ⊗  │
│ Please wait while we load your data.                │
│ [⟳ animated spinner ⟳ ⟳ ⟳]                         │
└─────────────────────────────────────────────────────┘
```

**Visual Properties:**
- Background: `rgba(10, 18, 68, 0.92)` (dark) / `rgba(255, 255, 255, 0.98)` (light)
- Left Border: `4px solid rgba(255, 193, 7, 0.9)`
- Icon: Animated spinner (24px, rotating)
- Duration: No auto-dismiss (manual control)
- Icon Color: `#ffc107` (yellow, matching accent)

**When to use:**
- Async operations (loading, uploading)
- File processing
- Network requests
- Heavy computations
- Any operation that takes > 1 second

**Enhanced Features:**
- No auto-dismiss
- Controlled via API: `loadingToast.dismiss()`
- Optional cancel button
- Example:

```javascript
const toast = showToast('Loading formation...', 'loading');
try {
  await loadFormation();
  toast.dismiss();
  showSuccessToast('Formation loaded!');
} catch (error) {
  toast.dismiss();
  showErrorToast(`Failed: ${error.message}`);
}
```

---

## 🎬 Animation Specifications

### Entrance Animation

**Duration:** 280ms
**Easing:** `cubic-bezier(0.34, 1.56, 0.64, 1)` (bounce)
**Movement:**
- X: Slides from right (+420px → 0)
- Y: Stays fixed
- Scale: 0.95 → 1.0
- Opacity: 0 → 1

```
Timeline:
0ms    ├─ Start: translateX(420px) scale(0.95) opacity(0)
140ms  ├─ Bounce: Passes center with overshoot
280ms  └─ End: translateX(0) scale(1) opacity(1)
```

### Exit Animation

**Duration:** 220ms
**Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (ease-in-out)
**Movement:**
- X: Slides to right (0 → 420px)
- Y: Stays fixed
- Scale: 1.0 → 0.95
- Opacity: 1 → 0

```
Timeline:
0ms    ├─ Start: translateX(0) scale(1) opacity(1)
220ms  └─ End: translateX(420px) scale(0.95) opacity(0)
```

### Progress Bar Animation

**Duration:** Matches toast duration (3s-5s)
**Easing:** `linear` (constant speed)
**Width:** 100% → 0%
**Color:** Type-specific gradient

```
Timeline (3s example):
0ms    ├─ Start: width 100%
1500ms ├─ Halfway
3000ms └─ End: width 0%
```

### Icon Spinner (Loading Toast)

**Duration:** 1s
**Easing:** `linear` (continuous)
**Rotation:** 0deg → 360deg
**Infinite:** Yes

```
Timeline:
0ms    ├─ rotation(0deg)
250ms  ├─ rotation(90deg)
500ms  ├─ rotation(180deg)
750ms  ├─ rotation(270deg)
1000ms └─ rotation(360deg) → repeat
```

### Hover State

**Effect:** Pause all animations
**Animation Play State:** `paused`
**Hint:** Subtle brightening of background

```css
.flab-toast:hover {
  animation-play-state: paused;
  background: rgba(10, 18, 68, 0.96); /* Slightly brighter */
}
```

---

## 📱 Responsive Layout

### Desktop (≥ 769px)

```
                           ┌─────────────────────────────┐
                           │  Toast 1 (24px from top)    │
                           ├─────────────────────────────┤
                           │    (16px gap)               │
                           │  Toast 2                    │
                           ├─────────────────────────────┤
                           │    (16px gap)               │
                           │  Toast 3                    │
                           └─────────────────────────────┘
                           ↑
                           520px max-width
                           24px from right edge
```

**Properties:**
- Position: Top-right corner
- Max width: 520px
- Padding from edges: 24px
- Gap between toasts: 16px
- Z-index: 2000

### Tablet (641px - 768px)

```
                 ┌─────────────────────────────┐
                 │  Toast 1 (20px from top)    │
                 ├─────────────────────────────┤
                 │  Toast 2                    │
                 └─────────────────────────────┘
                 ↑
                 600px max-width
                 20px from edges
```

**Properties:**
- Position: Top-right corner
- Max width: 600px (or 80vw)
- Padding from edges: 20px
- Max visible: 2 toasts
- Additional toasts: Queue and display on next dismiss

### Mobile (≤ 640px)

```
┌───────────────────────────────┐
│  Toast 1 (16px from top)      │
├───────────────────────────────┤
│  Toast 2                      │
└───────────────────────────────┘
↑                               ↑
16px left                       16px right
(respects safe area)            (respects safe area)
```

**Properties:**
- Position: Top-center (full-width minus margins)
- Width: 100% - 32px (16px margins each side)
- Padding from edges: 16px (top & sides)
- Max visible: 1 toast
- Gap between toasts: 12px

---

## 🎨 Light Mode Specifications

### Colors by Type

#### Success (Light Mode)
```css
Background:     rgba(255, 255, 255, 0.98)
Border-left:    rgba(76, 175, 80, 0.6)
Icon:           #4caf50
Text:           #1a2332
Progress:       rgba(76, 175, 80, 0.4)
```

#### Error (Light Mode)
```css
Background:     rgba(255, 255, 255, 0.98)
Border-left:    rgba(244, 67, 54, 0.6)
Icon:           #f44336
Text:           #1a2332
Progress:       rgba(244, 67, 54, 0.4)
```

#### Warning (Light Mode)
```css
Background:     rgba(255, 255, 255, 0.98)
Border-left:    rgba(255, 193, 7, 0.6)
Icon:           #ffc107
Text:           #1a2332
Progress:       rgba(255, 193, 7, 0.4)
```

#### Info (Light Mode)
```css
Background:     rgba(255, 255, 255, 0.98)
Border-left:    rgba(33, 150, 243, 0.6)
Icon:           #2196f3
Text:           #1a2332
Progress:       rgba(33, 150, 243, 0.4)
```

#### Loading (Light Mode)
```css
Background:     rgba(255, 255, 255, 0.98)
Border-left:    rgba(255, 193, 7, 0.6)
Icon:           #ffc107
Text:           #1a2332
Spinner:        #ffc107
```

---

## 💡 Design Tokens

```css
/* Toast Container */
--toast-container-gap: 16px
--toast-container-max-width: 520px
--toast-container-offset: 24px

/* Toast Card */
--toast-padding: 16px
--toast-gap: 12px
--toast-border-radius: 12px
--toast-min-height: 64px

/* Icon */
--toast-icon-size: 20px

/* Text */
--toast-message-font-size: 14px
--toast-message-line-height: 1.4
--toast-description-font-size: 13px

/* Progress Bar */
--toast-progress-height: 3px

/* Button */
--toast-button-min-height: 44px
--toast-button-padding: 8px 12px

/* Animations */
--toast-entrance-duration: 280ms
--toast-entrance-easing: cubic-bezier(0.34, 1.56, 0.64, 1)
--toast-exit-duration: 220ms
--toast-exit-easing: cubic-bezier(0.4, 0, 0.2, 1)
```

---

## ✨ Polish & Details

### Shadow Hierarchy

**Dark Mode:**
```css
Box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4)
```

**Light Mode:**
```css
Box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12)
```

### Backdrop Blur

```css
Backdrop-filter: blur(12px)
```

### Border & Outline

**Dark Mode:**
```css
Border: 1px solid rgba(245, 247, 255, 0.15)
```

**Light Mode:**
```css
Border: 1px solid rgba(0, 0, 0, 0.08)
```

### Hover Effects

```css
.flab-toast:hover {
  background: rgba(10, 18, 68, 0.96);  /* Slightly brightened */
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5); /* Lifted shadow */
  animation-play-state: paused;  /* Pause progress bar */
}
```

### Focus State

```css
.flab-toast-close:focus {
  outline: 2px solid var(--flab-accent);
  outline-offset: 2px;
}
```

---

## 🎯 Implementation Checklist

### Visual Design
- [ ] Create icon set (SVG checkmark, warning, info, exclamation)
- [ ] Define exact color hex values
- [ ] Create animation timing function values
- [ ] Design progress bar gradient stops
- [ ] Create loading spinner animation

### CSS Components
- [ ] Base `.flab-toast` styles
- [ ] Type-specific styles (success, error, warning, info, loading)
- [ ] Dark mode overrides
- [ ] Light mode overrides
- [ ] Animation keyframes
- [ ] Responsive media queries
- [ ] Hover/focus states

### JavaScript
- [ ] Update toast creation function
- [ ] Add progress bar element
- [ ] Implement progress bar timing
- [ ] Add action button support
- [ ] Add stacking algorithm
- [ ] Add queue management

### Testing
- [ ] Visual regression on all toasts
- [ ] Responsive testing (mobile, tablet, desktop)
- [ ] Animation performance (60fps)
- [ ] Accessibility audit
- [ ] Cross-browser testing
- [ ] Light/dark mode switching

---

## 📚 Reference Images

### Current State vs Target State

**Current (Basic):**
```
Simple emoji icon + text + basic color
```

**Target (Professional):**
```
Branded icon + detailed layout + gradient borders + progress bars + animations
```

---

**Created:** 2025-11-09
**For:** UI Development Team
**Version:** 1.0
