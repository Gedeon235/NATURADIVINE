import React, { useEffect, useState, createContext, useContext } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import axios from 'axios';
import { Menu, X, Bell, LogOut, Home, Users, Box, ClipboardList, Calendar } from 'lucide-react';

// Professional Admin Dashboard (single-file)
// Place this file in: src/components/admin/AdminDashboardProfessional.tsx
// - Default export is a React component AdminDashboardProfessional
// - Uses Tailwind + shadcn/ui style conventions (no imports required for Tailwind)
// - Requires dependencies: axios, recharts, lucide-react, framer-motion
// - Connects to API via VITE_API_URL env var (fallback: http://localhost:5000)
// - Example: VITE_API_URL=http://localhost:5000

// Install (if needed):
// npm install axios recharts lucide-react framer-motion

// USAGE
// 1) Put this file in your project
// 2) Add route in router: <Route path="/admin" element={<AdminDashboardProfessional />} />
// 3) Add CSS: tailwind must already be configured
// 4) Add env: VITE_API_URL

// --------------------------- Types ---------------------------
type Overview = {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalAppointments: number;
};

type Order = { id: string | number; customer: string; total: number; status: string; date: string };
type Appointment = { id: string | number; client: string; service: string; date: string; status: string };

// --------------------------- Simple Auth Context ---------------------------
// This is a lightweight client-side guard for the admin route. For real security use JWT-auth and server checks.
const AdminAuthContext = createContext<{ token: string | null; login: (t: string) => void; logout: () => void }>({ token: null, login: () => {}, logout: () => {} });

function useAdminAuth() {
  return useContext(AdminAuthContext);
}

function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin_token'));
  useEffect(() => {
    if (token) localStorage.setItem('admin_token', token); else localStorage.removeItem('admin_token');
  }, [token]);
  return (
    <AdminAuthContext.Provider value={{ token, login: setToken, logout: () => setToken(null) }}>{children}</AdminAuthContext.Provider>
  );
}

// --------------------------- API ---------------------------
const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000';
const api = axios.create({ baseURL: API_BASE, timeout: 12000 });

// Attach token if present
api.interceptors.request.use((cfg) => {
  try {
    const token = localStorage.getItem('admin_token');
    if (token && cfg.headers) cfg.headers['Authorization'] = `Bearer ${token}`;
  } catch (e) {}
  return cfg;
});

// --------------------------- Main Component ---------------------------
export default function AdminDashboardProfessional() {
  return (
    <AdminAuthProvider>
      <DashboardShell />
    </AdminAuthProvider>
  );
}

// --------------------------- Shell (sidebar + header + content) ---------------------------
function DashboardShell() {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState('dashboard');
  const { token, logout } = useAdminAuth();

  // If not logged in show login screen
  if (!token) return <AdminLogin onSuccess={(t) => window.localStorage.setItem('admin_token', t) || window.location.reload()} />;

  return (
    <div className="min-h-screen flex bg-gray-50 text-slate-800">
      <aside className={`transition-all duration-300 border-r bg-white ${open ? 'w-64' : 'w-16'}`}>
        <div className="h-16 flex items-center px-4 justify-between border-b">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-indigo-600 text-white w-10 h-10 flex items-center justify-center font-bold">ND</div>
            <div className={`${open ? 'block' : 'hidden'}`}>
              <div className="text-sm font-semibold">Natura Admin</div>
              <div className="text-xs text-gray-500">Dashboard</div>
            </div>
          </div>
          <button className="p-2 rounded hover:bg-gray-100" onClick={() => setOpen((v) => !v)} aria-label="toggle sidebar">
            <Menu size={16} />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          <SidebarItem icon={<Home size={16} />} label="Tableau" open={open} active={active === 'dashboard'} onClick={() => setActive('dashboard')} />
          <SidebarItem icon={<Users size={16} />} label="Clients" open={open} active={active === 'customers'} onClick={() => setActive('customers')} />
          <SidebarItem icon={<Box size={16} />} label="Produits" open={open} active={active === 'products'} onClick={() => setActive('products')} />
          <SidebarItem icon={<ClipboardList size={16} />} label="Commandes" open={open} active={active === 'orders'} onClick={() => setActive('orders')} />
          <SidebarItem icon={<Calendar size={16} />} label="Rendez-vous" open={open} active={active === 'appointments'} onClick={() => setActive('appointments')} />
        </nav>

        <div className="absolute bottom-0 w-full p-3 border-t">
          <button
            className="w-full flex items-center gap-3 p-2 rounded hover:bg-gray-100"
            onClick={() => {
              localStorage.removeItem('admin_token');
              logout();
              window.location.reload();
            }}
          >
            <LogOut size={16} />
            <span className={`${open ? 'block' : 'hidden'}`}>Se déconnecter</span>
          </button>
        </div>
      </aside>

      <main className="flex-1">
        <Header />
        <div className="p-6">
          <ContentArea activeKey={(document.querySelector('body')?.dataset['active'] = '') || ''} />
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, open, active, onClick }: { icon: React.ReactNode; label: string; open: boolean; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 w-full p-2 rounded ${active ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}>
      <div className="text-gray-600">{icon}</div>
      <div className={`${open ? 'block' : 'hidden'} text-sm`}>{label}</div>
    </button>
  );
}

