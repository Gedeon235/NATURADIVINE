import React, { useEffect, useState, createContext, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from "axios";
import { Menu, Bell, LogOut, Home, Users, Box, ClipboardList, Calendar, Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

// --------------------------- Types ---------------------------
type Overview = {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalAppointments: number;
};

type Order = { 
  id: string | number; 
  customer: string; 
  total: number; 
  status: string; 
  date: string;
  items: OrderItem[];
};

type OrderItem = {
  id: string;
  productName: string;
  quantity: number;
  price: number;
};

type Product = {
  id: string | number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  image?: string;
};

type Appointment = {
  id: string | number;
  client: string;
  service: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  phone: string;
  email: string;
};

type MonthlyStat = { month: string; revenue: number; appointments: number };

// --------------------------- Auth Context ---------------------------
interface AdminAuthContextType {
  token: string | null;
  login: (t: string) => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  token: null,
  login: () => {},
  logout: () => {},
});

function useAdminAuth() {
  return useContext(AdminAuthContext);
}

function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin_token'));
  useEffect(() => {
    if (token) localStorage.setItem('admin_token', token);
    else localStorage.removeItem('admin_token');
  }, [token]);

  return (
    <AdminAuthContext.Provider value={{ token, login: setToken, logout: () => setToken(null) }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

// --------------------------- API ---------------------------

// Par :
const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://naturadivine-2.onrender.com";
const api = axios.create({ baseURL: API_BASE, timeout: 12000 });api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('admin_token');
  if (token && cfg.headers) {
    cfg.headers['Authorization'] = `Bearer ${token}`;
  }
  return cfg;
});

// Helper function to safely extract data from API responses
function extractData<T>(response: any): T | null {
  if (!response) return null;
  
  if (response.data !== undefined) {
    if (response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  }
  
  return response;
}

// --------------------------- Main Component ---------------------------
export default function AdminDashboardProfessional() {
  return (
    <AdminAuthProvider>
      <DashboardShell />
    </AdminAuthProvider>
  );
}

// --------------------------- Dashboard Shell ---------------------------
function DashboardShell() {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState('dashboard');
  const { token, logout } = useAdminAuth();

  if (!token)
    return (
      <AdminLogin
        onSuccess={(t) => {
          localStorage.setItem('admin_token', t);
          window.location.reload();
        }}
      />
    );

  const renderContent = () => {
    switch (active) {
      case 'dashboard': return <DashboardContent />;
      case 'customers': return <CustomersContent />;
      case 'products': return <ProductsContent />;
      case 'orders': return <OrdersContent />;
      case 'appointments': return <AppointmentsContent />;
      default: return <DashboardContent />;
    }
  };

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
          <button className="p-2 rounded hover:bg-gray-100" onClick={() => setOpen(!open)} aria-label="toggle sidebar">
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
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

// --------------------------- SidebarItem ---------------------------
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
        <button className="p-2 rounded hover:bg-gray-100">
          <Bell size={16} />
        </button>
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
      const resp = await api.post<{ token: string }>('/auth/login', { email, password }).catch(() => null);
      const tokenData = extractData<{ token: string }>(resp);
      const token = tokenData?.token ?? btoa(`${email}:${password}:${Date.now()}`);
      localStorage.setItem('admin_token', token);
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
          <label className="block text-sm">
            Email
            <input className="w-full p-2 border rounded mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="block text-sm">
            Mot de passe
            <input type="password" className="w-full p-2 border rounded mt-1" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <div className="flex items-center justify-between">
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
            <button type="button" className="text-sm text-gray-500" onClick={() => { setEmail('admin@example.com'); setPassword('admin123'); }}>
              Compte demo
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// --------------------------- Dashboard Content ---------------------------
function DashboardContent() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [monthly, setMonthly] = useState<MonthlyStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [statsRes, ordersRes, dashRes] = await Promise.all([
          api.get('/admin/stats').catch(() => null),
          api.get('/admin/orders').catch(() => null),
          api.get('/admin/dashboard').catch(() => null),
        ]);

        if (!mounted) return;

        const overviewData = extractData<Overview>(statsRes);
        const ordersData = extractData<Order[]>(ordersRes);
        const dashboardData = extractData<{ monthlyStats: MonthlyStat[] }>(dashRes);

        if (overviewData) setOverview(overviewData);
        if (ordersData) setOrders(ordersData);
        if (dashboardData?.monthlyStats) setMonthly(dashboardData.monthlyStats);

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

  const recentOrders = orders.slice(0, 5);
  const orderStatusData = [
    { name: 'Confirmées', value: orders.filter(o => o.status.includes('confirm')).length },
    { name: 'En cours', value: orders.filter(o => o.status.includes('pending')).length },
    { name: 'Livrées', value: orders.filter(o => o.status.includes('completed')).length },
    { name: 'Annulées', value: orders.filter(o => o.status.includes('cancel')).length },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Ventes totales" value={overview?.totalSales ?? 0} unit="FCFA" />
        <StatCard title="Commandes" value={overview?.totalOrders ?? 0} />
        <StatCard title="Clients" value={overview?.totalCustomers ?? 0} />
        <StatCard title="Rendez-vous" value={overview?.totalAppointments ?? 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
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
          <h3 className="font-semibold mb-3">Statut des commandes</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Dernières commandes</h3>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <div className="font-medium">Commande #{order.id}</div>
                  <div className="text-sm text-gray-500">{order.customer}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{order.total.toLocaleString()} FCFA</div>
                  <span className="px-2 py-1 rounded text-xs text-white" style={{ backgroundColor: statusColor(order.status) }}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Activité récente</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border rounded">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm">Nouvelle commande #1234</div>
                <div className="text-xs text-gray-500">Il y a 2 minutes</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm">Rendez-vous confirmé</div>
                <div className="text-xs text-gray-500">Il y a 5 minutes</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm">Stock faible - Crème hydratante</div>
                <div className="text-xs text-gray-500">Il y a 1 heure</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --------------------------- Products Content ---------------------------
function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await api.get('/admin/products').catch(() => null);
      const productsData = extractData<Product[]>(res) || [];
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await api.delete(`/admin/products/${id}`);
        loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  if (loading) return <div className="p-6">Chargement des produits...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des produits</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={16} />
          Ajouter un produit
        </button>
      </div>

      <div className="bg-white rounded shadow">
        <div className="p-4 border-b">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  placeholder="Rechercher un produit..." 
                  className="w-full pl-10 pr-4 py-2 border rounded"
                />
              </div>
            </div>
            <button className="px-4 py-2 border rounded flex items-center gap-2">
              <Filter size={16} />
              Filtres
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" />
                      ) : (
                        <Box size={20} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{product.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">{product.price.toLocaleString()} FCFA</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    product.stock > 10 ? 'bg-green-100 text-green-800' : 
                    product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock} unités
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={() => setEditingProduct(product)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(showAddModal || editingProduct) && (
        <ProductModal 
          product={editingProduct}
          onClose={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }}
          onSave={loadProducts}
        />
      )}
    </div>
  );
}

// --------------------------- Orders Content ---------------------------
function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get('/admin/orders').catch(() => null);
      const ordersData = extractData<Order[]>(res) || [];
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase().includes(selectedStatus));

  const updateOrderStatus = async (orderId: string | number, newStatus: string) => {
    try {
      await api.patch(`/admin/orders/${orderId}`, { status: newStatus });
      loadOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (loading) return <div className="p-6">Chargement des commandes...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des commandes</h2>
        <div className="flex gap-2">
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmées</option>
            <option value="completed">Livrées</option>
            <option value="cancelled">Annulées</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commande</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 font-medium">#{order.id}</td>
                <td className="px-4 py-3">{order.customer}</td>
                <td className="px-4 py-3">{order.total.toLocaleString()} FCFA</td>
                <td className="px-4 py-3">{new Date(order.date).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <select 
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="px-2 py-1 rounded text-xs text-white border-0"
                    style={{ backgroundColor: statusColor(order.status) }}
                  >
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmée</option>
                    <option value="completed">Livrée</option>
                    <option value="cancelled">Annulée</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                      <Eye size={16} />
                    </button>
                    <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                      <Edit size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --------------------------- Appointments Content ---------------------------
function AppointmentsContent() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const res = await api.get('/admin/appointments').catch(() => null);
      const appointmentsData = extractData<Appointment[]>(res) || [];
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string | number, newStatus: string) => {
    try {
      await api.patch(`/admin/appointments/${appointmentId}`, { status: newStatus });
      loadAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  if (loading) return <div className="p-6">Chargement des rendez-vous...</div>;

  const todayAppointments = appointments.filter(apt => 
    new Date(apt.date).toDateString() === new Date().toDateString()
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des rendez-vous</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={16} />
          Nouveau rendez-vous
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded shadow">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Tous les rendez-vous</h3>
          </div>
          <div className="divide-y">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded flex items-center justify-center">
                    <Calendar className="text-indigo-600" size={20} />
                  </div>
                  <div>
                    <div className="font-medium">{appointment.client}</div>
                    <div className="text-sm text-gray-500">{appointment.service}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(appointment.date).toLocaleDateString()} à {appointment.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select 
                    value={appointment.status}
                    onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value)}
                    className="px-3 py-1 rounded text-sm border"
                  >
                    <option value="scheduled">Programmé</option>
                    <option value="confirmed">Confirmé</option>
                    <option value="completed">Terminé</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                  <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Aujourd'hui</h3>
            <div className="space-y-3">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="p-3 border rounded">
                  <div className="font-medium">{appointment.client}</div>
                  <div className="text-sm text-gray-500">{appointment.service}</div>
                  <div className="text-xs text-gray-400">{appointment.time}</div>
                  <span className="px-2 py-1 rounded text-xs text-white mt-2 inline-block" 
                        style={{ backgroundColor: statusColor(appointment.status) }}>
                    {appointment.status}
                  </span>
                </div>
              ))}
              {todayAppointments.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  Aucun rendez-vous aujourd'hui
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Statistiques</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total RDV ce mois:</span>
                <span className="font-medium">{appointments.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Confirmés:</span>
                <span className="font-medium text-green-600">
                  {appointments.filter(a => a.status === 'confirmed').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>En attente:</span>
                <span className="font-medium text-yellow-600">
                  {appointments.filter(a => a.status === 'scheduled').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <AppointmentModal 
          onClose={() => setShowAddModal(false)}
          onSave={loadAppointments}
        />
      )}
    </div>
  );
}

// --------------------------- Customers Content ---------------------------
function CustomersContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des clients</h2>
      </div>
      
      <div className="bg-white rounded shadow">
        <div className="p-8 text-center">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium mb-2">Gestion des clients</h3>
          <p className="text-gray-500 mb-4">Interface de gestion des clients en cours de développement</p>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded">
            Voir les clients
          </button>
        </div>
      </div>
    </div>
  );
}

