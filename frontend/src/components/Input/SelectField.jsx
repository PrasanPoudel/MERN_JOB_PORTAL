import React from "react";
import { AlertCircle, ChevronDown } from "lucide-react";

const SelectField = ({
  label,
  options,
  placeholder,
  error,
  id,
  value,
  onChange,
  icon: Icon,
  required = false,
  disabled = false,
  ...props
}) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <p className="label">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </p>
      )}
      <div className="relative">
        <div className="flex items-center">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <Icon className="w-5 h-5 text-gray-400" />
            </div>
          )}
          <select
            id={id}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`input-base ${Icon ? "input-with-icon" : ""} ${error ? "input-error" : ""} pr-10 appearance-none`}
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-1 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default SelectField;