// --------------------------- Header ---------------------------
function Header() {
  const [query, setQuery] = useState('');
  return (
    <div className="h-16 border-b bg-white flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="text-lg font-semibold">Tableau de bord</div>
        <div className="hidden md:block">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher..." className="px-3 py-2 rounded border text-sm" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded hover:bg-gray-100"><Bell size={16} /></button>
        <div className="flex items-center gap-2">
          <div className="text-sm">Admin</div>
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">A</div>
        </div>
      </div>
    </div>
  );
}

// --------------------------- Login ---------------------------
function AdminLogin({ onSuccess }: { onSuccess: (token: string) => void }) {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Tentative: appeler ton endpoint login si existant, sinon fallback local token
      const url = `${API_BASE}/api/auth/login`;
      const resp = await api.post('/auth/login', { email, password }).catch(() => null);
      if (resp && resp.data && resp.data.token) {
        onSuccess(resp.data.token);
        return;
      }
      // fallback: generate simple token
      const token = btoa(`${email}:${password}:${Date.now()}`);
      onSuccess(token);
    } catch (err: any) {
      setError(err.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Connexion Administrateur</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={submit} className="space-y-3">
          <label className="block text-sm">Email<input className="w-full p-2 border rounded mt-1" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className="block text-sm">Mot de passe<input type="password" className="w-full p-2 border rounded mt-1" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          <div className="flex items-center justify-between">
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={loading}>{loading ? 'Connexion...' : 'Se connecter'}</button>
            <button type="button" className="text-sm text-gray-500" onClick={() => { setEmail('admin@example.com'); setPassword('admin123'); }}>Compte demo</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// --------------------------- Content Area ---------------------------
function ContentArea({ activeKey }: { activeKey?: string }) {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, ordersRes, apptRes, dashRes] = await Promise.allSettled([
          api.get('/admin/stats'),
          api.get('/admin/orders'),
          api.get('/admin/appointments'),
          api.get('/admin/dashboard')
        ]);

        if (!mounted) return;

        if (statsRes.status === 'fulfilled' && statsRes.value.data) {
          const d = statsRes.value.data.data ?? statsRes.value.data;
          setOverview({
            totalSales: d.totalSales ?? 0,
            totalOrders: d.totalOrders ?? 0,
            totalCustomers: d.totalCustomers ?? 0,
            totalAppointments: d.totalAppointments ?? 0
          });
        }

        if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value.data?.data ?? []);
        if (apptRes.status === 'fulfilled') setAppointments(apptRes.value.data?.data ?? []);
        if (dashRes.status === 'fulfilled') {
          const ms = dashRes.value.data?.data?.monthlyStats ?? dashRes.value.data?.monthlyStats ?? [];
          const normalized = (ms || []).map((m: any) => ({ month: m._id ? `${m._id.year}-${String(m._id.month).padStart(2, '0')}` : m.month, revenue: m.revenue ?? m.total ?? 0, appointments: m.appointments ?? m.count ?? 0 }));
          setMonthly(normalized);
        }
      } catch (err: any) {
        setError(err.message || 'Erreur chargement');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-6">Chargement du tableau de bord...</div>;
  if (error) return <div className="p-6 text-red-600">Erreur: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Ventes totales" value={overview?.totalSales ?? 0} unit="FCFA" />
        <StatCard title="Commandes" value={overview?.totalOrders ?? 0} />
        <StatCard title="Clients" value={overview?.totalCustomers ?? 0} />
        <StatCard title="Rendez-vous" value={overview?.totalAppointments ?? 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Revenus (6 derniers mois)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={monthly}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line dataKey="revenue" stroke="#06b6d4" dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Activité récente</h3>
          <div className="space-y-3 max-h-72 overflow-auto">
            {(appointments || []).slice(0, 8).map((a) => (
              <div key={a.id} className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{a.client}</div>
                  <div className="text-xs text-gray-500">{a.service} — {new Date(a.date).toLocaleString()}</div>
                </div>
                <div className="text-sm px-2 py-1 rounded text-white" style={{ backgroundColor: statusColor(a.status) }}>{a.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold mb-3">Dernières commandes</h4>
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs text-gray-500 uppercase">
              <tr><th className="px-2 py-2">#</th><th className="px-2 py-2">Client</th><th className="px-2 py-2">Total</th><th className="px-2 py-2">Statut</th><th className="px-2 py-2">Date</th></tr>
            </thead>
            <tbody>
              {(orders || []).slice(0, 8).map((o) => (
                <tr key={o.id} className="border-t"><td className="px-2 py-2">{o.id}</td><td className="px-2 py-2">{o.customer}</td><td className="px-2 py-2">{formatNumber(o.total)}</td><td className="px-2 py-2"><span className="px-2 py-1 rounded text-xs text-white" style={{ backgroundColor: statusColor(o.status) }}>{o.status}</span></td><td className="px-2 py-2">{new Date(o.date).toLocaleDateString()}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold mb-3">Actions rapides</h4>
          <div className="flex flex-col gap-3">
            <button className="px-3 py-2 bg-indigo-600 text-white rounded">Créer un produit</button>
            <button className="px-3 py-2 bg-green-600 text-white rounded">Publier une annonce</button>
            <button className="px-3 py-2 bg-yellow-500 text-black rounded">Exporter commandes (CSV)</button>
          </div>
        </div>
      </div>

    </div>
  );
}

// --------------------------- Small UI pieces ---------------------------
function StatCard({ title, value, unit }: { title: string; value: number | string; unit?: string }) {
  return (
    <div className="bg-white p-4 rounded shadow flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-bold mt-1">{unit ? `${unit} ${formatNumber(value)}` : formatNumber(value)}</div>
      </div>
      <div className="text-3xl text-gray-300">📊</div>
    </div>
  );
}

// --------------------------- Helpers ---------------------------
function formatNumber(n: number | string | undefined) {
  if (n === undefined || n === null) return '-';
  const num = typeof n === 'string' ? Number(n) : n;
  return num.toLocaleString();
}

function statusColor(status?: string) {
  if (!status) return '#6b7280';
  const s = status.toLowerCase();
  if (s.includes('confirm') || s.includes('confirmé')) return '#10b981';
  if (s.includes('completed') || s.includes('livré')) return '#0ea5e9';
  if (s.includes('pending') || s.includes('en cours')) return '#f59e0b';
  if (s.includes('cancel') || s.includes('annul')) return '#ef4444';
  return '#6b7280';
}
