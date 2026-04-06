import React from "react";
import { AlertCircle } from "lucide-react";

const InputField = ({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  icon: Icon,
  ...props
}) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="label">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          autoComplete="off"
          type={type}
          value={value}
          placeholder={placeholder}
          id={id}
          onChange={onChange}
          disabled={disabled}
          className={`input-base ${Icon ? "input-with-icon" : ""} ${error ? "input-error" : ""}`}
          {...props}
        />
      </div>
      {error && (
        <div className="flex items-center gap-1 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-400">{helperText}</p>
      )}
    </div>
  );
};

export default InputField;
