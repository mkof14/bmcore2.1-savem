# SAVEN Public Website And Real System Separation Plan

Project: SAVEN  
Environment: BioMath Core  
Goal: Separate the public SAVEN website from the real SAVEN life-support system and create a clear entry into daily human support operations

## Product Separation

SAVEN has two distinct product areas.

The public website explains SAVEN as a product, platform, architecture layer, and partnership opportunity.

The real SAVEN system starts when a person creates a support profile, connects a support circle, activates daily support, and begins tracking verified support actions.

The user must immediately understand this transition:

```text
Public SAVEN website
  -> Real SAVEN system entry
  -> Personal life setup
  -> Daily support control center
  -> Verified support timeline
```

Core message:

```text
This is where SAVEN stops being a website and becomes a real-life support system for a person.
```

## 1. Route Structure

### Public Website Routes

```text
/saven
/saven/about
/saven/how-it-works
/saven/robotics
/saven/partners
```

Purpose:

- Explain what SAVEN is.
- Show product concept.
- Show use cases.
- Show BioMath Core connection.
- Show robotics readiness.
- Show partner and investor information.

Visual language:

- Dark premium.
- Cinematic.
- High-level presentation.
- Investor and partner language.
- Architecture and concept visuals.

### Real System Routes

```text
/app/saven
/app/saven/start
/app/saven/start/life-setup
/app/saven/profile
/app/saven/today
/app/saven/tasks
/app/saven/timeline
/app/saven/circle
/app/saven/devices
/app/saven/robots
/app/saven/environments
/app/saven/access
/app/saven/settings
```

Purpose:

- Actual user onboarding.
- Personal support setup.
- Daily support control.
- Verified support timeline.
- Devices and robots.
- Caregivers and family.
- Environment management.
- Access control.

Visual language:

- Light.
- Calm.
- Warm.
- Practical.
- Human-first.
- Large readable typography.
- Soft cards.
- Minimal stress.

## 2. Page Structure

### Public Website

```text
app/saven/page.tsx
  Public SAVEN landing and concept page

app/saven/about/page.tsx
  SAVEN explanation, product boundaries, BioMath Core connection

app/saven/how-it-works/page.tsx
  Model to support task to verification to timeline

app/saven/robotics/page.tsx
  Device and robot readiness, Body Layer positioning, safety boundaries

app/saven/partners/page.tsx
  Partner, investor, provider, device maker, robotics partner information
```

### Real System

```text
app/app/saven/page.tsx
  System entry redirect or overview gate

app/app/saven/start/page.tsx
  Start SAVEN entry page

app/app/saven/start/life-setup/page.tsx
  Guided Life Setup onboarding

app/app/saven/profile/page.tsx
  Human support profile

app/app/saven/today/page.tsx
  Daily support control center

app/app/saven/tasks/page.tsx
  Support task execution

app/app/saven/timeline/page.tsx
  Verified support history

app/app/saven/circle/page.tsx
  Family, caregivers, professionals, support providers

app/app/saven/devices/page.tsx
  Device readiness

app/app/saven/robots/page.tsx
  Robot readiness

app/app/saven/environments/page.tsx
  Care environments and support rules

app/app/saven/access/page.tsx
  Role-based access

app/app/saven/settings/page.tsx
  Preferences and support defaults
```

## 3. Component Structure

```text
components/saven/public/
  SAVENPublicLayout.tsx
  PublicHero.tsx
  PublicNavigation.tsx
  PublicUseCaseSection.tsx
  PublicArchitectureSection.tsx
  PublicRoboticsSection.tsx
  PublicPartnerSection.tsx

components/saven/app/
  SAVENAppLayout.tsx
  AppHeader.tsx
  AppNavigation.tsx
  PersonSelector.tsx
  EnvironmentSelector.tsx
  SystemEntryCard.tsx
  SystemEntryFlow.tsx

components/saven/life-setup/
  LifeSetupStepper.tsx
  LifeSetupOptionCard.tsx
  LifeSetupBasicProfile.tsx
  LifeSetupReview.tsx
  SupportProfileSummary.tsx

components/saven/today/
  TodaySupportHeader.tsx
  TodayActionStats.tsx
  PrioritySupportTaskCard.tsx
  NeedsAttentionCard.tsx
  VerifiedActionCard.tsx
  NextSupportWindow.tsx

components/saven/profile/
  SupportProfilePanel.tsx
  SupportModePanel.tsx
  SupportGoalsPanel.tsx
  SupportCircleStatus.tsx

components/saven/timeline/
  HumanSupportTimelineItem.tsx
  HumanSupportTimelineList.tsx
  TimelineFilters.tsx

components/saven/badges/
  SupportModeBadge.tsx
  MobilityLevelBadge.tsx
  RobotComfortBadge.tsx
  TaskStatusBadge.tsx
  VerificationMethodBadge.tsx
```

