import { ReactNode } from 'react';

import { ArrowRight, Check, UserRound } from 'lucide-react';



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

const sectionPages: SectionPage[] = [
  {
    id: 'architecture',
    label: 'Architecture',
    eyebrow: 'BioMath Core Environment',
    title: 'SAVEN is the execution and verification layer inside BioMath Core.',
    summary:
      'BioMath Core understands the person. SAVEN coordinates and verifies support actions. Body Layer systems execute actions physically under SAVEN safety rules.',
    accent: 'BioMath Core -> SAVEN -> Body Layer',
    visual: '/saven-architecture-levels.png',
    visualAlt: 'SAVEN level in the BioMath architecture',
    visualNote: 'Architecture reference: BioMath Life, BioMath Core, SAVEN, and Body Layer.',
    blocks: [
      {
        title: 'BioMath Core Layer',
        text: 'Maintains the continuously evolving digital human model and generates structured support recommendations and state signals.',
        items: ['Physiological trends', 'Routines', 'Recovery patterns', 'Mobility patterns', 'Hydration', 'Sleep', 'Nutrition', 'Activity monitoring'],
      },
      {
        title: 'SAVEN Execution Layer',
        text: 'Converts BioMath Core outputs into structured human support tasks with scheduling, assignment, escalation, and verification handling.',
        items: ['Task orchestration', 'Executor assignment', 'Environment rules', 'Continuity tracking', 'Safety and accountability'],
      },
      {
        title: 'Body Layer',
        text: 'Physical execution systems receive structured tasks, operate under SAVEN safety rules, and return telemetry or status.',
        items: ['Caregiver applications', 'Wearables', 'Smart beds', 'Mobility systems', 'Rehabilitation devices', 'Future humanoid robots'],
      },
    ],
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    eyebrow: 'Operational Overview',
    title: 'The SAVEN Dashboard shows current support status without creating stress.',
    summary:
      'The dashboard is the main operational view for active support, delayed tasks, device status, caregiver status, environment alerts, and wellness continuity indicators.',
    accent: 'Status. Tasks. Devices. Continuity.',
    visual: '/saven-model-control-action.png',
    visualAlt: 'SAVEN model control action flow',
    visualNote: 'The dashboard makes the execution flow visible: model signal, controlled task, verified action.',
    blocks: [
      {
        title: 'Current Support Status',
        text: 'A calm overview that shows whether the person is supported, what is active, and what needs attention.',
        items: ['Current support status', 'Active tasks', 'Delayed tasks', 'Completed actions', 'Wellness continuity indicators'],
      },
      {
        title: 'Operational Signals',
        text: 'The dashboard should summarize device, robot, caregiver, and environment readiness without technical overload.',
        items: ['Device status', 'Robot status', 'Caregiver status', 'Environment alerts', 'Online/offline state'],
      },
      {
        title: 'UI Direction',
        text: 'The dashboard must feel calm, premium, human-centered, and low-stress.',
        items: ['Large typography', 'Soft colors', 'Minimal clutter', 'Clear status language', 'No panic-first design'],
      },
    ],
  },
  {
    id: 'timeline',
    label: 'Support Timeline',
    eyebrow: 'Verified Human Support History',
    title: 'The Human Support Timeline is the operational memory of SAVEN.',
    summary:
      'This timeline stores verified human support history: what happened, when it happened, who or what performed it, and how it was confirmed.',
    accent: 'Verified history becomes continuity.',
    visual: '/saven-orbit-system.png',
    visualAlt: 'SAVEN orbital continuity system',
    visualNote: 'Timeline logic keeps every support event connected to one continuity record.',
    blocks: [
      {
        title: 'Timeline Events',
        text: 'Every confirmed support action becomes part of the continuity record.',
        items: ['Hydration confirmed', 'Walking completed', 'Rehabilitation completed', 'Medication support verified', 'Caregiver visit completed', 'Sleep support activated'],
      },
      {
        title: 'Operational Memory',
        text: 'The timeline gives families, caregivers, and operators a shared history instead of scattered notes.',
        items: ['Continuity history', 'Accountability record', 'Execution proof', 'Care context over time'],
      },
      {
        title: 'Verification Status',
        text: 'SAVEN distinguishes confirmed work from assumed work.',
        items: ['Completed', 'Partial', 'Failed', 'Not confirmed', 'Delayed', 'Exception'],
      },
    ],
  },
  {
    id: 'care-graph',
    label: 'Care Graph',
    eyebrow: 'Relationship System',
    title: 'Care Graph maps the people, systems, and environments around the person.',
    summary:
      'SAVEN should visually show the relationship between user, family, caregivers, clinicians, robots, devices, and environments.',
    accent: 'Person-centered support network.',
    visual: '/saven-orbit-dark.png',
    visualAlt: 'SAVEN relationship orbit around the central support mark',
    visualNote: 'Care Graph uses relationship mapping around the person, not a technical network map.',
    blocks: [
      {
        title: 'Human Relationships',
        text: 'The user is at the center. Family, caregivers, clinicians, and support providers are connected by responsibility and permissions.',
        items: ['User', 'Family', 'Caregivers', 'Clinicians', 'Support providers'],
      },
      {
        title: 'Execution Relationships',
        text: 'Physical support systems connect to the person through tasks, permissions, and safety rules.',
        items: ['Robots', 'Devices', 'Sensors', 'Smart environments', 'Caregiver applications'],
      },
      {
        title: 'Visual Purpose',
        text: 'The Care Graph should make responsibility visible without turning the interface into a technical network map.',
        items: ['Clear connections', 'Support roles', 'Environment scope', 'Escalation routes'],
      },
    ],
  },
  {
    id: 'registry',
    label: 'Device & Robot Registry',
    eyebrow: 'Body Layer Management',
    title: 'The registry tracks devices, robots, capabilities, telemetry, and safety limitations.',
    summary:
      'Body Layer systems are not autonomous caregivers. They receive structured tasks, return telemetry and status, and operate under SAVEN rules.',
    accent: 'Capabilities under control.',
    visual: '/saven-scalable-infrastructure.png',
    visualAlt: 'SAVEN scalable infrastructure with many execution bodies',
    visualNote: 'Registry direction: one intelligence, many controlled physical systems.',
    blocks: [
      {
        title: 'Device Status',
        text: 'Each connected system must have a clear operational state.',
        items: ['Available devices', 'Online/offline state', 'API status', 'Telemetry streams', 'Environment permissions'],
      },
      {
        title: 'Robot Profile',
        text: 'Robots should be tracked by model, capabilities, safety limits, online status, and endpoint.',
        items: ['model', 'manufacturer', 'capabilities', 'safety_limits', 'online_status', 'api_endpoint'],
      },
      {
        title: 'Visual Direction',
        text: 'Robotic visuals should be friendly, calm, premium, human-safe, and non-threatening.',
        items: ['Soft lighting', 'Rounded surfaces', 'Warm environments', 'No military aesthetics', 'No dystopian visuals'],
      },
    ],
  },
  {
    id: 'environments',
    label: 'Environments',
    eyebrow: 'Operational Context',
    title: 'SAVEN adapts support rules to the environment where care happens.',
    summary:
      'Each environment has permissions, safety rules, connected devices, escalation rules, and operational policies.',
    accent: 'One person. Multiple environments.',
    visual: '/saven-environments-one-logic.png',
    visualAlt: 'Three SAVEN environments: home, hospital, and institution',
    visualNote: 'Environment management keeps one support logic across home, hospital recovery, and care institutions.',
    blocks: [
      {
        title: 'Supported Environments',
        text: 'The same SAVEN logic should operate across daily life, recovery, and care facilities.',
        items: ['Home', 'Rehabilitation center', 'Clinic', 'Assisted living', 'Hospital recovery', 'Senior care'],
      },
      {
        title: 'Environment Rules',
        text: 'Tasks and permissions must be scoped to the current physical and operational setting.',
        items: ['Permissions', 'Safety rules', 'Connected devices', 'Escalation rules', 'Operational policies'],
      },
      {
        title: 'Continuity',
        text: 'The environment can change, but the person, history, and accountability record should not reset.',
        items: ['Transfer between locations', 'Shared support history', 'Role changes', 'Policy changes'],
      },
    ],
  },
  {
    id: 'verification',
    label: 'Verification',
    eyebrow: 'Critical Concept',
    title: 'SAVEN is based on verified execution, not assumptions.',
    summary:
      'Every action must support verification. Verification can come from people, sensors, wearables, robot telemetry, smart environments, or automated detection.',
    accent: 'No assumption without confirmation.',
    visual: '/saven-post-hospital-bridge.png',
    visualAlt: 'SAVEN post-hospital bridge',
    visualNote: 'Verification is the bridge between planned care and confirmed support.',
    blocks: [
      {
        title: 'Verification Sources',
        text: 'The system should accept multiple confirmation sources depending on the task and environment.',
        items: ['Caregiver confirmation', 'User confirmation', 'Sensor confirmation', 'Robot telemetry', 'Wearable telemetry', 'Smart environment events'],
      },
      {
        title: 'Verification Types',
        text: 'A support action is not always simply complete or incomplete. SAVEN needs nuanced verification states.',
        items: ['Completed', 'Partial', 'Failed', 'Not confirmed', 'Delayed', 'Exception'],
      },
      {
        title: 'Event History',
        text: 'All verification results become part of the support record.',
        items: ['Full event history', 'Timestamped actions', 'Executor identity', 'Telemetry payload', 'Notes'],
      },
    ],
  },
  {
    id: 'access',
    label: 'Access Control',
    eyebrow: 'Strict Role-Based Access',
    title: 'Every SAVEN action must be logged, timestamped, and auditable.',
    summary:
      'Access should be limited by role, environment, task, and time. SAVEN must support accountability without overwhelming users.',
    accent: 'Roles. Scope. Logs. Accountability.',
    visual: '/saven-control-verified.png',
    visualAlt: 'SAVEN control verified accountability',
    visualNote: 'Access control keeps roles, boundaries, and accountability explicit.',
    blocks: [
      {
        title: 'Roles',
        text: 'SAVEN roles define responsibility and permission boundaries.',
        items: ['User', 'Family', 'Caregiver', 'Clinician', 'Support provider', 'Robot operator', 'Environment admin', 'System admin'],
      },
      {
        title: 'Audit Requirements',
        text: 'Every meaningful action should be traceable.',
        items: ['Logged', 'Timestamped', 'Auditable', 'Role-scoped', 'Environment-scoped'],
      },
      {
        title: 'Product Boundary',
        text: 'Access control protects users and keeps SAVEN positioned as support infrastructure.',
        items: ['No diagnosis claims', 'No treatment control', 'No clinician replacement', 'No autonomous AI caregiver positioning'],
      },
    ],
  },
  {
    id: 'data',
    label: 'Data Models',
    eyebrow: 'Development Foundation',
    title: 'The first SAVEN data layer should stay execution-focused.',
    summary:
      'The initial models define the person, tasks, verification events, robot and device profiles, and access control.',
    accent: 'Profile. Task. Event. Robot.',
    visual: '/saven-acronym.png',
    visualAlt: 'SAVEN system acronym',
    visualNote: 'Data models stay close to SAVEN anatomy: support, action, verification, environment, network.',
    blocks: [
      {
        title: 'UserProfile',
        text: 'Stores support context and the link to the BioMath Core model.',
        items: ['id', 'name', 'age', 'support_context', 'mobility_status', 'primary_environment', 'linked_biomath_model_id'],
      },
      {
        title: 'CareTask',
        text: 'Represents a structured support action that can be scheduled, assigned, tracked, and verified.',
        items: ['id', 'user_id', 'category', 'priority', 'description', 'assigned_executor', 'executor_type', 'scheduled_time', 'status', 'verification_method', 'escalation_level'],
      },
      {
        title: 'ExecutionEvent',
        text: 'Stores verified execution history and telemetry.',
        items: ['id', 'task_id', 'executor_id', 'event_type', 'timestamp', 'telemetry_payload', 'verification_status', 'notes'],
      },
      {
        title: 'RobotProfile',
        text: 'Defines robotic execution capabilities and safety limits.',
        items: ['id', 'model', 'manufacturer', 'capabilities', 'safety_limits', 'online_status', 'api_endpoint'],
      },
    ],
  },
  {
    id: 'roadmap',
    label: 'Roadmap',
    eyebrow: 'Development Plan',
    title: 'Build the human workflow first. Add physical execution carefully.',
    summary:
      'SAVEN should grow from a dashboard and task system into controlled physical orchestration, smart environments, and humanoid robot integration.',
    accent: 'Human workflow first. Robotics carefully.',
    visual: '/saven-infrastructure.png',
    visualAlt: 'SAVEN infrastructure development direction',
    visualNote: 'Roadmap direction: execution infrastructure that can expand without losing human control.',
    blocks: [
      {
        title: 'Phase 1',
        text: 'Create the operational foundation.',
        items: ['SAVEN dashboard', 'Task system', 'Manual verification', 'Event history', 'Access control'],
      },
      {
        title: 'Phase 2',
        text: 'Connect BioMath Core signals and coordination flows.',
        items: ['BioMath Core integration', 'Smart recommendations', 'Telemetry ingestion', 'Device APIs', 'Caregiver coordination'],
      },
      {
        title: 'Phase 3',
        text: 'Add controlled physical execution.',
        items: ['Robotic integration', 'Physical task orchestration', 'Smart environments', 'Advanced verification', 'Escalation automation'],
      },
      {
        title: 'Phase 4',
        text: 'Move toward adaptive multi-location continuity.',
        items: ['Humanoid robot integration', 'Predictive support workflows', 'Adaptive environment coordination', 'Multi-location continuity'],
      },
    ],
  },
  {
    id: 'positioning',
    label: 'Positioning',
    eyebrow: 'Product Boundary',
    title: 'SAVEN is human support infrastructure, not a sci-fi robot product.',
    summary:
      'SAVEN must feel calm, premium, human-centered, operational, trustworthy, modern, and low-stress.',
    accent: 'Support infrastructure, not autonomous care.',
    visual: '/saven-brand-card.png',
    visualAlt: 'SAVEN premium brand card with support mark',
    visualNote: 'Positioning stays anchored in one calm SAVEN identity and clear product boundaries.',
    blocks: [
      {
        title: 'SAVEN Is',
        text: 'The product should be positioned as continuity infrastructure inside BioMath Core.',
        items: ['Human support infrastructure', 'Continuity platform', 'Execution and verification layer', 'Coordination system'],
      },
      {
        title: 'SAVEN Is Not',
        text: 'The product should never be framed as autonomous clinical replacement.',
        items: ['Not a medical diagnosis system', 'Not an autonomous treatment platform', 'Not a replacement for healthcare professionals', 'Not an emotional chatbot', 'Not a sci-fi robot system'],
      },
      {
        title: 'Main Product Statement',
        text: 'SAVEN connects BioMath Core’s digital understanding of a person with verified real-world support actions performed by people, devices, environments, and future robotic systems.',
        items: ['Continuous human support', 'Care coordination', 'Task execution', 'Verification', 'Safety', 'Accountability', 'Operational continuity'],
      },
    ],
  },
];

