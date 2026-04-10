

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export const EmptyState = ({ icon, title, description, className = '' }: EmptyStateProps) => (
  <div className={`text-center py-8 text-gray-400 ${className}`}>
    {icon}
    <p className="font-medium mt-3">{title}</p>
    <p className="text-sm mt-1">{description}</p>
  </div>
);