import React from "react";

const NavigationItem = ({
  item,
  isActive,
  isCollapsed,
  onClick,
  unreadCount,
}) => {
  const Icon = item.icon;
  return (
    <button
      onClick={() => {
        onClick(item.id);
      }}
      className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer group relative ${
        isActive
          ? "bg-sky-50 text-sky-700 shadow-sm shadow-sky-50"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <Icon
        className={`h-5 w-5 ${isActive ? "text-sky-600" : "text-gray-600"}`}
      />
      {!isCollapsed && <span className="ml-3 truncate">{item.name}</span>}
      {unreadCount > 0 && (
        <span className="absolute right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NavigationItem;
