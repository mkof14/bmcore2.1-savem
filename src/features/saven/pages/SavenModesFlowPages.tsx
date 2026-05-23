import { Activity, Check, Clock3 } from 'lucide-react';



const autonomousSupportTemplates = [
  {
    name: 'Senior Support',
    workflow: 'Daily stability, meals, hydration, movement, evening safety',
    tasks: ['Morning check-in', 'Hydration check', 'Mobility check', 'Meal confirmation', 'Evening safety check'],
    verification: ['Family confirmed', 'Caregiver confirmed', 'Sensor confirmation'],
  },
  {
    name: 'Post Surgery Recovery',
    workflow: 'Recovery windows, assisted mobility, rest, confirmation, escalation',
    tasks: ['Breathing exercise', 'Assisted walking', 'Medication support reminder', 'Rest period check', 'Evening recovery review'],
    verification: ['Caregiver confirmed', 'User confirmed', 'Wearable telemetry'],
  },
  {
    name: 'Rehabilitation',
    workflow: 'Guided sessions, fatigue checks, caregiver confirmation, pacing',
    tasks: ['Exercise session', 'Mobility progress check', 'Fatigue note', 'Rest period', 'Caregiver confirmation'],
    verification: ['Caregiver confirmed', 'Device telemetry', 'User confirmed'],
  },
  {
    name: 'Family Monitoring',
    workflow: 'Low-stress visibility for family support and continuity',
    tasks: ['Daily routine check', 'Family update', 'Missed action review', 'Evening check-in'],
    verification: ['Family confirmed', 'User confirmed', 'System inferred'],
  },
];

const continuityFactors = [
  { label: 'Completed actions', value: 'Stable', tone: 'green' },
  { label: 'Delayed actions', value: '1 open', tone: 'amber' },
  { label: 'Verification stability', value: 'Strong', tone: 'green' },
  { label: 'Caregiver responsiveness', value: 'Active', tone: 'green' },
  { label: 'Device uptime', value: '92%', tone: 'blue' },
  { label: 'Robot readiness', value: 'Ready', tone: 'blue' },
];

const demoScenarios = [
  'Senior living support',
  'Post-surgery recovery',
  'Rehabilitation support',
  'Family support monitoring',
  'Robot-assisted environment',
];

function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/82 p-7 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
      <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-blue-200/20 blur-3xl dark:bg-slate-950/70 dark:ring-1 dark:ring-blue-300/15" />
      <div className="relative">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{eyebrow}</p>
      <h2 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">{title}</h2>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">{text}</p>
      </div>
    </section>
  );
}

function LayeredPanel({ title, text, items }: { title: string; text: string; items: string[] }) {
  return (
    <article className="group rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10 dark:hover:border-blue-300/30 dark:hover:bg-slate-900/80">
      <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full bg-[#f7f5f1] px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-950/65 dark:text-slate-200 dark:ring-1 dark:ring-white/10">{item}</span>
        ))}
      </div>
    </article>
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

