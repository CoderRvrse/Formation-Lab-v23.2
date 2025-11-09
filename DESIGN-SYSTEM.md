# Formation Lab Design System

> Modern design tokens and component guidelines for Formation Lab v23.4+

## 📐 Design Principles

1. **Premium & Modern**: Stadium-quality aesthetics matching professional soccer apps
2. **Clear Hierarchy**: Primary actions stand out, secondary actions recede
3. **Consistent Spacing**: 4px base unit system for predictable layouts
4. **Smooth Interactions**: Sub-200ms animations for responsive feel
5. **Accessible First**: WCAG AA minimum, keyboard navigable, screen reader friendly

---

## 🎨 Color System

### Dark Mode (Primary)

```css
/* Background Gradients */
--flab-bg-start: #05122e;           /* Deep navy */
--flab-bg-end: #0b2b72;             /* Royal blue */
--flab-surface: rgba(10, 18, 68, 0.6); /* Translucent surface */

/* Brand Colors */
--flab-accent: #ffd447;             /* Golden yellow (primary) */
--flab-accent-dark: #f5bd23;        /* Darker gold (hover) */
--flab-accent-light: #ffe680;       /* Light gold (highlights) */

/* Text Colors */
--flab-text: #f5f7ff;               /* Primary text (near white) */
--flab-muted: rgba(245, 247, 255, 0.68); /* Secondary text */
--flab-outline: rgba(245, 247, 255, 0.4); /* Borders */

/* Pitch/Field */
--flab-pitch-green: #0a2f48;        /* Dark soccer field green */
--flab-pitch-line: rgba(255, 255, 255, 0.92); /* Field lines */

/* Component Surfaces */
--flab-tool-bg: rgba(5, 24, 60, 0.65);
--flab-tool-active: rgba(12, 68, 140, 0.9);
--flab-tool-border: rgba(255, 255, 255, 0.12);

/* Semantic Colors */
--flab-success: #4caf50;            /* Green */
--flab-warning: #ff9800;            /* Orange */
--flab-error: #f44336;              /* Red */
--flab-info: #2196f3;               /* Blue */
```

### Extended Palette (Redesign)

```css
/* Primary Brand Gradient */
--flab-primary-50: #fff9e6;
--flab-primary-100: #fff3cc;
--flab-primary-200: #ffe799;
--flab-primary-300: #ffdb66;
--flab-primary-400: #ffcf33;
--flab-primary-500: #ffd447;        /* Base accent */
--flab-primary-600: #f5bd23;
--flab-primary-700: #e0a000;
--flab-primary-800: #b38000;
--flab-primary-900: #805c00;

/* Neutral Grays */
--flab-gray-50: #f8fafc;
--flab-gray-100: #e9ecf2;
--flab-gray-200: #d1d5db;
--flab-gray-300: #9ca3af;
--flab-gray-400: #6b7280;
--flab-gray-500: #4b5563;
--flab-gray-600: #374151;
--flab-gray-700: #1f2937;
--flab-gray-800: #111827;
--flab-gray-900: #030712;

/* Surface Elevations */
--flab-surface-1: rgba(10, 18, 68, 0.6);    /* Base */
--flab-surface-2: rgba(15, 28, 85, 0.7);    /* Elevated */
--flab-surface-3: rgba(20, 38, 102, 0.8);   /* Floating */
```

---

## 📏 Spacing System

### Base Unit: 4px

```css
--space-1: 4px;     /* 0.25rem */
--space-2: 8px;     /* 0.5rem */
--space-3: 12px;    /* 0.75rem */
--space-4: 16px;    /* 1rem */
--space-5: 20px;    /* 1.25rem */
--space-6: 24px;    /* 1.5rem */
--space-7: 28px;    /* 1.75rem */
--space-8: 32px;    /* 2rem */
--space-10: 40px;   /* 2.5rem */
--space-12: 48px;   /* 3rem */
--space-16: 64px;   /* 4rem */
--space-20: 80px;   /* 5rem */

/* Component Gaps */
--gap-xs: var(--space-1);   /* 4px */
--gap-sm: var(--space-2);   /* 8px */
--gap-md: var(--space-3);   /* 12px */
--gap-lg: var(--space-4);   /* 16px */
--gap-xl: var(--space-6);   /* 24px */
```

---

## ✍️ Typography

### Font Family

```css
--font-primary: "Inter", "Segoe UI", -apple-system, sans-serif;
--font-mono: "SF Mono", "Consolas", "Monaco", monospace;
```

### Font Sizes