const publicMenuItems = [{ id: 'home' as const, label: 'SAVEN Home' }, ...sectionPages.map(({ id, label }) => ({ id, label }))];

const appNavItems: Array<{ id: AppPageId; label: string; icon: typeof Home }> = [
  { id: 'app-start', label: 'Start', icon: Activity },
  { id: 'app-life-setup', label: 'Life Setup', icon: UserRound },
  { id: 'app-today', label: 'Today', icon: HeartPulse },
  { id: 'app-modes', label: 'Modes', icon: Cpu },
  { id: 'app-command', label: 'Command Center', icon: MessageSquareText },
  { id: 'app-support', label: 'Support Flow', icon: Activity },
  { id: 'app-lifecycle', label: 'Task Lifecycle', icon: ClipboardCheck },
  { id: 'app-plan', label: 'Daily Plan', icon: CalendarCheck },
  { id: 'app-policies', label: 'Verify Rules', icon: ShieldCheck },
  { id: 'app-continuity', label: 'Continuity', icon: Waypoints },
  { id: 'app-timeline', label: 'Timeline', icon: Clock3 },
  { id: 'app-circle', label: 'Circle', icon: UsersRound },
  { id: 'app-devices', label: 'Devices', icon: Cpu },
  { id: 'app-robots', label: 'Robots', icon: Bot },
  { id: 'app-environments', label: 'Environments', icon: Waypoints },
  { id: 'app-recovery', label: 'Recovery', icon: Radar },
  { id: 'app-verification', label: 'Verification', icon: ShieldCheck },
  { id: 'app-settings', label: 'Settings', icon: LockKeyhole },
  { id: 'app-care-routes', label: 'Care Routes', icon: PhoneCall },
  { id: 'app-faq', label: 'FAQ for SAVEN', icon: AlertCircle },
  { id: 'app-learning', label: 'Learning Center', icon: BookOpen },
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

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/92 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-blue-300 dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-300/50"
      />
    </label>
  );
}