## 4. Data Models

### Prisma Models

```prisma
enum RelationshipToUser {
  myself
  family_member
  person_under_care
  client_resident
}

enum AgeGroup {
  child
  teen
  adult
  senior
  advanced_senior
}

enum Sex {
  female
  male
  prefer_not_to_say
}

enum LivingSituation {
  independent_home
  with_family
  assisted_living
  rehabilitation_center
  senior_care
  hospital_recovery
  temporary_recovery
}

enum SupportMode {
  independent_living
  home_recovery
  post_surgery_recovery
  rehabilitation
  senior_support
  chronic_condition_support
  child_support
  temporary_care
  wellness_monitoring
}

enum MobilityLevel {
  fully_independent
  light_assistance
  walking_support
  limited_mobility
  wheelchair_support
  bed_recovery
}

enum DailyRhythm {
  early_morning
  balanced_day
  low_activity
  evening_active
  structured_recovery
}

enum TechnologyComfort {
  prefers_human_support
  comfortable_with_devices
  cautious_about_robots
  open_to_robotic_support
  high_automation_acceptance
}

enum CommunicationPreference {
  gentle_notifications
  voice_prompts
  text_reminders
  visual_prompts
  caregiver_first
  minimal_notifications
}

enum MainSupportGoal {
  maintain_independence
  recover_after_surgery
  improve_daily_routine
  support_mobility
  reduce_missed_actions
  coordinate_family_and_caregivers
  prepare_for_device_or_robot_support
}

enum SupportPlanStatus {
  draft
  active
  paused
  archived
}

enum SupportTaskCategory {
  hydration
  medication_support
  mobility
  rehabilitation
  nutrition
  sleep
  check_in
  device_check
  safety
  general_support
}

enum SupportTaskPriority {
  low
  normal
  high
  urgent
}

enum SupportTaskStatus {
  planned
  active
  completed
  needs_attention
  delayed
  pending_confirmation
  escalated
  canceled
}

enum SupportExecutorType {
  user
  family
  caregiver
  professional
  support_provider
  device
  robot
  environment_system
}

enum SupportVerificationMethod {
  user_confirmed
  caregiver_confirmed
  family_confirmed
  device_confirmed
  robot_telemetry
  sensor_detected
  system_confirmed
}

model SAVENPersonProfile {
  id                      String                  @id @default(cuid())
  userId                  String
  relationshipToUser      RelationshipToUser
  firstName               String
  preferredName           String?
  ageGroup                AgeGroup
  sex                     Sex
  primaryLanguage         String
  livingSituation         LivingSituation
  supportMode             SupportMode
  mobilityLevel           MobilityLevel
  dailyRhythm             DailyRhythm
  technologyComfort       TechnologyComfort
  robotComfort            TechnologyComfort
  communicationPreference CommunicationPreference
  mainSupportGoals        MainSupportGoal[]
  createdAt               DateTime                @default(now())
  updatedAt               DateTime                @updatedAt

  supportCircleMembers SupportCircleMember[]
  supportPlans         SupportPlan[]
  supportTasks         SupportTask[]
  verifiedActions      VerifiedAction[]

  @@index([userId])
  @@index([supportMode])
}

model SupportCircleMember {
  id              String @id @default(cuid())
  personProfileId String
  name            String
  role            String
  contactMethod   String
  accessLevel     String
  active          Boolean @default(true)

  personProfile SAVENPersonProfile @relation(fields: [personProfileId], references: [id])

  @@index([personProfileId])
}

model SupportPlan {
  id              String            @id @default(cuid())
  personProfileId String
  supportMode     SupportMode
  status          SupportPlanStatus @default(draft)
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  personProfile SAVENPersonProfile @relation(fields: [personProfileId], references: [id])
  tasks         SupportTask[]

  @@index([personProfileId, status])
}

model SupportTask {
  id                 String                    @id @default(cuid())
  supportPlanId      String
  personProfileId    String
  title              String
  reason             String
  category           SupportTaskCategory
  priority           SupportTaskPriority
  assignedTo         String?
  executorType       SupportExecutorType
  dueTime            DateTime?
  status             SupportTaskStatus         @default(planned)
  verificationMethod SupportVerificationMethod
  createdAt          DateTime                  @default(now())
  updatedAt          DateTime                  @updatedAt

  supportPlan     SupportPlan        @relation(fields: [supportPlanId], references: [id])
  personProfile   SAVENPersonProfile @relation(fields: [personProfileId], references: [id])
  verifiedActions VerifiedAction[]

  @@index([supportPlanId])
  @@index([personProfileId, status])
  @@index([dueTime])
}

model VerifiedAction {
  id                 String                    @id @default(cuid())
  taskId             String
  personProfileId    String
  confirmedBy        String
  confirmationMethod SupportVerificationMethod
  timestamp          DateTime                  @default(now())
  status             SupportTaskStatus
  notes              String?

  task          SupportTask        @relation(fields: [taskId], references: [id])
  personProfile SAVENPersonProfile @relation(fields: [personProfileId], references: [id])

  @@index([taskId])
  @@index([personProfileId, timestamp])
}
```

