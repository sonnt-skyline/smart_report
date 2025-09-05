import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { objectives as initialObjectives } from '../data/dashboardData';

// Create the context
const ObjectiveContext = createContext();

export function ObjectiveProvider({ children }) {
  const [objectives, setObjectives] = useState(() => {
    // Try to get from localStorage first
    const savedObjectives = localStorage.getItem('objectives');
    return savedObjectives ? JSON.parse(savedObjectives) : initialObjectives;
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save to localStorage whenever objectives change
  useEffect(() => {
    localStorage.setItem('objectives', JSON.stringify(objectives));
  }, [objectives]);

  // Create a new objective
  const createObjective = (objective) => {
    try {
      setLoading(true);
      const newObjective = {
        ...objective,
        id: `obj-${Date.now()}`, // Generate a unique ID
        createdAt: new Date().toISOString()
      };
      setObjectives(prevObjectives => [...prevObjectives, newObjective]);
      
      // Here you would typically make an API call to persist the data
      // For now, we're just using localStorage
      
      setLoading(false);
      return newObjective;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Read a specific objective by ID
  const getObjective = (id) => {
    return objectives.find(objective => objective.id === id);
  };

  // Update an existing objective
  const updateObjective = (id, updates) => {
    try {
      setLoading(true);
      setObjectives(prevObjectives => 
        prevObjectives.map(objective => 
          objective.id === id ? { ...objective, ...updates } : objective
        )
      );
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Delete an objective
  const deleteObjective = (id) => {
    try {
      setLoading(true);
      setObjectives(prevObjectives => 
        prevObjectives.filter(objective => objective.id !== id)
      );
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Get AI suggestions for objective wording
  const getAiSuggestion = async (objective) => {
    try {
      setLoading(true);
      
      // This is a placeholder for an actual API call to OpenAI
      // In a real implementation, you would call your backend which integrates with OpenAI API
      // For now, we'll simulate a delay and return some sample suggestions
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const suggestions = {
        title: objective.title.length < 10 
          ? `${objective.title} (Enhanced with specific metrics)` 
          : objective.title,
        description: `${objective.description} This objective follows SMART criteria: Specific, Measurable through ${objective.metrics?.length || 0} KPIs, Achievable, Relevant, and Time-bound with a deadline of ${objective.deadline}.`
      };
      
      setLoading(false);
      return suggestions;
    } catch (err) {
      setError("Failed to get AI suggestions. Please try again later.");
      setLoading(false);
      return null;
    }
  };

  const value = {
    objectives,
    loading,
    error,
    createObjective,
    getObjective,
    updateObjective,
    deleteObjective,
    getAiSuggestion
  };

  return (
    <ObjectiveContext.Provider value={value}>
      {children}
    </ObjectiveContext.Provider>
  );
}

ObjectiveProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Create a custom hook for consuming the context
export function useObjectives() {
  const context = useContext(ObjectiveContext);
  if (context === undefined) {
    throw new Error('useObjectives must be used within an ObjectiveProvider');
  }
  return context;
}

export default ObjectiveContext;
