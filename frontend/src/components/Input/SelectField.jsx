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
    <div className="space-y-2">
      <p className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </p>
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
            className={`w-full ${
              Icon ? "pl-10" : "pl-3"
            } pr-10 py-2.5 border rounded-lg text-base transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500 ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-sky-500 focus:ring-sky-500"
            } focus:outline-none focus:ring-2  appearance-none bg-white`}
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute inset-y-0 h-5 w-5 right-1 pointer-events-none top-1/4 text-gray-500" />
        </div>
      </div>
      {error && (
        <div className="flex items-center space-x-1 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default SelectField;
