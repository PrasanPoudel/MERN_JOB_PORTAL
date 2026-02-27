import React from "react";

const NavigationItem = ({
  item,
  isActive,
  onClick,
}) => {
  const Icon = item.icon;
  return (
    <button
      onClick={() => {
        onClick(item.id);
      }}
      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer group relative hover:text-white hover:bg-sky-600 ${
        isActive
          ? "text-white bg-sky-600 shadow-sm shadow-sky-50"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <Icon
        className={`h-5 w-5`}
      />
     <span className="ml-3 truncate">{item.name}</span>
    </button>
  );
};

export default NavigationItem;
