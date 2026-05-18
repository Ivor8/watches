import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import Logo from '@/components/Logo';
import { LogOut, LayoutDashboard, Package, ShoppingCart, MessageSquare, Users, Settings } from 'lucide-react';

const ADMIN_KEY_STORAGE = 'ows_admin_session';

export const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple gate; in production, use Supabase Auth + admin role
    if (password === 'admin123' || password === 'luxury2024') {
      localStorage.setItem(ADMIN_KEY_STORAGE, 'true');
      navigate('/admin/dashboard');
      toast.success('Welcome, Admin');
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-6">
      <div className="bg-white p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Logo />
        </div>
        <h1 className="font-serif text-2xl text-center mb-6">Admin Login</h1>
        <form onSubmit={onLogin}>
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] mb-4"
            required
          />
          <button className="w-full bg-[#059669] hover:bg-[#047857] text-white py-3 text-sm uppercase tracking-wider font-semibold">
            Sign in
          </button>
          <p className="text-xs text-gray-500 text-center mt-4">
            Demo password: admin123
          </p>
        </form>
      </div>
    </div>
  );
};

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem(ADMIN_KEY_STORAGE) !== 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  const nav = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
    { to: '/admin/admins', label: 'Admins', icon: Users },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const logout = () => {
    localStorage.removeItem(ADMIN_KEY_STORAGE);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAF8]">
      <aside className="w-60 bg-[#0A0A0A] text-white flex flex-col">
        <div className="p-5 border-b border-white/10">
          <Logo variant="light" showTagline={false} />
        </div>
        <nav className="flex-1 py-4">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`flex items-center gap-3 px-5 py-3 text-sm hover:bg-white/5 transition-colors ${
                location.pathname === n.to ? 'bg-[#D4AF37]/10 border-r-2 border-[#D4AF37] text-[#D4AF37]' : ''
              }`}
            >
              <n.icon className="w-4 h-4" /> {n.label}
            </Link>
          ))}
        </nav>
        <button onClick={logout} className="flex items-center gap-3 px-5 py-4 text-sm border-t border-white/10 hover:bg-white/5">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </aside>
      <main className="flex-1 p-8 overflow-x-auto">{children}</main>
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0, messages: 0 });
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from('ecom_orders').select('total'),
      supabase.from('ecom_products').select('id', { count: 'exact', head: true }),
      supabase.from('chat_messages').select('id', { count: 'exact', head: true }),
      supabase.from('ecom_orders').select('*').order('created_at', { ascending: false }).limit(5),
    ]).then(([orderRes, prodRes, msgRes, recentRes]) => {
      const revenue = (orderRes.data || []).reduce((s: number, o: any) => s + o.total, 0);
      setStats({
        orders: orderRes.data?.length || 0,
        revenue,
        products: prodRes.count || 0,
        messages: msgRes.count || 0,
      });
      setRecent(recentRes.data || []);
    });
  }, []);

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {[
          { label: 'Total Orders', value: stats.orders },
          { label: 'Total Revenue', value: `$${(stats.revenue / 100).toLocaleString()}` },
          { label: 'Products', value: stats.products },
          { label: 'Messages', value: stats.messages },
        ].map((s) => (
          <div key={s.label} className="bg-white p-6 border border-gray-100">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">{s.label}</p>
            <p className="font-serif text-3xl">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 border border-gray-100">
        <h2 className="font-serif text-xl mb-5">Recent Orders</h2>
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-gray-500 border-b">
            <tr><th className="py-2">Order ID</th><th>Date</th><th>Total</th><th>Status</th></tr>
          </thead>
          <tbody>
            {recent.map((o) => (
              <tr key={o.id} className="border-b last:border-0">
                <td className="py-3 font-mono text-xs">{o.id.slice(0, 8)}</td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="font-semibold">${(o.total / 100).toFixed(2)}</td>
                <td><span className="uppercase text-xs">{o.status}</span></td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr><td colSpan={4} className="py-6 text-center text-gray-500">No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);

  const load = () => {
    supabase.from('ecom_orders').select('*').order('created_at', { ascending: false }).then(({ data }) => setOrders(data || []));
  };
  useEffect(load, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('ecom_orders').update({ status }).eq('id', id);
    toast.success('Order updated');
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this order?')) return;
    await supabase.from('ecom_order_items').delete().eq('order_id', id);
    await supabase.from('ecom_orders').delete().eq('id', id);
    load();
    toast.success('Order deleted');
  };

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl mb-8">Orders</h1>
      <div className="bg-white border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-gray-500 border-b">
            <tr><th className="p-4">ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th /></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 font-mono text-xs">{o.id.slice(0, 8)}</td>
                <td>{o.shipping_address?.email || '—'}</td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="font-semibold">${(o.total / 100).toFixed(2)}</td>
                <td>
                  <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="border border-gray-200 px-2 py-1 text-xs">
                    {['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td><button onClick={() => remove(o.id)} className="text-red-500 text-xs hover:underline">Delete</button></td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-500">No orders</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    supabase.from('ecom_products').select('*').order('created_at', { ascending: false }).then(({ data }) => setProducts(data || []));
  };
  useEffect(load, []);

  const remove = async (id: string) => {
    if (!confirm('Delete product?')) return;
    await supabase.from('ecom_products').delete().eq('id', id);
    load();
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const p = { ...editing };
    if (typeof p.images === 'string') p.images = p.images.split(',').map((s: string) => s.trim()).filter(Boolean);
    if (typeof p.tags === 'string') p.tags = p.tags.split(',').map((s: string) => s.trim()).filter(Boolean);
    p.price = Math.round(Number(p.price));
    p.inventory_qty = Number(p.inventory_qty) || 0;
    if (p.id) {
      await supabase.from('ecom_products').update(p).eq('id', p.id);
    } else {
      await supabase.from('ecom_products').insert(p);
    }
    setShowForm(false);
    setEditing(null);
    load();
    toast.success('Product saved');
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl">Products</h1>
        <button onClick={() => { setEditing({ name: '', handle: '', price: 0, vendor: '', status: 'active', images: '', tags: '' }); setShowForm(true); }} className="bg-[#059669] text-white px-5 py-2 text-sm">+ Add Product</button>
      </div>

      {showForm && editing && (
        <form onSubmit={save} className="bg-white border p-6 mb-6 grid grid-cols-2 gap-4">
          <input required placeholder="Name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="border px-3 py-2 col-span-2" />
          <input required placeholder="Handle (url slug)" value={editing.handle} onChange={(e) => setEditing({ ...editing, handle: e.target.value })} className="border px-3 py-2" />
          <input required placeholder="Brand/Vendor" value={editing.vendor} onChange={(e) => setEditing({ ...editing, vendor: e.target.value })} className="border px-3 py-2" />
          <input required type="number" placeholder="Price (cents)" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} className="border px-3 py-2" />
          <input type="number" placeholder="Inventory" value={editing.inventory_qty || 0} onChange={(e) => setEditing({ ...editing, inventory_qty: e.target.value })} className="border px-3 py-2" />
          <input placeholder="Images (comma separated URLs)" value={Array.isArray(editing.images) ? editing.images.join(', ') : editing.images} onChange={(e) => setEditing({ ...editing, images: e.target.value })} className="border px-3 py-2 col-span-2" />
          <input placeholder="Tags (comma separated)" value={Array.isArray(editing.tags) ? editing.tags.join(', ') : editing.tags} onChange={(e) => setEditing({ ...editing, tags: e.target.value })} className="border px-3 py-2 col-span-2" />
          <textarea placeholder="Description" value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="border px-3 py-2 col-span-2" rows={3} />
          <div className="col-span-2 flex gap-3">
            <button className="bg-[#059669] text-white px-5 py-2 text-sm">Save</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="border px-5 py-2 text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-gray-500 border-b">
            <tr><th className="p-4">Image</th><th>Name</th><th>Brand</th><th>Price</th><th>Stock</th><th /></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-2"><img src={p.images?.[0]} className="w-12 h-12 object-cover" /></td>
                <td>{p.name}</td>
                <td>{p.vendor}</td>
                <td>${(p.price / 100).toFixed(2)}</td>
                <td>{p.inventory_qty}</td>
                <td>
                  <button onClick={() => { setEditing(p); setShowForm(true); }} className="text-blue-600 text-xs mr-3 hover:underline">Edit</button>
                  <button onClick={() => remove(p.id)} className="text-red-500 text-xs hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export const AdminMessages: React.FC = () => {
  const [sessions, setSessions] = useState<string[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState('');

  useEffect(() => {
    supabase.from('chat_messages').select('session_id').then(({ data }) => {
      const unique = Array.from(new Set((data || []).map((d: any) => d.session_id)));
      setSessions(unique);
    });

    const ch = supabase
      .channel('admin-chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
        const sid = (payload.new as any).session_id;
        setSessions((prev) => prev.includes(sid) ? prev : [...prev, sid]);
        if (sid === activeSession) {
          setMessages((m) => [...m, payload.new as any]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, [activeSession]);

  useEffect(() => {
    if (!activeSession) return;
    supabase.from('chat_messages').select('*').eq('session_id', activeSession).order('created_at').then(({ data }) => setMessages(data || []));
  }, [activeSession]);

  const send = async () => {
    if (!reply.trim() || !activeSession) return;
    await supabase.from('chat_messages').insert({ session_id: activeSession, sender: 'admin', message: reply.trim() });
    setReply('');
  };

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl mb-8">Messages</h1>
      <div className="grid grid-cols-[260px_1fr] gap-5 h-[600px]">
        <div className="bg-white border border-gray-100 overflow-y-auto">
          {sessions.map((s) => (
            <button key={s} onClick={() => setActiveSession(s)} className={`block w-full text-left p-4 border-b text-sm font-mono ${activeSession === s ? 'bg-[#D4AF37]/10' : ''}`}>
              {s.slice(0, 20)}...
            </button>
          ))}
          {sessions.length === 0 && <p className="p-4 text-gray-500 text-sm">No conversations yet</p>}
        </div>
        <div className="bg-white border border-gray-100 flex flex-col">
          {activeSession ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${m.sender === 'admin' ? 'bg-[#D4AF37] text-white' : 'bg-gray-100'}`}>{m.message}</div>
                  </div>
                ))}
              </div>
              <div className="border-t p-3 flex gap-2">
                <input value={reply} onChange={(e) => setReply(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Type your reply..." className="flex-1 border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" />
                <button onClick={send} className="bg-[#059669] text-white px-5 text-sm">Send</button>
              </div>
            </>
          ) : <p className="m-auto text-gray-500">Select a conversation</p>}
        </div>
      </div>
    </AdminLayout>
  );
};

export const AdminAdmins: React.FC = () => (
  <AdminLayout>
    <h1 className="font-serif text-3xl mb-8">Admins</h1>
    <div className="bg-white border p-8">
      <p className="text-gray-600 mb-4">Admin user management. In production, this would integrate with Supabase Auth roles.</p>
      <div className="space-y-3">
        <div className="flex justify-between items-center border-b pb-3">
          <div>
            <p className="font-semibold">Super Admin</p>
            <p className="text-xs text-gray-500">admin@originalwatches.shop</p>
          </div>
          <span className="text-xs uppercase bg-[#D4AF37] text-white px-3 py-1">Owner</span>
        </div>
      </div>
    </div>
  </AdminLayout>
);

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    supabase.from('shop_settings').select('*').eq('id', 1).single().then(({ data }) => setSettings(data));
  }, []);

  const save = async () => {
    await supabase.from('shop_settings').update(settings).eq('id', 1);
    toast.success('Settings saved');
  };

  if (!settings) return <AdminLayout><p>Loading...</p></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl mb-8">Settings</h1>
      <div className="bg-white border p-8 max-w-2xl space-y-5">
        <Setting label="Shop name" value={settings.shop_name} onChange={(v) => setSettings({ ...settings, shop_name: v })} />
        <Setting label="WhatsApp number" value={settings.whatsapp} onChange={(v) => setSettings({ ...settings, whatsapp: v })} />
        <Setting label="Email" value={settings.email} onChange={(v) => setSettings({ ...settings, email: v })} />
        <Setting label="Telegram URL" value={settings.telegram_url} onChange={(v) => setSettings({ ...settings, telegram_url: v })} />
        <Setting label="Shipping fee (cents)" value={settings.shipping_fee} onChange={(v) => setSettings({ ...settings, shipping_fee: Number(v) })} type="number" />
        <Setting label="Promo bar text" value={settings.promo_text} onChange={(v) => setSettings({ ...settings, promo_text: v })} />
        <button onClick={save} className="bg-[#059669] text-white px-6 py-3 text-sm uppercase tracking-wider">Save Settings</button>
      </div>
    </AdminLayout>
  );
};

const Setting: React.FC<any> = ({ label, value, onChange, type = 'text' }) => (
  <div>
    <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">{label}</label>
    <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]" />
  </div>
);
