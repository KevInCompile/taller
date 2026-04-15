interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: string;
  bg: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, accent, bg }) => (
  <div className={`bg-elements rounded-2xl border border-border-elements shadow-sm p-5 flex items-center gap-4`}>
    <div className={`${bg} p-3 rounded-xl shrink-0`}>
      <div className={accent}>{icon}</div>
    </div>
    <div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
    </div>
  </div>
);

export default StatCard
