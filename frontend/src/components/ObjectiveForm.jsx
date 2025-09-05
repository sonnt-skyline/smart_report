import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaPlus, FaTrashAlt, FaMagic, FaSpinner, FaExclamationCircle, FaStar } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { QUADRANTS } from '../data/dashboardData';
import { useObjectives } from '../context/ObjectiveContext';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const Form = styled.form`
  padding: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #0088cc;
    box-shadow: 0 0 0 3px rgba(0, 136, 204, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #0088cc;
    box-shadow: 0 0 0 3px rgba(0, 136, 204, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: #fff;
  
  &:focus {
    outline: none;
    border-color: #0088cc;
    box-shadow: 0 0 0 3px rgba(0, 136, 204, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: #0088cc;
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background-color: #0077b3;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
  
  &:hover:not(:disabled) {
    background-color: #f5f5f5;
  }
`;

const ActionButton = styled(({ primary, danger, ...rest }) => <Button {...rest} />)`
  background-color: ${props => props.primary ? '#0088cc' : props.danger ? '#fff1f0' : '#fff'};
  color: ${props => props.primary ? '#fff' : props.danger ? '#ff4d4f' : '#666'};
  border: 1px solid ${props => props.primary ? '#0088cc' : props.danger ? '#ff4d4f' : '#ddd'};
  
  &:hover:not(:disabled) {
    background-color: ${props => props.primary ? '#0077b3' : props.danger ? '#ffa39e' : '#f1f1f1'};
  }
`;

const MetricsContainer = styled.div`
  margin-top: 0.5rem;
`;

const MetricItem = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: center;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const MetricInput = styled(Input)`
  width: 100%;
`;

const MetricValueInput = styled(Input)`
  width: 100%;
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #ff4d4f;
  cursor: pointer;
  padding: 0.25rem;
  
  &:hover {
    color: #cf1322;
  }
`;

const AddMetricButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #0088cc;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const AiSuggestButton = styled(Button)`
  background-color: #722ed1;
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background-color: #5b21b6;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4d4f;
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

const QuadrantGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 10px;
  margin-top: 0.5rem;
`;

const QuadrantBox = styled(({ selected, quadrantId, ...rest }) => <div {...rest} />)`
  border: 2px solid ${props => props.selected ? '#1890ff' : '#d9d9d9'};
  border-radius: 4px;
  padding: 1rem;
  cursor: pointer;
  background-color: ${props => {
    if (!props.selected) return 'white';
    if (props.quadrantId === QUADRANTS.URGENT_IMPORTANT) return '#fff1f0';
    if (props.quadrantId === QUADRANTS.URGENT_NOT_IMPORTANT) return '#fff7e6';
    if (props.quadrantId === QUADRANTS.NOT_URGENT_IMPORTANT) return '#f6ffed';
    return '#f9f9f9';
  }};
  transition: all 0.2s;
  
  &:hover {
    border-color: ${props => props.selected ? '#1890ff' : '#40a9ff'};
  }
`;

const QuadrantTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuadrantDescription = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: #666;
`;

const UrgentBadge = styled.span`
  background-color: #ff4d4f;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
`;

const ImportantBadge = styled.span`
  background-color: #52c41a;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
`;