## 5. TypeScript Types

```ts
export type RelationshipToUser = 'myself' | 'family_member' | 'person_under_care' | 'client_resident';

export type AgeGroup = 'child' | 'teen' | 'adult' | 'senior' | 'advanced_senior';

export type Sex = 'female' | 'male' | 'prefer_not_to_say';

export type LivingSituation =
  | 'independent_home'
  | 'with_family'
  | 'assisted_living'
  | 'rehabilitation_center'
  | 'senior_care'
  | 'hospital_recovery'
  | 'temporary_recovery';

export type SupportMode =
  | 'independent_living'
  | 'home_recovery'
  | 'post_surgery_recovery'
  | 'rehabilitation'
  | 'senior_support'
  | 'chronic_condition_support'
  | 'child_support'
  | 'temporary_care'
  | 'wellness_monitoring';

export type MobilityLevel =
  | 'fully_independent'
  | 'light_assistance'
  | 'walking_support'
  | 'limited_mobility'
  | 'wheelchair_support'
  | 'bed_recovery';

export type DailyRhythm =
  | 'early_morning'
  | 'balanced_day'
  | 'low_activity'
  | 'evening_active'
  | 'structured_recovery';

export type TechnologyComfort =
  | 'prefers_human_support'
  | 'comfortable_with_devices'
  | 'cautious_about_robots'
  | 'open_to_robotic_support'
  | 'high_automation_acceptance';

export type CommunicationPreference =
  | 'gentle_notifications'
  | 'voice_prompts'
  | 'text_reminders'
  | 'visual_prompts'
  | 'caregiver_first'
  | 'minimal_notifications';

export type MainSupportGoal =
  | 'maintain_independence'
  | 'recover_after_surgery'
  | 'improve_daily_routine'
  | 'support_mobility'
  | 'reduce_missed_actions'
  | 'coordinate_family_and_caregivers'
  | 'prepare_for_device_or_robot_support';

export type SAVENPersonProfile = {
  id: string;
  userId: string;
  relationshipToUser: RelationshipToUser;
  firstName: string;
  preferredName?: string;
  ageGroup: AgeGroup;
  sex: Sex;
  primaryLanguage: string;
  livingSituation: LivingSituation;
  supportMode: SupportMode;
  mobilityLevel: MobilityLevel;
  dailyRhythm: DailyRhythm;
  technologyComfort: TechnologyComfort;
  robotComfort: TechnologyComfort;
  communicationPreference: CommunicationPreference;
  mainSupportGoals: MainSupportGoal[];
};

export type SupportCircleMember = {
  id: string;
  personProfileId: string;
  name: string;
  role: string;
  contactMethod: string;
  accessLevel: string;
  active: boolean;
};

export type SupportPlan = {
  id: string;
  personProfileId: string;
  supportMode: SupportMode;
  status: 'draft' | 'active' | 'paused' | 'archived';
};

export type SupportTask = {
  id: string;
  supportPlanId: string;
  personProfileId: string;
  title: string;
  reason: string;
  category: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assignedTo?: string;
  executorType: 'user' | 'family' | 'caregiver' | 'professional' | 'support_provider' | 'device' | 'robot' | 'environment_system';
  dueTime?: string;
  status: 'planned' | 'active' | 'completed' | 'needs_attention' | 'delayed' | 'pending_confirmation' | 'escalated' | 'canceled';
  verificationMethod: 'user_confirmed' | 'caregiver_confirmed' | 'family_confirmed' | 'device_confirmed' | 'robot_telemetry' | 'sensor_detected' | 'system_confirmed';
};

export type VerifiedAction = {
  id: string;
  taskId: string;
  personProfileId: string;
  confirmedBy: string;
  confirmationMethod: SupportTask['verificationMethod'];
  timestamp: string;
  status: SupportTask['status'];
  notes?: string;
};
```

## 6. Public Website Layout

File: `components/saven/public/SAVENPublicLayout.tsx`

```tsx
import type { ReactNode } from 'react';
import Link from 'next/link';

export function SAVENPublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/80 px-6 py-5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/saven" className="text-xl font-semibold tracking-tight">SAVEN</Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <Link href="/saven/about">About</Link>
            <Link href="/saven/how-it-works">How it works</Link>
            <Link href="/saven/robotics">Robotics</Link>
            <Link href="/saven/partners">Partners</Link>
            <Link href="/app/saven/start" className="rounded-full bg-white px-4 py-2 font-semibold text-slate-950">Enter system</Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
```

