import type { FieldValues, Path, UseFormRegister, FieldError } from 'react-hook-form';

interface FormInputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string | FieldError;
  type?: string;
  placeholder?: string;
  className?: string;
}

export const FormInput = <T extends FieldValues>({
  label,
  name,
  register,
  error,
  type = 'text',
  placeholder,
  className,
}: FormInputProps<T>) => {
  const errorMessage = typeof error === 'string' ? error : error?.message;

  return (
    <div className={`w-full ${className ?? ''}`}>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={`w-full p-3 bg-gray-50 border rounded-lg outline-none transition-all shadow-sm ${
          errorMessage
            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
            : 'border-gray-200 focus:ring-2 focus:ring-brand-accent'
        }`}
      />
      {errorMessage && (
        <p className="text-red-500 text-xs mt-1 font-medium">{errorMessage}</p>
      )}
    </div>
  );
};