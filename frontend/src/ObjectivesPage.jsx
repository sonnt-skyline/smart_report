import React, { useState } from 'react';
import styled from 'styled-components';
import { FaArrowLeft } from 'react-icons/fa';
import ObjectivesTable from './components/ObjectivesTable';
import ObjectiveForm from './components/ObjectiveForm';
import ObjectiveTracker from './components/ObjectiveTracker';
import { ObjectiveProvider, useObjectives } from './context/ObjectiveContext';
import { Link } from 'react-router-dom';

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const PageTitle = styled.h1`
  margin: 0;
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #0088cc;
  padding: 0.5rem;
  border-radius: 4px;
  
  &:hover {
    background-color: #f1f1f1;
  }
`;

const ObjectivesContent = () => {
  const { objectives, createObjective, updateObjective } = useObjectives();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentObjective, setCurrentObjective] = useState(null);
  const [selectedObjective, setSelectedObjective] = useState(null);
  
  // Open modal for creating a new objective
  const handleCreateObjective = () => {
    setCurrentObjective(null);
    setIsModalOpen(true);
  };
  
  // Open modal for editing an existing objective
  const handleEditObjective = (objective) => {
    setCurrentObjective(objective);
    setIsModalOpen(true);
  };
  
  // Handle form save (create or update)
  const handleSaveObjective = (objectiveData) => {
    if (currentObjective) {
      // Update existing objective
      updateObjective(currentObjective.id, objectiveData);
    } else {
      // Create new objective
      createObjective(objectiveData);
    }
    setIsModalOpen(false);
    setCurrentObjective(null);
  };
  
  // View objective details and progress tracking
  const handleViewObjective = (objective) => {
    setSelectedObjective(objective);
  };
  
  // Back to objectives table
  const handleBackToList = () => {
    setSelectedObjective(null);
  };
  
  return (
    <PageContainer>
      {selectedObjective ? (
        // Objective details view
        <>
          <PageHeader>
            <BackLink onClick={handleBackToList}>
              <FaArrowLeft /> Back to Objectives
            </BackLink>
            <button onClick={() => handleEditObjective(selectedObjective)}>
              Edit Objective
            </button>
          </PageHeader>
          
          <h1>{selectedObjective.title}</h1>
          <p>{selectedObjective.description}</p>
          
          <ObjectiveTracker objective={selectedObjective} />
        </>
      ) : (
        // Objectives list view
        <>
          <PageHeader>
            <PageTitle>Objectives</PageTitle>
            <BackLink to="/dashboard">
              <FaArrowLeft /> Back to Dashboard
            </BackLink>
          </PageHeader>
          
          <ObjectivesTable 
            onCreateObjective={handleCreateObjective} 
            onEditObjective={handleEditObjective} 
            onViewObjective={handleViewObjective}
          />
        </>
      )}
      
      {/* Modal form for creating/editing objectives */}
      <ObjectiveForm 
        isOpen={isModalOpen}
        objective={currentObjective}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveObjective}
      />
    </PageContainer>
  );
};

// Wrapper component with ObjectiveProvider
const ObjectivesPage = () => {
  return (
    <ObjectiveProvider>
      <ObjectivesContent />
    </ObjectiveProvider>
  );
};

export default ObjectivesPage;
