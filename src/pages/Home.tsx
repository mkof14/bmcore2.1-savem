import { Brain, Heart, Lightbulb, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useEffect } from 'react';
import HealthCategories from '../components/HealthCategories';
import SEO from '../components/SEO';
import { TrustBadgesCompact } from '../components/TrustSignals';
import CTASection, { CTABanner } from '../components/CTASection';
import { generateOrganizationSchema, generateWebSiteSchema, injectStructuredData } from '../lib/structuredData';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const coreValues = [
    {
      icon: Brain,
      title: 'Understanding, Not Overwhelm',
      description: 'We turn signals into meaning, then into calm, supportive guidance you can actually use.'
    },
    {
      icon: Heart,
      title: 'Reassurance, Not Urgency',
      description: 'Built on emotional safety. You are learning, never failing. Guidance is invitational, not prescriptive.'
    },
    {
      icon: Lightbulb,
      title: 'Interpretation, Not Diagnosis',
      description: 'We help you understand how your body responds day‑to‑day. Educational, supportive, wellness‑first.'
    }
  ];

  const howItWorks = [
    { step: '1', title: 'Create Your Profile', description: 'Answer short questions so the system knows your baseline' },
    { step: '2', title: 'Connect Your Signals', description: 'Add devices, questionnaires, and notes to build context' },
    { step: '3', title: 'Receive Unified Reports', description: 'Multi‑model analysis produces one clear summary and action plan' }
  ];

  const whoItsFor = [
    'People who want clarity, not medical jargon',
    'Busy professionals who need quick guidance',
    'Wellness‑focused users building better routines',
    'Athletes and performers optimizing recovery',
    'Longevity‑minded users tracking trends',
    'Anyone seeking calm, proactive self‑care'
  ];

  useEffect(() => {
    const orgSchema = generateOrganizationSchema();
    const websiteSchema = generateWebSiteSchema();
    injectStructuredData(orgSchema);
    injectStructuredData(websiteSchema);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <SEO
        title="AI-Powered Personalized Health Intelligence"
        description="Transform your health data into actionable insights with AI-powered analysis, personalized recommendations, and comprehensive health tracking. Join BioMath Core for preventive wellness."
        keywords={['AI health analytics', 'personalized medicine', 'preventive healthcare', 'wellness tracking', 'health intelligence', 'biomarkers analysis']}
        url="/"
      />

      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[radial-gradient(circle_at_top,_#fff6ed,_transparent_55%),linear-gradient(135deg,#f8fafc,white)] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_55%),linear-gradient(135deg,#0f172a,#020617)]">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-24 left-10 w-64 h-64 rounded-full bg-orange-400/20 blur-3xl"></div>
          <div className="absolute top-10 right-10 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 -translate-x-1/2 rounded-full bg-purple-400/10 blur-[120px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-200/80 bg-white/70 text-[11px] font-semibold uppercase tracking-[0.32em] text-orange-700 backdrop-blur dark:bg-white/10 dark:text-orange-200 dark:border-orange-300/20">
              AI Wellness Intelligence
            </div>
            <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-gray-900 dark:text-white mb-5">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">BioMath Core</span>
            </h1>
            <p className="text-2xl md:text-3xl lg:text-4xl font-medium text-gray-700 dark:text-gray-300 mb-8">
              Where health data becomes daily clarity
            </p>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-600 dark:text-gray-400 mb-10">
              All of Health in One Platform
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
              From sleep to cognition, from movement to mood — BioMath Core turns signals into
              understanding, then into action. Track, learn, and improve with intelligent, real‑time guidance that adapts to you.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => onNavigate('services')}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors shadow-lg"
              >
                Explore Services
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center text-white">
            <p className="font-semibold text-center">
              Limited Time: Get 30 days free on Premium plans.
            </p>
          </div>
        </div>
      </section>

      <HealthCategories onNavigate={onNavigate} />

      <section className="py-8 bg-white/80 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustBadgesCompact />
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="group bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur border border-gray-700/40 rounded-2xl p-6 md:p-8 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500/10 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Brain className="h-7 w-7 text-blue-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-200">
                AI Health with Two Expert Opinions
              </h2>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Get comprehensive health insights powered by dual AI analysis. Our unique Second Opinion system compares insights from multiple AI models, providing balanced recommendations.
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4 hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold text-blue-400 mb-1">200+</div>
                <div className="text-xs text-gray-400">AI Services</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4 hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold text-blue-400 mb-1">3M+</div>
                <div className="text-xs text-gray-400">Insights</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4 hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold text-blue-400 mb-1">98%</div>
                <div className="text-xs text-gray-400">Accuracy</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-xl p-4 hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold text-orange-400 mb-1">24/7</div>
                <div className="text-xs text-gray-400">Support</div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20 rounded-lg p-4 hover:border-blue-500/40 transition-colors duration-300">
                <div className="text-sm font-semibold text-blue-400 mb-1">Dual AI Analysis</div>
                <div className="text-xs text-gray-400">Multiple model insights</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500/5 to-transparent border border-orange-500/20 rounded-lg p-4 hover:border-orange-500/40 transition-colors duration-300">
                <div className="text-sm font-semibold text-orange-400 mb-1">Consensus Reports</div>
                <div className="text-xs text-gray-400">Balanced recommendations</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20 rounded-lg p-4 hover:border-blue-500/40 transition-colors duration-300">
                <div className="text-sm font-semibold text-blue-400 mb-1">Expert Validation</div>
                <div className="text-xs text-gray-400">Professionally verified</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400/20 dark:bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-orange-500/10 dark:from-blue-500/20 dark:to-orange-500/20 border border-blue-200/50 dark:border-blue-500/30 rounded-full mb-6">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">How We Transform Your Health Journey</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              From Signals to Meaning to Support
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Rather than tracking numbers, BioMath Core focuses on interpretation, education,
              and preventive wellness through personalized, multi‑model insights.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              const colors = [
                { bg: 'from-blue-500/10 to-blue-600/5', border: 'border-blue-500/30', icon: 'text-blue-600 dark:text-blue-400', gradient: 'from-blue-500/20 to-transparent' },
                { bg: 'from-orange-500/10 to-orange-600/5', border: 'border-orange-500/30', icon: 'text-orange-600 dark:text-orange-400', gradient: 'from-orange-500/20 to-transparent' },
                { bg: 'from-blue-500/10 to-orange-500/5', border: 'border-blue-500/30', icon: 'text-blue-600 dark:text-blue-400', gradient: 'from-blue-500/20 via-orange-500/10 to-transparent' }
              ];
              const color = colors[index];

              return (
                <div
                  key={index}
                  className={`group relative bg-gradient-to-br ${color.bg} backdrop-blur-xl border ${color.border} rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${color.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl`}></div>
                  <div className="relative">
                    <div className={`w-12 h-12 bg-gradient-to-br ${color.bg} border ${color.border} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-6 w-6 ${color.icon}`} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:translate-x-1 transition-transform duration-300">
                      {value.title}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200/70 bg-blue-50 text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-700 dark:bg-blue-500/10 dark:text-blue-200 dark:border-blue-400/20">
              Multi‑Model Intelligence
            </div>
            <h2 className="mt-5 text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white">
              AI Systems, Built for Clarity
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Two AI perspectives run in parallel and merge into one unified report — with signal coverage,
              quality scoring, and a calm action plan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-900/60 p-6 shadow-sm">
              <div className="text-xs uppercase tracking-[0.2em] text-orange-600 mb-3">Signal Hub</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Know your data strength</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                See which inputs shape your report, where coverage is strong, and what to add next.
              </p>
              <button
                onClick={() => onNavigate('member')}
                className="text-sm font-semibold text-orange-600 dark:text-orange-400 hover:underline"
              >
                Open Signal Hub →
              </button>
            </div>
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-900/60 p-6 shadow-sm">
              <div className="text-xs uppercase tracking-[0.2em] text-blue-600 mb-3">Second Opinion</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Two models, one truth</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Compare physiological and behavioral insights, then merge them into a single summary.
              </p>
              <button
                onClick={() => onNavigate('second-opinion')}
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View Second Opinion →
              </button>
            </div>
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-900/60 p-6 shadow-sm">
              <div className="text-xs uppercase tracking-[0.2em] text-green-600 mb-3">Action Plans</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Turn insight into motion</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Get 7, 14, and 30‑day steps with priorities, pacing, and gentle progress tracking.
              </p>
              <button
                onClick={() => onNavigate('reports')}
                className="text-sm font-semibold text-green-600 dark:text-green-400 hover:underline"
              >
                See Report Examples →
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Simple, supportive, effective
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white/90 dark:bg-gray-900/60 backdrop-blur border border-gray-200 dark:border-gray-800 rounded-2xl p-6 h-full shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-lg font-bold mb-4 shadow">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-orange-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Who Is This For?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              BioMath Core is designed for people who want understanding, not overwhelm
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {whoItsFor.map((item, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-slate-50 dark:bg-gray-900/60 backdrop-blur border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
                <Check className="h-6 w-6 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        variant="secondary"
        title="Start with calm clarity"
        description="Activate the services you need and get your first multi‑model report today."
        primaryButtonText="View Plans"
        onPrimaryClick={() => onNavigate('pricing')}
        showStats={false}
      />

    </div>
  );
}
