# Formation Lab - Sidepanel & UI Redesign Todo List

## 🎯 Project Overview
Formation Lab v23.4+ needs a complete UI overhaul for the left sidepanel and control buttons. The current design feels dated and needs modern, premium aesthetics that match the stunning pitch animations we've implemented.

## 📋 Current Issues
- **Sidepanel Layout**: Basic, uninspired button layout
- **Visual Hierarchy**: All buttons feel equal, no clear primary actions
- **Spacing & Padding**: Inconsistent gaps and alignment
- **Color Scheme**: Needs better accent colors and gradients
- **Interactive States**: Hover/active states are minimal
- **Icon Integration**: Icons could be more integrated into button design
- **Accessibility**: Text-heavy, needs better visual feedback
- **Mobile Responsiveness**: Sidepanel doesn't adapt well to smaller screens

---

## 🎨 Phase 1: Design & Concept (Priority: HIGH)

### 1.1 Sidepanel Structure Redesign
- [ ] Create 3-5 design mockups for the left sidepanel
- [ ] Establish new visual hierarchy (primary, secondary, tertiary actions)
- [ ] Design new button styles with modern aesthetics
- [ ] Create hover/active/focus states for all interactive elements
- [ ] Plan color palette using team brand colors
- [ ] Design spacing grid (4px, 8px, 12px, 16px, etc.)

**Files to Create/Update:**
- `designs/sidepanel-mockups.fig` (or Figma link)
- `DESIGN-SYSTEM.md` (design tokens and guidelines)

### 1.2 Icon & Visual Elements
- [ ] Audit current icons for consistency
- [ ] Design new icon set if needed (or use consistent icon library)
- [ ] Create icon size variants (16px, 20px, 24px, 32px)
- [ ] Add loading states with spinner animation
- [ ] Design success/error/warning visual indicators

---

## 💻 Phase 2: Technical Implementation (Priority: HIGH)

### 2.1 Sidepanel Component Refactor
- [ ] **File**: `styles/components/sidepanel.css`
  - Redesign grid layout structure
  - Implement CSS custom properties for spacing/colors
  - Add modern gradient backgrounds
  - Create smooth transitions and animations
  - Implement dark/light mode variants

- [ ] **File**: `scripts/ui.js`
  - Refactor button initialization logic
  - Improve event handler organization
  - Add keyboard navigation improvements
  - Implement focus management

### 2.2 Button & Toolbar Redesign
- [ ] **File**: `styles/components/toolbar.css`
  - Create new button component styles
  - Design button size variants (sm, md, lg)
  - Implement button group styling
  - Add loading and disabled states

- [ ] Create: `styles/components/button.css`
  - Primary button style
  - Secondary button style
  - Icon-only button style
  - Button with badge/notification indicator
  - Pill/rounded button variant

### 2.3 Action Group Organization
- [ ] **File**: `styles/components/actions.css`
  - Group related actions with visual separators
  - Implement action group cards/containers
  - Add collapse/expand for grouped actions
  - Create visual sections (Preset Actions, Orientation, Export, etc.)

### 2.4 Preset Menu & Dropdown Redesign
- [ ] **File**: `scripts/ui.presets.menu.js`
  - Redesign preset selector UI
  - Add preset thumbnails/previews
  - Improve visual feedback for selected preset
  - Create smooth dropdown animation

### 2.5 Pass Style Dropdown
- [ ] **File**: `scripts/ui.passstyle.menu.js`
  - Update dropdown styling
  - Add visual examples of pass styles
  - Improve trigger button design

---

## 🎭 Phase 3: Animation & Interactions (Priority: MEDIUM)

### 3.1 Button Interactions
- [ ] [ ] Smooth hover scaling and color transitions
- [ ] Ripple/wave effect on click
- [ ] Smooth state transitions (hover → active → disabled)
- [ ] Loading spinner animations
- [ ] Success/error feedback animations

### 3.2 Sidepanel Animations
- [ ] Smooth collapse/expand transition for mobile
- [ ] Stagger animation on initial page load
- [ ] Smooth transitions between mode changes
- [ ] Floating action buttons with bounce effect
- [ ] Tooltip/popover animations

