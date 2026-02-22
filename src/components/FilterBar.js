import React from 'react';
import './FilterBar.css';

function FilterBar({
  categories,
  statuses,
  selectedCategory,
  selectedStatus,
  searchTerm,
  onCategoryChange,
  onStatusChange,
  onSearchChange
}) {
  return (
    <div className="filter-bar">
      <div className="filter-group search-group">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Søk etter vedlikehold..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

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
