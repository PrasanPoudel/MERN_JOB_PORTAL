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
      className={`w-full border mt-4 border-gray-400 flex items-center p-2 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer group relative hover:text-white hover:bg-sky-600 ${
        isActive
          ? "border-white text-white bg-sky-600 shadow-sm shadow-sky-50"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <Icon
        className={`h-5 w-5`}
      />
     <span className="ml-2 truncate">{item.name}</span>
    </button>
  );
};

export default NavigationItem;
