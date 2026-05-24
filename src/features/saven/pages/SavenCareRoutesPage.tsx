import { useState } from 'react';
import { BellRing, HeartPulse, ShieldCheck, Siren, Stethoscope, Users } from 'lucide-react';
import { savenCareContacts } from '../services/savenLocalBackendGateway';

type Tone = 'blue' | 'gold' | 'green';

function StatusPill({ label, tone }: { label: string; tone: Tone }) {
  const color =
    tone === 'green'
      ? 'border border-emerald-200 bg-emerald-100 text-emerald-900 dark:border-emerald-300/30 dark:bg-slate-950/75 dark:text-emerald-100 dark:ring-1 dark:ring-emerald-300/25'
      : tone === 'gold'
        ? 'border border-amber-200 bg-amber-100 text-amber-900 dark:border-amber-300/30 dark:bg-slate-950/75 dark:text-amber-100 dark:ring-1 dark:ring-amber-300/25'
        : 'border border-blue-200 bg-blue-100 text-blue-900 dark:border-blue-300/30 dark:bg-slate-950/75 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/25';

  return <span className={'rounded-full px-4 py-2 font-semibold shadow-sm ' + color}>{label}</span>;
}

function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">{eyebrow}</p>
      <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">{title}</h2>
      <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-600 dark:text-slate-300">{text}</p>
    </section>
  );
}

function LayeredPanel({ title, text, items }: { title: string; text: string; items: string[] }) {
  return (
    <article className="rounded-3xl border border-white/70 bg-white/78 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-slate-950/58">
      <h4 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h4>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/20">{item}</span>
        ))}
      </div>
    </article>
  );
}