## 7. Real System App Layout

File: `components/saven/app/SAVENAppLayout.tsx`

```tsx
import type { ReactNode } from 'react';
import Link from 'next/link';
import { CalendarDays, CircleCheck, Home, Settings, ShieldCheck, Users, Waypoints, Bot, Cpu, Clock3, ClipboardList } from 'lucide-react';

const navigation = [
  { label: 'Start', href: '/app/saven/start', icon: Home },
  { label: 'Profile', href: '/app/saven/profile', icon: Users },
  { label: 'Today', href: '/app/saven/today', icon: CalendarDays },
  { label: 'Tasks', href: '/app/saven/tasks', icon: ClipboardList },
  { label: 'Timeline', href: '/app/saven/timeline', icon: Clock3 },
  { label: 'Circle', href: '/app/saven/circle', icon: CircleCheck },
  { label: 'Devices', href: '/app/saven/devices', icon: Cpu },
  { label: 'Robots', href: '/app/saven/robots', icon: Bot },
  { label: 'Environments', href: '/app/saven/environments', icon: Waypoints },
  { label: 'Access', href: '/app/saven/access', icon: ShieldCheck },
  { label: 'Settings', href: '/app/saven/settings', icon: Settings }
];

export function SAVENAppLayout({ activePage, children }: { activePage: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f5f1] text-slate-950">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(201,151,65,0.16),transparent_34%)]" />
      <div className="grid min-h-screen lg:grid-cols-[292px_1fr]">
        <aside className="border-r border-white/70 bg-white/76 px-4 py-5 shadow-sm backdrop-blur-xl">
          <Link href="/app/saven/start" className="flex items-center gap-3 px-2">
            <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-2xl bg-slate-950">
              <img src="/saven-mark.png" alt="SAVEN" className="h-full w-full object-cover" />
            </span>
            <span>
              <span className="block text-xl font-semibold tracking-tight">SAVEN</span>
              <span className="block text-xs text-slate-500">Real-life support system</span>
            </span>
          </Link>
          <nav className="mt-8 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const selected = activePage === item.label.toLowerCase();
              return (
                <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${selected ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-600 hover:bg-white hover:text-slate-950'}`}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-white/70 bg-[#f7f5f1]/82 px-5 py-4 backdrop-blur-xl sm:px-8 lg:px-10">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">SAVEN System</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight">Daily support operations</h1>
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-white px-4 py-2 text-slate-600 shadow-sm">Anna Roberts</span>
                <span className="rounded-full bg-white px-4 py-2 text-slate-600 shadow-sm">Home Recovery</span>
                <span className="rounded-full bg-emerald-50 px-4 py-2 font-semibold text-emerald-700 shadow-sm">Support active</span>
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-5 pb-12 pt-6 sm:px-8 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
```

## 8. System Entry Page

Route: `/app/saven/start`

Page title: `Start SAVEN`  
Subtitle: `Set up real-life support for a person.`

File: `app/app/saven/start/page.tsx`

```tsx
import Link from 'next/link';
import { SAVENAppLayout } from '@/components/saven/app/SAVENAppLayout';
import { SystemEntryCard } from '@/components/saven/app/SystemEntryCard';
import { SystemEntryFlow } from '@/components/saven/app/SystemEntryFlow';

export default function StartSAVENPage() {
  return (
    <SAVENAppLayout activePage="start">
      <div className="space-y-8">
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-sm backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Real SAVEN begins here</p>
          <h2 className="mt-4 text-5xl font-semibold tracking-tight text-slate-950">Start SAVEN</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">Set up real-life support for a person.</p>
        </section>
        <div className="grid gap-5 lg:grid-cols-3">
          <SystemEntryCard title="Set Up a Person" description="Create a support profile for yourself, a family member, or someone under care." href="/app/saven/start/life-setup" />
          <SystemEntryCard title="Connect Support Circle" description="Add family, caregivers, professionals, or support providers." href="/app/saven/circle" />
          <SystemEntryCard title="Activate Daily Support" description="Create the first daily care and support plan." href="/app/saven/today" />
        </div>
        <SystemEntryFlow />
        <Link href="/app/saven/start/life-setup" className="inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm">Begin Life Setup</Link>
      </div>
    </SAVENAppLayout>
  );
}
```

File: `components/saven/app/SystemEntryCard.tsx`

```tsx
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function SystemEntryCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link href={href} className="group rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h3>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-950 text-white">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">{description}</p>
    </Link>
  );
}
```

File: `components/saven/app/SystemEntryFlow.tsx`

```tsx
export function SystemEntryFlow() {
  const steps = ['Person', 'Support Circle', 'Daily Support', 'Verified Actions'];

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/72 p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step} className="relative rounded-3xl bg-[#f7f5f1] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Step {index + 1}</p>
            <p className="mt-3 text-xl font-semibold text-slate-950">{step}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

