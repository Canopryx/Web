# Enhancements Implementation Plan

## Objective

Implement a focused set of visual and interaction enhancements for the Canopryx site while preserving the current design direction. The work should feel deliberate, restrained, and product-specific rather than generic animated marketing polish.

Enhancements to complete:

- Footer transition.
- Button signal pulse.
- Early-access form progress rail.
- Functional radar.
- Trust-boundary visualization.
- Fix subtle button/icon overlay artifacts around navbar notch elements.

## Branch Setup

1. Inspect the current worktree before changing anything:

   ```sh
   git status --short
   git branch --show-current
   ```

2. Preserve all existing uncommitted work. Do not reset, checkout away, or discard user changes.

3. Switch to an `enhancements` branch:

   ```sh
   git switch enhancements
   ```

   If the branch does not exist:

   ```sh
   git switch -c enhancements
   ```

4. If switching branches would overwrite local changes, stop and ask for direction.

5. After switching, run:

   ```sh
   bun run check
   ```

## Visual Audit Priority

Use the visual audit process in this order:

1. Chrome Skill.
2. Browser Connector.
3. Computer Use Skill.

Before finalizing, audit the site visually in desktop and mobile widths. Check hover states, focus states, reduced-motion behavior, Astro navigation, and layout overflow.

## GitHub Workflow Priority

If GitHub work becomes necessary, use this order:

1. `git` command.
2. `gh` command.
3. GitHub Connector Skill.

Assume configuration is already done. Escalate privileges for commands that need access to refs, remotes, or authenticated GitHub operations.

## 1. Navbar Overlay Artifact Fix

### Problem

The decorative frame/notch elements are visually bleeding over navbar content. This creates small dark overlays on the opposite end of nav items, especially around the `Contact` button and the logo/avatar area.

### Likely Cause

Frame-corner or notch pseudo-elements are stacked above actual navbar content. The shimmer overlay on the contact CTA may also make the artifact more noticeable.

### Implementation

- Inspect `src/styles/global.css` and the header component used for the navbar.
- Ensure navbar content sits above decorative notch/corner layers.
- Add an explicit stacking context to the navbar shell if needed:

  ```css
  .site-nav-shell {
    isolation: isolate;
  }

  .navbar {
    position: relative;
    z-index: 3;
  }

  .site-nav-shell__corner,
  .site-nav-shell::before,
  .site-nav-shell::after {
    z-index: 1;
    pointer-events: none;
  }
  ```

- Do not remove the Canopryx frame language. Fix the stacking, not the concept.
- Remove or replace any infinite shimmer overlay on `.navbar__cta::before` if it contributes to the visual bug.
- Confirm the artifact is gone at desktop widths around `1024px`, `1280px`, `1440px`, and `1600px`.

## 2. Button Signal Pulse

### Goal

Make primary CTAs feel alive without adding generic glow spam.

### Implementation

- Add a restrained one-shot signal pulse to `.btn-primary` and the landing hero CTA.
- The pulse should feel like a secure transmission or readiness signal.
- Prefer a short expanding ring, subtle arrow movement, or contained edge sweep.
- Avoid permanent looping animation.
- Avoid large glow halos.
- Avoid purple/blue SaaS-gradient defaults.
- Respect reduced motion:

  ```css
  @media (prefers-reduced-motion: reduce) {
    .btn-primary::after {
      animation: none;
    }
  }
  ```

### Acceptance Criteria

- Primary CTA has a distinctive but restrained interaction.
- Hover/focus states remain clear.
- Keyboard focus is still obvious.
- No layout shift.

## 3. Early-Access Form Progress Rail

### Goal

Make the two-column early-access questionnaire feel more intentional and easier to complete.

### Files

- `src/pages/early-access.astro`
- `src/styles/global.css`, if shared styles are appropriate.

### Implementation

- Keep the existing two-column questionnaire layout.
- Add a vertical progress rail on desktop and a compact horizontal rail on mobile.
- Group fields into three stages:

  ```text
  Your details
  Environment
  Priorities
  ```

- Suggested grouping:

  ```text
  Your details:
  Name, Work email, Organization, Role/title

  Environment:
  Industry, Company size, Current secrets setup

  Priorities:
  What are you trying to protect?, Additional message
  ```

- Use `IntersectionObserver` or form focus events to update the active stage.
- Allow clicking a stage to scroll to its field group.
- Use `aria-current="step"` on the active stage.
- Preserve validation, honeypot, loading state, and successful redirect behavior.
- Avoid adding extra required fields.

### Acceptance Criteria

- Progress rail reflects the active field group.
- Works with keyboard navigation.
- Mobile layout remains clean and does not crowd the form.
- No recipient email address is shown in the UI.

## 4. Functional Radar

### Goal

Turn the existing radar visual into a useful product explanation instead of purely decorative motion.

### Files

- `src/components/RadarEffect.astro`
- Any page that renders the radar.

