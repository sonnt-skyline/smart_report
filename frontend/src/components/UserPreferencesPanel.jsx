import React, { useState } from 'react';
import styled from 'styled-components';
import { FaCog, FaTimes, FaUndo } from 'react-icons/fa';
import { useUserPreferences } from '../context/UserPreferencesContext';

const PreferencesButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: #339af0;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  z-index: 1000;
  transition: transform 0.3s ease;
  
  &:hover {
    background-color: #1c7ed6;
    transform: translateY(-2px);
  }
`;

// Create a functional component to handle the visible prop
const Panel = ({ visible, children, ...rest }) => {
  return (
    <StyledPanel style={{ right: visible ? '0' : '-400px' }} {...rest}>
      {children}
    </StyledPanel>
  );
};

const StyledPanel = styled.div`
  position: fixed;
  top: 0;
  width: 350px;
  height: 100vh;
  background-color: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  z-index: 1001;
  overflow-y: auto;
  transition: right 0.3s ease;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PanelTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #495057;
  
  &:hover {
    color: #1c7ed6;
  }
`;

const PreferenceSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #495057;
`;

const OptionLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #212529;
  cursor: pointer;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  margin-bottom: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #4dabf7;
  }
`;

const Toggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

// Separate the span from the label to avoid non-standard props
const SwitchLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 52px;
  height: 26px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

// Create non-styled components to handle the checked state logic
const Switch = ({ checked, children }) => {
  return (
    <SwitchLabel>
      <input type="checkbox" checked={checked} readOnly />
      <SwitchBackground checked={checked}>
        <SwitchKnob checked={checked} />
      </SwitchBackground>
      {children}
    </SwitchLabel>
  );
};

// Use regular styled components for the visual parts
const SwitchBackground = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.checked ? '#339af0' : '#e9ecef'};
  transition: 0.3s;
  border-radius: 34px;
`;

const SwitchKnob = styled.span`
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
  transform: ${props => props.checked ? 'translateX(26px)' : 'translateX(0)'};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

// Create functional component versions
const Button = ({ primary, children, ...rest }) => {
  return primary ? (
    <PrimaryButton {...rest}>{children}</PrimaryButton>
  ) : (
    <SecondaryButton {...rest}>{children}</SecondaryButton>
  );
};

const ButtonBase = styled.button`
  padding: 0.75rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PrimaryButton = styled(ButtonBase)`
  background-color: #339af0;
  color: white;
  border: none;
  
  &:hover {
    background-color: #1c7ed6;
  }
`;

const SecondaryButton = styled(ButtonBase)`
  background-color: white;
  color: #495057;
  border: 1px solid #ced4da;
  
  &:hover {
    background-color: #f1f3f5;
  }
`;

// Component for user preferences panel
const UserPreferencesPanel = () => {
  const [isPanelVisible, setPanelVisible] = useState(false);
  const { preferences, updatePreference, resetPreferences } = useUserPreferences();

  const togglePanel = () => {
    setPanelVisible(!isPanelVisible);
  };

  return (
    <>
      <PreferencesButton onClick={togglePanel} title="User Preferences">
        <FaCog size={20} />
      </PreferencesButton>
      
      <Panel visible={isPanelVisible}>
        <PanelHeader>
          <PanelTitle>Dashboard Preferences</PanelTitle>
          <CloseButton onClick={togglePanel}>
            <FaTimes />
          </CloseButton>
        </PanelHeader>
        
        <PreferenceSection>
          <SectionTitle>Appearance</SectionTitle>
          <OptionLabel htmlFor="theme">Theme</OptionLabel>
          <Select
            id="theme"
            value={preferences.theme}
            onChange={(e) => updatePreference('theme', e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System Default</option>
          </Select>
          
          <OptionLabel htmlFor="dashboardLayout">Dashboard Layout</OptionLabel>
          <Select
            id="dashboardLayout"
            value={preferences.dashboardLayout}
            onChange={(e) => updatePreference('dashboardLayout', e.target.value)}
          >
            <option value="default">Default</option>
            <option value="compact">Compact</option>
            <option value="expanded">Expanded</option>
          </Select>
        </PreferenceSection>
        
        <PreferenceSection>
          <SectionTitle>View Options</SectionTitle>
          <OptionLabel htmlFor="defaultView">Default View</OptionLabel>
          <Select
            id="defaultView"
            value={preferences.defaultView}
            onChange={(e) => updatePreference('defaultView', e.target.value)}
          >
            <option value="objectives">Objectives</option>
            <option value="actions">Actions</option>
          </Select>
          
          <OptionLabel htmlFor="sortBy">Default Sort Order</OptionLabel>
          <Select
            id="sortBy"
            value={preferences.sortBy}
            onChange={(e) => updatePreference('sortBy', e.target.value)}
          >
            <option value="priority">Priority</option>
            <option value="deadline">Deadline</option>
            <option value="progress">Progress</option>
          </Select>
          
          <Toggle>
            <OptionLabel htmlFor="showCompletedItems">Show Completed Items</OptionLabel>
            <Switch checked={preferences.showCompletedItems}>
              <input
                type="checkbox"
                id="showCompletedItems"
                checked={preferences.showCompletedItems}
                onChange={(e) => updatePreference('showCompletedItems', e.target.checked)}
              />
              <span></span>
            </Switch>
          </Toggle>
        </PreferenceSection>
        
        <PreferenceSection>
          <SectionTitle>Data Visualization</SectionTitle>
          <OptionLabel htmlFor="chartType">Default Chart Type</OptionLabel>
          <Select
            id="chartType"
            value={preferences.chartType}
            onChange={(e) => updatePreference('chartType', e.target.value)}
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
          </Select>
          
          <OptionLabel htmlFor="refreshInterval">Auto Refresh Interval (minutes)</OptionLabel>
          <Select
            id="refreshInterval"
            value={preferences.refreshInterval}
            onChange={(e) => updatePreference('refreshInterval', Number(e.target.value))}
          >
            <option value="1">1</option>
            <option value="5">5</option>
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="60">60</option>
          </Select>
        </PreferenceSection>
        
        <ButtonGroup>
          <Button onClick={resetPreferences}>
            <FaUndo size={14} /> Reset to Default
          </Button>
          <Button primary onClick={togglePanel}>
            Save & Close
          </Button>
        </ButtonGroup>
      </Panel>
    </>
  );
};

export default UserPreferencesPanel;