## 9. Life Setup Onboarding Flow

Route: `/app/saven/start/life-setup`

Name: `Life Setup`  
Purpose: Understand the person's life situation, not a medical diagnosis.

### Steps

```text
1. Who is this for?
2. Basic profile
3. Current support situation
4. Mobility level
5. Daily rhythm
6. Support circle
7. Comfort with technology and robotics
8. Communication preference
9. Main support goals
10. Review
```

File: `components/saven/life-setup/LifeSetupStepper.tsx`

```tsx
import { LifeSetupOptionCard } from './LifeSetupOptionCard';

const steps = [
  {
    title: 'Who is this for?',
    options: ['Myself', 'Family member', 'Person under care', 'Client / resident']
  },
  {
    title: 'Current support situation',
    options: ['Independent living', 'Home recovery', 'Post-surgery recovery', 'Rehabilitation', 'Senior support', 'Chronic condition support', 'Child support', 'Temporary care', 'Wellness monitoring']
  },
  {
    title: 'Mobility level',
    options: ['Fully independent', 'Light assistance', 'Walking support', 'Limited mobility', 'Wheelchair support', 'Bed recovery']
  },
  {
    title: 'Daily rhythm',
    options: ['Early morning', 'Balanced day', 'Low activity', 'Evening active', 'Structured recovery']
  },
  {
    title: 'Support circle',
    options: ['Family available', 'Caregiver available', 'Clinic connected', 'Rehabilitation provider', 'No support connected yet']
  },
  {
    title: 'Comfort with technology and robotics',
    options: ['Prefers human support', 'Comfortable with devices', 'Cautious about robots', 'Open to robotic support', 'High automation acceptance']
  },
  {
    title: 'Communication preference',
    options: ['Gentle notifications', 'Voice prompts', 'Text reminders', 'Visual prompts', 'Caregiver first', 'Minimal notifications']
  },
  {
    title: 'Main support goals',
    options: ['Maintain independence', 'Recover after surgery', 'Improve daily routine', 'Support mobility', 'Reduce missed actions', 'Coordinate family and caregivers', 'Prepare for device or robot support']
  }
];

export function LifeSetupStepper() {
  return (
    <div className="space-y-6">
      {steps.map((step, index) => (
        <section key={step.title} className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Step {index + 1}</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{step.title}</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {step.options.map((option) => (
              <LifeSetupOptionCard key={option} label={option} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
```

File: `components/saven/life-setup/LifeSetupOptionCard.tsx`

```tsx
export function LifeSetupOptionCard({ label }: { label: string }) {
  return (
    <button className="rounded-3xl border border-slate-200 bg-white p-4 text-left text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50">
      {label}
    </button>
  );
}
```

File: `components/saven/life-setup/SupportProfileSummary.tsx`

```tsx
import type { SAVENPersonProfile } from '@/lib/saven/life-types';

export function SupportProfileSummary({ profile }: { profile: SAVENPersonProfile }) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm">
      <h3 className="text-2xl font-semibold tracking-tight text-slate-950">Review support profile</h3>
      <div className="mt-5 grid gap-4 text-sm text-slate-600 md:grid-cols-2">
        <span>Person: {profile.preferredName || profile.firstName}</span>
        <span>Situation: {profile.supportMode.replaceAll('_', ' ')}</span>
        <span>Mobility: {profile.mobilityLevel.replaceAll('_', ' ')}</span>
        <span>Environment: {profile.livingSituation.replaceAll('_', ' ')}</span>
        <span>Support circle: Ready to connect</span>
        <span>Communication: {profile.communicationPreference.replaceAll('_', ' ')}</span>
      </div>
      <button className="mt-6 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white">Create Support Profile</button>
    </section>
  );
}
```

## 10. Initial Support Plan Generator

File: `lib/saven/initial-support-plan.ts`

