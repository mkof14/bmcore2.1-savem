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

function LayeredPanel({ title, text, items }: { title: string; text: string; items: string[] }) {
  return (
    <article className="group rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10 dark:hover:border-blue-300/30 dark:hover:bg-slate-900/80">
      <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-2 text-base leading-6 text-slate-600 dark:text-slate-300">{text}</p>
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
            <p className="text-sm font-semibold tracking-[0.08em] text-slate-500 dark:text-slate-400">Life Setup</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Build a real-life support profile in a few clear steps.
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              A calm setup for the person, their circle, and the first support day.
            </p>
            <div className="mt-7 grid gap-3 md:grid-cols-4">
              {['Person', 'Life context', 'Support circle', 'Daily plan'].map((item, index) => (
                <div key={item} className="group rounded-3xl border border-white/70 bg-white/72 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-md dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10 dark:hover:bg-slate-900/80">
                  <p className="text-sm font-semibold tracking-[0.06em] text-slate-400 dark:text-slate-500">Part {index + 1}</p>
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

        <section className="grid gap-4 rounded-[2rem] border border-blue-300/18 bg-[#07111f] p-5 text-white shadow-xl shadow-slate-950/18 ring-1 ring-white/10 xl:grid-cols-[300px_minmax(0,1fr)_270px]" data-saven-life-setup-rail="true">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
            <p className="text-sm font-semibold tracking-[0.06em] text-blue-200">Setup command rail</p>
            <h3 className="mt-2 text-xl font-semibold">Create support by voice or touch.</h3>
            <p className="mt-2 text-base leading-6 text-slate-300">SAVEN turns setup answers into daily support, people, devices, and proof.</p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-4">
            <div className="flex flex-wrap gap-2">
              {['Person', 'Home', 'Nurse', 'Family', 'Daily plan'].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-slate-200">{item}</span>
              ))}
            </div>
            <p className="mt-4 text-lg font-semibold leading-7">Hey SAVEN, create a support profile for Anna Roberts in Home Recovery.</p>
            <p className="mt-2 text-sm text-slate-400">Then add nurse follow-up, family updates, reminders, and mobility support.</p>
          </div>

          <div className="grid gap-2">
            {[
              ['01', 'Person context'],
              ['02', 'Support circle'],
              ['03', 'First daily plan'],
            ].map(([step, label]) => (
              <div key={step} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">{step}</span>
                <span className="text-sm font-semibold text-slate-200">{label}</span>
              </div>
            ))}
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
      <p className="relative text-sm font-semibold tracking-[0.06em] text-slate-500 dark:text-slate-400">Live Review</p>
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
              <p className="mt-2 max-w-2xl text-base leading-6 text-slate-600 dark:text-slate-300">{subtitle}</p>
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
            <p className="mt-1 max-w-3xl text-base leading-6 text-slate-600 dark:text-slate-300">{description}</p>
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
            <p className="mt-1 max-w-3xl text-base leading-6 text-slate-600 dark:text-slate-300">{description}</p>
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

export function SupportProfile({ setup, openPage }: { setup: LifeSetupState; openPage: (pageId: 'app-today') => void }) {
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

