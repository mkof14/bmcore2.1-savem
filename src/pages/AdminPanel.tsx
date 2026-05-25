// reviewCommandPermission marker: Admin Ops keeps command permission review visible through worker shifts, overrides, incidents, and event audit.
import {  Settings, Users, FileText, Newspaper, Briefcase, FolderOpen, BarChart3, Shield, Menu, X, LayoutDashboard, Mail, Key, Map, Gift, Database, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import BlogManager from '../components/admin/BlogManager';
import NewsManager from '../components/admin/NewsManager';
import CareersManager from '../components/admin/CareersManager';
import EmailTemplatesManager from '../components/admin/EmailTemplatesManager';
import AccessControlSection from '../components/admin/AccessControlSection';
import SettingsSection from '../components/admin/SettingsSection';
import AnalyticsSection from '../components/admin/AnalyticsSection';
import UserManagementSection from '../components/admin/UserManagementSection';
import MarketingDocumentsSection from '../components/admin/MarketingDocumentsSection';
import AllAPIKeysManager from '../components/admin/AllAPIKeysManager';
import SiteMapManager from '../components/admin/SiteMapManager';
import InvitationManager from '../components/admin/InvitationManager';
import ConfigSystem from './admin/ConfigSystem';
import SupportChatPanel from './admin/SupportChatPanel';
import { supabase } from '../lib/supabase';
import { notifyError } from '../lib/adminNotify';
import { savenBackendGateway } from '../features/saven/services/savenBackendGatewaySelector';
import { createSavenLaunchControlReport } from '../features/saven/services/savenLaunchControlService';
import { createSavenOpsEvidencePack } from '../features/saven/services/savenOpsEvidenceService';
import { createSavenWorkerShiftBoard } from '../features/saven/services/savenWorkerHandoffService';
import { createSavenMonitoringSloReport, type SavenMonitoringSloReport } from '../features/saven/services/savenMonitoringSloService';
import { createSavenOpsAlerts, type SavenOpsAlert } from '../features/saven/services/savenAlertingService';
import type { SavenAdminOverrideAction, SavenAdminOverrideResult, SavenEventAuditRecord, SavenIncidentAction, SavenIncidentActionResult, SavenIncidentReadiness, SavenMonitoringSnapshot, SavenPersistenceStatus } from '../features/saven/contracts/savenBackendContract';

interface AdminPanelProps {
  onNavigate: (page: string) => void;
}

export default function AdminPanel({ onNavigate }: AdminPanelProps) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'saven-ops', label: 'SAVEN Ops', icon: Shield },
    { id: 'support-chat', label: 'Support Chat', icon: MessageSquare },
    { id: 'config-system', label: 'Config System (Vault)', icon: Database },
    { id: 'api-keys', label: 'API Keys & Services', icon: Key },
    { id: 'sitemap', label: 'Site Map & Pages', icon: Map },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'invitations', label: 'Invitations', icon: Gift },
    { id: 'blog', label: 'Blog Management', icon: FileText },
    { id: 'news', label: 'News Management', icon: Newspaper },
    { id: 'careers', label: 'Careers Management', icon: Briefcase },
    { id: 'email', label: 'Email Templates', icon: Mail },
    { id: 'marketing', label: 'Marketing Documents', icon: FolderOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'access', label: 'Access Control', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/40 to-white">
      <div className="flex h-screen pt-16">
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } bg-white/90 border-r border-slate-200 transition-all duration-300 flex flex-col`}
        >
          <div className="p-4 flex items-center justify-between border-b border-slate-200">
            {sidebarOpen && (
              <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5 text-gray-500" />
              ) : (
                <Menu className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-orange-50 border border-orange-200 text-orange-700'
                      : 'text-gray-600 hover:bg-slate-100 border border-transparent hover:border-slate-200'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <BackButton onNavigate={onNavigate} />

            {activeSection === 'dashboard' && <DashboardSection />}
            {activeSection === 'saven-ops' && <SavenOpsAdminSection />}
            {activeSection === 'support-chat' && <SupportChatPanel />}
            {activeSection === 'config-system' && <ConfigSystem />}
            {activeSection === 'api-keys' && <AllAPIKeysManager />}
            {activeSection === 'sitemap' && <SiteMapManager />}
            {activeSection === 'users' && <UserManagementSection />}
            {activeSection === 'invitations' && <InvitationManager />}
            {activeSection === 'blog' && <BlogManager />}
            {activeSection === 'news' && <NewsManager />}
            {activeSection === 'careers' && <CareersManager />}
            {activeSection === 'email' && <EmailTemplatesManager />}
            {activeSection === 'marketing' && <MarketingDocumentsSection />}
            {activeSection === 'analytics' && <AnalyticsSection />}
            {activeSection === 'access' && <AccessControlSection />}
            {activeSection === 'settings' && <SettingsSection />}
          </div>
        </main>
      </div>
    </div>
  );
}

function SavenOpsAdminSection() {
  const [snapshot, setSnapshot] = useState<SavenMonitoringSnapshot | null>(null);
  const [eventAudit, setEventAudit] = useState<SavenEventAuditRecord[]>([]);
  const [incidentReadiness, setIncidentReadiness] = useState<SavenIncidentReadiness | null>(null);
  const [persistenceStatus, setPersistenceStatus] = useState<SavenPersistenceStatus | null>(null);
  const [incidentActionResult, setIncidentActionResult] = useState<SavenIncidentActionResult | null>(null);
  const [overrideResult, setOverrideResult] = useState<SavenAdminOverrideResult | null>(null);

  useEffect(() => {
    let mounted = true;
    savenBackendGateway.getMonitoringSnapshot()
      .then((nextSnapshot) => {
        if (mounted) setSnapshot(nextSnapshot);
      })
      .catch(() => {
        notifyError('SAVEN monitoring snapshot load failed');
      });

    savenBackendGateway.listEventAudit()
      .then((records) => {
        if (mounted) setEventAudit(records);
      })
      .catch(() => {
        notifyError('SAVEN event audit load failed');
      });

    savenBackendGateway.getIncidentReadiness()
      .then((readiness) => {
        if (mounted) setIncidentReadiness(readiness);
      })
      .catch(() => {
        notifyError('SAVEN incident readiness load failed');
      });

    savenBackendGateway.getPersistenceStatus()
      .then((status) => {
        if (mounted) setPersistenceStatus(status);
      })
      .catch(() => {
        notifyError('SAVEN persistence status load failed');
      });

    return () => {
      mounted = false;
    };
  }, []);

  const summaryCards = [
    { label: 'Commands', value: String(snapshot?.summary.activeCommands ?? '-'), detail: 'Voice, text, and system intake', tone: 'blue' },
    { label: 'Proof waits', value: String(snapshot?.summary.openProofWaits ?? '-'), detail: 'Actions waiting for confirmation', tone: 'gold' },
    { label: 'Endpoints online', value: snapshot ? snapshot.summary.onlineEndpoints + '/4' : '-', detail: 'Devices, robot, and environment health', tone: 'green' },
    { label: 'Robot policy', value: String(snapshot?.summary.robotReadinessOnly ?? '-'), detail: 'Readiness-only robot gates', tone: 'red' },
  ];

  const signals = snapshot?.signals ?? [];
  const queueItems = snapshot?.queues ?? [];
  const auditItems = eventAudit.slice(0, 8);
  const incidentItems = incidentReadiness?.incidents.slice(0, 6) ?? [];
  const persistenceTables = persistenceStatus?.tables.slice(0, 6) ?? [];
  const sloReport: SavenMonitoringSloReport | null = snapshot ? createSavenMonitoringSloReport(snapshot) : null;
  const activeAlerts: SavenOpsAlert[] = sloReport ? createSavenOpsAlerts(sloReport) : [];
  const opsEvidencePack = createSavenOpsEvidencePack();
  const launchControlReport = createSavenLaunchControlReport();
  const workerShiftBoard = createSavenWorkerShiftBoard([
    { source: 'voice' as const, text: 'Hey SAVEN, request nurse follow-up and send recovery context.', targetTaskId: 'task-medication-0900' },
    { source: 'voice' as const, text: 'Hey SAVEN, assign caregiver Maya to this support task.', targetTaskId: 'task-mobility-1030' },
    { source: 'voice' as const, text: 'Hey SAVEN, check wearable sensor and attach proof.', targetTaskId: 'task-mobility-1030' },
    { source: 'voice' as const, text: 'Hey SAVEN, check robot readiness and keep physical approval locked.', targetTaskId: 'task-mobility-1030' },
    { source: 'voice' as const, text: 'Hey SAVEN, urgent emergency help now.', targetTaskId: 'task-emergency' },
  ]);
  const sloTone = sloReport?.status === 'breach' ? 'border-red-300/25 bg-red-500/10 text-red-100' : sloReport?.status === 'watch' ? 'border-amber-300/25 bg-amber-500/10 text-amber-100' : 'border-emerald-300/25 bg-emerald-500/10 text-emerald-100';
  const adminOverrideActions: Array<{ action: SavenAdminOverrideAction; label: string; targetId: string; reason: string }> = [
    { action: 'pause_support', label: 'Pause support', targetId: 'person-anna', reason: 'Admin review before continued support.' },
    { action: 'reassign_owner', label: 'Reassign owner', targetId: 'task-mobility-1030', reason: 'Caregiver route needs review.' },
    { action: 'approve_robot_action', label: 'Review robot action', targetId: 'robot-r1', reason: 'Robot physical action requires explicit approval.' },
    { action: 'hold_escalation', label: 'Hold escalation', targetId: 'esc-care', reason: 'Escalation should wait for admin confirmation.' },
  ];

  const runAdminOverride = async (action: SavenAdminOverrideAction, targetId: string, reason: string) => {
    const result = await savenBackendGateway.applyAdminOverride({
      action,
      actorId: 'biomath-admin',
      targetId,
      reason,
      note: 'Local SAVEN admin ops action.',
    });
    setOverrideResult(result);
  };

  const runIncidentAction = async (incidentId: string, action: SavenIncidentAction, note: string) => {
    const result = await savenBackendGateway.applyIncidentAction({
      incidentId,
      action,
      actorId: 'biomath-admin',
      note,
      assignTo: action === 'assign_owner' ? 'saven-ops-lead' : undefined,
    });
    setIncidentActionResult(result);
  };

  return (
    <div className="space-y-6" data-saven-admin-ops="true" data-saven-admin-monitoring-live="true">
      <div className="rounded-3xl border border-blue-500/20 bg-[#07111f] p-6 text-white shadow-xl shadow-slate-950/20 ring-1 ring-white/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100/70">SAVEN Operations</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Backend monitoring snapshot inside BioMath Core Admin.</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Admin now reads the SAVEN local gateway snapshot: commands, proof waits, endpoints, robot gates, escalation routes, and safety status.
            </p>
          </div>
          <span className="w-fit rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm">
            {snapshot ? 'Snapshot ready' : 'Loading snapshot'}
          </span>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const tone =
              card.tone === 'green'
                ? 'border-emerald-300/20 bg-emerald-500/10'
                : card.tone === 'gold'
                  ? 'border-amber-300/20 bg-amber-500/10'
                  : card.tone === 'red'
                    ? 'border-red-300/20 bg-red-500/10'
                    : 'border-blue-300/20 bg-blue-500/10';
            return (
              <article key={card.label} className={'min-h-[150px] rounded-2xl border p-4 ring-1 ring-white/5 ' + tone}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">{card.label}</p>
                <h3 className="mt-3 text-3xl font-semibold text-white">{card.value}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{card.detail}</p>
              </article>
            );
          })}
        </div>
      </div>

      <section className="rounded-3xl border border-emerald-300/15 bg-[#07111f] p-6 text-white shadow-xl shadow-slate-950/20 ring-1 ring-white/10" data-saven-admin-slo="true">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100/70">SAVEN SLO posture</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Support health is measured by safety gates, not generic uptime.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Admin Ops now reads SAVEN command backlog, proof waits, incident severity, robot gate, emergency gate, and endpoint availability as one operating posture.</p>
          </div>
          <span className={'w-fit rounded-full border px-4 py-2 text-sm font-semibold capitalize ' + sloTone}>
            {sloReport?.status ?? 'loading'}
          </span>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {(sloReport?.metrics ?? []).map((metric) => {
            const metricTone =
              metric.status === 'breach'
                ? 'border-red-300/20 bg-red-500/10'
                : metric.status === 'watch'
                  ? 'border-amber-300/20 bg-amber-500/10'
                  : 'border-emerald-300/20 bg-emerald-500/10';
            return (
              <article key={metric.id} className={'rounded-2xl border p-4 ring-1 ring-white/5 ' + metricTone}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">{metric.label}</p>
                  <span className="rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold capitalize text-slate-200 ring-1 ring-white/10">{metric.status}</span>
                </div>
                <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{metric.objective}</p>
                <p className="mt-3 rounded-2xl bg-slate-950/55 px-3 py-2 text-xs font-semibold leading-5 text-slate-200 ring-1 ring-white/10">{metric.action}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-sky-300/15 bg-[#07111f] p-6 text-white shadow-xl shadow-slate-950/20 ring-1 ring-white/10" data-saven-admin-launch-control="true">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-100/70">SAVEN launch control</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Final handoff has a visible go / hold decision.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Launch Control combines ops evidence, command-worker loop, privacy, monitoring, backend foundation, admin visibility, and production preview into one operator decision.</p>
          </div>
          <span className={(launchControlReport.decision === 'go' ? 'border-emerald-300/25 bg-emerald-500/10 text-emerald-100' : 'border-red-300/25 bg-red-500/10 text-red-100') + ' w-fit rounded-full border px-5 py-2 text-sm font-semibold uppercase tracking-[0.14em]'}>
            {launchControlReport.decision}
          </span>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
          {launchControlReport.gates.map((gate) => {
            const gateTone =
              gate.status === 'blocked'
                ? 'border-red-300/25 bg-red-500/10'
                : gate.status === 'watch'
                  ? 'border-amber-300/25 bg-amber-500/10'
                  : 'border-emerald-300/25 bg-emerald-500/10';
            return (
              <article key={gate.id} className={'rounded-2xl border p-4 ring-1 ring-white/5 ' + gateTone}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">{gate.label}</p>
                  <span className="rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold capitalize text-slate-100 ring-1 ring-white/10">{gate.status}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{gate.evidence}</p>
                {gate.requiredBeforeProduction && (
                  <p className="mt-3 rounded-2xl bg-slate-950/55 px-3 py-2 text-xs font-semibold text-slate-200 ring-1 ring-white/10">Required before production</p>
                )}
              </article>
            );
          })}
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <article className="rounded-2xl border border-white/10 bg-slate-950/55 p-4 ring-1 ring-white/5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Required holds</p>
            <div className="mt-3 grid gap-2">
              {launchControlReport.requiredHolds.length ? launchControlReport.requiredHolds.map((hold) => (
                <p key={hold} className="rounded-2xl bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-100 ring-1 ring-red-300/20">{hold}</p>
              )) : (
                <p className="rounded-2xl bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-100 ring-1 ring-emerald-300/20">No blocking hold gates</p>
              )}
            </div>
          </article>
          <article className="rounded-2xl border border-white/10 bg-slate-950/55 p-4 ring-1 ring-white/5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Next actions</p>
            <div className="mt-3 grid gap-2">
              {launchControlReport.nextActions.map((action, index) => (
                <div key={action} className="flex gap-3 rounded-2xl bg-white/[0.04] px-3 py-2 text-sm leading-6 text-slate-200 ring-1 ring-white/5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">{index + 1}</span>
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="rounded-3xl border border-violet-300/15 bg-[#07111f] p-6 text-white shadow-xl shadow-slate-950/20 ring-1 ring-white/10" data-saven-admin-evidence-pack="true">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-100/70">SAVEN ops evidence</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Release posture is visible before handoff.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">This pack connects command fixtures, worker handoff, privacy, monitoring, alerts, and Admin Ops into one operator-facing review signal.</p>
          </div>
          <span className="w-fit rounded-full border border-violet-300/25 bg-violet-500/10 px-4 py-2 text-sm font-semibold capitalize text-violet-100">
            {opsEvidencePack.releasePosture.replace(/_/g, ' ')}
          </span>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {Object.entries(opsEvidencePack.evidence).map(([label, value]) => (
            <article key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 ring-1 ring-white/5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label.replace(/([A-Z])/g, ' $1')}</p>
              <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
            </article>
          ))}
        </div>
        <div className="mt-5 grid gap-3 xl:grid-cols-5">
          {opsEvidencePack.gates.map((gate) => {
            const gateTone =
              gate.status === 'blocked'
                ? 'border-red-300/25 bg-red-500/10'
                : gate.status === 'watch'
                  ? 'border-amber-300/25 bg-amber-500/10'
                  : 'border-emerald-300/25 bg-emerald-500/10';
            return (
              <article key={gate.id} className={'rounded-2xl border p-4 ring-1 ring-white/5 ' + gateTone}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">{gate.id.replace(/-/g, ' ')}</p>
                  <span className="rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold capitalize text-slate-100 ring-1 ring-white/10">{gate.status}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{gate.summary}</p>
              </article>
            );
          })}
        </div>
        <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/55 p-4 ring-1 ring-white/5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Operator narrative</p>
          <div className="mt-3 grid gap-2 lg:grid-cols-2">
            {opsEvidencePack.operatorNarrative.map((line) => (
              <p key={line} className="rounded-2xl bg-white/[0.04] px-3 py-2 text-sm leading-6 text-slate-200 ring-1 ring-white/5">{line}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-cyan-300/15 bg-[#07111f] p-6 text-white shadow-xl shadow-slate-950/20 ring-1 ring-white/10" data-saven-admin-worker-shift="true">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/70">SAVEN worker shift board</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Voice commands become role-specific handoffs.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Admin can see how SAVEN routes live commands to nurse, caregiver, device, robot, and emergency endpoints before real dispatch is connected.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
            <span className="rounded-2xl border border-emerald-300/20 bg-emerald-500/10 px-3 py-2 text-emerald-100">{workerShiftBoard.summary.prepared} prepared</span>
            <span className="rounded-2xl border border-amber-300/20 bg-amber-500/10 px-3 py-2 text-amber-100">{workerShiftBoard.summary.requiresConfirmation} confirm</span>
            <span className="rounded-2xl border border-red-300/20 bg-red-500/10 px-3 py-2 text-red-100">{workerShiftBoard.summary.blocked} blocked</span>
          </div>
        </div>
        <div className="mt-5 grid gap-3 xl:grid-cols-2">
          {workerShiftBoard.packets.map((packet) => {
            const packetTone =
              packet.status === 'blocked'
                ? 'border-red-300/25 bg-red-500/10'
                : packet.status === 'requires_confirmation'
                  ? 'border-amber-300/25 bg-amber-500/10'
                  : 'border-emerald-300/25 bg-emerald-500/10';
            return (
              <article key={packet.id} className={'rounded-2xl border p-4 ring-1 ring-white/5 ' + packetTone}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{packet.worker.label}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{packet.worker.role} · {packet.worker.handoffRoute}</p>
                  </div>
                  <span className="rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold capitalize text-slate-100 ring-1 ring-white/10">{packet.status.replace(/_/g, ' ')}</span>
                </div>
                <p className="mt-3 rounded-2xl bg-slate-950/55 px-3 py-2 text-sm font-semibold leading-6 text-slate-100 ring-1 ring-white/10">{packet.command.text}</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{packet.message}</p>
                <div className="mt-4 grid gap-2">
                  {packet.nextSteps.map((step, index) => (
                    <div key={step} className="flex gap-3 rounded-2xl bg-slate-950/55 px-3 py-2 text-sm text-slate-200 ring-1 ring-white/10">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">{index + 1}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-amber-300/15 bg-[#07111f] p-6 text-white shadow-xl shadow-slate-950/20 ring-1 ring-white/10" data-saven-admin-alerts="true">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-100/70">SAVEN alert routes</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">When support is at risk, Admin sees the next move.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Alerts translate SAVEN SLO watch and breach states into action routes: Admin Ops, caregiver review, robot review, emergency review, and device review.</p>
          </div>
          <span className="w-fit rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-sm font-semibold text-slate-100">
            {activeAlerts.length ? activeAlerts.length + ' active' : 'No active alerts'}
          </span>
        </div>
        <div className="mt-5 grid gap-3 xl:grid-cols-2">
          {activeAlerts.length ? activeAlerts.map((alert) => {
            const alertTone =
              alert.severity === 'critical'
                ? 'border-red-300/25 bg-red-500/10'
                : alert.severity === 'urgent'
                  ? 'border-orange-300/25 bg-orange-500/10'
                  : alert.severity === 'watch'
                    ? 'border-amber-300/25 bg-amber-500/10'
                    : 'border-blue-300/25 bg-blue-500/10';
            return (
              <article key={alert.id} className={'rounded-2xl border p-4 ring-1 ring-white/5 ' + alertTone}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{alert.title}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{alert.route.replace(/_/g, ' ')}</p>
                  </div>
                  <span className="rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold capitalize text-slate-100 ring-1 ring-white/10">{alert.severity}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{alert.message}</p>
                <div className="mt-4 grid gap-2">
                  {alert.runbook.map((step, index) => (
                    <div key={step} className="flex gap-3 rounded-2xl bg-slate-950/55 px-3 py-2 text-sm text-slate-200 ring-1 ring-white/10">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">{index + 1}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </article>
            );
          }) : (
            <article className="rounded-2xl border border-emerald-300/20 bg-emerald-500/10 p-4 ring-1 ring-white/5">
              <p className="text-sm font-semibold text-emerald-50">SAVEN has no active alert routes.</p>
              <p className="mt-2 text-sm leading-6 text-emerald-100/75">Command, proof, robot, emergency, and endpoint posture are within review limits.</p>
            </article>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-blue-500/20 bg-[#07111f] p-6 text-white shadow-xl shadow-slate-950/20 ring-1 ring-white/10" data-saven-admin-overrides="true">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100/70">Admin overrides</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Human admin controls stay audit-first.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">These local actions model pause, reassignment, robot approval review, and escalation hold before real backend wiring.</p>
          </div>
          {overrideResult && (
            <span className="w-fit rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100 ring-1 ring-emerald-300/20">
              {overrideResult.status}
            </span>
          )}
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {adminOverrideActions.map((item) => (
            <button
              key={item.action}
              onClick={() => runAdminOverride(item.action, item.targetId, item.reason)}
              className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-left ring-1 ring-white/5 transition-all hover:-translate-y-0.5 hover:border-blue-300/35 hover:bg-white/[0.1]"
            >
              <p className="text-sm font-semibold text-white">{item.label}</p>
              <p className="mt-2 text-xs leading-5 text-slate-400">{item.reason}</p>
            </button>
          ))}
        </div>
        {overrideResult && (
          <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Last override</p>
            <p className="mt-2 text-sm font-semibold text-white">{overrideResult.message}</p>
            <p className="mt-2 text-xs text-slate-400">Actor: {overrideResult.auditTrail.actorId} · Target: {overrideResult.targetId}</p>
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-emerald-300/20 bg-[#07111f] p-6 text-white shadow-xl shadow-slate-950/20 ring-1 ring-white/10" data-saven-admin-persistence-status="true">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100/70">Persistence bridge</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Supabase path is visible before production writes.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              SAVEN tables, RLS, Edge gateway, and external-dispatch safety are tracked as a backend readiness layer.
            </p>
          </div>
          <span className="w-fit rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100 ring-1 ring-emerald-300/20">
            {persistenceStatus?.mode ?? 'loading'}
          </span>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {persistenceTables.map((item) => (
            <article key={item.table} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-white">{item.table}</h3>
                <span className={(item.criticalWrites ? 'bg-amber-500/10 text-amber-100 ring-amber-300/20' : 'bg-blue-500/10 text-blue-100 ring-blue-300/20') + ' rounded-full px-3 py-1 text-xs font-semibold ring-1'}>
                  {item.criticalWrites ? 'gated write' : 'read/audit'}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">{item.purpose}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-blue-500/20 bg-[#07111f] p-6 text-white shadow-xl shadow-slate-950/20 ring-1 ring-white/10" data-saven-admin-event-audit="true">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100/70">Event audit</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">SAVEN explains every operational move.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              Commands, proof waits, robot review, escalation, and admin actions are visible as one audit-first timeline.
            </p>
          </div>
          <span className="w-fit rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-100 ring-1 ring-emerald-300/20">
            {auditItems.length} audit events
          </span>
        </div>
        <div className="mt-5 grid gap-3 xl:grid-cols-2">
          {auditItems.map((event) => {
            const eventTone =
              event.severity === 'critical'
                ? 'border-red-300/20 bg-red-500/10 text-red-100'
                : event.severity === 'urgent'
                  ? 'border-amber-300/20 bg-amber-500/10 text-amber-100'
                  : event.severity === 'watch'
                    ? 'border-cyan-300/20 bg-cyan-500/10 text-cyan-100'
                    : 'border-blue-300/20 bg-blue-500/10 text-blue-100';
            return (
              <article key={event.id} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={'rounded-full border px-3 py-1 text-xs font-semibold ' + eventTone}>{event.severity}</span>
                  <span className="rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold text-slate-300 ring-1 ring-white/10">{event.type.replace(/_/g, ' ')}</span>
                </div>
                <h3 className="mt-3 text-sm font-semibold leading-6 text-white">{event.summary}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-400">Actor: {event.actorId} · Target: {event.targetId ?? 'system'} · {event.createdAt}</p>
              </article>
            );
          })}
          {auditItems.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm text-slate-300">
              Event audit is waiting for the backend gateway.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-amber-300/20 bg-[#0b101c] p-6 text-white shadow-xl shadow-slate-950/20 ring-1 ring-white/10" data-saven-admin-incident-readiness="true" data-saven-admin-incident-actions="true">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-100/70">Incident readiness</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Admin attention is separated from ordinary activity.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              SAVEN groups proof waits, escalation routes, robot review, and admin overrides into a short incident list.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <span className="rounded-2xl bg-white/[0.06] px-3 py-2 text-xs text-slate-300"><b className="block text-lg text-white">{incidentReadiness?.summary.open ?? '-'}</b>open</span>
            <span className="rounded-2xl bg-amber-500/10 px-3 py-2 text-xs text-amber-100"><b className="block text-lg">{incidentReadiness?.summary.urgent ?? '-'}</b>urgent</span>
            <span className="rounded-2xl bg-red-500/10 px-3 py-2 text-xs text-red-100"><b className="block text-lg">{incidentReadiness?.summary.critical ?? '-'}</b>critical</span>
            <span className="rounded-2xl bg-cyan-500/10 px-3 py-2 text-xs text-cyan-100"><b className="block text-lg">{incidentReadiness?.summary.waitingHuman ?? '-'}</b>human</span>
          </div>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {incidentItems.map((incident) => {
            const incidentTone =
              incident.severity === 'critical'
                ? 'border-red-300/20 bg-red-500/10 text-red-100'
                : incident.severity === 'urgent'
                  ? 'border-amber-300/20 bg-amber-500/10 text-amber-100'
                  : 'border-cyan-300/20 bg-cyan-500/10 text-cyan-100';
            return (
              <article key={incident.id} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={'rounded-full border px-3 py-1 text-xs font-semibold ' + incidentTone}>{incident.severity}</span>
                  <span className="rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold text-slate-300 ring-1 ring-white/10">{incident.status.replace(/_/g, ' ')}</span>
                </div>
                <h3 className="mt-3 text-sm font-semibold leading-6 text-white">{incident.title}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-400">{incident.nextStep}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button onClick={() => runIncidentAction(incident.id, 'acknowledge', 'Admin acknowledged this SAVEN incident.')} className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-950 transition-all hover:-translate-y-0.5">Acknowledge</button>
                  <button onClick={() => runIncidentAction(incident.id, 'assign_owner', 'Assigned to SAVEN Ops lead for review.')} className="rounded-full bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-all hover:-translate-y-0.5">Assign</button>
                  <button onClick={() => runIncidentAction(incident.id, 'hold', 'Held until human safety review is complete.')} className="rounded-full bg-amber-500/15 px-3 py-2 text-xs font-semibold text-amber-100 ring-1 ring-amber-300/20 transition-all hover:-translate-y-0.5">Hold</button>
                  <button onClick={() => runIncidentAction(incident.id, 'resolve', 'Resolved after admin review.')} className="rounded-full bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-100 ring-1 ring-emerald-300/20 transition-all hover:-translate-y-0.5">Resolve</button>
                </div>
              </article>
            );
          })}
          {incidentItems.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm text-slate-300">
              Incident readiness is waiting for the backend gateway.
            </div>
          )}
          {incidentActionResult && (
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
              {incidentActionResult.message}
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
        <section className="rounded-3xl border border-slate-800 bg-slate-950 p-6 text-white shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/70">Monitoring signals</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {signals.map((signal) => {
              const stateTone =
                signal.status === 'healthy'
                  ? 'bg-emerald-500/10 text-emerald-100 ring-emerald-300/20'
                  : signal.status === 'blocked'
                    ? 'bg-red-500/10 text-red-100 ring-red-300/20'
                    : 'bg-amber-500/10 text-amber-100 ring-amber-300/20';
              return (
                <div key={signal.id} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-white">{signal.label}</h3>
                    <span className={'rounded-full px-3 py-1 text-xs font-semibold ring-1 ' + stateTone}>{signal.status}</span>
                  </div>
                  <p className="mt-3 text-xl font-semibold text-white">{signal.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{signal.detail}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-950 p-6 text-white shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100/70">Live queues</p>
          <div className="mt-5 space-y-3">
            {queueItems.map((item) => {
              const severityTone =
                item.severity === 'critical'
                  ? 'bg-red-500/10 text-red-100 ring-red-300/20'
                  : item.severity === 'high'
                    ? 'bg-amber-500/10 text-amber-100 ring-amber-300/20'
                    : 'bg-blue-500/10 text-blue-100 ring-blue-300/20';
              return (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-white">{item.title}</p>
                    <span className={'rounded-full px-3 py-1 text-xs font-semibold ring-1 ' + severityTone}>{item.severity}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{item.queue} · {item.owner}</p>
                  <p className="mt-2 text-sm leading-5 text-slate-400">{item.waitingFor}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function DashboardSection() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    publishedPosts: 0,
    activeJobs: 0,
    newsItems: 0,
    emailTemplates: 0,
    emailsSent: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const [users, posts, jobs, news, templates, emails] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('career_postings').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('news_items').select('id', { count: 'exact', head: true }),
        supabase.from('email_templates').select('id', { count: 'exact', head: true }),
        supabase.from('email_sends').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        totalUsers: users.count || 0,
        publishedPosts: posts.count || 0,
        activeJobs: jobs.count || 0,
        newsItems: news.count || 0,
        emailTemplates: templates.count || 0,
        emailsSent: emails.count || 0,
      });
    } catch (error) {
      notifyError('Dashboard stats load failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-900/20 via-blue-800/10 to-gray-900 border border-blue-700/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8 text-blue-400" />
            <span className="px-2 py-1 bg-blue-900/30 border border-blue-600/30 text-blue-400 text-xs font-medium rounded-full">
              +12%
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-900/20 via-orange-800/10 to-gray-900 border border-orange-700/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <FileText className="h-8 w-8 text-orange-400" />
            <span className="px-2 py-1 bg-green-900/30 border border-green-600/30 text-green-400 text-xs font-medium rounded-full">
              +5
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Published Posts</h3>
          <p className="text-3xl font-bold text-white">{stats.publishedPosts}</p>
        </div>

        <div className="bg-gradient-to-br from-green-900/20 via-green-800/10 to-gray-900 border border-green-700/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Briefcase className="h-8 w-8 text-green-400" />
            <span className="px-2 py-1 bg-green-900/30 border border-green-600/30 text-green-400 text-xs font-medium rounded-full">
              +2
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Active Jobs</h3>
          <p className="text-3xl font-bold text-white">{stats.activeJobs}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-gray-900 border border-purple-700/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Newspaper className="h-8 w-8 text-purple-400" />
            <span className="px-2 py-1 bg-purple-900/30 border border-purple-600/30 text-purple-400 text-xs font-medium rounded-full">
              {stats.newsItems}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">News Items</h3>
          <p className="text-3xl font-bold text-white">{stats.newsItems}</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-900/20 via-cyan-800/10 to-gray-900 border border-cyan-700/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Mail className="h-8 w-8 text-cyan-400" />
            <span className="px-2 py-1 bg-cyan-900/30 border border-cyan-600/30 text-cyan-400 text-xs font-medium rounded-full">
              {stats.emailTemplates}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Email Templates</h3>
          <p className="text-3xl font-bold text-white">{stats.emailTemplates}</p>
        </div>

        <div className="bg-gradient-to-br from-pink-900/20 via-pink-800/10 to-gray-900 border border-pink-700/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="h-8 w-8 text-pink-400" />
            <span className="px-2 py-1 bg-pink-900/30 border border-pink-600/30 text-pink-400 text-xs font-medium rounded-full">
              +24
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Emails Sent</h3>
          <p className="text-3xl font-bold text-white">{stats.emailsSent}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid gap-3">
            <button className="flex items-center gap-3 p-3 bg-gray-800/50 border border-gray-700/30 rounded-lg hover:bg-gray-800 transition-colors text-left">
              <FileText className="h-5 w-5 text-orange-400" />
              <span className="text-white text-sm">Create New Blog Post</span>
            </button>
            <button className="flex items-center gap-3 p-3 bg-gray-800/50 border border-gray-700/30 rounded-lg hover:bg-gray-800 transition-colors text-left">
              <Newspaper className="h-5 w-5 text-purple-400" />
              <span className="text-white text-sm">Add News Item</span>
            </button>
            <button className="flex items-center gap-3 p-3 bg-gray-800/50 border border-gray-700/30 rounded-lg hover:bg-gray-800 transition-colors text-left">
              <Briefcase className="h-5 w-5 text-green-400" />
              <span className="text-white text-sm">Post New Job</span>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700/30 rounded-lg">
              <span className="text-sm text-gray-400">Database</span>
              <span className="px-2 py-1 bg-green-900/30 border border-green-600/30 text-green-400 text-xs font-medium rounded-full">
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700/30 rounded-lg">
              <span className="text-sm text-gray-400">API</span>
              <span className="px-2 py-1 bg-green-900/30 border border-green-600/30 text-green-400 text-xs font-medium rounded-full">
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700/30 rounded-lg">
              <span className="text-sm text-gray-400">Email Service</span>
              <span className="px-2 py-1 bg-green-900/30 border border-green-600/30 text-green-400 text-xs font-medium rounded-full">
                Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