```ts
import type { SupportMode, SupportTask } from './life-types';

const planTasks: Record<SupportMode, Array<Pick<SupportTask, 'title' | 'reason' | 'category' | 'priority' | 'executorType' | 'verificationMethod'>>> = {
  independent_living: [
    { title: 'Morning routine check', reason: 'Daily support continuity', category: 'check_in', priority: 'normal', executorType: 'user', verificationMethod: 'user_confirmed' },
    { title: 'Hydration check', reason: 'Routine support', category: 'hydration', priority: 'normal', executorType: 'user', verificationMethod: 'user_confirmed' }
  ],
  home_recovery: [
    { title: 'Morning hydration check', reason: 'Recovery support', category: 'hydration', priority: 'normal', executorType: 'caregiver', verificationMethod: 'caregiver_confirmed' },
    { title: 'Assisted walking session', reason: 'Mobility support', category: 'mobility', priority: 'high', executorType: 'caregiver', verificationMethod: 'caregiver_confirmed' }
  ],
  post_surgery_recovery: [
    { title: 'Morning hydration check', reason: 'Post-surgery recovery support', category: 'hydration', priority: 'normal', executorType: 'caregiver', verificationMethod: 'caregiver_confirmed' },
    { title: 'Medication support confirmation', reason: 'Scheduled support confirmation', category: 'medication_support', priority: 'high', executorType: 'caregiver', verificationMethod: 'caregiver_confirmed' },
    { title: 'Assisted walking session', reason: 'Mobility recovery support', category: 'mobility', priority: 'high', executorType: 'caregiver', verificationMethod: 'caregiver_confirmed' },
    { title: 'Breathing exercise', reason: 'Recovery routine', category: 'rehabilitation', priority: 'normal', executorType: 'user', verificationMethod: 'user_confirmed' },
    { title: 'Rest period check', reason: 'Recovery pacing', category: 'check_in', priority: 'normal', executorType: 'family', verificationMethod: 'family_confirmed' },
    { title: 'Evening recovery review', reason: 'Daily support continuity', category: 'general_support', priority: 'normal', executorType: 'caregiver', verificationMethod: 'caregiver_confirmed' }
  ],
  rehabilitation: [
    { title: 'Exercise session', reason: 'Rehabilitation routine', category: 'rehabilitation', priority: 'high', executorType: 'caregiver', verificationMethod: 'caregiver_confirmed' },
    { title: 'Pain or discomfort note', reason: 'Support context', category: 'check_in', priority: 'normal', executorType: 'user', verificationMethod: 'user_confirmed' },
    { title: 'Mobility progress check', reason: 'Mobility support', category: 'mobility', priority: 'normal', executorType: 'caregiver', verificationMethod: 'caregiver_confirmed' },
    { title: 'Rest period', reason: 'Recovery pacing', category: 'general_support', priority: 'normal', executorType: 'user', verificationMethod: 'user_confirmed' },
    { title: 'Caregiver confirmation', reason: 'Verified support continuity', category: 'check_in', priority: 'normal', executorType: 'caregiver', verificationMethod: 'caregiver_confirmed' }
  ],
  senior_support: [
    { title: 'Morning check-in', reason: 'Daily support continuity', category: 'check_in', priority: 'normal', executorType: 'caregiver', verificationMethod: 'caregiver_confirmed' },
    { title: 'Hydration check', reason: 'Routine support', category: 'hydration', priority: 'normal', executorType: 'caregiver', verificationMethod: 'caregiver_confirmed' },
    { title: 'Mobility check', reason: 'Mobility support', category: 'mobility', priority: 'normal', executorType: 'caregiver', verificationMethod: 'caregiver_confirmed' },
    { title: 'Meal confirmation', reason: 'Nutrition support', category: 'nutrition', priority: 'normal', executorType: 'family', verificationMethod: 'family_confirmed' },
    { title: 'Family update', reason: 'Support circle continuity', category: 'check_in', priority: 'normal', executorType: 'family', verificationMethod: 'family_confirmed' },
    { title: 'Evening safety check', reason: 'End-of-day support', category: 'safety', priority: 'high', executorType: 'caregiver', verificationMethod: 'caregiver_confirmed' }
  ],
  chronic_condition_support: [
    { title: 'Daily routine check', reason: 'Continuity support', category: 'check_in', priority: 'normal', executorType: 'caregiver', verificationMethod: 'caregiver_confirmed' }
  ],
  child_support: [
    { title: 'Daily routine check', reason: 'Family support continuity', category: 'check_in', priority: 'normal', executorType: 'family', verificationMethod: 'family_confirmed' },
    { title: 'Meal confirmation', reason: 'Daily routine support', category: 'nutrition', priority: 'normal', executorType: 'family', verificationMethod: 'family_confirmed' },
    { title: 'Activity reminder', reason: 'Routine support', category: 'general_support', priority: 'normal', executorType: 'family', verificationMethod: 'family_confirmed' },
    { title: 'Family confirmation', reason: 'Verified support', category: 'check_in', priority: 'normal', executorType: 'family', verificationMethod: 'family_confirmed' },
    { title: 'Evening review', reason: 'End-of-day support', category: 'general_support', priority: 'normal', executorType: 'family', verificationMethod: 'family_confirmed' }
  ],
  temporary_care: [
    { title: 'Temporary care check-in', reason: 'Short-term support continuity', category: 'check_in', priority: 'normal', executorType: 'caregiver', verificationMethod: 'caregiver_confirmed' }
  ],
  wellness_monitoring: [
    { title: 'Wellness routine check', reason: 'Daily support continuity', category: 'check_in', priority: 'low', executorType: 'user', verificationMethod: 'user_confirmed' }
  ]
};

export function generateInitialSupportPlan(supportMode: SupportMode) {
  return planTasks[supportMode];
}
```

