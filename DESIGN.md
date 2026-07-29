---
name: DeskNomads Design System
description: Sleek Dark Tech visual language for creators, developers, and remote professionals.
colors:
  primary: "#3B82F6"
  accent: "#60A5FA"
  neutral-bg: "#050505"
  neutral-text: "#FFFFFF"
  neutral-secondary: "#8892B0"
  neutral-muted: "#5E6A78"
  border: "#FFFFFF0d"
typography:
  display:
    fontFamily: "Geist, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Geist, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "8px"
  md: "16px"
  lg: "32px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  card:
    backgroundColor: "{colors.neutral-bg}"
    rounded: "{rounded.md}"
    padding: "24px"
---

# Design System: DeskNomads

## 1. Overview

**Creative North Star: "The Digital Hub Glow"**

DeskNomads utilizes a high-end, developer-oriented "Sleek Dark Tech" aesthetic. Spacing is comfortable, visual hierarchy is sharp, and components emphasize depth and contrast. The layout rejects SaaS-cream templates and generic, un-tinted grays. Instead, surfaces are styled in OLED dark colors with deep ambient gradients and responsive, hairline border glows.

**Key Characteristics:**
- OLED Black canvas tinted with deep brand hue.
- Low-contrast, legible secondary typography.
- Restricted use of colorful radial glow points to signify premium interactivity.
- Sharp, hairline-thin borders using transparent white overlays.

## 2. Colors

A committed dark-first palette prioritizing readability and premium contrast under low light.

### Primary
- **Vibrant Blue** (#3B82F6): Primary accent, navigation focus, and call-to-actions.

### Secondary
- **Ethereal Light Blue** (#60A5FA): Supporting glow color, icons, and highlight borders.

### Neutral
- **OLED Black** (#050505): Canvas background.
- **Pure White** (#FFFFFF): Dominant heading text.
- **Muted Steel** (#8892B0): Body copy and meta details.
- **Deep Steel** (#5E6A78): Border strokes, inactive states, and tags.

### Named Rules
**The Rarity Rule.** Colorful accents must occupy no more than 10% of any viewport's visual weight. The background and neutrals carry the weight; accents provide the destination.

## 3. Typography

**Display Font:** Geist Sans (with system fallback)
**Body Font:** Geist Sans (with system fallback)
**Label/Mono Font:** Geist Mono

### Hierarchy
- **Display** (800, clamp(2.5rem, 6vw, 4.5rem), 1): Main page titles and hero headers.
- **Headline** (700, 1.875rem, 1.2): Section headings.
- **Title** (600, 1.25rem, 1.3): Component/Card headers.
- **Body** (400, 0.875rem, 1.6): Standard articles and meta descriptions. Column width capped at 75ch.
- **Label** (500, 0.75rem, 1): Tags, labels, category titles.

## 4. Elevation

Depth is conveyed through semi-transparent backgrounds and nested inner borders rather than heavy drop shadows.

### Shadow Vocabulary
- **Interactive Glow** (0 0 40px rgba(59, 130, 246, 0.15)): Radial atmospheric light on interactive containers.
- **Inner Rim Bezel** (inset 0 1px 1px rgba(255, 255, 255, 0.08)): Highlight on top of cards to simulate a light source.

### Named Rules
**The Glass Edge Rule.** Shadows should not bleed out of glass cards; depth is created using inner borders (`border-white/[0.04]`) and background contrast changes on hover.

## 5. Components

### Buttons
- **Shape:** Pill-shaped (rounded-full).
- **Primary:** Background (#3B82F6), text (#050505), padding (12px 24px).
- **Hover:** Slight opacity reduction, micro-scale transform (98%).

### Cards / Containers
- **Corner Style:** Soft rounded corners (16px / 32px radius).
- **Background:** Semi-transparent OLED (#0a0a0a with blur).
- **Border:** Thin hairline border (1px solid rgba(255, 255, 255, 0.06)).
- **Internal Padding:** Spacing md (16px) or xl (32px).

### Navigation
- **Style:** Fixed top header (80px), glass background with blur, hairline bottom border.

## 6. Do's and Don'ts

### Do:
- **Do** wrap primary heading strings cleanly to balance lines using `text-wrap: balance`.
- **Do** keep text-contrast ratios above 4.5:1 on muted text by using `--dn-text-secondary` (#8892B0) instead of darker grays.

### Don't:
- **Don't** use solid side-stripe borders (e.g., `border-left-4`) as accents. Use a leading icon or clean layouts instead.
- **Don't** use generic default system sans-serif fonts; ensure Geist variable font loads correctly.
- **Don't** use gradient text for key information. Keep headings clean and solid white.
