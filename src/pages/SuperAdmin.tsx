import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, GraduationCap, BookOpen, TrendingUp, 
  Shield, AlertTriangle, CheckCircle2, XCircle, ChevronRight,
  BarChart3, Activity, Globe, Settings, LogOut, Eye,
  DollarSign, Crown, RefreshCw, MoreVertical, Search,
  ArrowUpRight, ArrowDownRight, Clock, Zap
} from 'lucide-react';

const API = 'http://localhost:4000/api/super-admin';
const MASTER_KEY = import.meta.env.VITE_SUPER_ADMIN_MASTER_KEY || '';

interface KPIs {
  totalTenants: number;
  activeTenants: number;
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  mrrEstimated: number;
  planBreakdown: { plan: string; count: number }[];
}

interface TenantData {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  subscription: {
    plan: string;
    status: string;
    currentPeriodEnd: string;
  } | null;
  stats: {
    totalClasses: number;
    totalStudents: number;
    additionalClasses: number;
    estimatedExtraCharge: number;
  };
}

const planColors: Record<string, string> = {
  starter: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
  pro: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  institution: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
};

const statusColors: Record<string, string> = {
  active: 'text-emerald-400',
  trialing: 'text-blue-400',
  past_due: 'text-red-400',
  canceled: 'text-gray-500',
};

