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
import { savenLocalBackendGateway } from '../features/saven/services/savenLocalBackendGateway';
import type { SavenMonitoringSnapshot } from '../features/saven/contracts/savenBackendContract';

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

  useEffect(() => {
    let mounted = true;
    savenLocalBackendGateway.getMonitoringSnapshot()
      .then((nextSnapshot) => {
        if (mounted) setSnapshot(nextSnapshot);
      })
      .catch(() => {
        notifyError('SAVEN monitoring snapshot load failed');
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




