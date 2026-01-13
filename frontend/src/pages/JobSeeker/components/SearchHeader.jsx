import React, { useState, useRef, useEffect } from "react";
import {
  BriefcaseBusiness,
  Clock,
  MapPin,
  Search,
  X,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import {
  JOB_TYPES,
  JOB_CATEGORIES,
  NEPAL_LOCATIONS,
} from "../../../utils/data";
import AutocompleteInput from "../../../components/Input/AutocompleteInput";

const SearchHeader = ({
  handleFilterChange,
  handleSearch,
  filters,
  clearAllFilters,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = () => {
    handleSearch();
    setShowFilters(false);
  };

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => key !== "keyword" && value !== ""
  ).length;

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="mx-auto">
      <div className="bg-white mb-2 rounded-2xl border border-white/20 p-1 sm:p-4 relative overflow-hidden">
        {/* Desktop */}
        <div className="relative z-10 flex flex-col gap-4">
          {/* Header Section */}
          <div className="text-center lg:text-left">
            <h1 className="text-2xl lg:text-3xl font-bold mb-3">
              Find Your Dream Job
            </h1>
            <p className="text-gray-600 text-base lg:text-lg">
              Discover opportunities that match your passion and skills
            </p>
          </div>

          {/*Mobile Search*/}
          <div className="flex flex-col gap-4 lg:hidden">
            <div className="flex border-2 border-gray-200 rounded-2xl overflow-hidden bg-white hover:border-gray-300 focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-100 transition-all">
              {/* Keyword Search */}
              <div className="relative group flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-sky-600 transition-colors z-10" />
                <input
                  type="text"
                  value={filters.keyword}
                  onChange={(e) =>
                    handleFilterChange("keyword", e.target.value)
                  }
                  placeholder="Job title, keywords"
                  className="w-full pl-12 pr-4 py-3.5 outline-none bg-transparent placeholder:text-xs placeholder:text-gray-400 text-sm"
                />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(true)}
                className="relative flex items-center justify-center text-gray-700 px-4 border-l-2 border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200"
              >
                <SlidersHorizontal className="w-5 h-5" />
                {activeFilterCount > 0 && (
                  <span className="absolute top-2 right-1.5  text-white bg-sky-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="flex items-center justify-center bg-sky-600 hover:bg-sky-700 hover:to-purple-700 text-white px-5 transition-all duration-200 font-semibold active:brightness-90"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            <div className="h-auto">
              {/* Active Filters on Mobile */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 h-full">
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-xl transition-all duration-200 text-xs font-semibold border border-gray-200 hover:border-gray-300"
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear All
                  </button>

                  {Object.entries(filters).map(
                    ([key, value]) =>
                      value && (
                        <span
                          key={key}
                          className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 px-2.5 py-1.5 rounded-full text-xs font-medium border border-sky-200"
                        >
                          <span className="capitalize">{key}:</span>
                          <span className="font-semibold truncate max-w-20">
                            {value}
                          </span>
                        </span>
                      )
                  )}
                </div>
              )}
            </div>
          </div>

          {/*Desktop */}
          <div className="hidden lg:flex flex-col gap-4">
            {/* All Filters in One Unified Row */}
            <div className="flex border-2 border-gray-200 rounded-2xl overflow-hidden bg-white hover:border-gray-300 focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-100 transition-all">
              {/* Keyword Search */}
              <div className="relative group flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-sky-600 transition-colors z-10" />
                <input
                  type="text"
                  value={filters.keyword}
                  onChange={(e) =>
                    handleFilterChange("keyword", e.target.value)
                  }
                  placeholder="Job title, keywords"
                  className="w-full pl-12 pr-4 py-3.5 outline-none text-base bg-transparent placeholder:text-gray-400"
                />
              </div>

              {/* Location with Autocomplete */}
              <AutocompleteInput
                value={filters.location}
                onChange={(value) => handleFilterChange("location", value)}
                onSelect={(value) => handleFilterChange("location", value)}
                placeholder="Location"
                icon={MapPin}
                suggestions={NEPAL_LOCATIONS}
                className="flex-1 border-l-2 border-gray-200"
              />

              {/* Category with Autocomplete */}
              <AutocompleteInput
                value={filters.category}
                onChange={(value) => handleFilterChange("category", value)}
                onSelect={(value) => handleFilterChange("category", value)}
                placeholder="Category"
                icon={BriefcaseBusiness}
                suggestions={JOB_CATEGORIES}
                className="flex-1 border-l-2 border-gray-200"
              />

              {/* Job Type */}
              <div className="relative group flex-1 border-l-2 border-gray-200">
                <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-sky-600 transition-colors z-10" />
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 outline-none text-base bg-transparent appearance-none cursor-pointer"
                >
                  <option value="">Any</option>
                  {JOB_TYPES.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 text-white bg-sky-600 hover:sky-700 px-6 transition-all duration-200 text-base font-semibold group active:brightness-90 cursor-pointer"
              >
                <Search className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Search</span>
              </button>
            </div>

            {/* Clear Filters Button & Active Filters */}
            <div className="flex flex-wrap items-center gap-3 h-8">
              {hasActiveFilters && (
                <>
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-semibold border-2 border-gray-200 hover:border-gray-300 active:scale-95"
                  >
                    <X className="w-4 h-4" />
                    Clear All
                  </button>

                  {/* Active Filter Chips */}
                  {Object.entries(filters).map(
                    ([key, value]) =>
                      value && (
                        <span
                          key={key}
                          className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 px-3 py-1.5 rounded-full text-sm font-medium border border-sky-200"
                        >
                          <span className="capitalize">{key}:</span>
                          <span className="font-semibold">{value}</span>
                          <button
                            onClick={() => handleFilterChange(key, "")}
                            className="ml-1 hover:bg-sky-200 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      )
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters*/}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Filter Panel */}
          <div className="absolute inset-0 bottom-0 bg-white  overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            {/* Filter Content */}
            <div className="flex-1 overflow-y-auto px-6 pt-3 pb-6 space-y-3">
              {/* Location with Autocomplete */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Location
                </label>
                <AutocompleteInput
                  value={filters.location}
                  onChange={(value) => handleFilterChange("location", value)}
                  onSelect={(value) => handleFilterChange("location", value)}
                  placeholder="e.g., Kathmandu"
                  icon={MapPin}
                  suggestions={NEPAL_LOCATIONS}
                  className="w-full border-2 border-gray-200 rounded-2xl focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-100 transition-all"
                />
              </div>

              {/* Category with Autocomplete */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Category
                </label>
                <AutocompleteInput
                  value={filters.category}
                  onChange={(value) => handleFilterChange("category", value)}
                  onSelect={(value) => handleFilterChange("category", value)}
                  placeholder="e.g., Engineering"
                  icon={BriefcaseBusiness}
                  suggestions={JOB_CATEGORIES}
                  className="w-full border-2 border-gray-200 rounded-2xl focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-100 transition-all"
                />
              </div>

              {/* Job Type */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Job Type
                </label>
                <div className="relative group">
                  <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-sky-600 transition-colors z-10" />
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange("type", e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 outline-none border-2 border-gray-200 rounded-2xl text-base bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">All Job Types</option>
                    {JOB_TYPES.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Footer Actions */}

            <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-3">
              {activeFilterCount > 0 && (
                <>
                  <button
                    onClick={clearAllFilters}
                    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3.5 rounded-2xl transition-all duration-200 text-base font-semibold border-2 border-gray-200 hover:border-gray-300 active:scale-95"
                  >
                    <X className="w-5 h-5" />
                    Clear All Filters
                  </button>

                  <button
                    onClick={applyFilters}
                    className="w-full text-center bg-sky-600 hover:bg-sky-700 text-white px-6 py-3.5 rounded-2xl transition-all duration-200 text-base font-semibold shadow-lg hover:shadow-xl active:scale-95"
                  >
                    Apply Filters{" "}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchHeader;
