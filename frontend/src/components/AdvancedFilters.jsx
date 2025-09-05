import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FaFilter, FaSearch, FaTags } from 'react-icons/fa';

const FilterContainer = styled.div`
  margin-bottom: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const FilterForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
  color: #495057;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #4dabf7;
    box-shadow: 0 0 0 2px rgba(77, 171, 247, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #4dabf7;
    box-shadow: 0 0 0 2px rgba(77, 171, 247, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => props.primary ? `
    background-color: #339af0;
    color: white;
    border: none;
    
    &:hover {
      background-color: #1c7ed6;
    }
  ` : `
    background-color: white;
    color: #495057;
    border: 1px solid #ced4da;
    
    &:hover {
      background-color: #f1f3f5;
    }
  `}
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.span`
  background-color: ${props => props.active ? '#339af0' : '#e9ecef'};
  color: ${props => props.active ? 'white' : '#495057'};
  padding: 0.25rem 0.5rem;
  border-radius: 16px;
  font-size: 0.8rem;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.active ? '#1c7ed6' : '#dee2e6'};
  }
`;

const AdvancedFilters = ({ 
  visible, 
  filters, 
  availableTags, 
  statuses, 
  quadrants, 
  onFilterChange, 
  onReset 
}) => {
  if (!visible) return null;
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };
  
  const toggleTag = (tag) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    onFilterChange({ ...filters, tags: newTags });
  };
  
  return (
    <FilterContainer>
      <FilterForm onSubmit={(e) => e.preventDefault()}>
        <FilterGroup>
          <Label htmlFor="search">
            <FaSearch size={12} /> Search
          </Label>
          <Input
            type="text"
            id="search"
            name="search"
            value={filters.search || ''}
            onChange={handleInputChange}
            placeholder="Search title or description"
          />
        </FilterGroup>
        
        <FilterGroup>
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            name="status"
            value={filters.status || ''}
            onChange={handleInputChange}
          >
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </Select>
        </FilterGroup>
        
        <FilterGroup>
          <Label htmlFor="quadrant">Priority Quadrant</Label>
          <Select
            id="quadrant"
            name="quadrant"
            value={filters.quadrant || ''}
            onChange={handleInputChange}
          >
            <option value="">All Quadrants</option>
            {Object.entries(quadrants).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>
        </FilterGroup>
        
        <FilterGroup>
          <Label htmlFor="progressMin">Progress Range</Label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Input
              type="number"
              id="progressMin"
              name="progressMin"
              min="0"
              max="100"
              value={filters.progressMin || '0'}
              onChange={handleInputChange}
              placeholder="Min %"
              style={{ flex: 1 }}
            />
            <span>to</span>
            <Input
              type="number"
              id="progressMax"
              name="progressMax"
              min="0"
              max="100"
              value={filters.progressMax || '100'}
              onChange={handleInputChange}
              placeholder="Max %"
              style={{ flex: 1 }}
            />
          </div>
        </FilterGroup>
      </FilterForm>
      
      <div style={{ marginTop: '1rem' }}>
        <Label>
          <FaTags size={12} /> Tags
        </Label>
        <TagsContainer>
          {availableTags.map((tag) => (
            <Tag
              key={tag}
              active={(filters.tags || []).includes(tag)}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Tag>
          ))}
        </TagsContainer>
      </div>
      
      <ButtonGroup>
        <Button primary>
          <FaFilter size={12} /> Apply Filters
        </Button>
        <Button onClick={onReset}>
          Reset
        </Button>
      </ButtonGroup>
    </FilterContainer>
  );
};

AdvancedFilters.propTypes = {
  visible: PropTypes.bool.isRequired,
  filters: PropTypes.shape({
    search: PropTypes.string,
    status: PropTypes.string,
    quadrant: PropTypes.string,
    progressMin: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    progressMax: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
  availableTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
  quadrants: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

AdvancedFilters.defaultProps = {
  filters: {},
};

export default AdvancedFilters;
