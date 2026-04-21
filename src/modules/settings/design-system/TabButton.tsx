interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

export const TabButton = ({ active, onClick, icon, label }: TabButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`pb-4 px-2 flex items-center gap-2 font-medium transition-all ${
      active
        ? 'border-b-2 border-brand-accent text-brand-accent'
        : 'text-foreground hover:text-gray-400'
    }`}
  >
    {icon} {label}
  </button>
);