### 3.3 Visual Feedback
- [ ] Toast notifications redesign
- [ ] Loading skeleton states
- [ ] Smooth transitions when switching themes
- [ ] Button press feedback (haptic on mobile)

---

## 📱 Phase 4: Mobile Responsiveness (Priority: MEDIUM)

### 4.1 Mobile Layout
- [ ] [ ] Sidebar collapse on mobile (< 768px)
- [ ] Bottom sheet menu for mobile actions
- [ ] Drawer/hamburger menu for sidepanel
- [ ] Touch-friendly button sizing (min 44x44px)
- [ ] Reorganize buttons for mobile layout

### 4.2 Touch Interactions
- [ ] Improve touch target sizes
- [ ] Add long-press actions
- [ ] Gesture support (swipe to toggle menu)
- [ ] Remove hover states on touch devices

**File**: `styles/components/sidepanel.css`
- Add mobile breakpoints (@media max-width: 768px)
- Create responsive layout system

---

## 🌈 Phase 5: Theme & Branding (Priority: MEDIUM)

### 5.1 Color System
- [ ] Define primary, secondary, tertiary colors
- [ ] Create color palette with 50-900 variants
- [ ] Update CSS variables in main.css
- [ ] Test contrast ratios (WCAG AA compliance)

### 5.2 Typography
- [ ] Establish font hierarchy (h1-h6, body, small, micro)
- [ ] Define font sizes and line heights
- [ ] Update all UI text styling
- [ ] Ensure readability on all screen sizes

### 5.3 Light & Dark Mode
- [ ] Update sidepanel for light mode
- [ ] Update button colors for light mode
- [ ] Test all interactive states in both themes
- [ ] **File**: `styles/light-mode.css`

---

## ♿ Phase 6: Accessibility (Priority: HIGH)

### 6.1 Keyboard Navigation
- [ ] [ ] Tab order is logical and predictable
- [ ] Focus indicators are visible and clear
- [ ] Keyboard shortcuts for primary actions
- [ ] Test with keyboard only

### 6.2 Screen Reader Support
- [ ] [ ] All buttons have descriptive aria-labels
- [ ] Button states announced (pressed, disabled, loading)
- [ ] Tool icons have alternative text
- [ ] Use semantic HTML (button, nav, section)

### 6.3 Visual Accessibility
- [ ] Sufficient color contrast (WCAG AA min)
- [ ] Don't rely on color alone for information
- [ ] Animated elements can be paused
- [ ] Test with accessibility tools (axe, Wave)

---

## 📚 Phase 7: Documentation & Refactoring (Priority: MEDIUM)

### 7.1 Code Organization
- [ ] Create `styles/components/sidepanel-redesign/` folder
- [ ] Break sidepanel CSS into modular files:
  - `_layout.css` (grid, flexbox)
  - `_buttons.css` (button styles)
  - `_colors.css` (color variables)
  - `_animations.css` (transitions, keyframes)
  - `_responsive.css` (media queries)

### 7.2 JavaScript Refactoring
- [ ] Extract button logic to separate modules
- [ ] Create `scripts/ui-components/` folder
- [ ] Document all UI event handlers
- [ ] Add JSDoc comments

### 7.3 Style Guide & Design System
- [ ] Create `DESIGN-SYSTEM.md`
- [ ] Document button component API
- [ ] Create component examples
- [ ] Add design tokens reference

---

## 🧪 Phase 8: Testing & QA (Priority: HIGH)

### 8.1 Visual Testing
- [ ] Test all button states (hover, active, disabled, loading)
- [ ] Test on different screen sizes (320px to 4K)
- [ ] Test with different browsers (Chrome, Firefox, Safari, Edge)
- [ ] Screenshot regression testing

### 8.2 Interaction Testing
- [ ] Test keyboard navigation (Tab, Enter, Space, Escape)
- [ ] Test mouse interactions
- [ ] Test touch interactions
- [ ] Test with screen readers (NVDA, JAWS, VoiceOver)

### 8.3 Performance Testing
- [ ] Measure animation performance (60fps)
- [ ] Check CSS bundle size
- [ ] Optimize animations with will-change
- [ ] Test on low-end devices

