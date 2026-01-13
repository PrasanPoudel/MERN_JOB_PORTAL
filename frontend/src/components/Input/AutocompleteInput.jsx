import React, { useRef, useState, useEffect } from "react";

const AutocompleteInput = ({
  value,
  onChange,
  placeholder,
  icon: Icon,
  suggestions,
  onSelect,
  className = "",
}) => {
  const [suggestion, setSuggestion] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (value && value.trim()) {
      const found = suggestions.find((item) =>
        item.toLowerCase().startsWith(value.toLowerCase())
      );
      if (found && found.toLowerCase() !== value.toLowerCase()) {
        setSuggestion(found);
      } else {
        setSuggestion("");
      }
    } else {
      setSuggestion("");
    }
  }, [value, suggestions]);

  const handleKeyDown = (e) => {
    if (e.key === "Tab" && suggestion) {
      e.preventDefault();
      onSelect(suggestion);
      setSuggestion("");
    } else if (e.key === "ArrowRight" && suggestion && inputRef.current) {
      const cursorAtEnd = inputRef.current.selectionStart === value.length;
      if (cursorAtEnd) {
        e.preventDefault();
        onSelect(suggestion);
        setSuggestion("");
      }
    }
  };

  const clearSuggestions = () => {
    setSuggestion("");
  };
  return (
    <div className={`relative group ${className}`}>
      <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-sky-600 transition-colors z-10" />
      {suggestion && (
        <div className="absolute left-12 top-1/2 transform -translate-y-1/2 pointer-events-none text-base text-gray-400">
          <span className="invisible">{value}</span>
          <span>{suggestion.slice(value.length)}</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3.5 outline-none text-base bg-transparent placeholder:text-gray-400 relative z-10"
        autoComplete="off"
      />
    </div>
  );
};

export default AutocompleteInput;
