import { Activity, Bed, Cable, Droplets, EyeOff, Gauge, Satellite, ScanLine, ShieldCheck, Wifi } from 'lucide-react';

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

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 py-2 last:border-b-0">
      <span className="text-sm text-slate-300">{label}</span>
      <span className="text-right text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

const devices = [
  {
    name: 'Wearable recovery tracker',
    type: 'Wearable',
    status: 'Connected',
    environment: 'Home Recovery',
    telemetry: 'Motion trend, activity support',
    capabilities: ['Mobility trend', 'Reminder response', 'Verification assist'],
  },
  {
    name: 'Smart hydration sensor',
    type: 'Kitchen device',
    status: 'Online',
    environment: 'Kitchen',
    telemetry: 'Hydration support signal',
    capabilities: ['Hydration signal', 'Routine support', 'Continuity input'],
  },
  {
    name: 'Bed presence sensor',
    type: 'Bedroom sensor',
    status: 'Standby',
    environment: 'Bedroom',
    telemetry: 'Rest window context',
    capabilities: ['Rest pacing', 'Quiet hours', 'Environment rule'],
  },
  {
    name: 'Home sensor mesh',
    type: 'Environment mesh',
    status: 'Active',
    environment: 'Home Recovery',
    telemetry: 'Room state and permission context',
    capabilities: ['Room state', 'Robot safety', 'Verification support'],
  },
];

function ReadinessCard({ title, subtitle, status, lines, items }: { title: string; subtitle: string; status: string; lines: string[]; items: string[] }) {
  return (
    <article className="rounded-[2rem] border border-white/70 bg-white/82 p-5 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{subtitle}</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h3>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100 dark:ring-1 dark:ring-emerald-300/20">{status}</span>
      </div>
      <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
        {lines.map((line) => <p key={line}>{line}</p>)}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/20">{item}</span>
        ))}
      </div>
    </article>
  );
}

export function DeviceReadiness() {
  const signalRoutes = [
    { signal: 'Hydration signal', source: 'Smart hydration sensor', task: 'Morning hydration check', proof: 'Supportive', icon: Droplets, tone: 'green' },
    { signal: 'Mobility trend', source: 'Wearable recovery tracker', task: 'Assisted walking session', proof: 'Supportive', icon: Activity, tone: 'blue' },
    { signal: 'Rest window', source: 'Bed presence sensor', task: 'Recovery pacing', proof: 'Context only', icon: Bed, tone: 'gold' },
    { signal: 'Room state', source: 'Home sensor mesh', task: 'Environment permission', proof: 'Rule input', icon: Satellite, tone: 'blue' },
  ];

  const consentRules = [
    { label: 'Consent visible', detail: 'Device use is shown as part of support, not hidden monitoring.', icon: EyeOff, tone: 'blue' },
    { label: 'Signal scoped', detail: 'Only support-relevant signals appear in SAVEN routes.', icon: ScanLine, tone: 'green' },
    { label: 'Human decision', detail: 'Telemetry supports proof but does not replace human confirmation.', icon: ShieldCheck, tone: 'gold' },
    { label: 'Backend ready', detail: 'Each signal can become an event behind the SAVEN gateway.', icon: Cable, tone: 'blue' },
  ];

  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Device Readiness" title="Devices are the verification gateway for real-world support." text="Devices do not make care decisions. They confirm signals, support continuity, and give SAVEN enough reality context to keep people, robots, and environments aligned." />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="grid gap-5 lg:grid-cols-2">
          {devices.map((device) => (
            <ReadinessCard key={device.name} title={device.name} subtitle={device.type} status={device.status} lines={[device.environment, device.telemetry]} items={device.capabilities} />
          ))}
        </div>
        <div className="rounded-[2rem] border border-white/70 bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/20 dark:border-white/10 dark:ring-1 dark:ring-blue-300/20">
          <div className="flex items-center gap-3">
            <span className="grid h-13 w-13 place-items-center rounded-2xl bg-blue-500/15 text-blue-100 ring-1 ring-blue-300/20">
              <Wifi className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">Device Gateway</p>
              <h3 className="mt-1 text-2xl font-semibold">Signals become proof, not noise.</h3>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <SummaryLine label="Device role" value="Verification support" />
            <SummaryLine label="Decision authority" value="Human + policy" />
            <SummaryLine label="Robot bridge" value="Telemetry only" />
            <SummaryLine label="Continuity update" value="After verification" />
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_14%_16%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_86%_16%,rgba(16,185,129,0.15),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(239,246,255,0.78),rgba(240,253,244,0.72))] p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[radial-gradient(circle_at_14%_16%,rgba(59,130,246,0.23),transparent_30%),radial-gradient(circle_at_86%_16%,rgba(16,185,129,0.12),transparent_28%),linear-gradient(135deg,rgba(4,10,20,0.98),rgba(10,22,40,0.9),rgba(6,34,24,0.62))] dark:ring-1 dark:ring-white/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Live signal routing</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Which device signal supports which task?</h3>
          </div>
          <StatusPill tone="green" label="Gateway active" />
        </div>
        <div className="mt-6 grid gap-3">
          {signalRoutes.map((signal) => {
            const Icon = signal.icon;
            const tone =
              signal.tone === 'green'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100'
                : signal.tone === 'gold'
                  ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100'
                  : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
            return (
              <div key={signal.signal} className={'grid gap-3 rounded-3xl border p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg md:grid-cols-[48px_1fr_1fr_1fr_150px] md:items-center ' + tone}>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/82 shadow-sm ring-1 ring-current/10 dark:bg-slate-950/70"><Icon className="h-5 w-5" /></span>
                <p className="font-semibold">{signal.signal}</p>
                <p className="text-sm opacity-80">{signal.source}</p>
                <p className="text-sm font-semibold">{signal.task}</p>
                <span className="rounded-full bg-white/82 px-3 py-1 text-center text-xs font-semibold shadow-sm dark:bg-slate-950/70">{signal.proof}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {consentRules.map((rule) => {
          const Icon = rule.icon;
          const tone =
            rule.tone === 'green'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100'
              : rule.tone === 'gold'
                ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100'
                : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
          return (
            <article key={rule.label} className={'rounded-3xl border p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl ' + tone}>
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/82 shadow-sm ring-1 ring-current/10 dark:bg-slate-950/70"><Icon className="h-5 w-5" /></span>
              <h3 className="mt-4 text-xl font-semibold">{rule.label}</h3>
              <p className="mt-3 text-sm leading-6 opacity-85">{rule.detail}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