function SelectLike({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/92 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-blue-300 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:focus:border-blue-300/50"
      >
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function SummaryLine({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-2 last:border-b-0 dark:border-white/10">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-right font-semibold text-slate-800 dark:text-white">{value || 'Not set'}</span>
    </div>
  );
}

export function LifeSetup({
  setup,
  setSetup,
  onCreate,
}: {
  setup: LifeSetupState;
  setSetup: (value: LifeSetupState) => void;
  onCreate: () => void;
}) {
  const toggleSupportCircle = (option: string) => {
    const exists = setup.supportCircle.includes(option);
    setSetup({
      ...setup,
      supportCircle: exists ? setup.supportCircle.filter((item) => item !== option) : [...setup.supportCircle, option],
    });
  };

  const toggleGoal = (option: string) => {
    const exists = setup.goals.includes(option);
    setSetup({
      ...setup,
      goals: exists ? setup.goals.filter((item) => item !== option) : [...setup.goals, option],
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(236,246,255,0.82),rgba(255,248,232,0.74))] p-7 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(10,21,35,0.96),rgba(22,38,58,0.86),rgba(45,35,21,0.66))]">
          <div className="absolute -right-8 top-0 hidden h-52 w-52 rounded-full bg-blue-200/30 blur-3xl dark:bg-blue-400/12 md:block" />
          <div className="absolute bottom-0 left-10 hidden h-28 w-72 rounded-full bg-amber-200/24 blur-3xl dark:bg-amber-300/10 md:block" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Life Setup</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Build a real-life support profile in a few clear steps.
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              This is not a medical form. SAVEN learns the person's life situation, support circle, rhythm, comfort, and goals so daily support can start calmly.
            </p>
            <div className="mt-7 grid gap-3 md:grid-cols-4">
              {['Person', 'Life context', 'Support circle', 'Daily plan'].map((item, index) => (
                <div key={item} className="group rounded-3xl border border-white/70 bg-white/72 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-md dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10 dark:hover:bg-slate-900/80">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">Part {index + 1}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{item}</p>
                  <div className="mt-3 h-1 rounded-full bg-gradient-to-r from-blue-300 via-amber-300 to-emerald-300 opacity-60 transition-opacity group-hover:opacity-100" />
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-3 lg:grid-cols-3">
              <InfoNote tone="blue" title="Easy first pass" text="Start with the closest answers. SAVEN can adapt later." />
              <InfoNote tone="gold" title="No diagnosis" text="This setup describes life context, rhythm, comfort, and support needs." />
              <InfoNote tone="green" title="Ready for action" text="The profile creates a daily plan with visible responsibility and confirmation." />
            </div>
          </div>
        </section>

        <LifeSetupSection
          step="01"
          tone="blue"
          title="Person foundation"
          subtitle="Start with who this support system is for. Keep it simple and human."
        >
          <OptionGroup
            title="Who is this for?"
            description="This sets the relationship and the language SAVEN uses."
            options={['Myself', 'Family member', 'Person under care', 'Client / resident']}
            selected={setup.relationship}
            onSelect={(value) => setSetup({ ...setup, relationship: value })}
          />
          <InfoNote tone="blue" title="Basic information" text="These fields help SAVEN address the person naturally and place support in the right environment." className="mt-6" />
          <div className="mt-4 grid gap-4 rounded-[1.5rem] border border-slate-200/70 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-950/55 md:grid-cols-2">
            <Field label="First name" value={setup.firstName} onChange={(value) => setSetup({ ...setup, firstName: value })} />
            <Field label="Preferred name" value={setup.preferredName} onChange={(value) => setSetup({ ...setup, preferredName: value })} />
            <SelectLike label="Age group" value={setup.ageGroup} options={['Child', 'Teen', 'Adult', 'Senior', 'Advanced senior']} onChange={(value) => setSetup({ ...setup, ageGroup: value })} />
            <SelectLike label="Sex" value={setup.sex} options={['Female', 'Male', 'Prefer not to say']} onChange={(value) => setSetup({ ...setup, sex: value })} />
            <Field label="Primary language" value={setup.language} onChange={(value) => setSetup({ ...setup, language: value })} />
            <SelectLike label="Living situation" value={setup.livingSituation} options={['Independent home', 'With family', 'Assisted living', 'Rehabilitation center', 'Senior care', 'Hospital recovery', 'Home Recovery']} onChange={(value) => setSetup({ ...setup, livingSituation: value })} />
          </div>
        </LifeSetupSection>

        <LifeSetupSection
          step="02"
          tone="gold"
          title="Life context"
          subtitle="Choose the current support situation and daily rhythm. This helps SAVEN create the first support day."
        >
          <OptionGroup
            title="Current support situation"
            description="Pick the closest current mode. This can change later."
            options={['Independent living', 'Home recovery', 'Post-surgery recovery', 'Rehabilitation', 'Senior support', 'Child support', 'Wellness monitoring']}
            selected={setup.supportMode}
            onSelect={(value) => setSetup({ ...setup, supportMode: value })}
          />
          <div className="mt-6 grid gap-6">
            <OptionGroup
              title="Mobility level"
              description="This changes how many actions appear at once and who should verify them."
              options={['Fully independent', 'Light assistance', 'Walking support', 'Limited mobility', 'Wheelchair support', 'Bed recovery']}
              selected={setup.mobility}
              onSelect={(value) => setSetup({ ...setup, mobility: value })}
            />
            <OptionGroup
              title="Daily rhythm"
              description="SAVEN uses rhythm to place support windows without overwhelming the day."
              options={['Early morning', 'Balanced day', 'Low activity', 'Evening active', 'Structured recovery']}
              selected={setup.rhythm}
              onSelect={(value) => setSetup({ ...setup, rhythm: value })}
            />
          </div>
        </LifeSetupSection>

        <LifeSetupSection
          step="03"
          tone="green"
          title="Support circle"
          subtitle="Show who is available around the person. SAVEN will use this to make responsibility visible."
        >
          <MultiOptionGroup
            title="Who is available?"
            description="Select everyone who may participate in support."
            options={['Family available', 'Caregiver available', 'Clinic connected', 'Rehabilitation provider', 'No support connected yet']}
            selected={setup.supportCircle}
            onToggle={toggleSupportCircle}
          />
        </LifeSetupSection>

        <LifeSetupSection
          step="04"
          tone="blue"
          title="Comfort and communication"
          subtitle="Set how support should feel. This controls reminders, devices, and robot readiness language."
        >
          <div className="grid gap-6">
            <OptionGroup
              title="Comfort with technology and robotics"
              description="SAVEN can stay human-first or prepare for device and robot support."
              options={['Prefers human support', 'Comfortable with devices', 'Cautious about robots', 'Open to robotic support', 'High automation acceptance']}
              selected={setup.technologyComfort}
              onSelect={(value) => setSetup({ ...setup, technologyComfort: value })}
            />
            <OptionGroup
              title="Communication preference"
              description="Choose how reminders should arrive in daily life."
              options={['Gentle notifications', 'Voice prompts', 'Text reminders', 'Visual prompts', 'Caregiver first', 'Minimal notifications']}
              selected={setup.communication}
              onSelect={(value) => setSetup({ ...setup, communication: value })}
            />
          </div>
        </LifeSetupSection>

        <LifeSetupSection
          step="05"
          tone="gold"
          title="Main support goals"
          subtitle="Select the goals that make SAVEN useful from day one."
        >
          <MultiOptionGroup
            title="Starting goals"
            description="These goals shape the first support plan after setup."
            options={['Maintain independence', 'Recover after surgery', 'Improve daily routine', 'Support mobility', 'Reduce missed actions', 'Coordinate family and caregivers', 'Prepare for device or robot support']}
            selected={setup.goals}
            onToggle={toggleGoal}
          />
        </LifeSetupSection>
      </div>

      <aside className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-start">
        <SupportProfileSummary setup={setup} />
        <button onClick={onCreate} className="group flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-950/10 transition-all hover:-translate-y-0.5 hover:shadow-xl dark:from-blue-500/90 dark:to-slate-800">
          Create Support Profile
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </aside>
    </div>
  );
}

function SupportProfileSummary({ setup }: { setup: LifeSetupState }) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#0b1726]/86">
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-200/20 blur-3xl dark:bg-slate-950/70 dark:ring-1 dark:ring-blue-300/15" />
      <p className="relative text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Live Review</p>
      <h3 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">{setup.preferredName || setup.firstName} Support Profile</h3>
      <div className="mt-5 rounded-3xl border border-slate-100 bg-[#f7f5f1] p-4 dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white shadow-sm ring-1 ring-slate-900/10 dark:bg-slate-950/75 dark:text-blue-100 dark:ring-blue-300/20">
            <UserRound className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-950 dark:text-white">{setup.preferredName || setup.firstName}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{setup.supportMode}</p>
          </div>
        </div>
      </div>
      <div className="mt-5 rounded-3xl border border-slate-100 bg-white/60 px-4 py-2 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-950/65 dark:text-slate-300 dark:ring-1 dark:ring-white/10">
        <SummaryLine label="For" value={setup.relationship} />
        <SummaryLine label="Situation" value={setup.supportMode} />
        <SummaryLine label="Mobility" value={setup.mobility} />
        <SummaryLine label="Environment" value={setup.livingSituation} />
        <SummaryLine label="Daily rhythm" value={setup.rhythm} />
        <SummaryLine label="Communication" value={setup.communication} />
      </div>
      <InfoNote tone="green" title="After creation" text="SAVEN will generate the first daily support plan after profile creation." className="mt-5" />
    </section>
  );
}

function InfoNote({ tone, title, text, className = '' }: { tone: 'blue' | 'gold' | 'green' | 'amber'; title: string; text: string; className?: string }) {
  const toneClass =
    tone === 'green'
      ? 'border-emerald-200 bg-emerald-50/82 text-emerald-900 dark:border-emerald-300/25 dark:bg-slate-950/75 dark:text-emerald-100 dark:ring-1 dark:ring-emerald-300/20'
      : tone === 'gold'
        ? 'border-amber-200 bg-amber-50/82 text-amber-900 dark:border-amber-300/25 dark:bg-slate-950/75 dark:text-amber-100 dark:ring-1 dark:ring-amber-300/20'
        : tone === 'amber'
          ? 'border-orange-200 bg-orange-50/82 text-orange-900 dark:border-orange-300/25 dark:bg-slate-950/75 dark:text-orange-100 dark:ring-1 dark:ring-orange-300/20'
          : 'border-blue-200 bg-blue-50/82 text-blue-900 dark:border-blue-300/25 dark:bg-slate-950/75 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/20';

  return (
    <div className={`rounded-3xl border p-4 shadow-sm ${toneClass} ${className}`}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm leading-6 opacity-80">{text}</p>
    </div>
  );
}

function LifeSetupSection({
  step,
  tone,
  title,
  subtitle,
  children,
}: {
  step: string;
  tone: 'blue' | 'gold' | 'green';
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const toneClass =
    tone === 'green'
      ? 'from-emerald-50/95 via-white/86 to-white/70 dark:from-emerald-950/30 dark:via-slate-900/80 dark:to-slate-950/60'
      : tone === 'gold'
        ? 'from-amber-50/95 via-white/86 to-white/70 dark:from-amber-950/25 dark:via-slate-900/80 dark:to-slate-950/60'
        : 'from-blue-50/95 via-white/86 to-white/70 dark:from-blue-950/30 dark:via-slate-900/80 dark:to-slate-950/60';

  const dotClass =
    tone === 'green'
      ? 'bg-emerald-500 shadow-emerald-500/25'
      : tone === 'gold'
        ? 'bg-amber-500 shadow-amber-500/25'
        : 'bg-blue-500 shadow-blue-500/25';

  return (
    <section className={`overflow-hidden rounded-[2rem] border border-white/75 bg-gradient-to-br ${toneClass} p-5 shadow-sm backdrop-blur-xl dark:border-white/10 sm:p-6`}>
      <div className="rounded-[1.65rem] border border-white/70 bg-white/42 p-5 shadow-sm dark:border-white/10 dark:bg-slate-950/55">
        <div className="flex flex-col gap-4 border-b border-slate-200/70 pb-5 dark:border-white/10 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start">
            <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-sm font-semibold text-white shadow-lg ${dotClass}`}>{step}</div>
            <div className="min-w-0">
              <h3 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{subtitle}</p>
            </div>
          </div>
          <div className="hidden h-12 min-w-28 rounded-full border border-white/70 bg-white/70 shadow-inner dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10 lg:block" />
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </section>
  );
}

function OptionGroup({
  title,
  description,
  options,
  selected,
  onSelect,
}: {
  title: string;
  description: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/78 shadow-sm dark:border-white/10 dark:bg-[#0b1726]/72">
      <div className="border-b border-slate-200/70 bg-[linear-gradient(135deg,rgba(239,246,255,0.92),rgba(255,255,255,0.74))] px-5 py-4 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(37,99,235,0.14),rgba(15,23,42,0.62))]">
        <div className="grid gap-3 sm:grid-cols-[92px_minmax(0,1fr)] sm:items-start">
          <span className="inline-flex w-fit items-center justify-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-slate-950/70 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/25">Single</span>
          <div>
            <h4 className="text-lg font-semibold leading-6 text-slate-950 dark:text-white">{title}</h4>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
          </div>
        </div>
      </div>
      <div className="grid gap-px bg-slate-200/70 p-px dark:bg-slate-950/70">
        {options.map((option) => (
          <LifeSetupOptionCard key={option} label={option} selected={selected === option} onClick={() => onSelect(option)} />
        ))}
      </div>
    </div>
  );
}

function MultiOptionGroup({
  title,
  description,
  options,
  selected,
  onToggle,
}: {
  title: string;
  description: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/78 shadow-sm dark:border-white/10 dark:bg-[#0b1726]/72">
      <div className="border-b border-slate-200/70 bg-[linear-gradient(135deg,rgba(236,253,245,0.92),rgba(255,255,255,0.74))] px-5 py-4 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(16,185,129,0.14),rgba(15,23,42,0.62))]">
        <div className="grid gap-3 sm:grid-cols-[92px_minmax(0,1fr)] sm:items-start">
          <span className="inline-flex w-fit items-center justify-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-slate-950/70 dark:text-emerald-100 dark:ring-1 dark:ring-emerald-300/25">{selected.length} selected</span>
          <div>
            <h4 className="text-lg font-semibold leading-6 text-slate-950 dark:text-white">{title}</h4>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
          </div>
        </div>
      </div>
      <div className="grid gap-px bg-slate-200/70 p-px dark:bg-slate-950/70">
        {options.map((option) => (
          <LifeSetupOptionCard key={option} label={option} selected={selected.includes(option)} onClick={() => onToggle(option)} />
        ))}
      </div>
    </div>
  );
}

function LifeSetupOptionCard({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`group relative min-h-[56px] w-full overflow-hidden border-0 px-4 py-3 text-left transition-all focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-300/70 ${
        selected
          ? 'bg-[linear-gradient(135deg,#172554,#1d4ed8)] text-white dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,64,175,0.72))] dark:text-blue-100 dark:ring-1 dark:ring-blue-300/25'
          : 'bg-white text-slate-700 hover:bg-blue-50/90 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:bg-blue-400/10'
      }`}
    >
      <span className={`absolute inset-y-0 left-0 w-1.5 transition-colors ${selected ? 'bg-emerald-300' : 'bg-slate-200 group-hover:bg-blue-300 dark:bg-slate-800 dark:group-hover:bg-blue-300/60'}`} />
      <div className="grid grid-cols-[minmax(0,1fr)_22px] items-center gap-4 pl-3">
        <span className="min-w-0 whitespace-normal break-words text-sm font-semibold leading-5">{label}</span>
        <span className={`grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border transition-all ${selected ? 'border-white/20 bg-emerald-600 text-white dark:bg-emerald-300 dark:text-slate-950' : 'border-slate-300 bg-white/80 text-transparent dark:border-white/20 dark:bg-slate-950/70'}`}>
          <Check className="h-2.5 w-2.5" />
        </span>
      </div>
    </button>
  );
}

function SupportProfileSummary({ setup }: { setup: LifeSetupState }) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#0b1726]/86">
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-200/20 blur-3xl dark:bg-slate-950/70 dark:ring-1 dark:ring-blue-300/15" />
      <p className="relative text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Live Review</p>
      <h3 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">{setup.preferredName || setup.firstName} Support Profile</h3>
      <div className="mt-5 rounded-3xl border border-slate-100 bg-[#f7f5f1] p-4 dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white shadow-sm ring-1 ring-slate-900/10 dark:bg-slate-950/75 dark:text-blue-100 dark:ring-blue-300/20">
            <UserRound className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-950 dark:text-white">{setup.preferredName || setup.firstName}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{setup.supportMode}</p>
          </div>
        </div>
      </div>
      <div className="mt-5 rounded-3xl border border-slate-100 bg-white/60 px-4 py-2 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-950/65 dark:text-slate-300 dark:ring-1 dark:ring-white/10">
        <SummaryLine label="For" value={setup.relationship} />
        <SummaryLine label="Situation" value={setup.supportMode} />
        <SummaryLine label="Mobility" value={setup.mobility} />
        <SummaryLine label="Environment" value={setup.livingSituation} />
        <SummaryLine label="Daily rhythm" value={setup.rhythm} />
        <SummaryLine label="Communication" value={setup.communication} />
      </div>
      <InfoNote tone="green" title="After creation" text="SAVEN will generate the first daily support plan after profile creation." className="mt-5" />
    </section>
  );
}

function InfoNote({ tone, title, text, className = '' }: { tone: 'blue' | 'gold' | 'green' | 'amber'; title: string; text: string; className?: string }) {
  const toneClass =
    tone === 'green'
      ? 'border-emerald-200 bg-emerald-50/82 text-emerald-900 dark:border-emerald-300/25 dark:bg-slate-950/75 dark:text-emerald-100 dark:ring-1 dark:ring-emerald-300/20'
      : tone === 'gold'
        ? 'border-amber-200 bg-amber-50/82 text-amber-900 dark:border-amber-300/25 dark:bg-slate-950/75 dark:text-amber-100 dark:ring-1 dark:ring-amber-300/20'
        : tone === 'amber'
          ? 'border-orange-200 bg-orange-50/82 text-orange-900 dark:border-orange-300/25 dark:bg-slate-950/75 dark:text-orange-100 dark:ring-1 dark:ring-orange-300/20'
          : 'border-blue-200 bg-blue-50/82 text-blue-900 dark:border-blue-300/25 dark:bg-slate-950/75 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/20';

  return (
    <div className={`rounded-3xl border p-4 shadow-sm ${toneClass} ${className}`}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm leading-6 opacity-80">{text}</p>
    </div>
  );
}

function LifeSetupSection({
  step,
  tone,
  title,
  subtitle,
  children,
}: {
  step: string;
  tone: 'blue' | 'gold' | 'green';
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const toneClass =
    tone === 'green'
      ? 'from-emerald-50/95 via-white/86 to-white/70 dark:from-emerald-950/30 dark:via-slate-900/80 dark:to-slate-950/60'
      : tone === 'gold'
        ? 'from-amber-50/95 via-white/86 to-white/70 dark:from-amber-950/25 dark:via-slate-900/80 dark:to-slate-950/60'
        : 'from-blue-50/95 via-white/86 to-white/70 dark:from-blue-950/30 dark:via-slate-900/80 dark:to-slate-950/60';

  const dotClass =
    tone === 'green'
      ? 'bg-emerald-500 shadow-emerald-500/25'
      : tone === 'gold'
        ? 'bg-amber-500 shadow-amber-500/25'
        : 'bg-blue-500 shadow-blue-500/25';

  return (
    <section className={`overflow-hidden rounded-[2rem] border border-white/75 bg-gradient-to-br ${toneClass} p-5 shadow-sm backdrop-blur-xl dark:border-white/10 sm:p-6`}>
      <div className="rounded-[1.65rem] border border-white/70 bg-white/42 p-5 shadow-sm dark:border-white/10 dark:bg-slate-950/55">
        <div className="flex flex-col gap-4 border-b border-slate-200/70 pb-5 dark:border-white/10 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start">
            <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-sm font-semibold text-white shadow-lg ${dotClass}`}>{step}</div>
            <div className="min-w-0">
              <h3 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{subtitle}</p>
            </div>
          </div>
          <div className="hidden h-12 min-w-28 rounded-full border border-white/70 bg-white/70 shadow-inner dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10 lg:block" />
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </section>
  );
}

function OptionGroup({
  title,
  description,
  options,
  selected,
  onSelect,
}: {
  title: string;
  description: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/78 shadow-sm dark:border-white/10 dark:bg-[#0b1726]/72">
      <div className="border-b border-slate-200/70 bg-[linear-gradient(135deg,rgba(239,246,255,0.92),rgba(255,255,255,0.74))] px-5 py-4 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(37,99,235,0.14),rgba(15,23,42,0.62))]">
        <div className="grid gap-3 sm:grid-cols-[92px_minmax(0,1fr)] sm:items-start">
          <span className="inline-flex w-fit items-center justify-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-slate-950/70 dark:text-blue-100 dark:ring-1 dark:ring-blue-300/25">Single</span>
          <div>
            <h4 className="text-lg font-semibold leading-6 text-slate-950 dark:text-white">{title}</h4>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
          </div>
        </div>
      </div>
      <div className="grid gap-px bg-slate-200/70 p-px dark:bg-slate-950/70">
        {options.map((option) => (
          <LifeSetupOptionCard key={option} label={option} selected={selected === option} onClick={() => onSelect(option)} />
        ))}
      </div>
    </div>
  );
}

function MultiOptionGroup({
  title,
  description,
  options,
  selected,
  onToggle,
}: {
  title: string;
  description: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/78 shadow-sm dark:border-white/10 dark:bg-[#0b1726]/72">
      <div className="border-b border-slate-200/70 bg-[linear-gradient(135deg,rgba(236,253,245,0.92),rgba(255,255,255,0.74))] px-5 py-4 dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(16,185,129,0.14),rgba(15,23,42,0.62))]">
        <div className="grid gap-3 sm:grid-cols-[92px_minmax(0,1fr)] sm:items-start">
          <span className="inline-flex w-fit items-center justify-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-slate-950/70 dark:text-emerald-100 dark:ring-1 dark:ring-emerald-300/25">{selected.length} selected</span>
          <div>
            <h4 className="text-lg font-semibold leading-6 text-slate-950 dark:text-white">{title}</h4>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
          </div>
        </div>
      </div>
      <div className="grid gap-px bg-slate-200/70 p-px dark:bg-slate-950/70">
        {options.map((option) => (
          <LifeSetupOptionCard key={option} label={option} selected={selected.includes(option)} onClick={() => onToggle(option)} />
        ))}
      </div>
    </div>
  );
}

function LifeSetupOptionCard({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`group relative min-h-[56px] w-full overflow-hidden border-0 px-4 py-3 text-left transition-all focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-300/70 ${
        selected
          ? 'bg-[linear-gradient(135deg,#172554,#1d4ed8)] text-white dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,64,175,0.72))] dark:text-blue-100 dark:ring-1 dark:ring-blue-300/25'
          : 'bg-white text-slate-700 hover:bg-blue-50/90 dark:bg-slate-950/70 dark:text-slate-200 dark:hover:bg-blue-400/10'
      }`}
    >
      <span className={`absolute inset-y-0 left-0 w-1.5 transition-colors ${selected ? 'bg-emerald-300' : 'bg-slate-200 group-hover:bg-blue-300 dark:bg-slate-800 dark:group-hover:bg-blue-300/60'}`} />
      <div className="grid grid-cols-[minmax(0,1fr)_22px] items-center gap-4 pl-3">
        <span className="min-w-0 whitespace-normal break-words text-sm font-semibold leading-5">{label}</span>
        <span className={`grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border transition-all ${selected ? 'border-white/20 bg-emerald-600 text-white dark:bg-emerald-300 dark:text-slate-950' : 'border-slate-300 bg-white/80 text-transparent dark:border-white/20 dark:bg-slate-950/70'}`}>
          <Check className="h-2.5 w-2.5" />
        </span>
      </div>
    </button>
  );
}

export function SupportProfile({ setup, openPage }: { setup: LifeSetupState; openPage: (pageId: string) => void }) {
  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Human Support Profile" title={`${setup.preferredName || setup.firstName} Roberts`} text="A life-support profile that describes the daily support context without becoming a medical chart." />
      <div className="grid gap-5 lg:grid-cols-3">
        <LayeredPanel title="Support mode" text={setup.supportMode} items={['Daily rhythm: ' + setup.rhythm, 'Mobility support: ' + setup.mobility, 'Environment: ' + setup.livingSituation]} />
        <LayeredPanel title="Family connection" text="Support circle is connected and ready." items={['Daniel Roberts', 'Maya Carter', 'Home Recovery']} />
        <LayeredPanel title="Technology comfort" text={setup.technologyComfort} items={['Device comfort visible', 'Robot comfort cautious', 'Preferred reminders: ' + setup.communication]} />
      </div>
      <button onClick={() => openPage('app-today')} className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white">
        Open Today's Support
      </button>
    </div>
  );
}

