# Architecture Discovery — Implemented 12-Level Input Checklist

This file reflects the questions currently implemented in the input form.

## Level 1 — Engagement Context
- Stakeholder role
- Discovery mode
- Planning depth
- System classification

## Level 2 — Business & Value Architecture
- Project name
- Target launch date
- Problem statement
- Solution summary
- Primary objective
- Success KPI
- Monetization/value model
- Entitlement/pricing/proration/refund toggles
- Competitive positioning (multi-select)

## Level 3 — Core Domain Modeling
- Core business entities (list)
- Ownership/approval/audit notes
- Lifecycle states
- Transition mode
- Lifecycle complexity
- Transition behavior toggles
- Workflow characteristics (multi-select)

## Level 4 — Risk, Compliance & Regulation
- Economic sensitivity (24h outage impact)
- Compliance frameworks (multi-select, includes FedRAMP)
- Data sensitivity (multi-select)
- Security/compliance control toggles

## Level 5 — Financial & Transaction Integrity (Conditional)
- Financial logic toggle
- Transaction model
- Audit requirement

## Level 6 — Data Architecture Characteristics
- Data structure type
- Data volume
- Retention policy
- Consistency requirement
- Data residency

## Level 7 — Scale & Load Modeling
- User projection (launch / 12-month / 36-month)
- Traffic pattern
- Peak concurrency
- Compute & processing needs (multi-select)
- Request characteristics (multi-select)

## Level 8 — Integration & Ecosystem
- External integrations (multi-select)
- API exposure model

## Level 9 — Intelligence & Advanced Processing
- Advanced capabilities (multi-select)
- Processing model (multi-select)
- AI capability toggle + AI governance fields

## Level 10 — Security Architecture
- Authentication expectations (multi-select)
- Authorization expectations (multi-select)
- Threat profile (multi-select)

## Level 11 — Operational Resilience
- Availability target
- RTO
- RPO
- Observability requirements (multi-select)
- Failure mode philosophy:
	- Graceful degradation required
	- Read-only mode acceptable
	- Background jobs can delay
	- Analytics can lag

## Level 12 — Infrastructure Constraints & Evolution
- Hosting preference
- Monthly infrastructure budget
- Cost sensitivity index (cost-first / balanced / performance-first)
- Cold start sensitivity
- Team capability modeling:
	- Team maturity level
	- Team seniority level
	- DevOps maturity level
	- In-house security expertise level
- Migration & legacy pressure:
	- Existing production data
	- Migration required
	- Backward compatibility required
	- Legacy integration required
- Expected lifespan
- Strategic architecture intent

---

## Technical Mode Conditional Level

When **Technical Mode** is selected, an additional deep-dive level is shown:
- Database
- ORM
- API versioning
- Tenant isolation model
- Auth/session model
- Cache controls
- Contradiction advisory (e.g., MongoDB vs strong relational pressure)

---

## Deterministic Modeling Layers

- Conflict Severity Model:
	- Soft
	- Moderate
	- Severe
	- Blocking
- Derived Signals Layer:
	- Complexity Index
	- Regulatory Burden Index
	- Financial Integrity Index
	- Scalability Pressure Index
	- Operational Risk Index

---

## Testing Presets (Implemented in UI)

- Founder MVP
	- Small early-stage team, cost-first, simple payments, no compliance frameworks.
- Regulated Financial
	- Technical mode, migration + backward compatibility, ledger + double-entry, SOC2/PCI profile.
- Scale + AI
	- High concurrency growth profile, AI + streaming processing, performance-first bias.
