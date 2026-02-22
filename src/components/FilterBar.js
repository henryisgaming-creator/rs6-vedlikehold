import React from 'react';
import './FilterBar.css';

function FilterBar({
  categories,
  statuses,
  selectedCategory,
  selectedStatus,
  onCategoryChange,
  onStatusChange
}) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="category-select">Kategori:</label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="status-select">Status:</label>
        <select
          id="status-select"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FilterBar;
