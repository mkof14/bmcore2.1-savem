import { Activity, Bot, Gauge, ShieldCheck, Workflow } from 'lucide-react';

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

function RobotBadge({ status }: { status: string }) {
  const isLocked = status.toLowerCase().includes('gated') || status.toLowerCase().includes('standby');
  return (
    <span className={(isLocked ? 'bg-amber-100 text-amber-900 dark:bg-amber-500/10 dark:text-amber-100 dark:ring-amber-300/20' : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100 dark:ring-emerald-300/20') + ' rounded-full px-3 py-1 text-xs font-semibold shadow-sm dark:ring-1'}>
      {status}
    </span>
  );
}

export function RobotReadiness() {
  const robots = [
    {
      name: 'SAVEN Assist R1',
      model: 'Humanoid support endpoint',
      readiness: 'Standby',
      capability: 'Conversation, object fetch readiness, mobility support preparation, room status reporting.',
      assignment: 'Recovery support only after caregiver approval',
      limits: ['No autonomous lift', 'No medication decision', 'No emergency dispatch'],
    },
    {
      name: 'Mobility Base M2',
      model: 'Physical mobility platform',
      readiness: 'Approval gated',
      capability: 'Transfer positioning, path readiness, room obstacle reporting, low-speed assisted movement.',
      assignment: 'Assistive movement only with human present',
      limits: ['Human present', 'Room rules required', 'Stop command always active'],
    },
    {
      name: 'Home Sensor Mesh',
      model: 'Environment robotics layer',
      readiness: 'Live telemetry',
      capability: 'Room presence, bed state, door state, light state, fall-risk signal, quiet-hours awareness.',
      assignment: 'Telemetry support for verification',
      limits: ['Signal only', 'No care decision alone', 'Privacy scoped'],
    },
    {
      name: 'Wearable Bridge',
      model: 'Body telemetry endpoint',
      readiness: 'Connected',
      capability: 'Motion trend, recovery activity, reminder response, hydration support, verification assist.',
      assignment: 'Supports but does not replace human confirmation',
      limits: ['No diagnosis', 'No hidden monitoring', 'Consent required'],
    },
  ];

  const serviceMatrix = [
    { service: 'Task command', saven: 'Creates action', robot: 'Receives scoped instruction', device: 'Adds state', human: 'Approves', status: 'Ready', tone: 'blue' },
    { service: 'Physical support', saven: 'Checks policy', robot: 'Prepares movement', device: 'Confirms room', human: 'Must be present', status: 'Locked', tone: 'gold' },
    { service: 'Telemetry sync', saven: 'Reads signals', robot: 'Reports readiness', device: 'Streams mock state', human: 'Reviews exceptions', status: 'Live mock', tone: 'green' },
    { service: 'Verification', saven: 'Waits for proof', robot: 'Provides telemetry', device: 'Supports proof', human: 'Confirms reality', status: 'Required', tone: 'blue' },
    { service: 'Emergency safety', saven: 'Prepares context', robot: 'Stops action', device: 'Adds location state', human: 'Confirms route', status: 'Human only', tone: 'red' },
  ];

  const physicalCommandStates = [
    { label: 'Readiness check', state: 'Allowed', detail: 'SAVEN may ask robots and devices for readiness state.', icon: Activity, tone: 'green' },
    { label: 'Move / lift / transfer', state: 'Locked', detail: 'Physical movement requires caregiver approval and environment rules.', icon: Bot, tone: 'gold' },
    { label: 'Device telemetry', state: 'Allowed', detail: 'Wearables and room sensors can support verification in mock mode.', icon: Gauge, tone: 'blue' },
    { label: 'Emergency route', state: 'Human only', detail: 'Robots stop and SAVEN prepares context; dispatch is not automatic.', icon: ShieldCheck, tone: 'red' },
  ];

  const networkNodes = [
    { label: 'SAVEN', x: 50, y: 18, color: '#60a5fa' },
    { label: 'R1', x: 20, y: 45, color: '#f97316' },
    { label: 'Mobility', x: 38, y: 76, color: '#f59e0b' },
    { label: 'Wearable', x: 66, y: 74, color: '#34d399' },
    { label: 'Room', x: 82, y: 44, color: '#22d3ee' },
    { label: 'Human', x: 50, y: 52, color: '#a78bfa' },
  ];

  const networkPaths = [
    'M50 18 C38 24 27 32 20 45',
    'M50 18 C62 24 75 32 82 44',
    'M20 45 C28 58 32 68 38 76',
    'M82 44 C76 58 72 68 66 74',
    'M38 76 C48 84 56 84 66 74',
    'M50 18 C50 30 50 42 50 52',
    'M50 52 C42 58 40 66 38 76',
    'M50 52 C58 58 64 66 66 74',
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2.25rem] border border-white/70 bg-[radial-gradient(circle_at_18%_18%,rgba(0,180,255,0.24),transparent_30%),radial-gradient(circle_at_78%_16%,rgba(255,178,54,0.24),transparent_30%),radial-gradient(circle_at_84%_86%,rgba(16,185,129,0.2),transparent_30%),linear-gradient(135deg,#f8fbff,#eaf3ff_42%,#fff4e8)] p-6 shadow-xl shadow-blue-950/8 dark:border-white/10 dark:bg-[radial-gradient(circle_at_18%_18%,rgba(0,180,255,0.26),transparent_30%),radial-gradient(circle_at_78%_16%,rgba(255,178,54,0.2),transparent_30%),radial-gradient(circle_at_84%_86%,rgba(16,185,129,0.16),transparent_30%),linear-gradient(135deg,#020817,#08182d_52%,#201205)]">
        <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(59,130,246,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.14)_1px,transparent_1px)] [background-size:38px_38px] dark:opacity-35" />
        <div className="relative grid gap-7 xl:grid-cols-[minmax(0,1.02fr)_minmax(460px,0.98fr)] xl:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700 dark:text-blue-200">Robot / Device Service Matrix</p>
            <h2 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-6xl">Physical support becomes visible, permissioned, and verified.</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700 dark:text-slate-300">SAVEN connects humanoid robots, mobility systems, room sensors, wearables, environment rules, and human approval through one operational layer. Robots can participate, but they cannot decide care alone.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                ['Command', 'One SAVEN task source'],
                ['Approval', 'Human-gated action'],
                ['Proof', 'Telemetry plus confirmation'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-3xl border border-white/70 bg-white/76 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/60 dark:ring-1 dark:ring-white/10">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{label}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-950 dark:text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[450px] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 p-5 text-white shadow-2xl shadow-slate-950/30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_18%,rgba(59,130,246,0.34),transparent_30%),radial-gradient(circle_at_72%_68%,rgba(249,115,22,0.32),transparent_32%),linear-gradient(135deg,#020617,#0f172a_55%,#111827)]" />
            <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(96,165,250,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.18)_1px,transparent_1px)] [background-size:28px_28px]" />
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {networkPaths.map((path, index) => (
                <g key={path}>
                  <path d={path} fill="none" stroke={index % 2 ? 'rgba(249,115,22,0.52)' : 'rgba(96,165,250,0.58)'} strokeWidth="0.46" strokeDasharray="1.6 1.2" />
                  <circle r="0.8" fill={index % 2 ? '#fb923c' : '#60a5fa'}>
                    <animateMotion dur={(3.8 + index * 0.3) + 's'} repeatCount="indefinite" path={path} />
                  </circle>
                </g>
              ))}
              {networkNodes.map((node) => (
                <g key={node.label}>
                  <circle cx={node.x} cy={node.y} r="5.4" fill="rgba(15,23,42,0.92)" stroke={node.color} strokeWidth="0.7" />
                  <circle cx={node.x} cy={node.y} r="2.1" fill={node.color} opacity="0.95" />
                </g>
              ))}
            </svg>
            <div className="relative grid min-h-[410px] place-items-center">
              <div className="grid h-28 w-28 place-items-center overflow-hidden rounded-[2rem] bg-slate-950 shadow-2xl ring-1 ring-blue-300/30">
                <img src="/saven-mark.png" alt="" className="h-full w-full object-cover" />
              </div>
              <div className="absolute inset-x-4 bottom-4 grid gap-2 sm:grid-cols-3">
                {['Robot ready', 'Devices live', 'Human approval'].map((label) => (
                  <div key={label} className="rounded-2xl bg-white/8 px-3 py-2 text-center text-xs font-semibold text-slate-100 ring-1 ring-white/10">{label}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {physicalCommandStates.map((item) => {
          const Icon = item.icon;
          const tone =
            item.tone === 'green'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100'
              : item.tone === 'gold'
                ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100'
                : item.tone === 'red'
                  ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-300/20 dark:bg-red-500/10 dark:text-red-100'
                  : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
          return (
            <article key={item.label} className={'group rounded-3xl border p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl ' + tone}>
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/78 shadow-sm ring-1 ring-current/10 transition-transform group-hover:scale-105 dark:bg-slate-950/70">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-white/82 px-3 py-1 text-xs font-semibold shadow-sm ring-1 ring-current/10 dark:bg-slate-950/70">{item.state}</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold">{item.label}</h3>
              <p className="mt-3 text-sm leading-6 opacity-85">{item.detail}</p>
            </article>
          );
        })}
      </section>

      <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Service matrix</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Who does what before a robot can help?</h3>
          </div>
          <StatusPill tone="blue" label="Operational layer" />
        </div>
        <div className="mt-5 overflow-hidden rounded-3xl border border-slate-100 bg-[#f7f5f1] dark:border-white/10 dark:bg-slate-900/70">
          <div className="hidden grid-cols-[1.1fr_1fr_1fr_1fr_1fr_110px] gap-0 border-b border-slate-200/70 bg-white/70 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-400 xl:grid">
            <span>Service</span>
            <span>SAVEN</span>
            <span>Robot</span>
            <span>Device</span>
            <span>Human</span>
            <span>Status</span>
          </div>
          {serviceMatrix.map((row) => {
            const tone =
              row.tone === 'green'
                ? 'text-emerald-700 dark:text-emerald-200'
                : row.tone === 'gold'
                  ? 'text-amber-700 dark:text-amber-200'
                  : row.tone === 'red'
                    ? 'text-red-700 dark:text-red-200'
                    : 'text-blue-700 dark:text-blue-200';
            return (
              <div key={row.service} className="grid gap-3 border-b border-slate-200/70 px-4 py-4 text-sm last:border-b-0 dark:border-white/10 xl:grid-cols-[1.1fr_1fr_1fr_1fr_1fr_110px] xl:items-center">
                <p className={'font-semibold ' + tone}>{row.service}</p>
                <p className="text-slate-700 dark:text-slate-300">{row.saven}</p>
                <p className="text-slate-700 dark:text-slate-300">{row.robot}</p>
                <p className="text-slate-700 dark:text-slate-300">{row.device}</p>
                <p className="text-slate-700 dark:text-slate-300">{row.human}</p>
                <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-100 dark:bg-slate-950 dark:text-slate-200 dark:ring-white/10">{row.status}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_12%_16%,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_88%_16%,rgba(16,185,129,0.14),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(239,246,255,0.78),rgba(240,253,244,0.72))] p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[radial-gradient(circle_at_12%_16%,rgba(59,130,246,0.22),transparent_30%),radial-gradient(circle_at_88%_16%,rgba(16,185,129,0.12),transparent_28%),linear-gradient(135deg,rgba(4,10,20,0.98),rgba(10,22,40,0.9),rgba(6,34,24,0.62))] dark:ring-1 dark:ring-white/10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Connected endpoints</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Robots, devices, and environments are one network.</h3>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {robots.map((robot) => (
              <article key={robot.name} className="group rounded-3xl border border-white/70 bg-white/78 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-xl dark:border-white/10 dark:bg-slate-950/60">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{robot.model}</p>
                    <h4 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{robot.name}</h4>
                  </div>
                  <RobotBadge status={robot.readiness} />
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{robot.capability}</p>
                <div className="mt-4 rounded-2xl bg-[#f7f5f1] p-3 text-sm dark:bg-slate-900/70">
                  <SummaryLine label="Assignment" value={robot.assignment} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {robot.limits.map((limit) => (
                    <span key={limit} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-slate-950/70 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/25">{limit}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/20 dark:border-white/10 dark:ring-1 dark:ring-blue-300/20">
          <div className="flex items-center gap-3">
            <span className="grid h-13 w-13 place-items-center rounded-2xl bg-blue-500/15 text-blue-100 ring-1 ring-blue-300/20">
              <Workflow className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">Physical orchestration</p>
              <h3 className="mt-1 text-2xl font-semibold">Rules before action</h3>
            </div>
          </div>
          <div className="mt-6 grid gap-3">
            <SummaryLine label="Command source" value="SAVEN task layer" />
            <SummaryLine label="Physical action" value="Human approval required" />
            <SummaryLine label="Telemetry" value="Robot + device + room" />
            <SummaryLine label="Continuity" value="Verified before update" />
            <SummaryLine label="Emergency" value="Stop and prepare context only" />
          </div>
          <div className="mt-6 rounded-3xl bg-white/7 p-4 text-sm leading-6 text-slate-300 ring-1 ring-white/10">
            Backend note: robot services should become adapters behind the same SAVEN gateway contract, never page-specific direct integrations.
          </div>
        </div>
      </section>
    </div>
  );
}
