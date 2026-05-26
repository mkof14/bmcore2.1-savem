import { Activity, Bot, Building2, Check, Clock3, HeartPulse, Home, ShieldCheck, UserRound, UsersRound, Watch } from 'lucide-react';



type VerifiedAction = {
  time: string;
  action: string;
  confirmedBy: string;
  method: string;
  status: string;
};

const verifiedActions: VerifiedAction[] = [
  { time: '08:42', action: 'Morning hydration completed', confirmedBy: 'Maya Carter', method: 'Caregiver confirmed', status: 'Verified' },
  { time: '10:58', action: 'Walking support session verified', confirmedBy: 'Maya Carter', method: 'Caregiver confirmed', status: 'Verified' },
  { time: '12:12', action: 'Medication support verified', confirmedBy: 'Daniel Roberts', method: 'Family confirmed', status: 'Verified' },
  { time: '13:30', action: 'Robot readiness telemetry received', confirmedBy: 'SAVEN Assist R1', method: 'Robot telemetry', status: 'Verified' },
  { time: '14:05', action: 'Breathing exercise confirmed', confirmedBy: 'Anna Roberts', method: 'User confirmed', status: 'Verified' },
];

function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/82 p-7 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
      <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-blue-200/20 blur-3xl dark:bg-slate-950/70 dark:ring-1 dark:ring-blue-300/15" />
      <div className="relative">
      <p className="text-sm font-semibold tracking-[0.08em] text-slate-500 dark:text-slate-400">{eyebrow}</p>
      <h2 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">{title}</h2>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">{text}</p>
      </div>
    </section>
  );
}

function StatusPill({ label, tone }: { label: string; tone: 'blue' | 'gold' | 'green' }) {
  const color =
    tone === 'green'
      ? 'border border-emerald-200 bg-emerald-100 text-emerald-900 dark:border-emerald-300/30 dark:bg-slate-950/75 dark:text-emerald-100 dark:ring-1 dark:ring-emerald-300/25'
      : tone === 'gold'
        ? 'border border-amber-200 bg-amber-100 text-amber-900 dark:border-amber-300/30 dark:bg-slate-950/75 dark:text-amber-100 dark:ring-1 dark:ring-amber-300/25'
        : 'border border-blue-200 bg-blue-100 text-blue-900 dark:border-blue-300/30 dark:bg-slate-950/75 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/25';
  return <span className={`rounded-full px-4 py-2 font-semibold shadow-sm ${color}`}>{label}</span>;
}

