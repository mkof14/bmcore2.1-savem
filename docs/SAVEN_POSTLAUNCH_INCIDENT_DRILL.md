# SAVEN Post-Launch Incident Drill

This drill is for the first live operating window after SAVEN promotion. It proves that SAVEN can notice, contain, and route a support incident without creating unsafe automation or noisy escalation.

## Drill Scope

- production route visible;
- command rail visible;
- Admin Ops visible;
- alert route visible;
- worker handoff visible;
- robot gate still approval-only;
- emergency gate still non-automatic;
- privacy redaction still active;
- rollback owner ready.

## Drill Scenario

Run one simulated support incident:

- nurse follow-up requested;
- device proof delayed;
- caregiver unavailable;
- robot readiness asked but physical action locked;
- emergency rules displayed but external dispatch blocked.

## Operator Checks

- Admin Ops shows event audit;
- command permission review remains visible;
- worker shift board keeps human ownership;
- SLO posture names any blocked state;
- alerting names the route owner;
- no external dispatch occurs automatically.

## Hold Conditions

Hold launch if:

- Admin Ops cannot show the incident;
- emergency route appears automatic;
- robot action appears automatic;
- privacy redaction is missing;
- rollback owner is not present;
- event audit is not visible.

## Operator Command

```zsh
npm run incident-drill:saven
```
