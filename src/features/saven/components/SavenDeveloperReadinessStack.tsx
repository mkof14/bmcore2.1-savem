import { ArrowRight, BellRing, HeartPulse, PhoneCall, ShieldCheck, Stethoscope, Users } from 'lucide-react';
import { savenMockState } from '../mock/savenMockState';
import { savenControlApiMock } from '../services/savenControlApiMock';
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

function SavenFinalAuditPanel() {
  const auditRows = [
    { label: 'Pages', value: '13 app views', detail: 'Start, Today, Command, Lifecycle, Plan, Circle, Devices, Robots, Environments, Recovery, Verification, Settings, Learning', tone: 'blue' },
    { label: 'Core services', value: 'Connected', detail: 'Tasks, commands, permissions, devices, robots, care contacts, escalation, continuity', tone: 'green' },
    { label: 'External systems', value: 'Mock only', detail: 'No real DB, env, phone, emergency, medical, SMS, or robot API connection is enabled', tone: 'gold' },
    { label: 'Cleanup status', value: 'Ready to test', detail: 'Duplicate support-template section removed; visual audit still requires browser pass after launch', tone: 'blue' },
  ];

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/82 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Final readiness audit</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">SAVEN is organized as a development-ready system.</h3>
        </div>
        <StatusPill tone="blue" label="Audit view" />
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {auditRows.map((row) => {
          const tone = row.tone === 'green' ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100' : row.tone === 'gold' ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100' : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
          return (
            <article key={row.label} className={'rounded-3xl border p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ' + tone}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-65">{row.label}</p>
              <p className="mt-2 text-2xl font-semibold">{row.value}</p>
              <p className="mt-2 text-sm leading-6 opacity-80">{row.detail}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function SavenLocalMockStatePanel() {
  const dataGroups = [
    { label: 'People', value: savenMockState.people.length, detail: 'Person, caregiver, family, doctor, nurse', tone: 'blue' },
    { label: 'Tasks', value: savenMockState.tasks.length, detail: 'Lifecycle tasks without DB', tone: 'green' },
    { label: 'Endpoints', value: savenMockState.endpoints.length, detail: 'Devices, robot, environment', tone: 'gold' },
    { label: 'Commands', value: savenMockState.commands.length, detail: 'Voice and text events', tone: 'blue' },
    { label: 'Escalations', value: savenMockState.escalations.length, detail: 'Normal, nurse, doctor, emergency UI', tone: 'red' },
    { label: 'Continuity', value: savenMockState.continuity.score, detail: savenMockState.continuity.state + ' at ' + savenMockState.continuity.lastUpdated, tone: 'green' },
  ];

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/82 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Local mock state</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">SAVEN now has a local data model without DB or env.</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">This state is intentionally local: it prepares the product logic for mock API work while avoiding Supabase, emergency services, phone, SMS, medical systems, and robot APIs.</p>
        </div>
        <StatusPill tone="gold" label={savenMockState.mode} />
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {dataGroups.map((group) => {
          const tone = group.tone === 'red'
            ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-300/25 dark:bg-red-500/10 dark:text-red-100'
            : group.tone === 'green'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100'
              : group.tone === 'gold'
                ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100'
                : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
          return (
            <article key={group.label} className={'rounded-3xl border p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ' + tone}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-65">{group.label}</p>
              <p className="mt-2 text-3xl font-semibold">{group.value}</p>
              <p className="mt-2 text-sm leading-6 opacity-80">{group.detail}</p>
            </article>
          );
        })}
      </div>
      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <div className="rounded-3xl bg-[#f7f5f1] p-4 dark:bg-slate-950/70 dark:ring-1 dark:ring-white/10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Active task</p>
          <p className="mt-2 text-sm font-semibold text-slate-950 dark:text-white">{savenMockState.tasks[0].title}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Lifecycle: {savenMockState.tasks[0].lifecycle}</p>
        </div>
        <div className="rounded-3xl bg-[#f7f5f1] p-4 dark:bg-slate-950/70 dark:ring-1 dark:ring-white/10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Latest command</p>
          <p className="mt-2 text-sm font-semibold text-slate-950 dark:text-white">{savenMockState.commands[0].text}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{savenMockState.commands[0].result}</p>
        </div>
        <div className="rounded-3xl bg-[#f7f5f1] p-4 dark:bg-slate-950/70 dark:ring-1 dark:ring-white/10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Continuity</p>
          <p className="mt-2 text-sm font-semibold text-slate-950 dark:text-white">{savenMockState.continuity.state}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{savenMockState.continuity.openVerifications} open verification waits for confirmation.</p>
        </div>
      </div>
    </section>
  );
}

function SavenControlApiMockPanel() {
  const apiExamples = [
    savenControlApiMock.createTask('Assisted walking session'),
    savenControlApiMock.assignTask('task-mobility-1030', 'caregiver-maya'),
    savenControlApiMock.sendCommand('Hey SAVEN, start assisted walking support.', 'task-mobility-1030'),
    savenControlApiMock.verifyAction('task-mobility-1030', 'caregiver-maya'),
    savenControlApiMock.escalate('care_concern'),
    savenControlApiMock.escalate('emergency'),
    savenControlApiMock.updateContinuity('task-mobility-1030'),
  ];

  return (
    <section className="rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_14%_18%,rgba(59,130,246,0.18),transparent_28%),radial-gradient(circle_at_84%_18%,rgba(16,185,129,0.14),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(239,246,255,0.76),rgba(240,253,244,0.72))] p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[radial-gradient(circle_at_14%_18%,rgba(59,130,246,0.24),transparent_28%),radial-gradient(circle_at_84%_18%,rgba(16,185,129,0.12),transparent_28%),linear-gradient(135deg,rgba(4,10,20,0.98),rgba(10,22,40,0.9),rgba(6,34,24,0.62))] dark:ring-1 dark:ring-white/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">SAVEN Control API mock</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Future backend actions are mapped locally first.</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">This is not a real API. It is the product contract for the next backend phase: every UI action becomes a predictable operation with status, summary, and payload.</p>
        </div>
        <StatusPill tone="green" label="Mock API ready" />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {apiExamples.map((example) => {
          const tone = example.status === 'blocked_by_policy'
            ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-300/25 dark:bg-red-500/10 dark:text-red-100'
            : example.status === 'requires_confirmation'
              ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100'
              : 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100';
          return (
            <article key={example.operation + example.status} className={'rounded-3xl border p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ' + tone}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-65">{example.status.replace(/_/g, ' ')}</p>
              <h4 className="mt-2 text-lg font-semibold">{example.operation}</h4>
              <p className="mt-3 text-sm leading-6 opacity-85">{example.summary}</p>
            </article>
          );
        })}
      </div>

      <div className="mt-5 rounded-3xl bg-slate-950 p-4 text-white shadow-inner ring-1 ring-white/10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">Example payload</p>
        <pre className="mt-3 overflow-x-auto text-xs leading-6 text-slate-200">{JSON.stringify(apiExamples[2], null, 2)}</pre>
      </div>
    </section>
  );
}


function SavenBackendGatewayPanel() {
  const routeStyles = {
    caregiver: {
      icon: HeartPulse,
      label: 'Caregiver',
      className: 'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-300/25 dark:bg-emerald-500/10 dark:text-emerald-100',
    },
    family: {
      icon: Users,
      label: 'Family',
      className: 'border-blue-200 bg-blue-50 text-blue-950 dark:border-blue-300/25 dark:bg-blue-500/10 dark:text-blue-100',
    },
    nurse: {
      icon: BellRing,
      label: 'Nurse',
      className: 'border-cyan-200 bg-cyan-50 text-cyan-950 dark:border-cyan-300/25 dark:bg-cyan-500/10 dark:text-cyan-100',
    },
    doctor: {
      icon: Stethoscope,
      label: 'Doctor',
      className: 'border-violet-200 bg-violet-50 text-violet-950 dark:border-violet-300/25 dark:bg-violet-500/10 dark:text-violet-100',
    },
    emergency: {
      icon: PhoneCall,
      label: 'Emergency',
      className: 'border-red-200 bg-red-50 text-red-950 dark:border-red-300/25 dark:bg-red-500/10 dark:text-red-100',
    },
  } as const;

  const gatewaySteps = [
    { label: 'UI command', detail: 'Voice, text, button, schedule, robot readiness, or care route.', tone: 'blue' },
    { label: 'Local gateway', detail: 'Transforms the action into one backend-ready contract call.', tone: 'green' },
    { label: 'Safety gate', detail: 'Blocks real dispatch, robot action, medical route, or emergency route without human confirmation.', tone: 'gold' },
    { label: 'Future adapter', detail: 'A real backend can replace the local gateway without rewriting the page.', tone: 'violet' },
  ];

  return (
    <section className="rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_12%_16%,rgba(0,180,255,0.16),transparent_30%),radial-gradient(circle_at_86%_12%,rgba(255,178,54,0.18),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.95),rgba(240,249,255,0.8),rgba(255,247,237,0.76))] p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[radial-gradient(circle_at_12%_16%,rgba(0,180,255,0.22),transparent_30%),radial-gradient(circle_at_86%_12%,rgba(255,178,54,0.14),transparent_28%),linear-gradient(135deg,rgba(3,7,18,0.98),rgba(7,20,39,0.9),rgba(35,19,7,0.68))] dark:ring-1 dark:ring-white/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Backend gateway map</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">SAVEN has one safe bridge for care routes and future backend services.</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">This view shows the future service boundary: doctors, nurses, emergency help, family, caregivers, devices, robots, and continuity all pass through one local contract first.</p>
        </div>
        <StatusPill tone="green" label="Contract visible" />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-5">
        {savenCareContacts.map((contact) => {
          const style = routeStyles[contact.role];
          const Icon = style.icon;

          return (
            <article key={contact.id} className={'group rounded-3xl border p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ' + style.className}>
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/82 shadow-sm ring-1 ring-current/10 transition-transform group-hover:scale-105 dark:bg-slate-950/70">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-white/75 px-3 py-1 text-xs font-semibold shadow-sm ring-1 ring-current/10 dark:bg-slate-950/65">{style.label}</span>
              </div>
              <h4 className="mt-4 text-lg font-semibold">{contact.name}</h4>
              <p className="mt-2 text-sm leading-6 opacity-80">{contact.route}</p>
              <div className="mt-4 rounded-2xl bg-white/68 p-3 text-sm shadow-inner ring-1 ring-current/10 dark:bg-slate-950/48">
                <p className="font-semibold">{contact.availability}</p>
                <p className="mt-1 opacity-75">{contact.responseTarget}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {gatewaySteps.map((step) => {
          const tone =
            step.tone === 'green'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100'
              : step.tone === 'gold'
                ? 'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100'
                : step.tone === 'violet'
                  ? 'border-violet-200 bg-violet-50 text-violet-950 dark:border-violet-300/20 dark:bg-violet-500/10 dark:text-violet-100'
                  : 'border-blue-200 bg-blue-50 text-blue-950 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';

          return (
            <div key={step.label} className={'rounded-3xl border p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ' + tone}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-65">{step.label}</p>
              </div>
              <p className="mt-3 text-sm leading-6 opacity-85">{step.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-3xl border border-red-200 bg-red-50 p-4 text-red-950 shadow-sm dark:border-red-300/25 dark:bg-red-500/10 dark:text-red-100">
        <p className="text-sm font-semibold">Emergency route is visible, but locked.</p>
        <p className="mt-2 text-sm leading-6 opacity-80">The local development version can prepare an emergency path for the interface, but it cannot dispatch real emergency services. The real backend must keep this as a human-confirmed action.</p>
      </div>
    </section>
  );
}

function OperationalReadinessReport() {
  const reportRows = [
    { label: 'Lifecycle service', value: 'Ready', detail: 'Tasks share one support path', tone: 'green' },
    { label: 'Command layer', value: 'Active', detail: 'Voice and text commands available', tone: 'blue' },
    { label: 'Robot action', value: 'Locked', detail: 'Readiness visible, physical action gated', tone: 'gold' },
    { label: 'Verification', value: 'Required', detail: 'Continuity updates only after proof', tone: 'green' },
  ];

  return (
    <section className="rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_12%_18%,rgba(59,130,246,0.18),transparent_28%),radial-gradient(circle_at_84%_20%,rgba(249,115,22,0.14),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(239,246,255,0.72),rgba(255,247,237,0.72))] p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[radial-gradient(circle_at_12%_18%,rgba(59,130,246,0.24),transparent_28%),radial-gradient(circle_at_84%_20%,rgba(249,115,22,0.12),transparent_28%),linear-gradient(135deg,rgba(4,10,20,0.98),rgba(10,22,40,0.9),rgba(33,22,10,0.66))] dark:ring-1 dark:ring-white/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">SAVEN operational report</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">What is actually ready right now?</h3>
        </div>
        <StatusPill tone="green" label="System coherent" />
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {reportRows.map((row) => {
          const tone = row.tone === 'green' ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100' : row.tone === 'gold' ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100' : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
          return (
            <div key={row.label} className={'rounded-3xl border p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ' + tone}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-65">{row.label}</p>
              <p className="mt-2 text-2xl font-semibold">{row.value}</p>
              <p className="mt-2 text-sm leading-6 opacity-80">{row.detail}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function SavenDeveloperReadinessStack() {
  const panels = [
    { title: 'Local mock state', summary: 'People, tasks, endpoints, commands, escalation, and continuity.', component: <SavenLocalMockStatePanel /> },
    { title: 'Control API mock', summary: 'Future backend operations represented locally.', component: <SavenControlApiMockPanel /> },
    { title: 'Backend gateway map', summary: 'Care contacts, safety gates, and future backend routes.', component: <SavenBackendGatewayPanel /> },
    { title: 'Operational report', summary: 'Lifecycle, command layer, robot gates, and verification readiness.', component: <OperationalReadinessReport /> },
    { title: 'Final readiness audit', summary: 'Version, mock-only boundaries, and cleanup status.', component: <SavenFinalAuditPanel /> },
  ];

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/72 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55 dark:ring-1 dark:ring-white/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Developer readiness</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Technical layers are available without crowding the daily workflow.</h3>
        </div>
        <StatusPill tone="blue" label="5 panels" />
      </div>
      <div className="mt-5 space-y-3">
        {panels.map((panel, index) => (
          <details key={panel.title} open={index === 0} className="group rounded-3xl border border-slate-100 bg-[#f7f5f1] p-3 shadow-sm transition-all open:bg-white open:shadow-md dark:border-white/10 dark:bg-slate-900/70 dark:open:bg-slate-950/70">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-2 py-2">
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-slate-950 dark:text-white">{panel.title}</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{panel.summary}</span>
              </span>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-100 transition-transform group-open:rotate-90 dark:bg-slate-950 dark:text-slate-200 dark:ring-white/10">
                <ArrowRight className="h-4 w-4" />
              </span>
            </summary>
            <div className="mt-3">{panel.component}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
