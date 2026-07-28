import React from 'react';
import './FilterBar.css';

interface FilterBarProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ activeFilter, setActiveFilter }) => {
  const filters = ['All', 'meals', 'appetizers', 'drinks'];

  return (
    <div className="filter-bar">
      <div className="filter-container">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`filter-button ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;