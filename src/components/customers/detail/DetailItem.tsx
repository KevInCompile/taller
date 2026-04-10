

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export const DetailItem = ({ icon, label, value }: DetailItemProps) => (
  <div className="flex items-center gap-3 text-sm">
    <div className="text-gray-400">{icon}</div>
    <div>
      <p className="text-gray-400 text-[10px] uppercase font-bold leading-none">{label}</p>
      <p className="text-gray-700 font-medium">{value}</p>
    </div>
  </div>
);