```css
/* Headings */
--text-xs: 12px;     /* 0.75rem - micro text */
--text-sm: 14px;     /* 0.875rem - small body */
--text-base: 16px;   /* 1rem - base body */
--text-lg: 18px;     /* 1.125rem - large body */
--text-xl: 20px;     /* 1.25rem - h3 */
--text-2xl: 24px;    /* 1.5rem - h2 */
--text-3xl: 30px;    /* 1.875rem - h1 */
--text-4xl: 36px;    /* 2.25rem - display */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Typography Scale

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| Display | 36px | 700 | 1.25 | Hero titles |
| H1 | 30px | 700 | 1.25 | Page titles |
| H2 | 24px | 600 | 1.25 | Section headings |
| H3 | 20px | 600 | 1.5 | Subsections |
| Body Large | 18px | 400 | 1.5 | Large paragraphs |
| Body | 16px | 400 | 1.5 | Default text |
| Body Small | 14px | 400 | 1.5 | Secondary text |
| Caption | 12px | 500 | 1.25 | Labels, hints |
| Micro | 10px | 500 | 1.25 | Badges, tags |

---

## 🔘 Button Components

### Button Variants

#### Primary Button
```css
.btn-primary {
  background: linear-gradient(135deg, var(--flab-accent) 0%, var(--flab-accent-dark) 100%);
  color: #0b2b66;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(255, 212, 71, 0.3);
  transition: all 0.15s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 212, 71, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(255, 212, 71, 0.3);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: rgba(255, 255, 255, 0.08);
  color: var(--flab-text);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.3);
}
```

#### Tertiary/Ghost Button
```css
.btn-tertiary {
  background: transparent;
  color: var(--flab-text);
  border: none;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s ease;
}

.btn-tertiary:hover {
  background: rgba(255, 255, 255, 0.08);
}
```

#### Icon Button
```css
.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  color: var(--flab-text);
  transition: all 0.15s ease;
}

.btn-icon:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
}
```

### Button Sizes

```css
/* Small */
.btn-sm {
  padding: 8px 16px;
  font-size: 13px;
  border-radius: 6px;
}

/* Medium (default) */
.btn-md {
  padding: 12px 24px;
  font-size: 14px;
  border-radius: 8px;
}

/* Large */
.btn-lg {
  padding: 14px 28px;
  font-size: 16px;
  border-radius: 10px;
}
```

### Button States

```css
/* Disabled */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Loading */
.btn-loading {
  position: relative;
  color: transparent;
}

.btn-loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin: -8px 0 0 -8px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Focus (keyboard) */
.btn:focus-visible {
  outline: 3px solid var(--flab-accent);
  outline-offset: 2px;
}

/* Active/Pressed */
.btn[aria-pressed="true"] {
  background: var(--flab-tool-active);
  border-color: var(--flab-accent);
  box-shadow: 0 0 0 4px rgba(255, 212, 71, 0.2);
}
```

---

## 🎭 Shadows & Elevation

```css
/* Shadows */
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.1);
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.15);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.2);
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.25);
--shadow-xl: 0 12px 24px rgba(0, 0, 0, 0.3);
--shadow-2xl: 0 24px 48px rgba(0, 0, 0, 0.4);

/* Glow Effects */
--glow-accent: 0 0 16px rgba(255, 212, 71, 0.4);
--glow-success: 0 0 16px rgba(76, 175, 80, 0.4);
--glow-error: 0 0 16px rgba(244, 67, 54, 0.4);
```

---

## 🌊 Animations

### Duration

```css
--duration-instant: 0ms;
--duration-fast: 100ms;
--duration-normal: 150ms;
--duration-moderate: 200ms;
--duration-slow: 300ms;
--duration-slower: 400ms;
```

### Easing Functions

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

### Common Transitions

```css
/* Button hover */
transition: all 150ms cubic-bezier(0, 0, 0.2, 1);

/* Modal entrance */
transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1),
            opacity 300ms ease;

