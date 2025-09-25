# Smart Report Backend API Integration Guide

## Overview
This document provides comprehensive information about the Smart Report backend APIs for AI-assisted frontend development. Use this as context when building frontend applications that interact with the Smart Report system.

## Authentication
All API endpoints require JWT authentication via Bearer token in the Authorization header.

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Set authorization header
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

## Weekly Report APIs

### Base URL: `/api/reports`

### 1. GET `/api/reports/weekly` - List Weekly Reports

**Purpose**: Retrieve paginated list of current user's weekly reports

**Query Parameters**:
- `week` (optional): Filter by specific week in ISO week format (YYYY-W##, e.g., "2025-W37")
- `limit` (optional): Number of reports per page (max 50, default 10)
- `page` (optional): Page number (default 1)

**Example Request**:
```typescript
const fetchWeeklyReports = async (page = 1, limit = 10, week?: string) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(week && { week })
  });
  
  const response = await fetch(`${API_BASE_URL}/api/reports/weekly?${params}`, {
    headers
  });
  return response.json();
};
```

**Response Schema**:
```typescript
interface WeeklyReportsResponse {
  success: boolean;
  data: WeeklyReport[];
  error?: string;
}

interface WeeklyReport {
  id: string;
  member_id: string;
  week: string; // Format: YYYY-W## (ISO week format, e.g., "2025-W37")
  progress_notes?: string;
  blockers_notes?: string;
  next_steps_notes?: string;
  additional_notes?: string;
  submitted_at: string;
  created_at: string;
  updated_at: string;
  member: {
    id: string;
    name: string;
    email: string;
  };
  actions: Array<{
    id: string;
    title: string;
    category: string;
    sub_category: string;
    target?: string;
    definition_of_done?: string;
    deadline?: string;
    progress: number; // 0-100
    work_status: 'Not started' | 'On-going' | 'Blocked' | 'On hold' | 'Completed';
  }>;
}
```

### 2. GET `/api/reports/weekly/:week` - Get Specific Weekly Report

**Purpose**: Retrieve a single weekly report by week

**Parameters**:
- `week`: Week identifier in ISO week format (format: YYYY-W##)
  - Year followed by '-W' and two-digit week number
  - Examples: "2025-W37", "2025-W01", "2024-W52"
  - Week numbers range from 01 to 52/53 depending on the year

**Example Request**:
```typescript
const fetchWeeklyReport = async (week: string) => {
  const response = await fetch(`${API_BASE_URL}/api/reports/weekly/${week}`, {
    headers
  });
  return response.json();
};
```

**Response**: Same as above but returns single `WeeklyReport` object in `data` field.

### 3. POST `/api/reports/weekly` - Submit Weekly Report

**Purpose**: Create or update a weekly report with action status updates

**Request Body Schema**:
```typescript
interface SubmitWeeklyReportRequest {
  week: string; // Required: ISO week format (YYYY-W##, e.g., "2025-W37")
  progress_notes?: string;
  blockers_notes?: string;
  next_steps_notes?: string;
  additional_notes?: string;
  actions: Array<{
    action_id: string;
    progress: number; // 0-100
    work_status: 'Not started' | 'On-going' | 'Blocked' | 'On hold' | 'Completed';
  }>;
}
```

**Example Request**:
```typescript
const submitWeeklyReport = async (reportData: SubmitWeeklyReportRequest) => {
  const response = await fetch(`${API_BASE_URL}/api/reports/weekly`, {
    method: 'POST',
    headers,
    body: JSON.stringify(reportData)
  });
  return response.json();
};

// Usage example
const reportData = {
  week: "2025-W37",
  progress_notes: "Completed user authentication module",
  blockers_notes: "Waiting for design approval on dashboard layout",
  next_steps_notes: "Will work on dashboard implementation next week",
  additional_notes: "Team meeting scheduled for Friday",
  actions: [
    {
      action_id: "action-uuid-1",
      progress: 85,
      work_status: "On-going"
    },
    {
      action_id: "action-uuid-2", 
      progress: 100,
      work_status: "Completed"
    }
  ]
};
```

**Response**: Returns created/updated `WeeklyReport` with HTTP 201 status.

### 4. PUT `/api/reports/weekly/:week` - Update Weekly Report

**Purpose**: Partially update an existing weekly report (notes only, not actions)

**Parameters**:
- `week`: Week identifier in ISO week format (YYYY-W##, e.g., "2025-W37")

**Request Body** (all fields optional):
```typescript
interface UpdateWeeklyReportRequest {
  progress_notes?: string;
  blockers_notes?: string;
  next_steps_notes?: string;
  additional_notes?: string;
}
```

**Example Request**:
```typescript
const updateWeeklyReport = async (week: string, updates: UpdateWeeklyReportRequest) => {
  const response = await fetch(`${API_BASE_URL}/api/reports/weekly/${week}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updates)
  });
  return response.json();
};
```

### 5. DELETE `/api/reports/weekly/:week` - Delete Weekly Report

**Purpose**: Remove a weekly report

**Example Request**:
```typescript
const deleteWeeklyReport = async (week: string) => {
  const response = await fetch(`${API_BASE_URL}/api/reports/weekly/${week}`, {
    method: 'DELETE',
    headers
  });
  return response.json();
};
```

### 6. GET `/api/reports/weekly/:week/navigation` - Get Week Navigation Data

**Purpose**: Get navigation metadata for browsing between weekly reports

**Parameters**:
- `week`: Week identifier in ISO week format (YYYY-W##, e.g., "2025-W37")

**Example Request**:
```typescript
const getWeekNavigation = async (week: string) => {
  const response = await fetch(`${API_BASE_URL}/api/reports/weekly/${week}/navigation`, {
    headers
  });
  return response.json();
};
```

**Response Schema**:
```typescript
interface WeekNavigationResponse {
  success: boolean;
  data: {
    current_week: string; // Current week (today)
    requested_week: string; // The week being viewed
    previous_week: string; // Previous week identifier
    next_week: string; // Next week identifier
    has_previous: boolean; // Whether user has a report for previous week
    has_next: boolean; // Whether user has a report for next week (limited to current week)
    available_weeks: string[]; // All weeks user has reports for
    links: {
      previous: string | null; // URL to previous week report
      next: string | null; // URL to next week report  
      current: string; // URL to current week report
      list: string; // URL to reports list
    };
  };
}
```

## Week Format Utilities

The system uses ISO week format (YYYY-W##) where:
- YYYY = 4-digit year
- W = literal 'W' character 
- ## = 2-digit week number (01-53)
- Examples: "2025-W01", "2025-W37", "2024-W52"

Here are utility functions:

```typescript
// Get current week in YYYY-W## format
export function getCurrentWeek(): string {
  const now = new Date();
  const year = now.getFullYear();
  const onejan = new Date(year, 0, 1);
  const week = Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

// Parse week string to get year and week number
export function parseWeek(weekStr: string): { year: number; week: number } {
  const [yearStr, weekStr2] = weekStr.split('-W');
  return {
    year: parseInt(yearStr),
    week: parseInt(weekStr2)
  };
}

// Get week date range
export function getWeekDateRange(weekStr: string): { start: Date; end: Date } {
  const { year, week } = parseWeek(weekStr);
  const jan4 = new Date(year, 0, 4);
  const startOfWeek = new Date(jan4.getTime() - (jan4.getDay() - 1) * 24 * 60 * 60 * 1000);
  startOfWeek.setDate(startOfWeek.getDate() + (week - 1) * 7);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  
  return { start: startOfWeek, end: endOfWeek };
}

// Get previous week
export function getPreviousWeek(currentWeek?: string): string {
  const week = currentWeek || getCurrentWeek();
  const [yearStr, weekStr] = week.split('-W');
  const year = parseInt(yearStr);
  const weekNum = parseInt(weekStr);
  
  if (weekNum > 1) {
    return `${year}-W${(weekNum - 1).toString().padStart(2, '0')}`;
  } else {
    const prevYear = year - 1;
    return `${prevYear}-W52`; // Simplified - actual calculation may vary
  }
}

// Get next week
export function getNextWeek(currentWeek?: string): string {
  const week = currentWeek || getCurrentWeek();
  const [yearStr, weekStr] = week.split('-W');
  const year = parseInt(yearStr);
  const weekNum = parseInt(weekStr);
  
  if (weekNum < 52) { // Simplified - actual calculation may vary
    return `${year}-W${(weekNum + 1).toString().padStart(2, '0')}`;
  } else {
    return `${year + 1}-W01`;
  }
}

// Format week for display
export function formatWeekDisplay(weekStr: string): string {
  const { year, week } = parseWeek(weekStr);
  const { start, end } = getWeekDateRange(weekStr);
  
  return `Week ${week}, ${year} (${start.toLocaleDateString()} - ${end.toLocaleDateString()})`;
}

// Check if week is current week
export function isCurrentWeek(weekStr: string): boolean {
  return weekStr === getCurrentWeek();
}

// Check if week is in the future
export function isFutureWeek(weekStr: string): boolean {
  const current = getCurrentWeek();
  return weekStr > current;
}
```

## Error Handling

All APIs return a consistent error format:

```typescript
interface ApiError {
  success: false;
  error: string;
}

// Common HTTP status codes:
// 400 - Bad Request (validation errors)
// 401 - Unauthorized (missing/invalid token)
// 404 - Not Found (report doesn't exist)
// 500 - Internal Server Error
```

**Example Error Handling**:
```typescript
const handleApiCall = async <T>(apiCall: () => Promise<Response>): Promise<T> => {
  try {
    const response = await apiCall();
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }
    
    if (!data.success) {
      throw new Error(data.error || 'API call failed');
    }
    
    return data.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

## Frontend Integration Patterns

### React Hook Example
```typescript
import { useState, useEffect } from 'react';

export const useWeeklyReports = (week?: string) => {
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetchWeeklyReports(1, 10, week);
        setReports(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [week]);

  return { reports, loading, error };
};
```

### Form Submission Example
```typescript
const WeeklyReportForm = () => {
  const [formData, setFormData] = useState<SubmitWeeklyReportRequest>({
    week: getCurrentWeek(),
    progress_notes: '',
    blockers_notes: '',
    next_steps_notes: '',
    additional_notes: '',
    actions: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitWeeklyReport(formData);
      // Handle success (redirect, show message, etc.)
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

### Week Navigation Hook
```typescript
import { useState, useEffect } from 'react';

export const useWeekNavigation = (currentWeek: string) => {
  const [navigation, setNavigation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        setLoading(true);
        const response = await getWeekNavigation(currentWeek);
        setNavigation(response.data);
      } catch (error) {
        console.error('Failed to fetch navigation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNavigation();
  }, [currentWeek]);

  return { navigation, loading };
};
```

### Week Navigation Component
```typescript
const WeekNavigation = ({ currentWeek }: { currentWeek: string }) => {
  const { navigation, loading } = useWeekNavigation(currentWeek);

  if (loading || !navigation) return <div>Loading...</div>;

  return (
    <div className="week-navigation">
      <button 
        disabled={!navigation.has_previous}
        onClick={() => router.push(`/reports/${navigation.previous_week}`)}
      >
        ← Previous Week
      </button>
      
      <span>Week {navigation.requested_week}</span>
      
      <button 
        disabled={!navigation.has_next}
        onClick={() => router.push(`/reports/${navigation.next_week}`)}
      >
        Next Week →
      </button>
      
      <select 
        value={currentWeek}
        onChange={(e) => router.push(`/reports/${e.target.value}`)}
      >
        {navigation.available_weeks.map(week => (
          <option key={week} value={week}>
            Week {week}
          </option>
        ))}
      </select>
    </div>
  );
};
```

## Related API Endpoints

For complete functionality, you may also need:

- `/api/auth/login` - User authentication
- `/api/actions` - Manage actions/tasks
- `/api/categories` - Get categories and subcategories

## Development Notes

1. **Week Format**: Always use ISO week format (YYYY-W##, e.g., "2025-W37")
   - Year: 4 digits
   - Week separator: literal "W" 
   - Week number: 2 digits (01-53)
2. **Progress Values**: Should be integers 0-100
3. **Work Status**: Use exact string values from the enum
4. **Authentication**: Include Bearer token in all requests
5. **Error Handling**: Always check `success` field in responses
6. **Pagination**: Default limit is 10, maximum is 50

## Testing Examples

```typescript
// Test data for development
const mockWeeklyReport: SubmitWeeklyReportRequest = {
  week: "2025-W37",
  progress_notes: "Good progress on authentication system",
  blockers_notes: "Need design approval",
  next_steps_notes: "Implement dashboard",
  additional_notes: "Meeting with team Friday",
  actions: [
    {
      action_id: "test-action-1",
      progress: 75,
      work_status: "On-going"
    }
  ]
};
```

This guide provides all necessary information for frontend developers to integrate with the Smart Report weekly report APIs effectively.