const ObjectiveForm = ({ isOpen, objective, onClose, onSave }) => {
  const { getAiSuggestion, loading } = useObjectives();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quadrant: QUADRANTS.NOT_URGENT_IMPORTANT,
    progress: 0,
    deadline: '',
    status: 'not started',
    assignedTo: '',
    tags: [],
    metrics: []
  });
  const [errors, setErrors] = useState({});
  const [aiLoading, setAiLoading] = useState(false);
  
  // Initialize form data when editing an existing objective
  useEffect(() => {
    if (objective) {
      setFormData({
        ...objective,
        metrics: objective.metrics || [],
        deadline: objective.deadline ? new Date(objective.deadline).toISOString().split('T')[0] : ''
      });
    } else {
      // Default values for new objective
      setFormData({
        title: '',
        description: '',
        quadrant: QUADRANTS.NOT_URGENT_IMPORTANT,
        progress: 0,
        deadline: '',
        status: 'not started',
        assignedTo: '',
        tags: [],
        metrics: []
      });
    }
    setErrors({});
  }, [objective]);
  
  if (!isOpen) return null;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const handleMetricChange = (index, field, value) => {
    const updatedMetrics = [...formData.metrics];
    updatedMetrics[index] = {
      ...updatedMetrics[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      metrics: updatedMetrics
    }));
  };
  
  const addMetric = () => {
    setFormData(prev => ({
      ...prev,
      metrics: [...prev.metrics, { name: '', targetValue: '', currentValue: 0 }]
    }));
  };
  
  const removeMetric = (index) => {
    const updatedMetrics = [...formData.metrics];
    updatedMetrics.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      metrics: updatedMetrics
    }));
  };
  
  const handleTagsChange = (e) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    
    setFormData(prev => ({
      ...prev,
      tags: tagsArray
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    }
    
    if (!formData.assignedTo.trim()) {
      newErrors.assignedTo = 'Owner is required';
    }
    
    // Validate metrics if any exist
    if (formData.metrics.length > 0) {
      formData.metrics.forEach((metric, index) => {
        if (!metric.name.trim()) {
          newErrors[`metric_${index}_name`] = 'Metric name is required';
        }
        if (!metric.targetValue) {
          newErrors[`metric_${index}_targetValue`] = 'Target value is required';
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Format data for saving
      const formattedData = {
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        progress: parseInt(formData.progress) || 0
      };
      
      onSave(formattedData);
    }
  };
  
  const handleGetAiSuggestions = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      setErrors({
        ...errors,
        title: !formData.title.trim() ? 'Title is required for AI suggestions' : undefined,
        description: !formData.description.trim() ? 'Description is required for AI suggestions' : undefined
      });
      return;
    }
    
    setAiLoading(true);
    
    try {
      const suggestions = await getAiSuggestion(formData);
      if (suggestions) {
        setFormData(prev => ({
          ...prev,
          title: suggestions.title,
          description: suggestions.description
        }));
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
    } finally {
      setAiLoading(false);
    }
  };
  
  return (
    <ModalOverlay onClick={e => e.target === e.currentTarget && onClose()}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>{objective ? 'Edit Objective' : 'Create New Objective'}</ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter objective title"
            />
            {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter objective description"
              rows={4}
            />
            {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label>Priority</Label>
            <QuadrantGrid>
              <QuadrantBox 
                selected={formData.quadrant === QUADRANTS.URGENT_IMPORTANT}
                quadrantId={QUADRANTS.URGENT_IMPORTANT}
                onClick={() => setFormData(prev => ({ ...prev, quadrant: QUADRANTS.URGENT_IMPORTANT }))}
              >
                <QuadrantTitle>
                  <UrgentBadge><FaExclamationCircle /> Urgent</UrgentBadge>
                  <ImportantBadge><FaStar /> Important</ImportantBadge>
                </QuadrantTitle>
                <QuadrantDescription>Do First - Critical tasks requiring immediate attention</QuadrantDescription>
              </QuadrantBox>
              
              <QuadrantBox 
                selected={formData.quadrant === QUADRANTS.NOT_URGENT_IMPORTANT}
                quadrantId={QUADRANTS.NOT_URGENT_IMPORTANT}
                onClick={() => setFormData(prev => ({ ...prev, quadrant: QUADRANTS.NOT_URGENT_IMPORTANT }))}
              >
                <QuadrantTitle>
                  <ImportantBadge><FaStar /> Important</ImportantBadge>
                </QuadrantTitle>
                <QuadrantDescription>Schedule - Strategic tasks to plan for</QuadrantDescription>
              </QuadrantBox>
              
              <QuadrantBox 
                selected={formData.quadrant === QUADRANTS.URGENT_NOT_IMPORTANT}
                quadrantId={QUADRANTS.URGENT_NOT_IMPORTANT}
                onClick={() => setFormData(prev => ({ ...prev, quadrant: QUADRANTS.URGENT_NOT_IMPORTANT }))}
              >
                <QuadrantTitle>
                  <UrgentBadge><FaExclamationCircle /> Urgent</UrgentBadge>
                </QuadrantTitle>
                <QuadrantDescription>Delegate - Tasks that seem urgent but aren't critical</QuadrantDescription>
              </QuadrantBox>
              
              <QuadrantBox 
                selected={formData.quadrant === QUADRANTS.NOT_URGENT_NOT_IMPORTANT}
                quadrantId={QUADRANTS.NOT_URGENT_NOT_IMPORTANT}
                onClick={() => setFormData(prev => ({ ...prev, quadrant: QUADRANTS.NOT_URGENT_NOT_IMPORTANT }))}
              >
                <QuadrantTitle>
                  Low Priority
                </QuadrantTitle>
                <QuadrantDescription>Eliminate - Tasks with minimal value</QuadrantDescription>
              </QuadrantBox>
            </QuadrantGrid>
          </FormGroup>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="not started">Not Started</option>
                <option value="on track">On Track</option>
                <option value="at risk">At Risk</option>
                <option value="off track">Off Track</option>
                <option value="completed">Completed</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
              />
              {errors.deadline && <ErrorMessage>{errors.deadline}</ErrorMessage>}
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="assignedTo">Owner</Label>
              <Input
                type="text"
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                placeholder="Enter owner's name or ID"
              />
              {errors.assignedTo && <ErrorMessage>{errors.assignedTo}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                type="number"
                id="progress"
                name="progress"
                min="0"
                max="100"
                value={formData.progress}
                onChange={handleChange}
              />
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags.join(', ')}
              onChange={handleTagsChange}
              placeholder="Enter tags separated by commas"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Key Results / Metrics</Label>
            <MetricsContainer>
              {formData.metrics.map((metric, index) => (
                <MetricItem key={index}>
                  <div>
                    <MetricInput
                      type="text"
                      value={metric.name}
                      onChange={(e) => handleMetricChange(index, 'name', e.target.value)}
                      placeholder="Metric name"
                    />
                    {errors[`metric_${index}_name`] && 
                      <ErrorMessage>{errors[`metric_${index}_name`]}</ErrorMessage>}
                  </div>
                  <div>
                    <MetricValueInput
                      type="text"
                      value={metric.targetValue}
                      onChange={(e) => handleMetricChange(index, 'targetValue', e.target.value)}
                      placeholder="Target value"
                    />
                    {errors[`metric_${index}_targetValue`] && 
                      <ErrorMessage>{errors[`metric_${index}_targetValue`]}</ErrorMessage>}
                  </div>
                  <div>
                    <MetricValueInput
                      type="number"
                      value={metric.currentValue}
                      onChange={(e) => handleMetricChange(index, 'currentValue', e.target.value)}
                      placeholder="Current value"
                    />
                  </div>
                  <RemoveButton type="button" onClick={() => removeMetric(index)}>
                    <FaTrashAlt />
                  </RemoveButton>
                </MetricItem>
              ))}
            </MetricsContainer>
            <AddMetricButton type="button" onClick={addMetric}>
              <FaPlus /> Add Metric
            </AddMetricButton>
          </FormGroup>
          
          <ButtonGroup>
            <div>
              <AiSuggestButton 
                type="button" 
                onClick={handleGetAiSuggestions}
                disabled={aiLoading || !formData.title.trim() || !formData.description.trim()}
              >
                {aiLoading ? <FaSpinner /> : <FaMagic />} 
                AI Suggestion
              </AiSuggestButton>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <SecondaryButton type="button" onClick={onClose}>
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit" disabled={loading}>
                {loading ? <FaSpinner /> : objective ? 'Update' : 'Create'}
              </PrimaryButton>
            </div>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
};

ObjectiveForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  objective: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default ObjectiveForm;
