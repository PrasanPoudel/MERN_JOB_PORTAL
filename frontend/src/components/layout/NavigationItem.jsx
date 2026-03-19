import React from "react";

const NavigationItem = ({ item, isActive, onClick }) => {
  const Icon = item.icon;

  return (
    <button
      onClick={() => onClick(item.id)}
      className={[
        "flex items-center gap-4 w-full px-4 py-2 rounded-lg transition-all duration-150 text-left cursor-pointer",
        isActive
          ? "text-white bg-sky-600 font-medium"
          : "text-gray-900 hover:bg-sky-50 ",
      ].join(" ")}
    >
      <Icon className="w-4 h-4" />
      <span className="truncate">{item.name}</span>
    </button>
  );
};

export default NavigationItem;
