interface InputFieldProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
  disabled?: boolean;
}

export const InputField = ({
  label,
  value,
  onChange,
  type = 'text',
  disabled = false,
}: InputFieldProps) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      disabled={disabled}
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none disabled:opacity-60 transition-all shadow-sm"
    />
  </div>
);