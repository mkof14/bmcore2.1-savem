import { useMemo, useState } from 'react';

import { AlertCircle, ArrowRight, Check, FileCheck2, HeartPulse, ShieldCheck, UsersRound } from 'lucide-react';

import { SavenDeveloperReadinessStack } from '../components/SavenDeveloperReadinessStack';



type SupportTask = {
  title: string;
  reason: string;
  category: string;
  assignedTo: string;
  executorType: string;
  dueTime: string;
  status: 'active' | 'completed' | 'needs_attention' | 'delayed' | 'pending_confirmation' | 'planned';
  verificationMethod: string;
  priority: 'low' | 'normal' | 'high';
};

type VerifiedAction = {
  time: string;
  action: string;
  confirmedBy: string;
  method: string;
  status: string;
};

type LifeSetupState = {
  relationship: string;
  firstName: string;
  preferredName: string;
  ageGroup: string;
  sex: string;
  language: string;
  livingSituation: string;
  supportMode: string;
  mobility: string;
  rhythm: string;
  supportCircle: string[];
  technologyComfort: string;
  communication: string;
  goals: string[];
};

function InfoNote({ tone, title, text, className = '' }: { tone: 'blue' | 'gold' | 'green' | 'amber'; title: string; text: string; className?: string }) {
  const color = tone === 'amber' ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100' : tone === 'green' ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100' : tone === 'gold' ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100' : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
  return (
    <div className={'rounded-3xl border p-4 shadow-sm ' + color + ' ' + className}>
      <p className="font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-6 opacity-85">{text}</p>
    </div>
  );
}

function StatusPill({ label, tone }: { label: string; tone: 'blue' | 'gold' | 'green' }) {
  const color =
    tone === 'green'
      ? 'border border-emerald-200 bg-emerald-100 text-emerald-900 dark:border-emerald-300/30 dark:bg-slate-950/75 dark:text-emerald-100 dark:ring-1 dark:ring-emerald-300/25'
      : tone === 'gold'
        ? 'border border-amber-200 bg-amber-100 text-amber-900 dark:border-amber-300/30 dark:bg-slate-950/75 dark:text-amber-100 dark:ring-1 dark:ring-amber-300/25'
        : 'border border-blue-200 bg-blue-100 text-blue-900 dark:border-blue-300/30 dark:bg-slate-950/75 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/25';

  return <span className={'rounded-full px-4 py-2 font-semibold shadow-sm ' + color}>{label}</span>;
}

