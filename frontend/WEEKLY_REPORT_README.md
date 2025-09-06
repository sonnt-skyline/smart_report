# Weekly Report Feature

## Overview

The Weekly Report feature allows team members to submit their weekly reports by updating the status of ongoing items, adjusting their Definition of Done (DoD), and adding new items as needed.

## Features

### 1. Action Management Structure
- **Category** → **Sub-category** → **Action**
- Each Action must have a clear Definition of Done (DoD)
- Progress tracking with percentage completion
- Work status tracking (Not started, On-going, Blocked, On hold, Completed)

### 2. Weekly Report Submission
- View and update existing actions
- Add new actions for the week
- Update progress and work status
- Modify Definition of Done as needed
- Add weekly notes
- Submit all data to backend API

### 3. User Interface
- Clean, intuitive form interface
- Dynamic sub-category selection based on category
- Progress slider for easy percentage input
- Responsive design for mobile and desktop

## Components

### WeeklyReportForm (`/src/components/WeeklyReportForm.jsx`)
Main component that handles:
- Displaying existing actions for editing
- Form for adding new actions
- Progress and status updates
- Report submission

### WeeklyReportPage (`/src/WeeklyReportPage.jsx`)
Page component that:
- Loads user's actions from API
- Handles submission to backend
- Manages loading states and error handling
- Provides success/error feedback

### API Utilities (`/src/utils/api.js`)
Mock API functions that should be replaced with real backend calls:
- `getUserActions(userId)` - Get user's current actions
- `submitWeeklyReport(reportData)` - Submit weekly report
- `updateAction(actionId, updates)` - Update existing action
- `createAction(actionData)` - Create new action

## Data Structure

### Action Object
```javascript
{
  id: string,
  title: string,
  category: string,
  subCategory: string,
  target: string,
  definitionOfDone: string,
  statusUpdates: [
    {
      week: string, // format: "YYYY-WXX"
      progress: number, // 0-100
      workStatus: string // "Not started", "On-going", etc.
    }
  ],
  deadline: string,
  member: string,
  tags: string[],
  valueAdded: string
}
```

### Weekly Report Object
```javascript
{
  week: string,
  actions: Action[],
  notes: string,
  submittedAt: string,
  member: string
}
```

## Categories and Sub-categories

### Delivery
- Milestone, Reporting, Documentation, Implementation, Testing

### Self development
- Education, Training, Certification, Skill Building, Learning

### Solution+
- Innovation, Review, Research, Improvement, Optimization

### Customer Success
- Support, Relationship, Feedback, Communication, Satisfaction

### Team management
- Leadership, Mentoring, Planning, Coordination, Process

## Usage

1. Navigate to `/weekly-report` in the application
2. Review existing actions and update their status/progress
3. Modify Definition of Done if requirements changed
4. Add new actions using the "Add New Action" button
5. Fill in weekly notes
6. Click "Submit Weekly Report" to send data to backend

## Backend Integration

Replace the mock functions in `/src/utils/api.js` with actual API calls:

```javascript
// Example implementation
const submitWeeklyReport = async (reportData) => {
  const response = await fetch('/api/weekly-reports', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(reportData)
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit report');
  }
  
  return response.json();
};
```

## Navigation

The weekly report page is accessible through:
- Header navigation link "Weekly Report"
- Direct URL: `/weekly-report`

## Styling

All styles are defined in `/src/App.css` under the "Weekly Report Form Styles" section. The design follows the existing app's visual theme with:
- Clean, modern form inputs
- Consistent color scheme
- Responsive grid layouts
- Loading states and feedback messages
