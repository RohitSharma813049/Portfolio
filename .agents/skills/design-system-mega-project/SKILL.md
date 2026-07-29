---
name: design-system-mega-project
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# Mega Project

## Mission
Deliver implementation-ready design-system guidance for Mega Project that can be applied consistently across e-commerce storefront interfaces.

## Brand
- Product/brand: Mega Project
- URL: https://themeforest.net/item/mega-project-construction-company-wp-theme/10620770
- Audience: online shoppers and consumers
- Product surface: e-commerce storefront

## Style Foundations
- Visual style: structured, accessible, implementation-first
- Main font style: `font.family.primary=Helvetica Neue`, `font.family.stack=Helvetica Neue, Helvetica, Arial, sans-serif`, `font.size.base=14px`, `font.weight.base=400`, `font.lineHeight.base=21px`
- Typography scale: `font.size.xs=0px`, `font.size.sm=10px`, `font.size.md=12px`, `font.size.lg=13px`, `font.size.xl=14px`, `font.size.2xl=15px`, `font.size.3xl=16px`, `font.size.4xl=18px`
- Color palette: `color.text.primary=#0084b4`, `color.text.secondary=#ffffff`, `color.text.tertiary=#666666`, `color.text.inverse=#545454`, `color.surface.base=#000000`, `color.surface.raised=#82b440`, `color.surface.strong=#333333`
- Spacing scale: `space.1=1px`, `space.2=2px`, `space.3=3px`, `space.4=4px`, `space.5=5px`, `space.6=6px`, `space.7=7.5px`, `space.8=8px`
- Radius/shadow/motion tokens: `radius.xs=2px`, `radius.sm=3.75px`, `radius.md=4px`, `radius.lg=7px`, `radius.xl=8px`, `radius.2xl=30px` | `shadow.1=rgb(168, 168, 168) 0px 2px 0px 0px`, `shadow.2=rgb(111, 154, 55) 0px 2px 0px 0px` | `motion.duration.instant=150ms`, `motion.duration.fast=200ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
concise, confident, implementation-focused

## Rules: Do
- Use semantic tokens, not raw hex values in component guidance.
- Every component must define required states: default, hover, focus-visible, active, disabled, loading, error.
- Responsive behavior and edge-case handling should be specified for every component family.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and tokens.
3. Define component anatomy, variants, and interactions.
4. Add accessibility acceptance criteria.
5. Add anti-patterns and migration notes.
6. End with QA checklist.

## Required Output Structure
- Context and goals
- Design tokens and foundations
- Component-level rules (anatomy, variants, states, responsive behavior)
- Accessibility requirements and testable acceptance criteria
- Content and tone standards with examples
- Anti-patterns and prohibited implementations
- QA checklist

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Prefer system consistency over local visual exceptions.

<!-- TYPEUI_SH_MANAGED_END -->