// --------------------------- Modal Components ---------------------------
function ProductModal({ product, onClose, onSave }: { 
  product?: Product | null; 
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    status: product?.status || 'active',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (product) {
        await api.put(`/admin/products/${product.id}`, formData);
      } else {
        await api.post('/admin/products', formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">
            {product ? 'Modifier le produit' : 'Nouveau produit'}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom du produit</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Catégorie</label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Prix (FCFA)</label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input
              type="number"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Statut</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
              className="w-full p-2 border rounded"
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border rounded">
              Annuler
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded">
              {product ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AppointmentModal({ onClose, onSave }: { 
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    client: '',
    service: '',
    date: '',
    time: '',
    phone: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/appointments', {
        ...formData,
        status: 'scheduled'
      });
      onSave();
      onClose();
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Nouveau rendez-vous</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Client</label>
            <input
              type="text"
              required
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Service</label>
            <input
              type="text"
              required
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Heure</label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Téléphone</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border rounded">
              Annuler
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded">
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --------------------------- StatCard ---------------------------
function StatCard({ title, value, unit }: { title: string; value: number | string; unit?: string }) {
  return (
    <div className="bg-white p-4 rounded shadow flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-bold mt-1">{unit ? `${unit} ${value.toLocaleString()}` : value.toLocaleString()}</div>
      </div>
      <div className="text-3xl text-gray-300">📊</div>
    </div>
  );
}

// --------------------------- Helpers ---------------------------
function statusColor(status?: string) {
  if (!status) return '#6b7280';
  const s = status.toLowerCase();
  if (s.includes('confirm') || s.includes('confirmé')) return '#10b981';
  if (s.includes('completed') || s.includes('livré') || s.includes('terminé')) return '#0ea5e9';
  if (s.includes('pending') || s.includes('en cours') || s.includes('scheduled')) return '#f59e0b';
  if (s.includes('cancel') || s.includes('annul')) return '#ef4444';
  return '#6b7280';
}