export function DualModeArchitecture() {
  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Dual Operational Architecture"
        title="SAVEN works with BioMath Core or independently."
        text="Connected Mode uses BioMath Core for deeper human understanding. Autonomous Mode keeps SAVEN functional with built-in support logic, workflows, environment rules, verification, and robotics-ready execution."
      />

      <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#0b1726]/88">
        <div className="grid gap-5 xl:grid-cols-[1fr_300px_1fr] xl:items-stretch">
          <ModePanel
            title="BioMath Connected SAVEN"
            eyebrow="Connected Mode"
            text="BioMath Core provides physiological patterns, behavior context, recovery patterns, adaptive thresholds, and personalized support recommendations."
            status="BioMath signal active"
            items={['Biological trends', 'Recovery context', 'Adaptive routines', 'Escalation indicators', 'Continuity intelligence']}
            tone="blue"
          />
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-xl dark:border-white/10">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-400/24 blur-3xl" />
            <div className="absolute -bottom-12 left-8 h-32 w-32 rounded-full bg-amber-300/18 blur-3xl" />
            <div className="relative flex h-full flex-col justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">Shared Core</p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight">SAVEN Execution System</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">One operational core supports both modes.</p>
              </div>
              <div className="space-y-2">
                {['Execution engine', 'Verification engine', 'Timeline', 'Access system', 'Device layer', 'Robot layer'].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm font-semibold text-slate-100">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <ModePanel
            title="Autonomous SAVEN"
            eyebrow="Standalone Mode"
            text="SAVEN generates support tasks from profile, environment, rhythm, availability, predefined workflows, and verification requirements without BioMath Core."
            status="Standalone support ready"
            items={['Support templates', 'Environment rules', 'Recovery workflows', 'Caregiver coordination', 'Robot orchestration']}
            tone="gold"
          />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Human to Reality Flow</p>
              <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Insight becomes verified support.</h3>
            </div>
            <StatusPill tone="green" label="Operational continuity" />
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-5">
            {['Human Understanding', 'Support Coordination', 'Real World Execution', 'Verification', 'Continuity State'].map((step, index) => (
              <div key={step} className="group min-h-[145px] rounded-3xl border border-slate-100 bg-[#f7f5f1] p-4 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-lg dark:border-white/10 dark:bg-slate-950/60 dark:hover:border-blue-300/30 dark:hover:bg-slate-900/80">
                <div className="flex items-center justify-between gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-950 text-xs font-semibold text-white ring-1 ring-slate-900/10 dark:bg-slate-950/75 dark:text-blue-100 dark:ring-blue-300/20">{index + 1}</span>
                  <span className="h-1.5 w-10 rounded-full bg-gradient-to-r from-blue-300 to-amber-300 opacity-70" />
                </div>
                <p className="mt-4 text-sm font-semibold leading-5 text-slate-950 dark:text-slate-100 group-[.is-active]:dark:text-white">{step}</p>
              </div>
            ))}
          </div>
        </div>
        <ContinuityEnginePanel />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <ArchitectureSeparationPanel />
        <AutonomousSupportEnginePanel />
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Built-in Support Templates</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Autonomous support profiles are ready without BioMath Core.</h3>
          </div>
          <StatusPill tone="gold" label="Autonomous engine" />
        </div>
        <div className="mt-6 grid gap-4 xl:grid-cols-4">
          {autonomousSupportTemplates.map((template) => (
            <article key={template.name} className="rounded-3xl border border-slate-100 bg-[#f7f5f1] p-5 transition-all hover:-translate-y-0.5 hover:border-amber-200 hover:bg-white hover:shadow-lg dark:border-white/10 dark:bg-slate-950/50 dark:hover:border-amber-300/25 dark:hover:bg-slate-900/80">
              <h4 className="text-xl font-semibold text-slate-950 dark:text-white">{template.name}</h4>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{template.workflow}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {template.tasks.slice(0, 3).map((task) => (
                  <span key={task} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-950/65 dark:text-slate-200 dark:ring-1 dark:ring-white/10">{task}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <LayeredPanel title="Robot orchestration" text="Robots are physical executors and telemetry providers, not the intelligence center." items={['Safety check', 'Capability match', 'Environment permission', 'Telemetry verification']} />
        <LayeredPanel title="Environment orchestration" text="Rules define what support can happen in home, recovery, senior care, assisted living, and clinic environments." items={['Permissions', 'Connected devices', 'Escalation chain', 'Restricted actions']} />
        <LayeredPanel title="Demo mode" text="Investor and partner demos show a complete operational support environment." items={demoScenarios} />
      </section>

      <SupportFlowGraphic current="Verification Received" />
    </div>
  );
}

function ModePanel({
  eyebrow,
  title,
  text,
  status,
  items,
  tone,
}: {
  eyebrow: string;
  title: string;
  text: string;
  status: string;
  items: string[];
  tone: 'blue' | 'gold';
}) {
  const toneClass =
    tone === 'gold'
      ? 'from-amber-50 via-white to-white text-amber-800 dark:from-slate-950/90 dark:via-amber-950/40 dark:to-slate-950/70 dark:text-amber-100'
      : 'from-blue-50 via-white to-white text-blue-800 dark:from-slate-950/90 dark:via-blue-950/42 dark:to-slate-950/70 dark:text-blue-100';

  return (
    <article className={`rounded-[2rem] border border-white/70 bg-gradient-to-br ${toneClass} p-6 shadow-sm dark:border-white/10`}>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-75">{eyebrow}</p>
      <h3 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{text}</p>
      <div className="mt-5 rounded-3xl bg-white/68 p-4 text-sm font-semibold text-slate-800 shadow-sm dark:bg-slate-950/70 dark:text-slate-100 dark:ring-1 dark:ring-white/10">{status}</div>
      <div className="mt-5 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full bg-white/78 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm dark:bg-slate-950/65 dark:text-slate-200 dark:ring-1 dark:ring-white/10">
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}

function ContinuityEnginePanel() {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Continuity Engine</p>
      <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Operational stability, not medical scoring.</h3>
      <div className="mt-5 space-y-3">
        {continuityFactors.map((factor) => (
          <div key={factor.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-3xl border border-slate-100 bg-[#f7f5f1] px-4 py-3 dark:border-white/10 dark:bg-slate-950/50">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{factor.label}</span>
            <StatusPill tone={factor.tone as 'blue' | 'gold' | 'green'} label={factor.value} />
          </div>
        ))}
      </div>
    </section>
  );
}

function ArchitectureSeparationPanel() {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Intelligence Separation</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-blue-50 p-5 dark:bg-slate-950/70 dark:ring-1 dark:ring-blue-300/15">
          <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">BioMath Core</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Biological understanding, predictive modeling, physiological analysis, dynamic interpretation.</p>
        </div>
        <div className="rounded-3xl bg-amber-50 p-5 dark:bg-slate-950/70 dark:ring-1 dark:ring-amber-300/15">
          <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">SAVEN</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Operational coordination, task execution, verification, environments, access, devices, robotics orchestration.</p>
        </div>
      </div>
    </section>
  );
}

function AutonomousSupportEnginePanel() {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Autonomous Support Engine</p>
      <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Task generation from real-life context.</h3>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {['Age group', 'Support mode', 'Mobility level', 'Environment', 'Recovery type', 'Support goals', 'Daily rhythm', 'Caregiver availability', 'Device availability', 'Robot availability'].map((item) => (
          <div key={item} className="rounded-2xl border border-slate-100 bg-[#f7f5f1] px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-200">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

export function SupportFlowPage() {
  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Support Flow" title="Support is actively happening." text="SAVEN visualizes the path from detected need to verified continuity. The same execution flow works in Connected Mode and Autonomous Mode." />
      <div className="grid gap-5 lg:grid-cols-2">
        <LayeredPanel title="Connected source" text="BioMath Core sends insight, recommendation, support need, priority, and adaptive threshold context." items={['BioMath signal', 'Human model context', 'Recovery pattern', 'Personal threshold']} />
        <LayeredPanel title="Autonomous source" text="SAVEN creates support tasks from profile, workflow templates, environment rules, availability, and verification requirements." items={['Support profile', 'Built-in workflow', 'Environment rule', 'Continuity state']} />
      </div>
      <SupportFlowGraphic current="Assigned to Person / Device / Robot" />
      <div className="grid gap-5 lg:grid-cols-3">
        <LayeredPanel title="Need detected" text="BioMath Core sends a structured support signal." items={['Hydration', 'Mobility', 'Recovery', 'Safety']} />
        <LayeredPanel title="Responsibility assigned" text="SAVEN selects a person, device, robot, or environment system." items={['Caregiver first', 'Family fallback', 'Device readiness', 'Robot safety']} />
        <LayeredPanel title="Reality verified" text="The result is confirmed before continuity updates." items={['Human confirmation', 'Sensor signal', 'Robot telemetry', 'Timeline event']} />
      </div>
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

