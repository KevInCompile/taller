interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: string;
  bg: string;
  onClick?: () => void;
  active?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, accent, bg, onClick, active }) => (
  <button onClick={onClick} className={`bg-elements rounded-2xl border border-border-elements shadow-sm p-5 flex items-center gap-4
    ${onClick ? 'cursor-pointer hover:shadow-md' : 'cursor-default'}
    ${active ? 'border-brand-accent ring-2 ring-brand-accent/20' : 'border-border-elements'}`}
  >
    <div className={`${bg} p-3 rounded-xl shrink-0`}>
      <div className={accent}>{icon}</div>
    </div>
    <div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
    </div>
  </button>
);

export default StatCard
