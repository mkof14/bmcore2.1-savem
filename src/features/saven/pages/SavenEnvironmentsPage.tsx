import { Bed, Droplets, MapPinned, Stethoscope } from 'lucide-react';

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

function LayeredPanel({ title, text, items }: { title: string; text: string; items: string[] }) {
  return (
    <article className="rounded-3xl border border-white/70 bg-white/78 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-slate-950/58">
      <h4 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h4>
      <p className="mt-2 text-base leading-6 text-slate-600 dark:text-slate-300">{text}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/20">{item}</span>
        ))}
      </div>
    </article>
  );
}

export function EnvironmentSystem() {
  const environmentRules = [
    { zone: 'Bedroom', allowed: 'Rest checks, bed sensor, quiet voice', restricted: 'Robot physical action at night', tone: 'blue', icon: Bed },
    { zone: 'Hallway', allowed: 'Walking support, wearable confirmation', restricted: 'No robot assist without caregiver', tone: 'green', icon: MapPinned },
    { zone: 'Kitchen', allowed: 'Hydration prompt, family check', restricted: 'No medication assumption', tone: 'gold', icon: Droplets },
    { zone: 'Clinic handoff', allowed: 'Provider note, recovery plan sync', restricted: 'No family digest without privacy rule', tone: 'blue', icon: Stethoscope },
  ];

  const environmentFlow = [
    { label: 'Room context', value: 'Home Recovery', detail: 'Environment decides where a support action can happen.' },
    { label: 'Active helpers', value: 'Maya + Daniel', detail: 'People are matched with room and risk rules.' },
    { label: 'Physical endpoints', value: 'Robot + sensors', detail: 'Devices and robots inherit environment restrictions.' },
    { label: 'Escalation', value: 'Nurse / doctor', detail: 'Unresolved or clinical routes leave the home workflow safely.' },
  ];

  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Care Environment" title="Home Recovery has one support logic." text="People, devices, robots, rules, and escalation chain are managed together without becoming a hospital dashboard." />

      <section className="grid gap-4 rounded-[2rem] border border-blue-300/18 bg-[#07111f] p-5 text-white shadow-xl shadow-slate-950/18 ring-1 ring-white/10 xl:grid-cols-[300px_minmax(0,1fr)_300px]" data-saven-gate-center="environment">
        <div>
          <p className="text-sm font-semibold tracking-[0.06em] text-blue-100/70">Permission gate</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">Room rules before action.</h3>
          <p className="mt-2 text-base leading-6 text-slate-200">SAVEN checks room, helper, device, and robot permission before support moves.</p>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-4">
          <p className="text-sm font-semibold tracking-[0.06em] text-slate-300">Say this</p>
          <p className="mt-2 text-lg font-semibold leading-7">Hey SAVEN, check hallway permission before assisted walking support.</p>
          <p className="mt-2 text-sm text-blue-100">Target: Hallway, Maya present, robot movement locked.</p>
        </div>
        <div className="grid gap-2">
          {['Room allowed', 'Human present', 'Robot locked'].map((item) => (
            <div key={item} className="rounded-2xl bg-white/[0.08] px-4 py-3 text-sm font-semibold text-slate-100 ring-1 ring-white/10">{item}</div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <LayeredPanel title="Connected people" text="Family and caregiver coverage is active." items={['Anna Roberts', 'Daniel Roberts', 'Maya Carter']} />
        <LayeredPanel title="Connected systems" text="Devices and robots are scoped to Home Recovery." items={['Smart hydration sensor', 'Wearable tracker', 'SAVEN Assist R1']} />
        <LayeredPanel title="Escalation chain" text="Unresolved items move through calm responsibility levels." items={['Assigned helper', 'Family', 'Nurse', 'Doctor']} />
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_15%_18%,rgba(59,130,246,0.2),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(16,185,129,0.16),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(239,246,255,0.78),rgba(255,247,237,0.72))] p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[radial-gradient(circle_at_15%_18%,rgba(59,130,246,0.24),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(16,185,129,0.12),transparent_28%),linear-gradient(135deg,rgba(4,10,20,0.98),rgba(10,22,40,0.9),rgba(33,22,10,0.7))] dark:ring-1 dark:ring-white/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.08em] text-slate-500 dark:text-slate-400">Environment permissions</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Rules change by room, risk, and available helper.</h3>
          </div>
          <StatusPill tone="blue" label="Home Recovery" />
        </div>
        <div className="mt-6 grid gap-4 xl:grid-cols-4">
          {environmentRules.map((rule) => {
            const Icon = rule.icon;
            const tone =
              rule.tone === 'green'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100'
                : rule.tone === 'gold'
                  ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100'
                  : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
            return (
              <article key={rule.zone} className={'rounded-3xl border p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ' + tone}>
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/82 shadow-sm ring-1 ring-current/10 dark:bg-slate-950/70"><Icon className="h-5 w-5" /></span>
                  <h4 className="text-xl font-semibold">{rule.zone}</h4>
                </div>
                <p className="mt-4 text-sm font-semibold tracking-[0.06em] opacity-65">Allowed</p>
                <p className="mt-2 text-base leading-6 opacity-85">{rule.allowed}</p>
                <p className="mt-4 text-sm font-semibold tracking-[0.06em] opacity-65">Restricted</p>
                <p className="mt-2 text-base leading-6 opacity-85">{rule.restricted}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/20 dark:border-white/10 dark:ring-1 dark:ring-blue-300/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.08em] text-blue-100">Environment flow</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight">The home becomes a controlled support surface.</h3>
          </div>
          <StatusPill tone="green" label="Rules active" />
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {environmentFlow.map((item, index) => (
            <div key={item.label} className="rounded-3xl border border-white/10 bg-white/6 p-4 transition-all hover:-translate-y-0.5 hover:bg-white/9">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-500 text-sm font-semibold text-white">{index + 1}</span>
              <p className="mt-4 text-sm font-semibold tracking-[0.08em] text-blue-100">{item.label}</p>
              <p className="mt-2 text-xl font-semibold">{item.value}</p>
              <p className="mt-2 text-base leading-6 text-slate-300">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