export function SavenCareRoutes() {
  const [selectedContactId, setSelectedContactId] = useState(savenCareContacts[0]?.id ?? '');
  const [routeReason, setRouteReason] = useState('Maya missed the confirmation window for assisted walking support.');
  const [routeSummary, setRouteSummary] = useState('Prepare context for Anna Roberts, active recovery task, latest device state, and verification requirement.');
  const [confirmationMode, setConfirmationMode] = useState<'prepare' | 'confirm'>('prepare');
  const routeTemplates = [
    {
      label: 'Missed medication',
      contactId: 'doctor-morris',
      reason: 'Medication support was not verified inside the expected window.',
      summary: 'Prepare clinical review context with medication task, caregiver status, family fallback, and latest verification log.',
    },
    {
      label: 'Care concern',
      contactId: 'nurse-grant',
      reason: 'Recovery action was delayed and needs a same-day care review.',
      summary: 'Attach active support task, open verification, mobility context, and caregiver availability.',
    },
    {
      label: 'Family handoff',
      contactId: 'family-daniel',
      reason: 'Caregiver window is ending and family fallback should be prepared.',
      summary: 'Send family-safe summary with current task, next action, and confirmation requirement.',
    },
    {
      label: 'Active caregiver',
      contactId: 'caregiver-maya',
      reason: 'Anna needs direct support for the current recovery task.',
      summary: 'Prepare caregiver route with task steps, device state, environment rules, and verification prompt.',
    },
    {
      label: 'Emergency ready',
      contactId: 'emergency-services',
      reason: 'Potential serious safety concern requires an emergency route to be prepared.',
      summary: 'Prepare emergency context only. Do not dispatch. Require explicit human confirmation.',
    },
  ];
  const auditTrail = [
    { label: 'Command composed', detail: 'Text route is ready for SAVEN command processing.', tone: 'blue' },
    { label: 'Context attached', detail: 'Person, task, environment, route reason, and verification state are visible.', tone: 'green' },
    { label: 'Safety checked', detail: selectedContactId === 'emergency-services' ? 'Emergency route is locked for human confirmation.' : 'Route can be prepared locally without real external dispatch.', tone: selectedContactId === 'emergency-services' ? 'red' : 'gold' },
  ];
  const selectedContact = savenCareContacts.find((contact) => contact.id === selectedContactId) ?? savenCareContacts[0];
  const selectedRouteCommand = selectedContact
    ? 'Hey SAVEN, prepare ' + selectedContact.role + ' route for Anna Roberts. Reason: ' + routeReason + ' Summary: ' + routeSummary
    : '';
  const structuredRequest = selectedContact
    ? {
        contactId: selectedContact.id,
        urgency: selectedContact.role === 'emergency' ? 'emergency' : selectedContact.role === 'doctor' ? 'clinical_review' : selectedContact.role === 'nurse' ? 'care_concern' : 'routine',
        reason: routeReason,
        summary: routeSummary,
        confirmation: selectedContact.role === 'emergency' ? 'human_required' : confirmationMode,
      }
    : null;

  const routeStyles = {
    caregiver: {
      icon: HeartPulse,
      label: 'Caregiver',
      action: 'Ask for direct support',
      className: 'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-300/25 dark:bg-emerald-500/10 dark:text-emerald-100',
    },
    family: {
      icon: Users,
      label: 'Family',
      action: 'Notify family fallback',
      className: 'border-blue-200 bg-blue-50 text-blue-950 dark:border-blue-300/25 dark:bg-blue-500/10 dark:text-blue-100',
    },
    nurse: {
      icon: BellRing,
      label: 'Nurse',
      action: 'Prepare care concern',
      className: 'border-cyan-200 bg-cyan-50 text-cyan-950 dark:border-cyan-300/25 dark:bg-cyan-500/10 dark:text-cyan-100',
    },
    doctor: {
      icon: Stethoscope,
      label: 'Doctor',
      action: 'Prepare clinical review',
      className: 'border-violet-200 bg-violet-50 text-violet-950 dark:border-violet-300/25 dark:bg-violet-500/10 dark:text-violet-100',
    },
    emergency: {
      icon: Siren,
      label: 'Emergency',
      action: 'Human confirmation required',
      className: 'border-red-200 bg-red-50 text-red-950 dark:border-red-300/25 dark:bg-red-500/10 dark:text-red-100',
    },
  } as const;

  const routeSteps = [
    { label: 'Reason', detail: 'SAVEN records what changed and why help is needed.' },
    { label: 'Context', detail: 'Person, task, environment, devices, and proof state travel together.' },
    { label: 'Route', detail: 'The responsible human path is prepared.' },
    { label: 'Confirm', detail: 'Sensitive routes wait at the human gate.' },
  ];

  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Care Routes" title="Escalation map: route the right human with context." text="Caregiver, family, nurse, doctor, and urgent paths all start from the same support packet. Local version only: no real messages or calls are sent." />

      <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_16%_16%,rgba(0,180,255,0.18),transparent_30%),radial-gradient(circle_at_86%_14%,rgba(255,178,54,0.18),transparent_28%),radial-gradient(circle_at_72%_88%,rgba(16,185,129,0.15),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.95),rgba(240,249,255,0.8),rgba(255,247,237,0.76))] p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[radial-gradient(circle_at_16%_16%,rgba(0,180,255,0.24),transparent_30%),radial-gradient(circle_at_86%_14%,rgba(255,178,54,0.15),transparent_28%),radial-gradient(circle_at_72%_88%,rgba(16,185,129,0.12),transparent_30%),linear-gradient(135deg,rgba(3,7,18,0.98),rgba(7,20,39,0.9),rgba(35,19,7,0.68))] dark:ring-1 dark:ring-white/10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Escalation map</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">One map for caregiver, family, clinical, and urgent paths.</h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">Every route carries reason, context, proof state, and the human gate.</p>
          </div>
          <StatusPill tone="gold" label="Local only" />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {routeTemplates.map((template) => (
            <button
              key={template.label}
              type="button"
              onClick={() => {
                setSelectedContactId(template.contactId);
                setRouteReason(template.reason);
                setRouteSummary(template.summary);
                setConfirmationMode(template.contactId === 'emergency-services' ? 'prepare' : 'confirm');
              }}
              className="rounded-full border border-white/70 bg-white/78 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-900 hover:shadow-lg dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-200 dark:hover:border-blue-300/25 dark:hover:bg-blue-500/10 dark:hover:text-blue-100"
            >
              {template.label}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-5">
          {savenCareContacts.map((contact) => {
            const style = routeStyles[contact.role];
            const Icon = style.icon;
            const isSelected = contact.id === selectedContactId;

            return (
              <button
                key={contact.id}
                type="button"
                onClick={() => setSelectedContactId(contact.id)}
                className={(isSelected ? 'scale-[1.02] shadow-xl ring-2 ring-current/25 ' : 'shadow-sm hover:-translate-y-1 hover:shadow-xl ') + style.className + ' rounded-3xl border p-4 text-left transition-all'}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/82 shadow-sm ring-1 ring-current/10 dark:bg-slate-950/70">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-white/75 px-3 py-1 text-xs font-semibold shadow-sm ring-1 ring-current/10 dark:bg-slate-950/65">{style.label}</span>
                </div>
                <h4 className="mt-4 text-lg font-semibold">{contact.name}</h4>
                <p className="mt-2 text-sm leading-6 opacity-80">{style.action}</p>
              </button>
            );
          })}
        </div>
      </section>

      {selectedContact && (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Route packet</p>
                <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{selectedContact.name}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{selectedContact.route}</p>
              </div>
              <StatusPill tone={selectedContact.role === 'emergency' ? 'gold' : 'green'} label={selectedContact.role === 'emergency' ? 'Needs confirmation' : 'Ready to prepare'} />
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <LayeredPanel title="Reachability" text={selectedContact.availability} items={['Current route state', selectedContact.responseTarget, 'No real external message sent']} />
              <LayeredPanel title="Route guardrails" text="SAVEN only allows practical reasons for each route." items={selectedContact.allowedReasons} />
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="rounded-3xl bg-slate-950 p-4 text-white shadow-inner ring-1 ring-white/10">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">Dispatch command</p>
                  <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-100 ring-1 ring-blue-300/20">Ready packet</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-200">{selectedRouteCommand}</p>
              </div>

              <div className="rounded-3xl border border-white/70 bg-[#f7f5f1] p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/70">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Confirmation mode</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {(['prepare', 'confirm'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setConfirmationMode(mode)}
                      disabled={selectedContact.role === 'emergency'}
                      className={(confirmationMode === mode ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/20' : 'bg-white text-slate-700 ring-1 ring-slate-100 hover:bg-blue-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-slate-800') + ' rounded-full px-4 py-2 text-sm font-semibold capitalize transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50'}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{selectedContact.role === 'emergency' ? 'Emergency remains human-confirmed only.' : 'Prepare saves the route; confirm simulates human approval in local mode.'}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="block rounded-3xl border border-white/70 bg-white/78 p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Need signal</span>
                <textarea
                  value={routeReason}
                  onChange={(event) => setRouteReason(event.target.value)}
                  className="mt-3 min-h-[104px] w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:focus:border-blue-300 dark:focus:ring-blue-300/10"
                />
              </label>
              <label className="block rounded-3xl border border-white/70 bg-white/78 p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Context attached</span>
                <textarea
                  value={routeSummary}
                  onChange={(event) => setRouteSummary(event.target.value)}
                  className="mt-3 min-h-[104px] w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:focus:border-emerald-300 dark:focus:ring-emerald-300/10"
                />
              </label>
            </div>

            {structuredRequest && (
              <div className="mt-4 rounded-3xl bg-slate-950 p-4 text-white shadow-inner ring-1 ring-white/10">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">Gateway packet</p>
                <pre className="mt-3 overflow-x-auto text-xs leading-6 text-slate-200">{JSON.stringify(structuredRequest, null, 2)}</pre>
              </div>
            )}
          </div>

          <aside className="rounded-[2rem] border border-white/70 bg-[#f7f5f1] p-6 shadow-sm dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Confirmation gate</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">No route jumps the human gate.</h3>
            <div className="mt-5 space-y-3">
              {routeSteps.map((step, index) => (
                <div key={step.label} className="flex gap-3 rounded-3xl bg-white/80 p-3 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900/70 dark:ring-white/10">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-950/20">{index + 1}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-950 dark:text-white">{step.label}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-3">
              {auditTrail.map((item) => {
                const tone =
                  item.tone === 'green'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-300/25 dark:bg-emerald-500/10 dark:text-emerald-100'
                    : item.tone === 'red'
                      ? 'border-red-200 bg-red-50 text-red-950 dark:border-red-300/25 dark:bg-red-500/10 dark:text-red-100'
                      : item.tone === 'gold'
                        ? 'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-300/25 dark:bg-amber-500/10 dark:text-amber-100'
                        : 'border-blue-200 bg-blue-50 text-blue-950 dark:border-blue-300/25 dark:bg-blue-500/10 dark:text-blue-100';

                return (
                  <div key={item.label} className={'rounded-3xl border p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ' + tone}>
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="mt-2 text-sm leading-6 opacity-80">{item.detail}</p>
                  </div>
                );
              })}
            </div>

            {selectedContact.role === 'emergency' && (
              <div className="mt-4 rounded-3xl border border-red-200 bg-red-50 p-4 text-red-950 dark:border-red-300/25 dark:bg-red-500/10 dark:text-red-100">
                <p className="text-sm font-semibold">Emergency is not dispatched in this version.</p>
                <p className="mt-2 text-sm leading-6 opacity-80">The screen can prepare the route and show the required context, but a real emergency service connection must remain a separate confirmed backend integration.</p>
              </div>
            )}
          </aside>
        </section>
      )}
    </div>
  );
}
