import React from "react";

const NavigationItem = ({ item, isActive, onClick, badge }) => {
  const Icon = item.icon;

  return (
    <button
      onClick={() => onClick(item.id)}
      className={[
        "group relative flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition-all duration-200 text-left cursor-pointer",
        isActive
          ? "bg-sky-50 text-sky-700"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
      ].join(" ")}
    >
      {/* Active indicator bar */}
      <span
        className={[
          "absolute left-0 top-1/2 -translate-y-1/2 w-0.75 rounded-full transition-all duration-200",
          isActive
            ? "h-5 bg-sky-600"
            : "h-0 bg-transparent group-hover:h-3 group-hover:bg-slate-300",
        ].join(" ")}
      />

      <Icon
        className={[
          "w-5 h-5 shrink-0 transition-colors duration-200",
          isActive ? "text-sky-600" : "text-slate-400 group-hover:text-slate-600",
        ].join(" ")}
      />
      <span className="truncate flex-1">{item.name}</span>

      {/* Badge */}
      {badge > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white px-1.5">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
};

export default NavigationItem;