export default function SuperAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authKey, setAuthKey] = useState('');
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [tenantsList, setTenantsList] = useState<TenantData[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'audit'>('overview');

  const headers = { 'x-super-admin-key': authKey };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [kpisRes, tenantsRes, logsRes] = await Promise.all([
        fetch(`${API}/kpis`, { headers }),
        fetch(`${API}/tenants`, { headers }),
        fetch(`${API}/audit-logs`, { headers }),
      ]);

      if (kpisRes.ok) setKpis(await kpisRes.json());
      if (tenantsRes.ok) {
        const data = await tenantsRes.json();
        setTenantsList(data.tenants || []);
      }
      if (logsRes.ok) {
        const data = await logsRes.json();
        setAuditLogs(data.logs || []);
      }

      setIsAuthenticated(true);
    } catch (e) {
      alert('Erreur de connexion au backend');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchData();
  };

  const handleTenantAction = async (tenantId: string, action: 'suspend' | 'activate') => {
    await fetch(`${API}/tenants/${tenantId}/${action}`, {
      method: 'PUT',
      headers: { ...headers, 'content-type': 'application/json' },
      body: JSON.stringify({ reason: 'Super admin action' }),
    });
    await fetchData();
  };

  const filteredTenants = tenantsList.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.slug.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 mb-4 shadow-2xl shadow-amber-500/30">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Super Admin</h1>
            <p className="text-slate-400 text-sm mt-1">Accès restreint — Madrassa Platform</p>
          </div>

          <form onSubmit={handleLogin}
            className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 space-y-4">
            <div>
              <label className="text-slate-300 text-sm font-medium block mb-2">Clé d'accès maître</label>
              <input
                type="password"
                value={authKey}
                onChange={e => setAuthKey(e.target.value)}
                placeholder="sk_super_admin_..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black py-3 rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Accéder au Panneau'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-white font-sans">
      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <div className="fixed left-0 top-0 h-full w-64 bg-black/40 backdrop-blur border-r border-white/5 z-10 flex flex-col">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-black text-sm text-white">Super Admin</p>
              <p className="text-xs text-slate-500">Contrôle Global</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1 flex-1">
          {[
            { id: 'overview', icon: BarChart3, label: 'Vue Globale' },
            { id: 'tenants', icon: Building2, label: 'Établissements' },
            { id: 'audit', icon: Activity, label: 'Audit Logs' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white">
              {activeTab === 'overview' && 'Vue d\'ensemble'}
              {activeTab === 'tenants' && 'Établissements'}
              {activeTab === 'audit' && 'Journal d\'Audit'}
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 hover:bg-white/10 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>

        {/* ── TAB OVERVIEW ──── */}
        {activeTab === 'overview' && kpis && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {[
                { label: 'Établissements', value: kpis.totalTenants, icon: Building2, color: 'amber', sub: `${kpis.activeTenants} actifs` },
                { label: 'MRR Estimé', value: `${kpis.mrrEstimated}€`, icon: DollarSign, color: 'emerald', sub: 'mensuel récurrent' },
                { label: 'Élèves Total', value: kpis.totalStudents, icon: GraduationCap, color: 'blue', sub: 'sur la plateforme' },
                { label: 'Enseignants', value: kpis.totalTeachers, icon: Users, color: 'purple', sub: 'enregistrés' },
                { label: 'Classes', value: kpis.totalClasses, icon: BookOpen, color: 'pink', sub: 'actives' },
                { label: 'Taux Actifs', value: `${kpis.totalTenants ? Math.round((kpis.activeTenants / kpis.totalTenants) * 100) : 0}%`, icon: Activity, color: 'cyan', sub: 'disponibilité' },
              ].map(({ label, value, icon: Icon, color, sub }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-all group">
                  <div className={`w-10 h-10 rounded-xl bg-${color}-500/20 flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 text-${color}-400`} />
                  </div>
                  <p className="text-2xl font-black text-white">{value}</p>
                  <p className="text-xs text-slate-400 font-medium mt-1">{label}</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>

            {/* Plan Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Répartition par Plan
                </h3>
                <div className="space-y-3">
                  {kpis.planBreakdown.map(({ plan, count }) => (
                    <div key={plan} className="flex items-center justify-between">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${planColors[plan] || planColors.starter}`}>
                        {plan}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-white/10 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                            style={{ width: `${kpis.totalTenants ? (Number(count) / kpis.totalTenants) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-white font-bold text-sm w-6 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Revenue Estimé
                </h3>
                <div className="space-y-3">
                  {[
                    { plan: 'Pro (49€)', desc: kpis.planBreakdown.find(p => p.plan === 'pro')?.count || 0, rev: (Number(kpis.planBreakdown.find(p => p.plan === 'pro')?.count) || 0) * 49 },
                    { plan: 'Institution (199€)', desc: kpis.planBreakdown.find(p => p.plan === 'institution')?.count || 0, rev: (Number(kpis.planBreakdown.find(p => p.plan === 'institution')?.count) || 0) * 199 },
                  ].map(({ plan, desc, rev }) => (
                    <div key={plan} className="flex items-center justify-between py-2 border-b border-white/5">
                      <div>
                        <p className="text-sm font-medium text-slate-200">{plan}</p>
                        <p className="text-xs text-slate-500">{String(desc)} établissements</p>
                      </div>
                      <span className="text-emerald-400 font-black">{rev}€</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-white font-bold">MRR Total</span>
                    <span className="text-amber-400 font-black text-lg">{kpis.mrrEstimated}€</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB TENANTS ──── */}
        {activeTab === 'tenants' && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un établissement..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Établissement', 'Plan', 'Statut', 'Classes', 'Élèves', 'Extra (€)', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredTenants.map(tenant => (
                    <tr key={tenant.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-bold text-white text-sm">{tenant.name}</p>
                          <p className="text-xs text-slate-500">{tenant.slug}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${planColors[tenant.subscription?.plan || 'starter']}`}>
                          {tenant.subscription?.plan || 'starter'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${tenant.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                          <span className={`text-xs font-medium ${tenant.isActive ? 'text-emerald-400' : 'text-red-400'}`}>
                            {tenant.isActive ? 'Actif' : 'Suspendu'}
                          </span>
                        </div>
                        <p className={`text-[10px] mt-0.5 ${statusColors[tenant.subscription?.status || ''] || 'text-slate-500'}`}>
                          {tenant.subscription?.status || 'N/A'}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm text-white font-bold">{tenant.stats.totalClasses}</div>
                        {tenant.stats.additionalClasses > 0 && (
                          <div className="text-[10px] text-amber-400">+{tenant.stats.additionalClasses} sup.</div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-300 font-medium">{tenant.stats.totalStudents}</td>
                      <td className="px-5 py-4">
                        {tenant.stats.estimatedExtraCharge > 0 ? (
                          <span className="text-amber-400 font-bold text-sm">+{tenant.stats.estimatedExtraCharge}€</span>
                        ) : (
                          <span className="text-slate-600 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {tenant.isActive ? (
                            <button
                              onClick={() => handleTenantAction(tenant.id, 'suspend')}
                              className="px-3 py-1.5 bg-red-500/20 text-red-400 text-xs font-bold rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-1"
                            >
                              <XCircle className="w-3 h-3" />
                              Suspendre
                            </button>
                          ) : (
                            <button
                              onClick={() => handleTenantAction(tenant.id, 'activate')}
                              className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg hover:bg-emerald-500/30 transition-colors flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              Activer
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredTenants.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <Building2 className="w-8 h-8 mx-auto mb-3 opacity-30" />
                  <p>Aucun établissement trouvé</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB AUDIT ──── */}
        {activeTab === 'audit' && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <h3 className="font-bold text-white">Journal d'Audit Global</h3>
              <p className="text-slate-400 text-xs mt-1">{auditLogs.length} entrées récentes</p>
            </div>
            <div className="divide-y divide-white/5">
              {auditLogs.map(log => (
                <div key={log.id} className="px-5 py-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mt-0.5">
                        <Activity className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{log.action}</p>
                        <p className="text-xs text-slate-400">{log.resource} {log.resourceId ? `· ${log.resourceId.substring(0, 8)}...` : ''}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(log.createdAt).toLocaleString('fr-FR')}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">par {log.userId || 'système'}</p>
                    </div>
                  </div>
                </div>
              ))}
              {auditLogs.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <Activity className="w-8 h-8 mx-auto mb-3 opacity-30" />
                  <p>Aucun log d'audit</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