function SummaryLine({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200/80 py-2 last:border-b-0 dark:border-white/10">
      <span>{label}</span>
      <span className="text-right font-semibold text-slate-950 dark:text-white">{value}</span>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/78 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/58">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 font-semibold text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  const color = tone === 'green' ? 'from-emerald-500 to-cyan-400' : tone === 'amber' ? 'from-orange-500 to-amber-300' : 'from-blue-600 to-cyan-400';
  return (
    <article className="rounded-3xl border border-white/70 bg-white/82 p-5 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-slate-950/65">
      <div className={'h-1.5 w-16 rounded-full bg-gradient-to-r ' + color} />
      <p className="mt-5 text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">{value}</p>
    </article>
  );
}

function StatusBadge({ status }: { status: SupportTask['status'] }) {
  const map: Record<SupportTask['status'], string> = {
    active: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/20',
    completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-100 dark:ring-1 dark:ring-emerald-300/20',
    needs_attention: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-100 dark:ring-1 dark:ring-amber-300/20',
    delayed: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-100 dark:ring-1 dark:ring-red-300/20',
    pending_confirmation: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-100 dark:ring-1 dark:ring-amber-300/20',
    planned: 'bg-slate-100 text-slate-600 dark:bg-slate-950/70 dark:text-slate-200 dark:ring-1 dark:ring-white/10',
  };
  return <span className={'rounded-full px-3 py-1 text-xs font-semibold ' + map[status]}>{status.replace(/_/g, ' ')}</span>;
}

function PriorityBadge({ priority }: { priority: SupportTask['priority'] }) {
  const color = priority === 'high' ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-100 dark:ring-1 dark:ring-red-300/20' : priority === 'normal' ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/20' : 'bg-slate-100 text-slate-600 dark:bg-slate-950/70 dark:text-slate-200 dark:ring-1 dark:ring-white/10';
  return <span className={'rounded-full px-3 py-1 text-xs font-semibold ' + color}>{priority}</span>;
}

const supportTasks: SupportTask[] = [
  {
    title: 'Morning hydration check',
    reason: 'Recovery hydration routine from BioMath Core signal',
    category: 'Hydration',
    assignedTo: 'Maya Carter',
    executorType: 'Caregiver',
    dueTime: '08:30',
    status: 'completed',
    verificationMethod: 'Caregiver confirmed',
    priority: 'normal',
  },
  {
    title: 'Medication support confirmation',
    reason: 'Scheduled support action needs confirmation',
    category: 'Medication support',
    assignedTo: 'Maya Carter',
    executorType: 'Caregiver',
    dueTime: '09:00',
    status: 'pending_confirmation',
    verificationMethod: 'Caregiver confirmed',
    priority: 'high',
  },
  {
    title: 'Assisted walking session',
    reason: 'Mobility recovery support window',
    category: 'Mobility',
    assignedTo: 'Maya Carter',
    executorType: 'Caregiver',
    dueTime: '10:30',
    status: 'active',
    verificationMethod: 'Caregiver confirmed',
    priority: 'high',
  },
  {
    title: 'Breathing exercise',
    reason: 'Recovery routine with user confirmation',
    category: 'Rehabilitation',
    assignedTo: 'Anna Roberts',
    executorType: 'User',
    dueTime: '12:00',
    status: 'planned',
    verificationMethod: 'User confirmed',
    priority: 'normal',
  },
  {
    title: 'SAVEN Assist R1 readiness check',
    reason: 'Robot support availability for safe execution',
    category: 'Robot readiness',
    assignedTo: 'SAVEN Assist R1',
    executorType: 'Robot',
    dueTime: '13:30',
    status: 'completed',
    verificationMethod: 'Robot telemetry',
    priority: 'normal',
  },
  {
    title: 'Evening recovery review',
    reason: 'End-of-day continuity review',
    category: 'General support',
    assignedTo: 'Daniel Roberts',
    executorType: 'Family',
    dueTime: '19:00',
    status: 'planned',
    verificationMethod: 'Family confirmed',
    priority: 'normal',
  },
];

const verifiedActions: VerifiedAction[] = [
  { time: '08:42', action: 'Morning hydration completed', confirmedBy: 'Maya Carter', method: 'Caregiver confirmed', status: 'Verified' },
  { time: '10:58', action: 'Walking support session verified', confirmedBy: 'Maya Carter', method: 'Caregiver confirmed', status: 'Verified' },
  { time: '12:12', action: 'Medication support verified', confirmedBy: 'Daniel Roberts', method: 'Family confirmed', status: 'Verified' },
  { time: '13:30', action: 'Robot readiness telemetry received', confirmedBy: 'SAVEN Assist R1', method: 'Robot telemetry', status: 'Verified' },
  { time: '14:05', action: 'Breathing exercise confirmed', confirmedBy: 'Anna Roberts', method: 'User confirmed', status: 'Verified' },
];

const attentionItems = [
  'Medication support is waiting for caregiver confirmation',
  'Mobility support device needs maintenance review',
  'Evening recovery review is not assigned to a caregiver yet',
];

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

export function TodaySupport({ setup, openPage, profileCreated }: { setup: LifeSetupState; openPage: (pageId: 'app-support' | 'app-plan' | 'app-circle' | 'app-command' | 'app-environments' | 'app-verification' | 'app-continuity') => void; profileCreated: boolean }) {
  const stats = useMemo(
    () => [
      { label: 'Active', value: supportTasks.filter((task) => task.status === 'active' || task.status === 'planned').length, tone: 'blue' },
      { label: 'Completed', value: supportTasks.filter((task) => task.status === 'completed').length, tone: 'green' },
      { label: 'Needs attention', value: supportTasks.filter((task) => task.status === 'needs_attention' || task.status === 'pending_confirmation').length, tone: 'amber' },
      { label: 'Delayed', value: supportTasks.filter((task) => task.status === 'delayed').length, tone: 'amber' },
      { label: 'Pending confirmation', value: supportTasks.filter((task) => task.status === 'pending_confirmation').length, tone: 'blue' },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {!profileCreated && <InfoNote tone="amber" title="Demo profile is active" text="Complete Life Setup to personalize SAVEN and generate a support plan for this person." />}
      <HumanSupportHeader setup={setup} />
      <CareContactNetwork compact />
      <SavenEndToEndScenario openPage={openPage} />
      <TodayOperationalClarity />
      <SavenDeveloperReadinessStack />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <MetricCard key={stat.label} label={stat.label} value={stat.value} tone={stat.tone} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Today’s Support Stream</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Live support actions</h2>
            </div>
            <button onClick={() => openPage('app-support')} className="group inline-flex items-center gap-2 rounded-full border border-white/70 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700 hover:shadow-md dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10 dark:text-slate-200 dark:hover:border-blue-300/30 dark:hover:text-blue-100">
              View support flow
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
          {supportTasks.map((task) => (
            <SupportActionCard key={task.title} task={task} />
          ))}
        </section>
        <NeedsAttentionPanel />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <VerifiedTimelineCompact />
        <NextSupportWindow />
      </div>
    </div>
  );
}


function SavenEndToEndScenario({ openPage }: { openPage: (pageId: 'app-support' | 'app-plan' | 'app-circle' | 'app-command' | 'app-environments' | 'app-verification' | 'app-continuity') => void }) {
  const scenarioSteps: Array<{
    label: string;
    title: string;
    detail: string;
    command: string;
    result: string;
    page: string;
    tone: 'blue' | 'green' | 'gold' | 'red';
  }> = [
    {
      label: 'Need',
      title: 'Mobility support need detected',
      detail: 'BioMath Core or SAVEN profile identifies that Anna needs a guided walking support window.',
      command: 'Hey SAVEN, show the next recovery need.',
      result: 'Need is visible and converted into a support task.',
      page: 'app-support',
      tone: 'blue',
    },
    {
      label: 'Task',
      title: 'Support task created',
      detail: 'SAVEN creates the assisted walking session with priority, due time, owner, and verification policy.',
      command: 'Create walking support task for 10:30.',
      result: 'Task exists in the daily plan.',
      page: 'app-plan',
      tone: 'green',
    },
    {
      label: 'Assign',
      title: 'Maya Carter assigned',
      detail: 'Circle permissions route the action to the caregiver first and keep robot action locked.',
      command: 'Assign walking support to Maya.',
      result: 'Maya becomes responsible; family remains fallback.',
      page: 'app-circle',
      tone: 'gold',
    },
    {
      label: 'Command',
      title: 'Voice or text command sent',
      detail: 'The same action can be started by voice or typed command without turning SAVEN into a generic chat.',
      command: 'Hey SAVEN, start assisted walking support.',
      result: 'Command is interpreted as a task action.',
      page: 'app-command',
      tone: 'blue',
    },
    {
      label: 'Care',
      title: 'Care network remains ready',
      detail: 'If the action becomes a care concern, SAVEN routes to nurse, doctor, family, or emergency path.',
      command: 'If Maya cannot confirm, notify Daniel and prepare nurse follow-up.',
      result: 'Escalation path is visible, but no real external service is called.',
      page: 'app-environments',
      tone: 'red',
    },
    {
      label: 'Verify',
      title: 'Reality confirmed',
      detail: 'SAVEN waits for caregiver confirmation and supportive device telemetry before updating continuity.',
      command: 'Confirm walking session completed.',
      result: 'Verification received and timeline event created.',
      page: 'app-verification',
      tone: 'green',
    },
    {
      label: 'Continue',
      title: 'Continuity updated',
      detail: 'The support day becomes stable again: one action done, next window clear, family digest ready.',
      command: 'Update continuity and show next support window.',
      result: 'Continuity state becomes Strong.',
      page: 'app-continuity',
      tone: 'gold',
    },
  ];

  const [activeStep, setActiveStep] = useState(0);
  const active = scenarioSteps[activeStep];
  const progress = ((activeStep + 1) / scenarioSteps.length) * 100;

  const toneClass =
    active.tone === 'red'
      ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-300/25 dark:bg-red-500/10 dark:text-red-100'
      : active.tone === 'green'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100'
        : active.tone === 'gold'
          ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100'
          : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_14%_16%,rgba(59,130,246,0.22),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(249,115,22,0.14),transparent_28%),radial-gradient(circle_at_78%_88%,rgba(16,185,129,0.16),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(239,246,255,0.78),rgba(255,247,237,0.72))] p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[radial-gradient(circle_at_14%_16%,rgba(59,130,246,0.28),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(249,115,22,0.12),transparent_28%),radial-gradient(circle_at_78%_88%,rgba(16,185,129,0.12),transparent_28%),linear-gradient(135deg,rgba(4,10,20,0.98),rgba(10,22,40,0.9),rgba(33,22,10,0.66))] dark:ring-1 dark:ring-white/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">End-to-end scenario</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">One support event from need to continuity.</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">This is the product spine for SAVEN: every page supports one shared operational story instead of disconnected demo panels.</p>
        </div>
        <StatusPill tone="green" label={'Step ' + (activeStep + 1) + ' of ' + scenarioSteps.length} />
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/70 shadow-inner dark:bg-slate-950/70">
        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 via-emerald-400 to-orange-400 transition-all duration-500" style={{ width: progress + '%' }} />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="grid gap-3 md:grid-cols-7">
          {scenarioSteps.map((step, index) => {
            const selected = index === activeStep;
            const done = index < activeStep;
            return (
              <button
                key={step.label}
                onClick={() => setActiveStep(index)}
                className={(selected ? 'border-blue-300 bg-slate-950 text-white shadow-xl dark:border-blue-300/50 dark:bg-blue-950/60' : done ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100' : 'border-white/70 bg-white/78 text-slate-700 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-200') + ' group min-h-[116px] rounded-3xl border p-3 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl'}
              >
                <span className={(selected ? 'bg-blue-500 text-white' : done ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-300') + ' grid h-9 w-9 place-items-center rounded-2xl text-xs font-semibold transition-transform group-hover:scale-105'}>
                  {done ? <Check className="h-4 w-4" /> : index + 1}
                </span>
                <p className="mt-3 text-sm font-semibold">{step.label}</p>
                <p className="mt-1 text-xs leading-5 opacity-75">{step.title}</p>
              </button>
            );
          })}
        </div>

        <aside className={'rounded-[2rem] border p-5 shadow-sm transition-all ' + toneClass}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-65">{active.label}</p>
          <h4 className="mt-2 text-2xl font-semibold tracking-tight">{active.title}</h4>
          <p className="mt-3 text-sm leading-6 opacity-85">{active.detail}</p>
          <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-sm font-semibold leading-6 text-white shadow-inner ring-1 ring-white/10">{active.command}</div>
          <p className="mt-4 rounded-2xl bg-white/78 p-3 text-sm font-semibold leading-6 shadow-sm dark:bg-slate-950/70">{active.result}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => setActiveStep((value) => Math.min(scenarioSteps.length - 1, value + 1))} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-500">
              Next step
            </button>
            <button onClick={() => setActiveStep(0)} className="rounded-full bg-white/82 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-white/70 transition-all hover:-translate-y-0.5 hover:bg-white dark:bg-slate-950/70 dark:text-slate-200 dark:ring-white/10">
              Reset
            </button>
            <button onClick={() => openPage(active.page)} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-blue-100">
              Open related page
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}


function TodayOperationalClarity() {
  const todayRows = [
    {
      label: 'Open verification',
      value: 'Assisted walking session',
      owner: 'Maya Carter',
      proof: 'Caregiver confirmation + wearable motion trend',
      impact: '+2 continuity when verified',
      next: 'Ask Maya to confirm completion.',
      tone: 'gold',
      icon: FileCheck2,
    },
    {
      label: 'Care route ready',
      value: 'Nurse review path',
      owner: 'Nurse Olivia Grant',
      proof: 'Used if medication confirmation remains unresolved',
      impact: 'Prevents continuity from becoming unclear',
      next: 'Prepare care concern route if no proof arrives.',
      tone: 'blue',
      icon: HeartPulse,
    },
    {
      label: 'Physical action gate',
      value: 'Robot movement locked',
      owner: 'Caregiver approval',
      proof: 'Robot readiness can be checked; movement stays gated',
      impact: 'Safety preserved',
      next: 'Keep R1 in readiness-only mode.',
      tone: 'green',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_14%_18%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_84%_18%,rgba(249,115,22,0.14),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(239,246,255,0.78),rgba(255,247,237,0.72))] p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[radial-gradient(circle_at_14%_18%,rgba(59,130,246,0.23),transparent_30%),radial-gradient(circle_at_84%_18%,rgba(249,115,22,0.12),transparent_28%),linear-gradient(135deg,rgba(4,10,20,0.98),rgba(10,22,40,0.9),rgba(33,22,10,0.66))] dark:ring-1 dark:ring-white/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Today operational clarity</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">What needs attention right now?</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">Today should show the operating truth: owner, proof, continuity impact, and next action.</p>
        </div>
        <StatusPill tone="gold" label="1 open proof" />
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        {todayRows.map((row) => {
          const Icon = row.icon;
          const tone =
            row.tone === 'green'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100'
              : row.tone === 'gold'
                ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100'
                : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
          return (
            <article key={row.label} className={'rounded-3xl border p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl ' + tone}>
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/82 shadow-sm ring-1 ring-current/10 dark:bg-slate-950/70"><Icon className="h-5 w-5" /></span>
                <span className="rounded-full bg-white/82 px-3 py-1 text-xs font-semibold shadow-sm dark:bg-slate-950/70">{row.label}</span>
              </div>
              <h4 className="mt-4 text-xl font-semibold">{row.value}</h4>
              <div className="mt-4 space-y-2 text-sm leading-6 opacity-85">
                <p><span className="font-semibold">Owner:</span> {row.owner}</p>
                <p><span className="font-semibold">Proof:</span> {row.proof}</p>
                <p><span className="font-semibold">Impact:</span> {row.impact}</p>
                <p><span className="font-semibold">Next:</span> {row.next}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
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
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Timeline clarity</p>
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

function HumanSupportHeader({ setup }: { setup: LifeSetupState }) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(239,246,255,0.72),rgba(250,244,232,0.88))] p-7 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,41,59,0.82),rgba(44,33,17,0.56))]">
      <div className="grid gap-7 xl:grid-cols-[1fr_420px] xl:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Person status</p>
          <h2 className="mt-3 text-5xl font-semibold tracking-tight text-slate-950 dark:text-white">{setup.preferredName || setup.firstName} Roberts</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            {setup.supportMode}, {setup.mobility.toLowerCase()}, {setup.rhythm.toLowerCase()}.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoTile label="Environment" value={setup.livingSituation} />
          <InfoTile label="Continuity" value="Steady support" />
          <InfoTile label="Coverage" value="Family and caregiver connected" />
          <InfoTile label="Comfort" value="Gentle reminders" />
        </div>
      </div>
    </section>
  );
}

function SupportActionCard({ task }: { task: SupportTask }) {
  return (
    <article className="group rounded-[2rem] border border-white/70 bg-white/82 p-5 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10 dark:hover:border-blue-300/30 dark:hover:bg-slate-900/80">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-950/65 dark:text-slate-200 dark:ring-1 dark:ring-white/10">{task.category}</span>
          </div>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{task.title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">{task.reason}</p>
        </div>
        <div className="rounded-3xl bg-[#f7f5f1] p-4 text-sm text-slate-600 dark:bg-slate-950/50 dark:text-slate-300 lg:min-w-[260px]">
          <SummaryLine label="Responsible" value={task.assignedTo} />
          <SummaryLine label="Executor" value={task.executorType} />
          <SummaryLine label="Due" value={task.dueTime} />
          <SummaryLine label="Verification" value={task.verificationMethod} />
        </div>
      </div>
    </article>
  );
}

function NeedsAttentionPanel() {
  return (
    <aside className="rounded-[2rem] border border-amber-200 bg-amber-50/80 p-5 shadow-sm backdrop-blur-xl dark:border-amber-300/25 dark:bg-slate-950/72 dark:ring-1 dark:ring-amber-300/15">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-slate-950/80 dark:text-amber-100 dark:ring-1 dark:ring-amber-300/25">
          <AlertCircle className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-200">Needs Attention</p>
          <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">3 open items</h3>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {attentionItems.map((item) => (
          <div key={item} className="border-l-4 border-amber-300 rounded-3xl bg-white/86 p-4 text-sm leading-6 text-slate-700 shadow-sm dark:border-amber-300/45 dark:bg-slate-950/65 dark:text-slate-200 dark:ring-1 dark:ring-amber-300/15">
            {item}
          </div>
        ))}
      </div>
    </aside>
  );
}

