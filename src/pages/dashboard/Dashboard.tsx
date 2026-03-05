import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWorkOrders } from '../../hooks/useWorkOrders';
import { useSupplies } from '../../hooks/useSupplies';
import { useCustomers } from '../../hooks/useCustomers';
import { StatusBadge, PriorityBadge } from '../../components/orders/WorkOrderBadges';
import {
  TrendingUp, Wrench, Users, Package, AlertTriangle,
  Plus, CheckCircle2, ClipboardList, Calendar, ChevronRight,
  XCircle, Loader2, BarChart3, Target,
} from 'lucide-react';
import { formatCurrency } from '../../helpers/helpers';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDateShort = (d: string) =>
  new Date(d).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
  });

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 18) return 'Buenas tardes';
  return 'Buenas noches';
};

const formatFullDate = () =>
  new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

// ─── Sub-components ───────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent: string;
  bg: string;
  trend?: { value: string; positive: boolean } | null;
  to?: string;
}

const KpiCard = ({ label, value, sub, icon, accent, bg, trend, to }: KpiCardProps) => {
  const content = (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 h-full
      ${to ? 'hover:shadow-md hover:border-gray-200 transition-all cursor-pointer' : ''}`}>
      <div className="flex items-start justify-between">
        <div className={`${bg} p-3 rounded-xl shrink-0`}>
          <div className={accent}>{icon}</div>
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
            trend.positive
              ? 'bg-green-50 text-green-600'
              : 'bg-red-50 text-red-500'
          }`}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800 leading-tight">{value}</p>
        <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-500 mt-1 font-semibold">{sub}</p>}
      </div>
    </div>
  );

  return to ? <Link to={to} className="block h-full">{content}</Link> : content;
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const Dashboard = () => {
  const navigate = useNavigate();
  const { workOrders, loading: loadingOrders } = useWorkOrders();
  const { supplies, loading: loadingSupplies } = useSupplies();
  const { customers, loading: loadingCustomers } = useCustomers();

  const loading = loadingOrders || loadingSupplies || loadingCustomers;

  // ── Derived metrics ─────────────────────────────────────────────────────────
  const completedOrders = useMemo(
    () => workOrders.filter(o => o.status === 'COMPLETED'),
    [workOrders],
  );

  const totalRevenue = useMemo(
    () => completedOrders.reduce((acc, o) => acc + Number(o.total), 0),
    [completedOrders],
  );

  const monthRevenue = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return completedOrders
      .filter(o => new Date(o.updatedAt) >= startOfMonth)
      .reduce((acc, o) => acc + Number(o.total), 0);
  }, [completedOrders]);

  const lastMonthRevenue = useMemo(() => {
    const now = new Date();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth   = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    return completedOrders
      .filter(o => {
        const d = new Date(o.updatedAt);
        return d >= startOfLastMonth && d <= endOfLastMonth;
      })
      .reduce((acc, o) => acc + Number(o.total), 0);
  }, [completedOrders]);

  const revenueTrend = useMemo(() => {
    if (lastMonthRevenue === 0) return null;
    const diff = ((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
    return { value: `${Math.abs(Math.round(diff))}%`, positive: diff >= 0 };
  }, [monthRevenue, lastMonthRevenue]);

  const avgTicket = useMemo(
    () => completedOrders.length > 0
      ? Math.round(totalRevenue / completedOrders.length)
      : 0,
    [totalRevenue, completedOrders],
  );

  const activeOrders  = useMemo(() => workOrders.filter(o => o.status === 'IN_PROGRESS'),  [workOrders]);
  const pendingOrders = useMemo(() => workOrders.filter(o => o.status === 'PENDING'),       [workOrders]);
  const urgentCount   = useMemo(() => pendingOrders.filter(o => o.priority === 'URGENT').length, [pendingOrders]);

  const completionRate = useMemo(() => {
    const finalized = workOrders.filter(o => o.status === 'COMPLETED' || o.status === 'CANCELLED').length;
    return finalized > 0 ? Math.round((completedOrders.length / finalized) * 100) : 0;
  }, [workOrders, completedOrders]);

  const todayOrders = useMemo(() => {
    const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
    const endOfToday   = new Date(startOfToday); endOfToday.setDate(endOfToday.getDate() + 1);
    return workOrders.filter(o => {
      const d = new Date(o.startDate);
      return d >= startOfToday && d < endOfToday;
    });
  }, [workOrders]);

  const stockAlerts = useMemo(
    () => supplies
      .filter(s => s.stock < 5)
      .sort((a, b) => a.stock - b.stock),
    [supplies],
  );

  const recentOrders = useMemo(
    () => [...workOrders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 7),
    [workOrders],
  );

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 text-gray-400">
        <Loader2 className="animate-spin text-brand-accent" size={44} />
        <p className="font-medium text-sm animate-pulse">Cargando dashboard...</p>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 p-8 animate-fadeIn">

      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {getGreeting()}
          </h1>
          <p className="text-gray-400 text-sm mt-0.5 capitalize">
            {formatFullDate()} · Resumen general del taller
          </p>
        </div>
        <button
          onClick={() => navigate('/orders')}
          className="self-start sm:self-auto bg-brand-accent text-white px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-100 font-semibold text-sm"
        >
          <Plus size={18} /> Nueva Orden
        </button>
      </header>

      {/* ─── KPI Row ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <KpiCard
          label="Ingresos del mes"
          value={formatCurrency(monthRevenue)}
          sub={`Total acumulado: ${formatCurrency(totalRevenue)}`}
          icon={<TrendingUp size={20} />}
          accent="text-green-600"
          bg="bg-green-50"
          trend={revenueTrend}
          to="/orders"
        />

        <KpiCard
          label="En proceso ahora"
          value={activeOrders.length}
          sub={pendingOrders.length > 0
            ? `+ ${pendingOrders.length} pendiente${pendingOrders.length !== 1 ? 's' : ''}${urgentCount > 0 ? ` (${urgentCount} urgente${urgentCount !== 1 ? 's' : ''})` : ''}`
            : 'Sin pendientes'}
          icon={<Wrench size={20} />}
          accent="text-blue-600"
          bg="bg-blue-50"
          to="/orders"
        />

        <KpiCard
          label="Ticket promedio"
          value={formatCurrency(avgTicket)}
          sub={`${completedOrders.length} orden${completedOrders.length !== 1 ? 'es' : ''} completada${completedOrders.length !== 1 ? 's' : ''} · ${completionRate}% tasa`}
          icon={<Target size={20} />}
          accent="text-brand-accent"
          bg="bg-orange-50"
        />

        <KpiCard
          label="Clientes registrados"
          value={customers.length}
          sub={`${customers.filter(c => c.vehicles.length > 0).length} con vehículos`}
          icon={<Users size={20} />}
          accent="text-purple-600"
          bg="bg-purple-50"
          to="/customers"
        />

      </div>

      {/* ─── Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ── Últimas Órdenes (3/5) ── */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <ClipboardList size={18} className="text-brand-accent" />
              Últimas Órdenes
            </h2>
            <Link
              to="/orders"
              className="text-xs text-brand-accent font-bold hover:underline flex items-center gap-1"
            >
              Ver todas <ChevronRight size={14} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <ClipboardList size={36} className="text-gray-200 mb-3" />
              <p className="text-sm font-medium">No hay órdenes aún</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentOrders.map(order => (
                <div
                  key={order.id}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors group"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-brand-accent flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                    {order.customer?.firstName?.charAt(0) ?? '?'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {order.customer
                        ? `${order.customer.firstName} ${order.customer.lastName}`
                        : 'Sin cliente'}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {order.vehicle && (
                        <span className="text-[10px] font-bold bg-orange-50 text-brand-accent border border-orange-100 px-1.5 py-0.5 rounded uppercase">
                          {order.vehicle.plate}
                        </span>
                      )}
                      <span className="text-[11px] text-gray-400 truncate">
                        {order.service?.name ?? '—'} · {order.mechanic}
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                    <StatusBadge status={order.status} size="sm" />
                    <PriorityBadge priority={order.priority} size="sm" />
                  </div>

                  {/* Total + date */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-800 tabular-nums">
                      {formatCurrency(order.total)}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {formatDateShort(order.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right column (2/5) ── */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Stock Alerts */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-1">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <AlertTriangle size={16} className={stockAlerts.length > 0 ? 'text-amber-500' : 'text-gray-300'} />
                Alertas de Stock
                {stockAlerts.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {stockAlerts.length}
                  </span>
                )}
              </h2>
              <Link
                to="/supplies"
                className="text-xs text-brand-accent font-bold hover:underline flex items-center gap-1"
              >
                Ver <ChevronRight size={13} />
              </Link>
            </div>

            {stockAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400 gap-2">
                <CheckCircle2 size={28} className="text-green-300" />
                <p className="text-xs font-medium text-green-600">Todo el stock en orden</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {stockAlerts.slice(0, 5).map(supply => {
                  const isOut = supply.stock === 0;
                  return (
                    <div key={supply.id} className="flex items-center gap-3 px-5 py-3">
                      <div className={`p-1.5 rounded-lg shrink-0 ${isOut ? 'bg-red-50' : 'bg-amber-50'}`}>
                        {isOut
                          ? <XCircle size={14} className="text-red-500" />
                          : <AlertTriangle size={14} className="text-amber-500" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{supply.name}</p>
                        <p className={`text-[10px] font-bold mt-0.5 ${isOut ? 'text-red-500' : 'text-amber-600'}`}>
                          {isOut ? 'Sin stock' : `${supply.stock} unidad${supply.stock !== 1 ? 'es' : ''}`}
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        isOut
                          ? 'bg-red-50 text-red-600 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {isOut ? 'Agotado' : 'Bajo'}
                      </span>
                    </div>
                  );
                })}
                {stockAlerts.length > 5 && (
                  <div className="px-5 py-2.5 text-center">
                    <Link to="/supplies" className="text-xs text-brand-accent font-bold hover:underline">
                      +{stockAlerts.length - 5} más →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Today's Orders */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <Calendar size={16} className="text-brand-accent" />
                Programadas Hoy
                {todayOrders.length > 0 && (
                  <span className="bg-brand-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {todayOrders.length}
                  </span>
                )}
              </h2>
            </div>

            {todayOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-7 text-gray-400 gap-2">
                <Calendar size={26} className="text-gray-200" />
                <p className="text-xs font-medium">Sin órdenes para hoy</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {todayOrders.slice(0, 4).map(order => (
                  <div key={order.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                      {order.customer?.firstName?.charAt(0) ?? '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">
                        {order.customer
                          ? `${order.customer.firstName} ${order.customer.lastName}`
                          : 'Sin cliente'}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">
                        {order.vehicle?.plate ?? '—'} · {order.mechanic}
                      </p>
                    </div>
                    <StatusBadge status={order.status} size="sm" />
                  </div>
                ))}
                {todayOrders.length > 4 && (
                  <div className="px-5 py-2.5 text-center">
                    <Link to="/orders" className="text-xs text-brand-accent font-bold hover:underline">
                      +{todayOrders.length - 4} más →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ─── Bottom row: metrics ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Orders by status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:col-span-2">
          <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-brand-accent" /> Distribución de Órdenes
          </h3>
          <div className="space-y-2.5">
            {[
              { label: 'Completadas', count: completedOrders.length, color: 'bg-green-500', text: 'text-green-600' },
              { label: 'En Proceso',  count: activeOrders.length,    color: 'bg-blue-500',  text: 'text-blue-600' },
              { label: 'Pendientes',  count: pendingOrders.length,   color: 'bg-amber-400', text: 'text-amber-600' },
              { label: 'Canceladas',  count: workOrders.filter(o => o.status === 'CANCELLED').length, color: 'bg-gray-300', text: 'text-gray-500' },
            ].map(({ label, count, color, text }) => {
              const pct = workOrders.length > 0 ? Math.round((count / workOrders.length) * 100) : 0;
              return (
                <div key={label} className="flex items-center gap-3">
                  <p className="text-xs text-gray-500 w-24 shrink-0">{label}</p>
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className={`text-xs font-bold w-8 text-right tabular-nums ${text}`}>{count}</span>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-gray-400 mt-3 text-right">
            Total: {workOrders.length} orden{workOrders.length !== 1 ? 'es' : ''}
          </p>
        </div>

        {/* Completion rate */}
        <div className="bg-brand-dark rounded-2xl shadow-sm p-5 flex flex-col justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Tasa de Completación</p>
            <p className="text-4xl font-bold text-white mt-2">{completionRate}<span className="text-xl text-gray-400">%</span></p>
          </div>
          <div>
            <div className="w-full bg-white/10 rounded-full h-2 mt-4 overflow-hidden">
              <div
                className="h-2 rounded-full bg-brand-accent transition-all duration-700"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-2">
              {completedOrders.length} completadas de {workOrders.filter(o => o.status !== 'PENDING').length} iniciadas
            </p>
          </div>
        </div>

        {/* Supplies quick stat */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Inventario</p>
            <Link to="/supplies" className="text-brand-accent hover:text-orange-600">
              <ChevronRight size={16} />
            </Link>
          </div>
          <div className="space-y-2 mt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                <p className="text-xs text-gray-600">Disponibles</p>
              </div>
              <span className="text-sm font-bold text-gray-800">{supplies.filter(s => s.stock >= 5).length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <p className="text-xs text-gray-600">Stock bajo</p>
              </div>
              <span className="text-sm font-bold text-amber-600">{supplies.filter(s => s.stock > 0 && s.stock < 5).length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <p className="text-xs text-gray-600">Sin stock</p>
              </div>
              <span className="text-sm font-bold text-red-500">{supplies.filter(s => s.stock === 0).length}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <Package size={13} className="text-gray-400" />
              <p className="text-xs text-gray-400">{supplies.length} suministros en total</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
