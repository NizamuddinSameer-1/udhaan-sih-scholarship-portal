---
name: mengto-design-craft
description: Advanced visual design and UI craft skill inspired by Meng To (DesignCode). Enforces crisp border-line layouts (container-lines, Linear/Apple aesthetic), multi-layered diffuse ambient shadows (beautiful-shadows), tabular-num financial typography (number-details), and design-first interaction specs. Use when refining frontend aesthetics, borders, shadows, cards, micro-interactions, or financial numbers.
---

# Meng To Design Craft: Linear & Apple Aesthetic Guidelines

## Overview
Replaces generic "AI aesthetic" (heavy purple gradients, rounded-everything, muddy drop shadows) with crisp, high-density, production-grade visual craft:
1. **Container Lines**: Precision hairline borders and inner bevel highlights.
2. **Beautiful Shadows**: Multi-layered, diffuse, ambient elevation.
3. **Number Details**: Tabular numerals, currency hierarchy, and financial density.
4. **Design-First Prompting**: Micro-interactions, spring transitions, and contrast balance.

---

## 1. Container Lines (Crisp Border-Line Layouts)

### The Problem
AI-generated cards often rely on blurry drop shadows and high-saturation backgrounds, which looks unpolished on modern OLED displays.

### The Solution: 1px Hairline Borders + Inset Light Reflection
```css
/* Linear / Apple Style Card */
.card-linear {
  background: rgba(18, 24, 38, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 
    inset 0 1px 0 0 rgba(255, 255, 255, 0.12), /* Subtle top edge reflection */
    0 1px 2px 0 rgba(0, 0, 0, 0.3),
    0 4px 12px -2px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 12px; /* Forbid rounded-2xl on interior widgets */
}

.card-linear:hover {
  border-color: rgba(255, 255, 255, 0.16);
  box-shadow: 
    inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
    0 8px 24px -4px rgba(0, 0, 0, 0.35);
  transform: translateY(-2px);
}
```

### Grid Lines & Section Dividers
Use hairline dividers (`1px solid rgba(255, 255, 255, 0.06)`) instead of heavy background differences to structure dense information.

---

## 2. Beautiful Shadows (Multi-Layered Ambient Depth)

### The Principle
Natural light produces multiple layers of shadow: a crisp contact shadow, a soft ambient spread, and a diffuse distance drop. Never use a single harsh `0 4px 6px rgba(0,0,0,0.5)`.

```css
/* Elevation 1: Subtle Badges & Chips */
--shadow-elevation-1: 
  0 1px 2px rgba(0, 0, 0, 0.2),
  0 2px 4px rgba(0, 0, 0, 0.1);

/* Elevation 2: Floating Cards & Dropdowns */
--shadow-elevation-2: 
  0 1px 3px rgba(0, 0, 0, 0.25),
  0 6px 16px -2px rgba(0, 0, 0, 0.3),
  0 12px 28px -6px rgba(0, 0, 0, 0.35);

/* Elevation 3: Modals & Dialogs */
--shadow-elevation-3: 
  0 2px 6px rgba(0, 0, 0, 0.3),
  0 12px 32px -4px rgba(0, 0, 0, 0.45),
  0 24px 64px -12px rgba(0, 0, 0, 0.55);

/* Colored Glow Shadows (Accent Matching) */
--glow-gold: 0 0 20px -4px rgba(245, 158, 11, 0.45);
--glow-emerald: 0 0 20px -4px rgba(16, 185, 129, 0.45);
--glow-purple: 0 0 20px -4px rgba(168, 85, 247, 0.45);
```

---

## 3. Number Details (Financial & Metric Typography)

### Rules for Financial and Counter Displays
1. **Always use Tabular Numerals**: `font-variant-numeric: tabular-nums;` prevents numbers from jumping/shifting when values refresh or animate.
2. **Tri-Level Information Hierarchy**:
   - **Label**: Uppercase, 0.72rem–0.78rem, letter-spacing 0.05em, text-muted (`#94a3b8`).
   - **Primary Metric**: Bold 1.25rem–1.5rem, high contrast (`#f8fafc`), prominent currency symbol.
   - **Conversion / Subtext**: 0.8rem–0.85rem, contextual color (emerald for earnings, amber for escrow, crimson for deductions).
3. **Coin Badges & Price Alignment**: Icons (`🪙`, `$`, `₹`) must be vertically aligned with the baseline, not floating or misaligned.

```css
.metric-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.metric-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
}

.metric-value {
  font-family: var(--font-display, -apple-system, sans-serif);
  font-size: 1.35rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: #f8fafc;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.metric-subtext {
  font-size: 0.82rem;
  color: #64748b;
  font-variant-numeric: tabular-nums;
}
```

---

## 4. Micro-Interactions & Spring Transitions

- Standard transition curve: `cubic-bezier(0.16, 1, 0.3, 1)` (Apple standard decelerate curve).
- Interactive buttons: Fast tactile feedback on active state (`transform: scale(0.98)`).
- Never animate width/height directly; use `transform` and `opacity` to maintain 60 FPS GPU-accelerated rendering.
- For users with `prefers-reduced-motion: reduce`, disable translations and scale effects.
