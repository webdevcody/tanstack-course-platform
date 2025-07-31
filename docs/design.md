# Learning Platform Design System

## 🎨 Overview

This document outlines the comprehensive design system used for the learning platform redesign, focusing on modern UX principles, accessibility, and visual consistency.

## 🌈 Color Palette

### Primary Theme Colors

- **Theme Green**: `#22c55e` (Primary brand color)
- **Theme Green Dark**: `#16a34a` (Hover states, emphasis)
- **Theme Green Light**: `#4ade80` (Accents, highlights)

### Color Scale

```css
--color-theme-50: #f0fdf4 /* Lightest background */ --color-theme-100: #dcfce7
  /* Light backgrounds */ --color-theme-200: #bbf7d0 /* Subtle backgrounds */
  --color-theme-300: #86efac /* Light accents */ --color-theme-400: #4ade80
  /* Medium accents */ --color-theme-500: #22c55e /* Primary brand */
  --color-theme-600: #16a34a /* Hover states */ --color-theme-700: #15803d
  /* Active states */ --color-theme-800: #166534 /* Dark backgrounds */
  --color-theme-900: #14532d /* Darkest backgrounds */
  --color-theme-950: #052e16 /* Darkest accents */;
```

### Semantic Colors

- **Success**: `#22c55e` (Green theme)
- **Warning**: `#f59e0b` (Amber for premium content)
- **Error**: `#ef4444` (Red for destructive actions)
- **Info**: `#3b82f6` (Blue for informational content)

## 🎭 Design Tokens

### Typography

- **Font Family**: Inter (Primary), system-ui (Fallback)
- **Font Weights**: 100-900 (Full range available)
- **Line Heights**: Optimized for readability
- **Text Sizes**: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl

### Spacing

- **Base Unit**: 4px (0.25rem)
- **Custom Spacing**: 18 (4.5rem), 88 (22rem), 128 (32rem)
- **Component Spacing**: Consistent 4px grid system

### Border Radius

- **Small**: `calc(var(--radius) - 4px)`
- **Medium**: `calc(var(--radius) - 2px)`
- **Large**: `var(--radius)` (0.5rem)
- **Extra Large**: `calc(var(--radius) + 4px)`

## 🧩 Component Patterns

### Button Variants

- **Primary**: `btn-gradient` (Green gradient with glow effects)
- **Secondary**: `variant="outline"` (Bordered with hover states)
- **Ghost**: `variant="ghost"` (Minimal with hover effects)
- **Destructive**: `variant="destructive"` (Red for dangerous actions)

### Navigation Design

- **Width**: 256px (w-64) - Reduced from 320px for better content visibility
- **Padding**: Compact spacing (p-3, p-4) instead of larger padding
- **Icons**: Smaller sizes (h-3 w-3, h-4 w-4) for better density
- **Progress Indicators**: Circular progress with theme colors

## ✨ Animation System

### Transitions

- **Duration**: 200ms, 300ms, 500ms (Consistent timing)
- **Easing**: `ease-out` for natural feel
- **Properties**: All, transform, opacity, colors

### Keyframe Animations

```css
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes slideUp {
  0% {
    transform: translateY(10px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes scaleIn {
  0% {
    transform: scale(0.95);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
```

### Animation Classes

- `.animate-fade-in`: Fade in with 0.5s duration
- `.animate-slide-up`: Slide up with 0.3s duration
- `.animate-scale-in`: Scale in with 0.2s duration
- `.animate-float`: Floating animation for decorative elements

## 🎯 Component-Specific Design

### Navigation Items

- **Module Cards**: Card-based layout with gradient backgrounds
- **Progress Circles**: SVG-based circular progress indicators
- **Status Icons**: Play/Check icons with theme-colored backgrounds
- **Premium Badges**: Amber-colored badges for premium content
- **Hover States**: Subtle color transitions and shadow effects

### Comment System

- **Card Layout**: Each comment in a module-card container
- **Avatar Design**: Gradient backgrounds with user initials
- **Reply System**: Nested cards with left border indicators
- **Form Design**: Expanding textarea with focus states
- **Action Buttons**: Theme-colored buttons with icons

