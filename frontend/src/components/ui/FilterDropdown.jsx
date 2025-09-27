import React from 'react'

const FilterDropdown = ({ 
  label, 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Select...',
  className = '' 
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FilterDropdown
