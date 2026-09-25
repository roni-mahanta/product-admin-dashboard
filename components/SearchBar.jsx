"use client";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full md:max-w-md">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search products..."
        className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 outline-none focus:ring-2 focus:ring-blue-500"
      />

      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        🔍
      </span>
    </div>
  );
}