function VerifiedTimelineCompact() {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl transition-all hover:border-blue-200 dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10 dark:hover:border-blue-300/30">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Verified Human Support Timeline</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">What already happened</h2>
      <div className="mt-6 space-y-3">
        {verifiedActions.slice(0, 4).map((event) => (
          <VerifiedActionCard key={`${event.time}-${event.action}`} event={event} />
        ))}
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

function NextSupportWindow() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 p-6 text-white shadow-sm dark:border-white/10">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="absolute -bottom-12 left-8 h-28 w-40 rounded-full bg-amber-300/16 blur-3xl" />
      <div className="relative">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-100">Next support window</p>
      <h3 className="mt-4 text-3xl font-semibold tracking-tight">Rest period check</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">15:00, Daniel Roberts, family confirmed.</p>
      <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-blue-300 to-amber-300" />
      </div>
      <p className="mt-4 text-sm text-slate-300">Support continuity is steady. Confirmation will update the timeline.</p>
      </div>
    </section>
  );
}

function CareContactNetwork({ compact = false }: { compact?: boolean }) {
  const contacts = [
    {
      role: 'Doctor',
      name: 'Dr. Elena Morris',
      availability: 'Clinic hours',
      trigger: 'Recovery plan change, medication concern, high-risk verification',
      action: 'Send clinical summary',
      tone: 'blue',
      icon: ShieldCheck,
    },
    {
      role: 'Nurse',
      name: 'Nurse Olivia Grant',
      availability: 'Daily check-in',
      trigger: 'Routine recovery question, wound care note, mobility concern',
      action: 'Request nurse follow-up',
      tone: 'green',
      icon: HeartPulse,
    },
    {
      role: 'Emergency',
      name: 'Emergency services',
      availability: 'Urgent only',
      trigger: 'Fall risk, acute distress, unresolved safety event',
      action: 'Escalate emergency path',
      tone: 'red',
      icon: AlertCircle,
    },
    {
      role: 'Family',
      name: 'Daniel Roberts',
      availability: 'Family fallback',
      trigger: 'Missed confirmation, evening digest, caregiver unavailable',
      action: 'Send family update',
      tone: 'gold',
      icon: UsersRound,
    },
  ];

  const escalationSteps = [
    { label: 'Routine', target: 'Family or nurse', time: 'Same day' },
    { label: 'Care concern', target: 'Nurse then doctor', time: 'Priority window' },
    { label: 'Clinical review', target: 'Doctor', time: 'Before plan change' },
    { label: 'Emergency', target: 'Emergency services', time: 'Immediate' },
  ];

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.22),transparent_28%),radial-gradient(circle_at_82%_16%,rgba(16,185,129,0.16),transparent_28%),radial-gradient(circle_at_74%_86%,rgba(249,115,22,0.16),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(239,246,255,0.78),rgba(255,247,237,0.72))] p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.28),transparent_28%),radial-gradient(circle_at_82%_16%,rgba(16,185,129,0.13),transparent_28%),radial-gradient(circle_at_74%_86%,rgba(249,115,22,0.12),transparent_28%),linear-gradient(135deg,rgba(4,10,20,0.98),rgba(10,22,40,0.9),rgba(33,22,10,0.68))] dark:ring-1 dark:ring-white/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Care connection network</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Doctor, nurse, emergency, and family are connected by clear escalation rules.</h3>
          {!compact && <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">SAVEN should never blur normal support with emergency response. This layer shows who gets contacted, when, and what information is sent.</p>}
        </div>
        <StatusPill tone="green" label="Care contacts ready" />
      </div>

      <div className={'mt-6 grid gap-4 ' + (compact ? 'lg:grid-cols-4' : 'xl:grid-cols-[minmax(0,1fr)_360px]')}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {contacts.map((contact) => {
            const Icon = contact.icon;
            const tone = contact.tone === 'red'
              ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-300/25 dark:bg-red-500/10 dark:text-red-100'
              : contact.tone === 'green'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-500/10 dark:text-emerald-100'
                : contact.tone === 'gold'
                  ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-500/10 dark:text-amber-100'
                  : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-300/20 dark:bg-blue-500/10 dark:text-blue-100';
            return (
              <article key={contact.role} className={'group rounded-3xl border p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ' + tone}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-65">{contact.role}</p>
                    <h4 className="mt-2 text-xl font-semibold">{contact.name}</h4>
                  </div>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/82 shadow-sm ring-1 ring-white/70 transition-transform group-hover:scale-105 dark:bg-slate-950/70 dark:ring-white/10">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <p className="mt-4 rounded-full bg-white/82 px-3 py-1 text-xs font-semibold shadow-sm dark:bg-slate-950/70">{contact.availability}</p>
                {!compact && <p className="mt-4 text-sm leading-6 opacity-85">{contact.trigger}</p>}
                <button className="mt-4 w-full rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-700 dark:bg-white dark:text-slate-950 dark:hover:bg-blue-100">
                  {contact.action}
                </button>
              </article>
            );
          })}
        </div>

        {!compact && (
          <aside className="rounded-[2rem] border border-white/10 bg-slate-950 p-5 text-white shadow-xl shadow-slate-950/20">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-100">Escalation ladder</p>
            <div className="mt-5 space-y-3">
              {escalationSteps.map((step, index) => (
                <div key={step.label} className="grid grid-cols-[38px_minmax(0,1fr)] gap-3 rounded-3xl border border-white/10 bg-white/[0.06] p-3">
                  <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-orange-400 text-sm font-semibold text-white">{index + 1}</span>
                  <div>
                    <p className="font-semibold text-white">{step.label}</p>
                    <p className="mt-1 text-sm text-slate-300">{step.target}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-3xl bg-red-500/10 p-4 text-sm leading-6 text-red-100 ring-1 ring-red-300/20">
              Emergency path is visual only in this development version. No real emergency service, phone, SMS, or medical system is connected.
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}

