import { useState } from 'react';
import { Bot, ClipboardCheck, FileCheck2, Gauge, HeartPulse } from 'lucide-react';

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
      <p className="text-sm font-semibold tracking-[0.08em] text-slate-500 dark:text-slate-400">{eyebrow}</p>
      <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">{title}</h2>
      <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-600 dark:text-slate-300">{text}</p>
    </section>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 py-2 last:border-b-0">
      <span className="text-sm text-slate-300">{label}</span>
      <span className="text-right text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

export function VerificationCenter() {
  const [selectedProofId, setSelectedProofId] = useState('mobility-walk');

  const openVerifications = [
    {
      id: 'mobility-walk',
      task: 'Assisted walking session',
      owner: 'Maya Carter',
      proof: 'Caregiver confirmation + wearable motion trend',
      due: '10:30',
      status: 'Waiting',
      impact: '+2 continuity when verified',
      next: 'Ask Maya to confirm support was completed.',
      tone: 'gold',
    },
    {
      id: 'medication-support',
      task: 'Medication support confirmation',
      owner: 'Maya Carter + Daniel Roberts fallback',
      proof: 'Caregiver confirmation required; family fallback if missed',
      due: '09:00',
      status: 'Review',
      impact: 'Care route prepared if unresolved',
      next: 'Prepare nurse review if no confirmation arrives.',
      tone: 'red',
    },
    {
      id: 'hydration-check',
      task: 'Hydration check',
      owner: 'SAVEN + sensor',
      proof: 'Hydration sensor signal supports user confirmation',
      due: '08:30',
      status: 'Verified',
      impact: 'Continuity already updated',
      next: 'Keep normal reminders calm.',
      tone: 'green',
    },
  ];

  const proofPolicies = [
    { label: 'Low risk routine', proof: 'User or caregiver confirmation', examples: ['Breathing exercise', 'Drink water', 'Daily note'], icon: ClipboardCheck, tone: 'blue' },
    { label: 'Recovery support', proof: 'Caregiver confirmation required', examples: ['Walking support', 'Medication support', 'Transfer assistance'], icon: HeartPulse, tone: 'gold' },
    { label: 'Device-assisted', proof: 'Human confirmation plus telemetry', examples: ['Wearable activity', 'Bed sensor', 'Hydration signal'], icon: Gauge, tone: 'green' },
    { label: 'Robot-related', proof: 'Human approval before action, telemetry after action', examples: ['Robot readiness', 'Mobility endpoint', 'Room assist'], icon: Bot, tone: 'blue' },
  ];

  const selectedProof = openVerifications.find((item) => item.id === selectedProofId) ?? openVerifications[0];

  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Verification Engine" title="SAVEN updates continuity only after proof." text="Verification turns real-world support into accountable continuity. The system shows what is waiting, who confirms it, what proof is required, and what happens next." />

      <section className="grid gap-4 rounded-[2rem] border border-emerald-300/18 bg-[#07111f] p-5 text-white shadow-xl shadow-slate-950/18 ring-1 ring-white/10 xl:grid-cols-[300px_minmax(0,1fr)_300px]" data-saven-gate-center="verification">
        <div>
          <p className="text-sm font-semibold tracking-[0.06em] text-emerald-100/70">Proof gate</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">Continuity waits for proof.</h3>
          <p className="mt-2 text-base leading-6 text-slate-200">A task closes only when the right person or signal confirms reality.</p>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-4">
          <p className="text-sm font-semibold tracking-[0.06em] text-slate-300">Say this</p>
          <p className="mt-2 text-lg font-semibold leading-7">Hey SAVEN, verify the walking session with Maya and wearable motion trend.</p>
          <p className="mt-2 text-sm text-emerald-100">Target: Assisted walking session, continuity +2 after proof.</p>
        </div>
        <div className="grid gap-2">
          {['Owner confirms', 'Signal supports', 'Continuity updates'].map((item) => (
            <div key={item} className="rounded-2xl bg-white/[0.08] px-4 py-3 text-sm font-semibold text-slate-100 ring-1 ring-white/10">{item}</div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_14%_18%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(16,185,129,0.15),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(239,246,255,0.78),rgba(240,253,244,0.72))] p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[radial-gradient(circle_at_14%_18%,rgba(59,130,246,0.23),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(16,185,129,0.12),transparent_28%),linear-gradient(135deg,rgba(4,10,20,0.98),rgba(10,22,40,0.9),rgba(6,34,24,0.62))] dark:ring-1 dark:ring-white/10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.08em] text-slate-500 dark:text-slate-400">Open verifications</p>
              <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">What is waiting for confirmation?</h3>
            </div>
            <StatusPill tone="gold" label="2 open" />
          </div>
          <div className="mt-6 grid gap-3">
            {openVerifications.map((item) => {
              const isSelected = selectedProof.id === item.id;
              const tone =
                item.tone === 'green'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100'
                  : item.tone === 'red'
                    ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-300/20 dark:bg-red-500/10 dark:text-red-100'
                    : 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100';
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedProofId(item.id)}
                  className={(isSelected ? 'scale-[1.01] shadow-xl ring-2 ring-current/20 ' : 'shadow-sm hover:-translate-y-0.5 hover:shadow-lg ') + tone + ' rounded-3xl border p-4 text-left transition-all'}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold tracking-[0.06em] opacity-65">{item.status}</p>
                      <h4 className="mt-2 text-xl font-semibold">{item.task}</h4>
                      <p className="mt-2 text-sm leading-6 opacity-80">{item.proof}</p>
                    </div>
                    <span className="w-fit rounded-full bg-white/82 px-3 py-1 text-xs font-semibold shadow-sm dark:bg-slate-950/70">{item.due}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="rounded-[2rem] border border-white/70 bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/20 dark:border-white/10 dark:ring-1 dark:ring-blue-300/20">
          <div className="flex items-center gap-3">
            <span className="grid h-13 w-13 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-300/20">
              <FileCheck2 className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm font-semibold tracking-[0.06em] text-emerald-100">Selected proof</p>
              <h3 className="mt-1 text-2xl font-semibold">{selectedProof.task}</h3>
            </div>
          </div>
          <div className="mt-6 grid gap-3">
            <SummaryLine label="Owner" value={selectedProof.owner} />
            <SummaryLine label="Proof required" value={selectedProof.proof} />
            <SummaryLine label="Continuity impact" value={selectedProof.impact} />
            <SummaryLine label="Next action" value={selectedProof.next} />
          </div>
          <div className="mt-6 rounded-3xl bg-white/7 p-4 text-base leading-6 text-slate-300 ring-1 ring-white/10">
            Backend event shape: taskId, proofType, verifierId, evidenceSource, status, continuityImpact, nextAction.
          </div>
        </aside>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {proofPolicies.map((policy) => {
          const Icon = policy.icon;
          const tone =
            policy.tone === 'green'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100'
              : policy.tone === 'gold'
                ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100'
                : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
          return (
            <article key={policy.label} className={'rounded-[2rem] border p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ' + tone}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold">{policy.label}</h3>
                  <p className="mt-2 text-base leading-6 opacity-85">{policy.proof}</p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/82 shadow-sm ring-1 ring-current/10 dark:bg-slate-950/70"><Icon className="h-5 w-5" /></span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {policy.examples.map((item) => <span key={item} className="rounded-full bg-white/82 px-3 py-1 text-xs font-semibold shadow-sm dark:bg-slate-950/70">{item}</span>)}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
