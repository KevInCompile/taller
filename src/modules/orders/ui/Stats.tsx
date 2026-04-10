import { useMemo } from "react";
import type { WorkOrder } from "../schemas/work-order.model";
import { CheckCircle2, ClipboardList, Clock, Wrench, XCircle } from "lucide-react";
import StatCard from "./StatCard";

interface Props {
  workOrders: WorkOrder[]
}
const Stats: React.FC<Props> = (props) => {
  const {workOrders} = props

  const stats = useMemo(() => ({
    total:       workOrders.length,
    pending:     workOrders.filter(o => o.status === 'PENDING').length,
    inProgress:  workOrders.filter(o => o.status === 'IN_PROGRESS').length,
    completed:   workOrders.filter(o => o.status === 'COMPLETED').length,
    cancelled:   workOrders.filter(o => o.status === 'CANCELLED').length,
  }), [workOrders]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <StatCard
        label="Total Órdenes"
        value={stats.total}
        icon={<ClipboardList size={20} />}
        accent="text-gray-600"
        bg="bg-gray-100"
      />
      <StatCard
        label="Pendientes"
        value={stats.pending}
        icon={<Clock size={20} />}
        accent="text-amber-600"
        bg="bg-amber-50"
      />
      <StatCard
        label="En Proceso"
        value={stats.inProgress}
        icon={<Wrench size={20} />}
        accent="text-blue-600"
        bg="bg-blue-50"
      />
      <StatCard
        label="Completadas"
        value={stats.completed}
        icon={<CheckCircle2 size={20} />}
        accent="text-green-600"
        bg="bg-green-50"
      />
      <StatCard
        label="Canceladas"
        value={stats.cancelled}
        icon={<XCircle size={20} />}
        accent="text-gray-400"
        bg="bg-gray-100"
      />
    </div>
  )
}

export default Stats