function TimelineOperationalClarity() {
  const timelineRows = [
    { time: '08:30', event: 'Hydration check verified', proof: 'Sensor signal + user confirmation', continuity: '+1 stable', state: 'Done', tone: 'green' },
    { time: '10:30', event: 'Assisted walking support', proof: 'Waiting for Maya confirmation', continuity: '+2 pending', state: 'Open', tone: 'gold' },
    { time: '11:00', event: 'Robot readiness checked', proof: 'R1 telemetry only', continuity: 'No physical action', state: 'Safe', tone: 'blue' },
    { time: 'If missed', event: 'Nurse route prepared', proof: 'Care concern context', continuity: 'Prevents gap', state: 'Fallback', tone: 'red' },
  ];

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.08em] text-slate-500 dark:text-slate-400">Timeline clarity</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Each event should explain proof and continuity.</h3>
        </div>
        <StatusPill tone="green" label="Explainable timeline" />
      </div>
      <div className="mt-6 grid gap-3">
        {timelineRows.map((row) => {
          const tone =
            row.tone === 'green'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100'
              : row.tone === 'gold'
                ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100'
                : row.tone === 'red'
                  ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-300/20 dark:bg-red-500/10 dark:text-red-100'
                  : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
          return (
            <div key={row.time + row.event} className={'grid gap-3 rounded-3xl border p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg md:grid-cols-[92px_minmax(0,1fr)_minmax(0,1fr)_150px_110px] md:items-center ' + tone}>
              <span className="rounded-full bg-white/82 px-3 py-1 text-center text-xs font-semibold shadow-sm dark:bg-slate-950/70">{row.time}</span>
              <p className="font-semibold">{row.event}</p>
              <p className="text-sm opacity-80">{row.proof}</p>
              <p className="text-sm font-semibold">{row.continuity}</p>
              <span className="rounded-full bg-white/82 px-3 py-1 text-center text-xs font-semibold shadow-sm dark:bg-slate-950/70">{row.state}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function VerifiedActionCard({ event }: { event: VerifiedAction }) {
  return (
    <div className="grid gap-3 rounded-3xl border border-slate-100 bg-[#f7f5f1] p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/60 sm:grid-cols-[70px_1fr_auto] sm:items-center">
      <span className="rounded-full bg-white px-3 py-1 text-center text-sm font-semibold text-slate-500 shadow-sm dark:bg-slate-950/75 dark:text-slate-200 dark:ring-1 dark:ring-white/10">{event.time}</span>
      <div>
        <p className="font-semibold text-slate-950 dark:text-white">{event.action}</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Confirmed by {event.confirmedBy} through {event.method.toLowerCase()}.
        </p>
      </div>
      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-slate-950/70 dark:text-emerald-100 dark:ring-1 dark:ring-emerald-300/25">{event.status}</span>
    </div>
  );
}

function SupportFlowGraphic({ current }: { current: string }) {
  const steps = ['Need Detected', 'Support Task Created', 'Assigned to Person / Device / Robot', 'Action Performed', 'Verification Received', 'Continuity Updated'];
  const currentIndex = steps.indexOf(current);

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#0b1726]/88">
      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        {steps.map((step, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;
          return (
            <div
              key={step}
              className={`group min-h-[130px] rounded-3xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg ${active ? 'is-active' : ''} ${
                active ? 'border-blue-300 bg-blue-50 ring-1 ring-blue-200 dark:border-blue-300/50 dark:bg-slate-950 dark:text-blue-50 dark:ring-blue-300/35 dark:shadow-lg dark:shadow-blue-950/30' : done ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-300/25 dark:bg-slate-950/65 dark:ring-1 dark:ring-emerald-300/15' : 'border-slate-100 bg-[#f7f5f1] dark:border-white/10 dark:bg-slate-950/60'
              }`}
            >
              <div
                className={`grid h-8 w-8 place-items-center rounded-xl shadow-sm transition-transform group-hover:scale-105 ${
                  active ? 'bg-blue-600 text-white shadow-blue-500/30 dark:bg-blue-600 dark:text-white dark:ring-1 dark:ring-blue-200/40' : done ? 'bg-emerald-600 text-white shadow-emerald-500/30 dark:bg-slate-950/80 dark:text-emerald-100 dark:ring-1 dark:ring-emerald-300/25' : 'bg-slate-200 text-slate-500 dark:bg-slate-950/65 dark:text-slate-300 dark:ring-1 dark:ring-white/10'
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : active ? <Activity className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}
              </div>
              <p className="mt-4 text-sm font-semibold leading-5 text-slate-950 dark:text-slate-100 group-[.is-active]:dark:text-white">{step}</p>
              {active && <p className="mt-3 inline-flex w-fit rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-800 ring-1 ring-blue-200 dark:bg-slate-900 dark:text-blue-100 dark:ring-blue-300/35">Active now</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function EmergencyEscalationCenter({ compact = false }: { compact?: boolean }) {
  const escalationRows = [
    { level: 'Normal support', route: 'Family or caregiver', trigger: 'Missed low-risk task, routine reminder, family digest', response: 'Create follow-up and wait calmly', tone: 'blue' },
    { level: 'Care concern', route: 'Nurse path', trigger: 'Repeated missed confirmation, recovery discomfort, wound care question', response: 'Request nurse review with timeline context', tone: 'green' },
    { level: 'Clinical review', route: 'Doctor path', trigger: 'Medication concern, recovery plan change, high-risk unresolved event', response: 'Send concise clinical summary for review', tone: 'gold' },
    { level: 'Emergency', route: 'Emergency path', trigger: 'Fall risk, acute distress, immediate safety concern', response: 'Show emergency escalation state only in dev mock', tone: 'red' },
  ];

  return (
    <section className="rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_18%_18%,rgba(59,130,246,0.2),transparent_28%),radial-gradient(circle_at_84%_22%,rgba(239,68,68,0.16),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(239,246,255,0.76),rgba(255,241,242,0.7))] p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[radial-gradient(circle_at_18%_18%,rgba(59,130,246,0.24),transparent_28%),radial-gradient(circle_at_84%_22%,rgba(239,68,68,0.14),transparent_28%),linear-gradient(135deg,rgba(4,10,20,0.98),rgba(10,22,40,0.9),rgba(45,16,16,0.58))] dark:ring-1 dark:ring-white/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.08em] text-slate-500 dark:text-slate-400">Escalation center</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">SAVEN separates normal support from urgent escalation.</h3>
          {!compact && <p className="mt-2 max-w-2xl text-base leading-6 text-slate-600 dark:text-slate-300">The goal is to reduce panic: clear levels, clear route, clear next action. Real emergency calling is intentionally not connected in this development version.</p>}
        </div>
        <StatusPill tone="gold" label="Escalation rules" />
      </div>
      <div className={'mt-6 grid gap-4 ' + (compact ? 'lg:grid-cols-2 xl:grid-cols-4' : 'xl:grid-cols-4')}>
        {escalationRows.map((row, index) => {
          const tone = row.tone === 'red'
            ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-300/25 dark:bg-red-500/10 dark:text-red-100'
            : row.tone === 'green'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100'
              : row.tone === 'gold'
                ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100'
                : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
          return (
            <article key={row.level} className={'rounded-3xl border p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ' + tone}>
              <div className="flex items-center justify-between gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/82 text-sm font-semibold shadow-sm dark:bg-slate-950/70">{index + 1}</span>
                {row.tone === 'red' && <span className="h-3 w-3 animate-pulse rounded-full bg-red-500 shadow-[0_0_14px_rgba(239,68,68,0.8)]" />}
              </div>
              <h4 className="mt-4 text-xl font-semibold">{row.level}</h4>
              <p className="mt-1 text-sm font-semibold tracking-[0.06em] opacity-65">{row.route}</p>
              {!compact && <p className="mt-3 text-base leading-6 opacity-85">{row.trigger}</p>}
              <p className="mt-4 rounded-2xl bg-white/72 p-3 text-sm font-semibold leading-6 shadow-sm dark:bg-slate-950/70">{row.response}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function HumanSupportTimeline() {
  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Support Timeline" title="Real history of support and care continuity." text="This timeline is not an audit log. It shows verified actions in plain human language." />

      <section className="grid gap-4 rounded-[2rem] border border-blue-300/18 bg-[#07111f] p-5 text-white shadow-xl shadow-slate-950/18 ring-1 ring-white/10 xl:grid-cols-[290px_minmax(0,1fr)_260px]" data-saven-human-rail="timeline">
        <div>
          <p className="text-sm font-semibold tracking-[0.06em] text-blue-100/70">Timeline rail</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">History stays human-readable.</h3>
          <p className="mt-2 text-base leading-6 text-slate-200">Every event says what happened, who confirmed it, and what changed next.</p>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-4">
          <p className="text-sm font-semibold tracking-[0.06em] text-slate-300">Say this</p>
          <p className="mt-2 text-lg font-semibold leading-7">Hey SAVEN, explain today&apos;s verified support history.</p>
          <p className="mt-2 text-sm text-blue-100">Target: proof trail, not raw logs.</p>
        </div>
        <div className="grid gap-2">
          {['What happened', 'Who confirmed', 'Continuity effect'].map((item) => (
            <div key={item} className="rounded-2xl bg-white/[0.08] px-4 py-3 text-sm font-semibold text-slate-100 ring-1 ring-white/10">{item}</div>
          ))}
        </div>
      </section>

      <TimelineOperationalClarity />
      <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
        <div className="space-y-4">
          {verifiedActions.map((event) => (
            <VerifiedActionCard key={`${event.time}-${event.action}`} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}

export function SupportCircle() {
  const systemNodes = [
    { label: 'Anna Roberts', type: 'Supported person', icon: UserRound, tone: 'blue', pos: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2', active: true },
    { label: 'SAVEN', type: 'Coordinator', icon: Activity, tone: 'saven', pos: 'left-1/2 top-[10%] -translate-x-1/2', active: true },
    { label: 'Daniel Roberts', type: 'Family', icon: UsersRound, tone: 'blue', pos: 'left-[7%] top-[22%]' },
    { label: 'Maya Carter', type: 'Caregiver', icon: HeartPulse, tone: 'green', pos: 'right-[7%] top-[23%]' },
    { label: 'Recovery Clinic', type: 'Provider', icon: Building2, tone: 'gold', pos: 'left-[9%] bottom-[18%]' },
    { label: 'Wearable', type: 'Device', icon: Watch, tone: 'blue', pos: 'right-[10%] bottom-[20%]' },
    { label: 'Home', type: 'Environment', icon: Home, tone: 'green', pos: 'left-1/2 bottom-[8%] -translate-x-1/2' },
    { label: 'Robot R1', type: 'Robot', icon: Bot, tone: 'gold', pos: 'right-[32%] top-[67%]' },
    { label: 'Verification', type: 'Reality check', icon: ShieldCheck, tone: 'green', pos: 'left-[32%] top-[66%]' },
  ];

  const processSteps = [
    { label: 'Need', text: 'Support need appears', tone: 'blue' },
    { label: 'Assign', text: 'Person, device, or robot receives task', tone: 'gold' },
    { label: 'Act', text: 'Support action happens', tone: 'green' },
    { label: 'Verify', text: 'Reality is confirmed', tone: 'blue' },
    { label: 'Continue', text: 'Timeline updates', tone: 'green' },
  ];

  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Support Circle" title="Who is helping this person?" text="The relationship map shows people, devices, robots, environments, and verification moving around one supported person." />

      <section className="grid gap-4 rounded-[2rem] border border-emerald-300/18 bg-[#07111f] p-5 text-white shadow-xl shadow-slate-950/18 ring-1 ring-white/10 xl:grid-cols-[290px_minmax(0,1fr)_260px]" data-saven-human-rail="circle">
        <div>
          <p className="text-sm font-semibold tracking-[0.06em] text-emerald-100/70">Circle rail</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">Responsibility has shape.</h3>
          <p className="mt-2 text-base leading-6 text-slate-200">SAVEN shows who acts first, who is fallback, and who verifies reality.</p>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-4">
          <p className="text-sm font-semibold tracking-[0.06em] text-slate-300">Say this</p>
          <p className="mt-2 text-lg font-semibold leading-7">Hey SAVEN, show who should handle the next recovery task.</p>
          <p className="mt-2 text-sm text-emerald-100">Target: Maya first, Daniel fallback, nurse if unresolved.</p>
        </div>
        <div className="grid gap-2">
          {['Primary owner', 'Fallback route', 'Proof role'].map((item) => (
            <div key={item} className="rounded-2xl bg-white/[0.08] px-4 py-3 text-sm font-semibold text-slate-100 ring-1 ring-white/10">{item}</div>
          ))}
        </div>
      </section>

      <section className="relative min-h-[700px] overflow-hidden rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_24%_18%,rgba(59,130,246,0.24),transparent_28%),radial-gradient(circle_at_78%_22%,rgba(16,185,129,0.2),transparent_28%),radial-gradient(circle_at_50%_92%,rgba(245,158,11,0.28),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.96),rgba(235,245,255,0.82),rgba(255,247,226,0.78))] p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[radial-gradient(circle_at_24%_18%,rgba(59,130,246,0.32),transparent_30%),radial-gradient(circle_at_80%_24%,rgba(16,185,129,0.18),transparent_30%),radial-gradient(circle_at_50%_92%,rgba(245,158,11,0.16),transparent_30%),linear-gradient(135deg,rgba(6,14,28,0.98),rgba(11,25,43,0.94),rgba(33,25,14,0.74))]">
        <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(59,130,246,0.13)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.12)_1px,transparent_1px)] [background-size:48px_48px] dark:opacity-30" />

        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {[
            'M50 18 C34 22 24 30 17 40',
            'M50 18 C66 22 76 30 83 40',
            'M50 50 C33 48 22 56 15 72',
            'M50 50 C66 48 78 56 85 72',
            'M50 50 C48 62 48 76 50 88',
            'M50 50 C44 58 38 62 32 70',
            'M50 50 C58 58 64 62 68 70',
          ].map((path, index) => (
            <g key={path}>
              <path d={path} fill="none" stroke={index % 2 ? 'rgba(16,185,129,0.5)' : 'rgba(59,130,246,0.52)'} strokeWidth="0.38" strokeLinecap="round" strokeDasharray="1.4 1.1" className="animate-pulse" />
              <circle r="0.72" fill={index % 2 ? '#34d399' : '#60a5fa'} opacity="0.92">
                <animateMotion dur={(4.2 + index * 0.28) + 's'} repeatCount="indefinite" path={path} />
              </circle>
              <circle r="0.38" fill={index % 2 ? '#f59e0b' : '#f97316'} opacity="0.78">
                <animateMotion dur={(5.4 + index * 0.32) + 's'} repeatCount="indefinite" path={path} begin={(index * 0.25) + 's'} />
              </circle>
            </g>
          ))}
        </svg>

        <div className="absolute inset-12 rounded-full border border-blue-200/70 dark:border-blue-300/15" />
        <div className="absolute inset-24 rounded-full border border-emerald-200/70 dark:border-emerald-300/15" />
        <div className="absolute inset-36 animate-pulse rounded-full border border-amber-200/80 dark:border-amber-300/20" />

        {systemNodes.map((node, index) => {
          const Icon = node.icon;
          const toneClass =
            node.tone === 'saven'
              ? 'from-slate-950 via-blue-950 to-slate-950 text-white ring-blue-300/35 shadow-blue-950/30'
              : node.tone === 'green'
                ? 'from-emerald-50 to-white text-emerald-800 ring-emerald-200 dark:from-slate-950/95 dark:to-emerald-950/58 dark:text-emerald-100 dark:ring-emerald-300/25'
                : node.tone === 'gold'
                  ? 'from-amber-50 to-white text-amber-800 ring-amber-200 dark:from-slate-950/95 dark:to-amber-950/58 dark:text-amber-100 dark:ring-amber-300/25'
                  : 'from-blue-50 to-white text-blue-800 ring-blue-200 dark:from-slate-950/95 dark:to-blue-950/58 dark:text-blue-100 dark:ring-blue-300/25';

          return (
            <div key={node.label} className={'group absolute z-10 ' + node.pos} style={{ animationDelay: index * 120 + 'ms' }}>
              <div className={'relative min-w-[170px] rounded-3xl border border-white/80 bg-gradient-to-br p-4 shadow-lg ring-1 transition-all hover:-translate-y-1 hover:shadow-2xl dark:border-white/10 ' + toneClass}>
                {node.active && <span className="absolute -right-1 -top-1 h-4 w-4 animate-ping rounded-full bg-emerald-400/70" />}
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/78 shadow-sm ring-1 ring-white/80 transition-transform group-hover:scale-110 dark:bg-slate-950/80 dark:ring-white/20">
                    {node.tone === 'saven' ? <img src="/saven-mark.png" alt="" className="h-full w-full rounded-2xl object-cover" /> : <Icon className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950 dark:text-slate-100">{node.label}</p>
                    <p className="mt-1 truncate text-xs tracking-[0.08em] opacity-70">{node.type}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <CirclePermissionsMatrix />

      <section className="grid gap-3 md:grid-cols-5">
        {processSteps.map((step, index) => {
          const tone = step.tone === 'green' ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100' : step.tone === 'gold' ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100' : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
          return (
            <div key={step.label} className={'rounded-3xl border p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ' + tone}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">{step.label}</p>
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white/70 text-xs font-semibold dark:bg-slate-950/70">{index + 1}</span>
              </div>
              <p className="mt-2 text-base leading-6 opacity-80">{step.text}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}

function CirclePermissionsMatrix() {
  const rows = [
    ['Family', 'Receive summary', 'Escalate unresolved items'],
    ['Caregiver', 'Perform support', 'Verify action'],
    ['Doctor', 'Review clinical summary', 'Approve plan change'],
    ['Robot', 'Report readiness', 'Wait for approval'],
  ];

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.08em] text-slate-500 dark:text-slate-400">Circle permissions</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Who can do what?</h3>
        </div>
        <StatusPill tone="blue" label="Permission matrix" />
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {rows.map(([role, action, limit]) => (
          <article key={role} className="rounded-3xl border border-blue-200 bg-blue-50 p-4 text-blue-900 shadow-sm dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100">
            <p className="text-xl font-semibold">{role}</p>
            <p className="mt-2 text-base leading-6 opacity-85">{action}</p>
            <p className="mt-2 text-sm font-semibold tracking-[0.06em] opacity-60">{limit}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function RecoveryMode() {
  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Recovery Mode" title="Simplified support for recovery." text="Recovery mode reduces cognitive load, prioritizes the next action, and tracks verified progression." />

      <section className="grid gap-4 rounded-[2rem] border border-amber-300/18 bg-[#07111f] p-5 text-white shadow-xl shadow-slate-950/18 ring-1 ring-white/10 xl:grid-cols-[290px_minmax(0,1fr)_260px]" data-saven-human-rail="recovery">
        <div>
          <p className="text-sm font-semibold tracking-[0.06em] text-amber-100/70">Recovery rail</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">One next action at a time.</h3>
          <p className="mt-2 text-base leading-6 text-slate-200">Recovery mode lowers noise and keeps the next verified step visible.</p>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-4">
          <p className="text-sm font-semibold tracking-[0.06em] text-slate-300">Say this</p>
          <p className="mt-2 text-lg font-semibold leading-7">Hey SAVEN, what is Anna&apos;s next recovery action?</p>
          <p className="mt-2 text-sm text-amber-100">Target: assisted walking, Maya owner, proof required.</p>
        </div>
        <div className="grid gap-2">
          {['Reduce noise', 'Show next step', 'Verify progress'].map((item) => (
            <div key={item} className="rounded-2xl bg-white/[0.08] px-4 py-3 text-sm font-semibold text-slate-100 ring-1 ring-white/10">{item}</div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="text-sm font-semibold tracking-[0.08em] text-slate-500 dark:text-slate-400">Current recovery action</p>
            <h3 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">Assisted walking session</h3>
            <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">Maya Carter is responsible. Confirmation is required before continuity updates.</p>
          </div>
          <div className="rounded-3xl bg-emerald-50 p-5 text-emerald-800 dark:bg-slate-950/70 dark:text-emerald-100 dark:ring-1 dark:ring-emerald-300/20">
            <p className="text-sm font-semibold">Verified progression</p>
            <p className="mt-4 text-5xl font-semibold">4</p>
            <p className="mt-2 text-sm">confirmed recovery actions today</p>
          </div>
        </div>
      </section>
      <SupportFlowGraphic current="Action Performed" />
      <EmergencyEscalationCenter compact />
    </div>
  );
}

