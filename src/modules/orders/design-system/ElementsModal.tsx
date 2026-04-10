export const Field = ({
  label, required, error, icon, children,
}: {
  label: string; required?: boolean; error?: string;
  icon?: React.ReactNode; children: React.ReactNode;
}) => (
  <div className="w-full">
    <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
      {icon} {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-[10px] mt-1 font-medium">{error}</p>}
  </div>
);
