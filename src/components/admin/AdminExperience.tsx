'use client';

import { useEffect, useState, useCallback } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { SessionProvider } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  Users, TrendingUp, Ticket, Megaphone, LogOut, RefreshCw, ImagePlus,
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { formatMXN } from '@/lib/utils';

interface LeadRow {
  id: string;
  type: 'INFANTIL' | 'ESCOLAR' | 'CORPORATIVO';
  fullName: string;
  email: string;
  phone: string;
  company: string | null;
  eventDate: string | null;
  guests: number | null;
  budget: string | null;
  status: 'NUEVO' | 'CONTACTADO' | 'COTIZADO' | 'GANADO' | 'PERDIDO';
  createdAt: string;
}

interface Banner {
  id: number;
  title: string;
  active: boolean;
  clicks: number;
}

const STATUS_STYLE: Record<LeadRow['status'], string> = {
  NUEVO: 'border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan',
  CONTACTADO: 'border-neon-yellow/40 bg-neon-yellow/10 text-neon-yellow',
  COTIZADO: 'border-neon-pink/40 bg-neon-pink/10 text-neon-pink',
  GANADO: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-400',
  PERDIDO: 'border-ink-dim/40 bg-ink-dim/10 text-ink-dim',
};

function AdminInner() {
  const { data: session, status } = useSession();
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [banners, setBanners] = useState<Banner[]>([
    { id: 1, title: '2x1 Bolera Martes', active: true, clicks: 12840 },
    { id: 2, title: 'Mega Recarga Noviembre', active: true, clicks: 9312 },
    { id: 3, title: 'Fiesta Neon Pack', active: false, clicks: 4450 },
  ]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const loadLeads = useCallback(async () => {
    const res = await fetch('/api/leads');
    if (res.ok) setLeads((await res.json()) as LeadRow[]);
  }, []);

  useEffect(() => {
    if (status === 'authenticated') loadLeads();
  }, [status, loadLeads]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    const res = await signIn('credentials', { email, password, redirect: false });
    setLoginLoading(false);
    if (res?.error) setLoginError('Credenciales inválidas. Intenta de nuevo.');
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-void">
        <p className="hud-label animate-blink">cargando crm…</p>
      </div>
    );
  }

  // ------- Pantalla de login -------
  if (status === 'unauthenticated') {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-void px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <GlassPanel strong className="w-full max-w-sm p-8">
            <p className="hud-label mb-2">acceso restringido</p>
            <h1 className="font-arcade text-sm text-ink">
              CRM <span className="text-glow-red text-brand-bright">RECÓRCHOLIS</span>
            </h1>
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label htmlFor="admin-email" className="hud-label mb-2 block">correo</label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="username"
                  className="input-arcade"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="admin-pass" className="hud-label mb-2 block">contraseña</label>
                <input
                  id="admin-pass"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="input-arcade"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {loginError && (
                <p className="rounded-xl border border-brand/40 bg-brand/10 px-4 py-2.5 text-sm text-brand-bright">
                  {loginError}
                </p>
              )}
              <button type="submit" className="btn-arcade w-full" disabled={loginLoading}>
                {loginLoading ? 'Verificando…' : 'Entrar al panel'}
              </button>
              <p className="text-center text-xs text-ink-dim">
                Demo: admin@recorcholis.mx / arcade2026
              </p>
            </form>
          </GlassPanel>
        </motion.div>
      </div>
    );
  }

  // ------- Dashboard -------
  const totalBudget = leads.reduce((acc, l) => acc + (Number(l.budget) || 0), 0);
  const stats = [
    { icon: Users, label: 'Prospectos', value: String(leads.length), tone: 'text-neon-cyan' },
    { icon: TrendingUp, label: 'Pipeline', value: formatMXN(totalBudget), tone: 'text-neon-yellow' },
    { icon: Ticket, label: 'Recorcards activas', value: '1,204', tone: 'text-neon-pink' },
    { icon: Megaphone, label: 'Clicks banners', value: banners.reduce((a, b) => a + b.clicks, 0).toLocaleString('es-MX'), tone: 'text-emerald-400' },
  ];

  return (
    <div className="min-h-dvh bg-void pb-16">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-carbon/90 px-6 py-4 backdrop-blur-xl">
        <div>
          <p className="hud-label">crm interno</p>
          <h1 className="font-arcade text-xs text-ink">PANEL DE CONTROL</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-ink-dim sm:inline">
            {session?.user?.name} · {session?.user?.role}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="btn-ghost !px-4 !py-2 text-[9px]"
          >
            <LogOut className="h-3.5 w-3.5" /> Salir
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-6 pt-8">
        {/* KPIs */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map(({ icon: Icon, label, value, tone }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <GlassPanel className="p-5">
                <Icon className="h-5 w-5 text-ink-dim" />
                <p className={`mt-3 font-arcade text-lg ${tone}`}>{value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-ink-dim">{label}</p>
              </GlassPanel>
            </motion.div>
          ))}
        </section>

        {/* Prospectos */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-arcade text-xs text-ink">TRAZABILIDAD DE PROSPECTOS</h2>
            <button
              onClick={loadLeads}
              className="btn-ghost !px-4 !py-2 text-[9px]"
              aria-label="Actualizar prospectos"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Actualizar
            </button>
          </div>
          <GlassPanel className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-ink-dim">
                  <th className="px-5 py-3 font-arcade">Prospecto</th>
                  <th className="px-5 py-3 font-arcade">Tipo</th>
                  <th className="px-5 py-3 font-arcade">Evento</th>
                  <th className="px-5 py-3 font-arcade">Presupuesto</th>
                  <th className="px-5 py-3 font-arcade">Estatus</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
                    <td className="px-5 py-3.5">
                      <p className="text-ink">{lead.fullName}</p>
                      <p className="text-xs text-ink-dim">{lead.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-ink-dim">{lead.type}</td>
                    <td className="px-5 py-3.5 text-ink-dim">
                      {lead.eventDate ?? '—'} · {lead.guests ?? 0} inv.
                    </td>
                    <td className="px-5 py-3.5 text-neon-yellow">
                      {lead.budget ? formatMXN(Number(lead.budget)) : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full border px-3 py-1 font-arcade text-[8px] tracking-widest ${STATUS_STYLE[lead.status]}`}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-ink-dim">
                      Aún no hay prospectos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </GlassPanel>
        </section>

        {/* Banners */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-arcade text-xs text-ink">GESTIÓN DE BANNERS</h2>
            <button
              onClick={() => setBanners((b) => [...b, { id: Date.now(), title: 'Nuevo banner', active: false, clicks: 0 }])}
              className="btn-arcade !px-4 !py-2 text-[9px]"
            >
              <ImagePlus className="h-3.5 w-3.5" /> Nuevo
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {banners.map((banner) => (
              <GlassPanel key={banner.id} className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-ink">{banner.title}</p>
                  <p className="mt-1 text-xs text-ink-dim">{banner.clicks.toLocaleString('es-MX')} clicks</p>
                </div>
                <button
                  onClick={() =>
                    setBanners((b) => b.map((x) => (x.id === banner.id ? { ...x, active: !x.active } : x)))
                  }
                  className={`relative h-6 w-11 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan ${
                    banner.active ? 'bg-brand' : 'bg-white/15'
                  }`}
                  role="switch"
                  aria-checked={banner.active}
                  aria-label={`Banner ${banner.title}`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                      banner.active ? 'left-[22px]' : 'left-0.5'
                    }`}
                  />
                </button>
              </GlassPanel>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function AdminExperience() {
  return (
    <SessionProvider>
      <AdminInner />
    </SessionProvider>
  );
}