## 11. Today Support Dashboard

Route: `/app/saven/today`

Page title: `Today's Support`  
Subtitle: `What needs to happen today and what has already been confirmed.`

Required sections:

```text
Person status header
Today's actions
Priority support tasks
Needs Attention
Verified Actions
Next support window
```

File: `components/saven/today/TodaySupportHeader.tsx`

```tsx
export function TodaySupportHeader() {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Today's Support</p>
      <h2 className="mt-3 text-5xl font-semibold tracking-tight text-slate-950">Anna Roberts</h2>
      <div className="mt-5 grid gap-3 text-sm text-slate-600 md:grid-cols-5">
        <span>Age group: Senior</span>
        <span>Support mode: Post-surgery recovery</span>
        <span>Environment: Home Recovery</span>
        <span>Support circle: Connected</span>
        <span>Status: Support active</span>
      </div>
    </section>
  );
}
```

File: `components/saven/today/PrioritySupportTaskCard.tsx`

```tsx
import type { SupportTask } from '@/lib/saven/life-types';

export function PrioritySupportTaskCard({ task }: { task: SupportTask }) {
  return (
    <article className="rounded-3xl border border-white/70 bg-white/82 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-slate-950">{task.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{task.reason}</p>
        </div>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{task.priority}</span>
      </div>
      <div className="mt-5 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
        <span>Assigned helper: {task.assignedTo || 'Not assigned'}</span>
        <span>Due time: {task.dueTime || 'Today'}</span>
        <span>Verification: {task.verificationMethod.replaceAll('_', ' ')}</span>
        <span>Status: {task.status.replaceAll('_', ' ')}</span>
      </div>
    </article>
  );
}
```

## 12. Human Support Profile Page

Route: `/app/saven/profile`

This page is a life-support profile, not a patient chart.

Sections:

```text
Basic person information
Current support mode
Mobility support
Communication preference
Support goals
Active caregivers
Connected devices
Robot support comfort
Environment
```

Use labels:

```text
Support mode
Daily rhythm
Mobility support
Family connection
Device comfort
Robot support comfort
Preferred reminders
```

Avoid:

```text
Diagnosis
Patient status
Treatment plan
Clinical labels
```

## 13. Human Support Timeline Page

Route: `/app/saven/timeline`

Purpose: Show verified support history.

Timeline event types:

```text
Support action completed
Caregiver confirmed
User confirmed
Device confirmed
Robot telemetry received
Task delayed
Escalation triggered
```

File: `components/saven/timeline/HumanSupportTimelineItem.tsx`

```tsx
import type { VerifiedAction } from '@/lib/saven/life-types';

export function HumanSupportTimelineItem({ action }: { action: VerifiedAction }) {
  return (
    <article className="rounded-3xl border border-white/70 bg-white/82 p-5 shadow-sm">
      <h3 className="text-xl font-semibold tracking-tight text-slate-950">{action.notes || 'Verified support action'}</h3>
      <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
        <span>Time: {action.timestamp}</span>
        <span>Confirmed by: {action.confirmedBy}</span>
        <span>Method: {action.confirmationMethod.replaceAll('_', ' ')}</span>
        <span>Status: {action.status.replaceAll('_', ' ')}</span>
      </div>
    </article>
  );
}
```

## 14. UI Copy

### Public Website Copy

```text
SAVEN connects BioMath Core understanding with verified real-world support actions.
Execution and verification layer for human support.
Built for home recovery, senior support, care environments, devices, and future robots.
Robotics-ready, human-first, verification-centered.
```

### Real System Copy

```text
Start SAVEN
Set up real-life support for a person.
Set Up a Person
Connect Support Circle
Activate Daily Support
Today's Support
What needs to happen today and what has already been confirmed.
Needs attention
Verified actions
Next support window
Support profile
Support timeline
Assigned helper
Confirmation required
```

## 15. Seed Demo Profile

```ts
export const demoPersonProfile: SAVENPersonProfile = {
  id: 'profile_anna_roberts',
  userId: 'user_demo',
  relationshipToUser: 'family_member',
  firstName: 'Anna',
  preferredName: 'Anna',
  ageGroup: 'senior',
  sex: 'female',
  primaryLanguage: 'English',
  livingSituation: 'temporary_recovery',
  supportMode: 'post_surgery_recovery',
  mobilityLevel: 'walking_support',
  dailyRhythm: 'structured_recovery',
  technologyComfort: 'comfortable_with_devices',
  robotComfort: 'cautious_about_robots',
  communicationPreference: 'gentle_notifications',
  mainSupportGoals: ['recover_after_surgery', 'support_mobility', 'reduce_missed_actions', 'coordinate_family_and_caregivers']
};
```