### 8.4 Cross-browser Testing
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (macOS & iOS)
- [ ] Edge
- [ ] Mobile browsers

---

## 📦 Deliverables Checklist

### Code
- [ ] Updated sidepanel HTML (index.html)
- [ ] New/updated CSS files (modular structure)
- [ ] Updated JavaScript (ui.js, menu files)
- [ ] Design tokens in CSS variables
- [ ] Light mode support

### Documentation
- [ ] DESIGN-SYSTEM.md
- [ ] Component documentation
- [ ] Migration guide (if breaking changes)
- [ ] Accessibility checklist

### Assets
- [ ] Icon set (consistent style)
- [ ] Design mockups
- [ ] Brand guidelines

### Quality Assurance
- [ ] Accessibility audit report
- [ ] Cross-browser testing report
- [ ] Performance metrics

---

## 🚀 Implementation Timeline Estimate

| Phase | Estimated Hours | Priority |
|-------|-----------------|----------|
| 1. Design & Concept | 16-20h | HIGH |
| 2. Technical Implementation | 24-32h | HIGH |
| 3. Animation & Interactions | 12-16h | MEDIUM |
| 4. Mobile Responsiveness | 8-12h | MEDIUM |
| 5. Theme & Branding | 8-12h | MEDIUM |
| 6. Accessibility | 12-16h | HIGH |
| 7. Documentation | 8-12h | MEDIUM |
| 8. Testing & QA | 16-24h | HIGH |
| **TOTAL** | **104-144 hours** | - |

---

## 👥 Team Assignment Recommendations

### UI/Design
- [ ] Designer Lead: Mockups & Design System
- [ ] Designer: Accessibility & responsive design

### Frontend Development
- [ ] Senior Frontend: Sidepanel refactor & architecture
- [ ] Frontend: Button components & styling
- [ ] Frontend: Animation & interactions
- [ ] Frontend: Mobile responsiveness

### QA & Testing
- [ ] QA Lead: Testing strategy & documentation
- [ ] QA: Cross-browser & device testing
- [ ] QA: Accessibility testing

---

## 📝 Files to Update/Create

### New Files
```
UI-REDESIGN-TODO.md (this file)
DESIGN-SYSTEM.md
designs/sidepanel-mockups.fig (or link)
styles/components/sidepanel-redesign/
  ├── _layout.css
  ├── _buttons.css
  ├── _colors.css
  ├── _animations.css
  └── _responsive.css
scripts/ui-components/
  ├── button.js
  ├── toolbar.js
  └── menu-manager.js
```

### Files to Update
```
index.html
scripts/ui.js
scripts/ui.presets.menu.js
scripts/ui.passstyle.menu.js
scripts/ui.erase.menu.js
styles/main.css
styles/light-mode.css
styles/components/toolbar.css
styles/components/presets.css
DESIGN-SYSTEM.md (create if doesn't exist)
```

---

## ✅ Success Criteria

- [ ] All buttons are visually cohesive and modern
- [ ] Spacing is consistent (using established grid)
- [ ] Animations are smooth and under 200ms where possible
- [ ] 100% keyboard navigable
- [ ] WCAG AA compliant (min)
- [ ] Mobile responsive (320px to 4K)
- [ ] Works in all modern browsers
- [ ] Team is happy with the new design
- [ ] No performance degradation
- [ ] Documentation is complete and clear

---

## 🔗 References

- [Material Design Buttons](https://material.io/components/buttons)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Modern CSS Grid](https://web.dev/css-grid/)
- [Web Animations Best Practices](https://web.dev/animations/)
- [Responsive Web Design](https://web.dev/responsive-web-design-basics/)

---

## 📅 Sprint Planning Notes

- Recommend breaking into 2-week sprints
- Phase 1 & 6 should happen in parallel (design + accessibility review)
- Phase 2 can start after Phase 1 mockups approved
- Phase 3-5 happen simultaneously with Phase 2
- Phase 7-8 happen during final sprint
- Buffer 20% time for feedback iterations

---

**Last Updated**: 2025-11-09
**Status**: Ready for Team Review
**Next Steps**: Schedule design kickoff meeting with team
