import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  showToggle?: boolean;
  showPassword?: boolean;
  onToggleVisibility?: () => void;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  error,
  showToggle = false,
  showPassword,
  onToggleVisibility,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
        {label}
      </label>

      <div className="relative">
        <input
          type={showToggle && showPassword ? 'text' : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 pr-10"
        />

        {showToggle && (
          <span
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500 text-sm"
            onClick={onToggleVisibility}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormField;