## 16. Seed Demo Tasks

```ts
export const demoSupportTasks: SupportTask[] = [
  {
    id: 'task_morning_hydration',
    supportPlanId: 'plan_post_surgery',
    personProfileId: 'profile_anna_roberts',
    title: 'Morning hydration check',
    reason: 'Recovery support',
    category: 'hydration',
    priority: 'normal',
    assignedTo: 'Maya Carter',
    executorType: 'caregiver',
    dueTime: '08:30',
    status: 'completed',
    verificationMethod: 'caregiver_confirmed'
  },
  {
    id: 'task_medication_confirmation',
    supportPlanId: 'plan_post_surgery',
    personProfileId: 'profile_anna_roberts',
    title: 'Medication support confirmation',
    reason: 'Scheduled support confirmation',
    category: 'medication_support',
    priority: 'high',
    assignedTo: 'Maya Carter',
    executorType: 'caregiver',
    dueTime: '09:00',
    status: 'pending_confirmation',
    verificationMethod: 'caregiver_confirmed'
  },
  {
    id: 'task_assisted_walking',
    supportPlanId: 'plan_post_surgery',
    personProfileId: 'profile_anna_roberts',
    title: 'Assisted walking session',
    reason: 'Mobility recovery support',
    category: 'mobility',
    priority: 'high',
    assignedTo: 'Maya Carter',
    executorType: 'caregiver',
    dueTime: '10:30',
    status: 'active',
    verificationMethod: 'caregiver_confirmed'
  },
  {
    id: 'task_breathing_exercise',
    supportPlanId: 'plan_post_surgery',
    personProfileId: 'profile_anna_roberts',
    title: 'Breathing exercise',
    reason: 'Recovery routine',
    category: 'rehabilitation',
    priority: 'normal',
    assignedTo: 'Anna Roberts',
    executorType: 'user',
    dueTime: '12:00',
    status: 'planned',
    verificationMethod: 'user_confirmed'
  },
  {
    id: 'task_rest_period',
    supportPlanId: 'plan_post_surgery',
    personProfileId: 'profile_anna_roberts',
    title: 'Rest period check',
    reason: 'Recovery pacing',
    category: 'general_support',
    priority: 'normal',
    assignedTo: 'Daniel Roberts',
    executorType: 'family',
    dueTime: '15:00',
    status: 'planned',
    verificationMethod: 'family_confirmed'
  },
  {
    id: 'task_evening_review',
    supportPlanId: 'plan_post_surgery',
    personProfileId: 'profile_anna_roberts',
    title: 'Evening recovery review',
    reason: 'Daily support continuity',
    category: 'check_in',
    priority: 'normal',
    assignedTo: 'Maya Carter',
    executorType: 'caregiver',
    dueTime: '19:00',
    status: 'planned',
    verificationMethod: 'caregiver_confirmed'
  }
];
```

## 17. Implementation Order

```text
1. Split SAVEN route groups into public website and real system.
2. Add SAVENPublicLayout for /saven routes.
3. Add SAVENAppLayout for /app/saven routes.
4. Build /app/saven/start entry page.
5. Build SystemEntryCard and SystemEntryFlow.
6. Build Life Setup route and stepper.
7. Add Life Setup types and profile model.
8. Add initial support plan generator.
9. Build /app/saven/today control center.
10. Build TodaySupportHeader, TodayActionStats, PrioritySupportTaskCard, NeedsAttentionCard, VerifiedActionCard, and NextSupportWindow.
11. Build /app/saven/profile as life-support profile.
12. Build /app/saven/timeline as verified support history.
13. Build /app/saven/circle for support circle members.
14. Build /app/saven/devices and /app/saven/robots with readiness language.
15. Build /app/saven/environments with rules and escalation chain.
16. Build /app/saven/access and settings.
17. Connect Life Setup submit to profile creation.
18. Generate initial support plan after profile creation.
19. Redirect completed setup to /app/saven/today.
20. Add responsive mobile navigation.
```

## 18. Acceptance Criteria

- Public website and real system have separate routes, layouts, language, and visual style.
- `/saven` does not contain real system controls.
- `/app/saven/start` makes the real SAVEN system entry obvious.
- The user understands the setup path: Person -> Support Circle -> Daily Support -> Verified Actions.
- Life Setup feels like life context, not a medical form.
- `/app/saven/today` feels like the main real-life support control center.
- Profile page feels like a life-support profile, not a patient chart.
- Timeline shows verified support history in plain language.
- Real system uses light, warm, calm, readable interface patterns.
- All code, UI strings, enum values, database fields, route names, file names, and component names are in English.
