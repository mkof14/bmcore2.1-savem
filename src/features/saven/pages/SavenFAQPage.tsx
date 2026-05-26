import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:ring-1 dark:ring-white/10">
      <p className="text-sm font-semibold tracking-[0.08em] text-slate-500 dark:text-slate-400">{eyebrow}</p>
      <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">{title}</h2>
      <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-600 dark:text-slate-300">{text}</p>
    </section>
  );
}

export function SavenFAQ() {
  const [openFaq, setOpenFaq] = useState(0);
  const faqGroups = [
    {
      title: 'System basics',
      tone: 'blue',
      questions: [
        {
          question: 'What is SAVEN?',
          answer: 'SAVEN is the daily support operating layer for a person. It turns needs into visible support tasks, assigns responsibility, connects people and machines, and waits for verification before continuity updates.',
          points: ['Daily support operating system', 'Task coordination', 'People, devices, robots, environments', 'Verification before continuity'],
        },
        {
          question: 'Is SAVEN a medical diagnosis system?',
          answer: 'No. SAVEN is not a diagnosis engine and does not replace clinical decisions. It coordinates support actions, reminders, responsibility, escalation, and verification in plain operational language.',
          points: ['No diagnosis', 'No treatment automation', 'Support coordination only', 'Human decision layer stays visible'],
        },
      ],
    },
    {
      title: 'Operating modes',
      tone: 'gold',
      questions: [
        {
          question: 'What is Connected Mode?',
          answer: 'Connected Mode uses BioMath Core context to understand the person more deeply, then SAVEN converts that context into support tasks, workflows, and verified action history.',
          points: ['BioMath Core context', 'Human model signals', 'Adaptive thresholds', 'Structured support tasks'],
        },
        {
          question: 'What is Autonomous Mode?',
          answer: 'Autonomous Mode lets SAVEN operate from its own profile rules, environment settings, templates, support circle, and verification requirements even when BioMath Core context is not connected.',
          points: ['Profile rules', 'Workflow templates', 'Environment permissions', 'Verification requirements'],
        },
      ],
    },
    {
      title: 'Voice and text commands',
      tone: 'green',
      questions: [
        {
          question: 'What can voice commands do?',
          answer: 'Voice commands can start daily support, ask for current status, hand off tasks to caregivers, check devices, review robot readiness, and trigger verification requests. Text commands work as the dependable fallback.',
          points: ['Start support', 'Ask status', 'Check devices', 'Review robots', 'Verify actions'],
        },
        {
          question: 'Why keep text commands if voice exists?',
          answer: 'Text commands are important when the mic is muted, the browser cannot recognize speech, the room is noisy, or the person prefers quiet interaction. SAVEN should always remain usable.',
          points: ['Quiet mode', 'Noisy rooms', 'Accessibility', 'Reliable fallback'],
        },
      ],
    },
    {
      title: 'Robots and physical devices',
      tone: 'blue',
      questions: [
        {
          question: 'How are robots connected to SAVEN?',
          answer: 'Robots connect as permissioned endpoints. SAVEN tracks model, capabilities, safe zones, approval rules, device telemetry, environment restrictions, and verification after action.',
          points: ['Robot registry', 'Capability match', 'Safe zones', 'Human approval', 'Telemetry verification'],
        },
        {
          question: 'Can robots act independently?',
          answer: 'No. In this SAVEN design, robots are physical executors and telemetry providers, not independent care decision makers. Physical action requires approval and must be verified.',
          points: ['Readiness first', 'Approval gate', 'Override allowed', 'Verified result'],
        },
      ],
    },
    {
      title: 'Support Circle and verification',
      tone: 'gold',
      questions: [
        {
          question: 'What is the Support Circle?',
          answer: 'The Support Circle is the visible map of everyone and everything helping the person: family, caregivers, providers, home environment, devices, robots, and verification services.',
          points: ['Family', 'Caregiver', 'Provider', 'Home environment', 'Devices and robots'],
        },
        {
          question: 'What does verification mean?',
          answer: 'Verification means SAVEN does not assume support happened. It waits for confirmation from a person, device, robot telemetry, or environment signal before the timeline and continuity state update.',
          points: ['Reality confirmed', 'Action history', 'Accountability', 'Continuity state'],
        },
      ],
    },
  ];

  const flattenedFaqs = faqGroups.flatMap((group) => group.questions.map((question) => ({ ...question, group: group.title, tone: group.tone })));
  const activeFaq = flattenedFaqs[openFaq] || flattenedFaqs[0];
  const toneClass = activeFaq.tone === 'green' ? 'from-emerald-500 to-cyan-400' : activeFaq.tone === 'gold' ? 'from-orange-500 to-amber-300' : 'from-blue-600 to-cyan-400';

  return (
    <div className="space-y-6">
      <PageIntro eyebrow="FAQ for SAVEN" title="Clear answers for operating SAVEN." text="A practical guide to SAVEN as a daily support operating system: people, robots, voice commands, verification, environments, and safety rules." />

      <section className="grid gap-4 rounded-[2rem] border border-blue-300/18 bg-[#07111f] p-5 text-white shadow-xl shadow-slate-950/18 ring-1 ring-white/10 xl:grid-cols-[300px_minmax(0,1fr)]" data-saven-practice-layer="faq">
        <div>
          <p className="text-sm font-semibold tracking-[0.06em] text-blue-100/70">Ask SAVEN, then check proof</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">FAQ becomes a practice desk.</h3>
          <p className="mt-2 text-base leading-6 text-slate-200">Use these as first commands when training a caregiver, nurse, or family member.</p>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          {[
            ['Status', 'Hey SAVEN, what needs attention right now?', 'Shows owner, proof, next action'],
            ['Human route', 'Hey SAVEN, request nurse follow-up.', 'Prepares context; no auto-call'],
            ['Physical gate', 'Hey SAVEN, can the robot help here?', 'Checks room, approval, telemetry'],
          ].map(([label, command, result]) => (
            <div key={label} className="rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-4">
              <p className="text-sm font-semibold tracking-[0.06em] text-slate-300">{label}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-white">{command}</p>
              <p className="mt-2 text-xs leading-5 text-blue-100">{result}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)]">
        <aside className="overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 p-6 text-white shadow-xl shadow-slate-950/20 dark:border-white/10 dark:ring-1 dark:ring-blue-300/20">
          <div className="flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-blue-300/30">
              <img src="/saven-mark.png" alt="" className="h-full w-full object-cover" />
            </span>
            <div>
              <p className="text-sm font-semibold tracking-[0.06em] text-blue-100">SAVEN knowledge base</p>
              <h3 className="mt-1 text-2xl font-semibold">Operator answers</h3>
            </div>
          </div>
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold tracking-[0.06em] text-slate-400">Selected topic</p>
            <h4 className="mt-3 text-3xl font-semibold tracking-tight">{activeFaq.question}</h4>
            <p className="mt-4 text-sm leading-7 text-slate-300">{activeFaq.answer}</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-900">
              <div className={'h-full rounded-full bg-gradient-to-r ' + toneClass} style={{ width: ((openFaq + 1) / flattenedFaqs.length) * 100 + '%' }} />
            </div>
          </div>
        </aside>

        <div className="space-y-3">
          {flattenedFaqs.map((faq, index) => {
            const isOpen = openFaq === index;
            const tone = faq.tone === 'green' ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-300/20 dark:bg-emerald-500/10' : faq.tone === 'gold' ? 'border-amber-200 bg-amber-50 dark:border-amber-300/20 dark:bg-amber-500/10' : 'border-blue-200 bg-blue-50 dark:border-blue-300/20 dark:bg-blue-500/10';
            return (
              <article key={faq.question} className={(isOpen ? tone + ' shadow-lg' : 'border-white/70 bg-white/82 dark:border-white/10 dark:bg-slate-950/65') + ' rounded-3xl border p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl'}>
                <button onClick={() => setOpenFaq(isOpen ? -1 : index)} className="flex w-full items-center justify-between gap-4 text-left">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold tracking-[0.06em] text-slate-500 dark:text-slate-400">{faq.group}</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{faq.question}</h3>
                  </div>
                  <span className={(isOpen ? 'rotate-90 bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-300') + ' grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all'}>
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
                {isOpen && (
                  <div className="mt-4 border-t border-white/70 pt-4 dark:border-white/10">
                    <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{faq.answer}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {faq.points.map((point) => (
                        <span key={point} className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-white/70 dark:bg-slate-950/70 dark:text-slate-200 dark:ring-white/10">{point}</span>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