/* Micro-interactions */
transition: transform 100ms ease-out;
```

### Keyframe Animations

```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale bounce */
@keyframes scaleBounce {
  0% { transform: scale(0.8); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Spin (loading) */
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## 📦 Border Radius

```css
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-xl: 12px;
--radius-2xl: 16px;
--radius-3xl: 24px;
--radius-full: 9999px;

/* Component-specific */
--radius-button: 8px;
--radius-card: 12px;
--radius-modal: 16px;
--radius-pill: 9999px;
```

---

## 🎯 Z-Index Scale

```css
--z-base: 0;
--z-dropdown: 1000;
--z-sticky: 1100;
--z-fixed: 1200;
--z-overlay: 2000;
--z-modal: 3000;
--z-popover: 4000;
--z-tooltip: 5000;
--z-toast: 6000;
```

---

## ♿ Accessibility Guidelines

### Minimum Requirements

1. **Color Contrast**: WCAG AA minimum (4.5:1 for normal text, 3:1 for large text)
2. **Touch Targets**: Minimum 44x44px on mobile
3. **Keyboard Navigation**: All interactive elements must be keyboard accessible
4. **Focus Indicators**: Visible 3px outline with 2px offset
5. **Screen Readers**: Proper ARIA labels on all buttons and interactive elements

### Focus Indicators

```css
/* Keyboard focus */
*:focus-visible {
  outline: 3px solid var(--flab-accent);
  outline-offset: 2px;
}

/* Enhanced focus for critical elements */
button:focus-visible,
.flab-player:focus-visible {
  outline: 3px solid var(--flab-accent);
  outline-offset: 3px;
  box-shadow: 0 0 0 6px rgba(255, 212, 71, 0.3);
}
```

### ARIA Best Practices

- Use `aria-pressed` for toggle buttons
- Use `aria-expanded` for collapsible sections
- Use `aria-label` when visual text is insufficient
- Use `role="status"` for toast notifications
- Use `aria-live="polite"` for dynamic updates

---

## 📱 Responsive Breakpoints

```css
/* Mobile first approach */
--breakpoint-xs: 360px;   /* Small phones */
--breakpoint-sm: 480px;   /* Phones */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
--breakpoint-2xl: 1536px; /* Extra large */
```

### Media Query Usage

```css
/* Small phones */
@media (max-width: 480px) { }

/* Tablets and below */
@media (max-width: 768px) { }

/* Desktop and up */
@media (min-width: 1024px) { }

/* Touch devices */
@media (hover: none) and (pointer: coarse) { }

/* Reduced motion */
@media (prefers-reduced-motion: reduce) { }
```

---

## 🧩 Component Patterns

### Card Pattern

```css
.card {
  background: var(--flab-surface-2);
  border: 1px solid var(--flab-outline);
  border-radius: var(--radius-card);
  padding: var(--space-6);
  backdrop-filter: blur(16px);
  box-shadow: var(--shadow-md);
}
```

### Button Group Pattern

```css
.btn-group {
  display: flex;
  gap: var(--gap-sm);
}

.btn-group > button:first-child {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.btn-group > button:last-child {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.btn-group > button:not(:first-child):not(:last-child) {
  border-radius: 0;
}
```

### Tooltip Pattern

```css
.tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  z-index: var(--z-tooltip);
  opacity: 0;
  transition: opacity 150ms ease;
}

.tooltip.visible {
  opacity: 1;
}
```

---

## 🎬 Motion Design

### Hover States

- **Scale**: 1.02 - 1.05 (subtle growth)
- **Translate Y**: -1px to -2px (lift effect)
- **Duration**: 150ms
- **Easing**: ease-out

### Active/Press States

- **Scale**: 0.95 - 0.98 (compression)
- **Translate Y**: 0 (return to origin)
- **Duration**: 100ms
- **Easing**: ease-in

### Loading Spinners

- **Rotation**: 360deg continuous
- **Duration**: 0.8s - 1.4s
- **Easing**: linear

---

## 🚀 Performance Guidelines

1. **Use `will-change` sparingly**: Only for animating properties
2. **Prefer transforms over position**: GPU accelerated
3. **Debounce resize handlers**: Minimum 150ms
4. **Lazy load images**: Below the fold
5. **Bundle size budget**: CSS under 50KB gzipped

---

## 📚 Usage Examples

### Primary Action Button with Icon

```html
<button class="btn-primary btn-md" type="button">
  <svg class="icon" aria-hidden="true" focusable="false">
    <use href="#export-icon"></use>
  </svg>
  <span>Export PNG</span>
</button>
```

### Button Group

```html
<div class="btn-group">
  <button class="btn-secondary btn-sm">Landscape</button>
  <button class="btn-secondary btn-sm">Portrait</button>
  <button class="btn-secondary btn-sm">Flip</button>
</div>
```

### Toggle Button (Mode Selector)

```html
<button
  class="btn-tool"
  data-mode="pass"
  aria-pressed="false"
  type="button">
  <svg aria-hidden="true" focusable="false">
    <use href="#pass-icon"></use>
  </svg>
  <span>Pass Mode</span>
</button>
```

---

## 🔄 Migration Strategy

### Phase 1: Design Tokens
1. Add new CSS custom properties to `:root`
2. Keep existing variables for backward compatibility
3. Gradually migrate components to new tokens

### Phase 2: Component Updates
1. Start with buttons (high impact)
2. Move to sidepanel layout
3. Update interactive states
4. Refine animations

### Phase 3: Polish & QA
1. Test all states (hover, focus, active, disabled)
2. Verify keyboard navigation
3. Run accessibility audit
4. Cross-browser testing

---

## 📝 Changelog

**v1.0.0** (2025-11-09)
- Initial design system documentation
- Color palette definition
- Typography scale
- Button component variants
- Spacing and animation tokens
- Accessibility guidelines

---

**Maintained by**: Formation Lab Team
**Last Updated**: 2025-11-09
**Version**: 1.0.0