### Video Player

- **Container**: Aspect-video with rounded corners and shadows
- **Loading States**: Animated play icon with spinner
- **Error States**: Clear messaging with themed colors
- **Controls**: Native video controls with custom styling

### Content Layout

- **Header Section**: Icon + title with metadata
- **Video Section**: Prominent video player with proper aspect ratio
- **Content Cards**: Markdown content in themed cards
- **Navigation**: Previous/Next buttons with gradient styling
- **Comments**: Discussion section with modern card design

## 🌙 Dark Mode Support

### Color Adaptations

- **Backgrounds**: Dark grays instead of whites
- **Borders**: Darker border colors for contrast
- **Text**: Lighter text colors for readability
- **Accents**: Adjusted theme colors for dark backgrounds

### Dark Mode Classes

```css
.dark {
  --background: 224 71% 4%;
  --foreground: 213 31% 91%;
  --muted: 223 47% 11%;
  --border: 216 34% 17%;
  /* ... additional dark mode variables */
}
```

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px (md)
- **Tablet**: 768px - 1024px (md to lg)
- **Desktop**: > 1024px (lg)

### Navigation Behavior

- **Desktop**: Fixed sidebar (256px width)
- **Mobile**: Collapsible sidebar with overlay
- **Tablet**: Responsive sidebar with touch-friendly interactions

## 🎨 Visual Hierarchy

### Typography Scale

- **H1**: 3xl (1.875rem) - Page titles
- **H2**: xl (1.25rem) - Section headers
- **H3**: lg (1.125rem) - Subsection headers
- **Body**: base (1rem) - Main content
- **Small**: sm (0.875rem) - Secondary text
- **Caption**: xs (0.75rem) - Metadata

### Spacing System

- **Tight**: space-y-1 (0.25rem)
- **Normal**: space-y-2 (0.5rem)
- **Loose**: space-y-4 (1rem)
- **Extra Loose**: space-y-6 (1.5rem), space-y-8 (2rem)

## 🔧 Utility Classes

### Gradient Utilities

```css
.btn-gradient {
  @apply bg-gradient-to-r from-theme-500 to-theme-600 
         hover:from-theme-600 hover:to-theme-700 
         text-white shadow-lg hover:shadow-glow 
         transition-all duration-300;
}

.text-gradient {
  @apply bg-gradient-to-r from-theme-600 to-theme-500 
         bg-clip-text text-transparent;
}
```

### Shadow System

```css
.shadow-elevation-1: /* Subtle elevation */
.shadow-elevation-2: /* Medium elevation */
.shadow-elevation-3: /* High elevation */
.shadow-glow: /* Glow effect with theme color */
```

### Glass Effects

```css
.glass-card {
  @apply backdrop-blur-md bg-white/10 dark:bg-black/10 
         border border-white/20 dark:border-white/10;
}
```

## 🎯 Accessibility

### Color Contrast

- **Text**: Minimum 4.5:1 contrast ratio
- **Interactive Elements**: Minimum 3:1 contrast ratio
- **Theme Colors**: Tested for accessibility compliance

### Focus States

- **Visible Focus**: Ring indicators on all interactive elements
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader**: Proper ARIA labels and semantic HTML

### Motion Preferences

- **Reduced Motion**: Respects `prefers-reduced-motion`
- **Animation Duration**: Configurable based on user preferences

## 📋 Implementation Guidelines

### CSS Architecture

1. **Design Tokens**: CSS custom properties for consistency
2. **Utility Classes**: Tailwind utilities for rapid development
3. **Component Classes**: Specific classes for complex components
4. **Responsive Design**: Mobile-first approach

### Component Structure

1. **Container**: Outer wrapper with proper spacing
2. **Header**: Title, metadata, and actions
3. **Content**: Main content area with proper typography
4. **Actions**: Interactive elements with consistent styling

### Best Practices

- Use design tokens for colors and spacing
- Implement consistent hover and focus states
- Ensure proper contrast ratios
- Test across different screen sizes
- Maintain semantic HTML structure
- Provide loading and error states

---

_This design system ensures a cohesive, modern, and accessible learning experience while maintaining flexibility for future enhancements._
