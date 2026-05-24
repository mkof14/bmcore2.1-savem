# SAVEN Visual Acceptance

SAVEN should not feel like a generic software dashboard. It is an operating surface for real support: human care, voice commands, devices, robots, escalation, verification, and calm daily action.

## Product-Specific Interface Rules

- Keep SAVEN dark-operational by default. Cards should not drift into large white blocks that break the care-ops atmosphere.
- Use warm status accents only when they mean something: support active, verified, waiting, escalation, emergency, robot/device gate, or admin review.
- The voice command rail is a functional operating belt, not a marketing banner.
- The mic level indicator must stay compact and feel like a real status signal, not a decorative placeholder.
- Text under section names should be shorter than ordinary site copy. SAVEN should speak calmly and directly.
- Primary actions should feel like support commands: Begin, Open mic, Open service, All commands, Review, Verify, Escalate.
- Light theme must keep icons and labels readable. White icons on pale surfaces and low-contrast gray text are visual blockers.

## Screen Acceptance Targets

### Start

- Shows SAVEN as a real support system, not a landing page.
- Keeps the voice command rail visible without covering the page.
- Uses dark panels with clear support milestones.

### Today

- Daily support information is scannable.
- Care contacts do not overlap.
- Voice command access is visible from the working screen.

### Commands

- Command targets are obvious: caregiver, nurse, doctor, robot, device, emergency.
- Examples are short and usable.
- It feels like an operating console for SAVEN, not a text-heavy help page.

### Settings

- Voice and command settings are readable in both themes.
- Controls stay compact.
- No large white card blocks should dominate the SAVEN surface.

### Admin Ops

- Monitoring, event audit, incident posture, persistence, and command review are visible as operational evidence.
- Admin can connect SAVEN state to BioMath Core without forcing SAVEN to lose its own identity.

## Visual Release Checks

Run:

```zsh
npm run visual:saven
```

The audit checks for SAVEN-specific interface markers, command rail language, light-theme contrast guardrails, dark surface guardrails, and operator-facing screen coverage.