### Implementation

- Convert hardcoded radar items into a small data array.
- Make radar nodes interactive buttons.
- Add a details panel that updates when a node is selected.
- Use concise, concrete content. Avoid vague labels like "enterprise-grade" without context.
- Suggested node examples:

  ```text
  Zero Trust: Every request is verified before secrets move.
  Air-Gapped: No dependency on public cloud storage paths.
  Post-Quantum: Cryptographic posture designed for long-term exposure.
  Key Rotation: Rotation events are visible and auditable.
  On-Premises: Secrets stay inside controlled infrastructure.
  Secure Enclave: Sensitive operations happen inside hardened boundaries.
  No Cloud DB: No hosted database becomes the central failure point.
  ```

- On selection, show a detection pulse or trace line from center to node.
- Keep the radar usable without JavaScript by rendering a sensible default selected item.
- Respect reduced motion by disabling spin/sweep animations while keeping content visible.

### Acceptance Criteria

- Radar communicates real product concepts.
- Nodes are keyboard-accessible.
- Selected state is visually obvious.
- Details panel updates reliably.
- Existing page rhythm is not disrupted.

## 5. Trust-Boundary Visualization

### Goal

Add a signature visual that explains Canopryx's product stance: secrets remain inside a controlled boundary, approved actors pass, unnecessary cloud exposure is blocked.

### Files

- Create `src/components/TrustBoundary.astro`.
- Add it to `src/pages/index.astro`, likely below the hero.
- Add styles in the component or `src/styles/global.css`, following existing project conventions.

### Visual Direction

Build a compact diagram with a strong product metaphor:

- A protected boundary ring or slab.
- Inside: `Secrets`, `Encrypted Store`, `Audit Trail`.
- Approved paths: `Operators`, `Workloads`.
- Outside or blocked: `Public Cloud DB`, `Leaked Token`, or `Unknown Request`.
- Use short animated packets or trace lines to show allowed and denied movement.

### Implementation Notes

- Use semantic HTML and accessible labels.
- Do not rely only on color to show allowed/blocked states.
- Keep copy restrained and technical.
- Avoid floating generic security icons.
- Avoid meaningless particle effects.
- Use the existing Canopryx palette and frame language.
- Respect reduced motion.

### Acceptance Criteria

- The visualization makes the security model easier to understand within five seconds.
- It feels specific to Canopryx rather than a generic cybersecurity landing-page graphic.
- It is responsive and does not overflow on mobile.

## 6. Footer Transition

### Goal

Make the footer arrival feel intentional while preserving the clean dark-frame continuity.

### Files

- `src/components/SiteFooter.astro`
- `src/styles/global.css`

### Implementation

- Add an `IntersectionObserver` reveal for the large footer wordmark or footer groups.
- Prefer a quiet mask/clip reveal, slight tracking settle, or top-edge transition.
- Avoid heavy shadows that recreate the removed downward shadow issue.
- Avoid making the frame and footer accidentally look like mismatched colors unless explicitly intended by design tokens.
- Preserve footer sizing and avoid cumulative layout shift.
- Handle Astro page swaps safely:

  ```js
  document.addEventListener("astro:page-load", initFooterReveal);
  ```

- Guard against duplicate observers/listeners.
- Respect reduced motion by rendering the final state immediately.

### Acceptance Criteria

- Footer transition is visible but not distracting.
- No seam, shadow, or color mismatch is introduced.
- Footer still works after Astro client-side navigation.

## 7. Code Quality Requirements

- Keep styles specific and maintainable.
- Avoid adding large dependencies.
- Prefer CSS and small vanilla JS over framework-heavy solutions.
- Do not introduce "AI slop" copy, badges, or generic marketing phrases.
- Preserve the existing early-access and contact form behavior.
- Do not expose `contact@canopryx.com` on the early-access page.
- Do not create a dedicated thank-you route.
- Do not revert user changes.

## 8. Verification

Run these checks:

```sh
bun run check
bun run build
git diff --check
```

Manually verify:

- Landing hero still has one primary early-access CTA.
- Early-access form validation still works.
- Required fields still block submission.
- Honeypot behavior still blocks bots.
- Business-email validation still rejects dummy, disposable, and common personal domains.
- API failure state still appears.
- Loading state still works.
- Successful early-access submission still redirects home with the one-time thank-you card.
- Existing contact form still submits through the original contact flow.
- Navbar artifact is gone on the contact button and logo area.
- Button signal pulse does not loop obnoxiously.
- Radar nodes work by mouse and keyboard.
- Form progress rail updates correctly.
- Footer transition does not create a seam or shadow.
- Reduced-motion mode remains usable.
- No desktop or mobile horizontal overflow.

## 9. Final Handoff

At completion, provide:

- A concise summary of implemented enhancements.
- Verification commands run and their results.
- Any residual risks or follow-up recommendations.
- The active branch name.
