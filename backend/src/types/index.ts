export interface User {
  id: string;
  email: string;
  name: string;
  password_hash?: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface Action {
  id: string;
  title: string;
  category: string;
  sub_category: string;
  target?: string;
  definition_of_done?: string;
  deadline?: string;
  member_id: string;
  parent_objective?: string;
  created_at: string;
  updated_at: string;
  // Relations
  status_updates?: StatusUpdate[];
  tags?: string[];
  member?: User;
}

export interface StatusUpdate {
  id: string;
  action_id: string;
  week: string;
  progress: number;
  work_status: 'Not started' | 'On-going' | 'Blocked' | 'On hold' | 'Completed';
  created_at: string;
  updated_at: string;
}

export interface WeeklyReport {
  id: string;
  member_id: string;
  week: string;
  progress_notes?: string;
  blockers_notes?: string;
  next_steps_notes?: string;
  additional_notes?: string;
  submitted_at: string;
  created_at: string;
  updated_at: string;
  // Relations
  member?: User;
  actions?: Action[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  category?: Category;
}

// API Request/Response types
export interface CreateActionRequest {
  title: string;
  category: string;
  sub_category: string;
  target?: string;
  definition_of_done?: string;
  deadline?: string;
  parent_objective?: string;
  tags?: string[];
}

export interface UpdateActionRequest {
  title?: string;
  category?: string;
  sub_category?: string;
  target?: string;
  definition_of_done?: string;
  deadline?: string;
  parent_objective?: string;
}

export interface CreateStatusUpdateRequest {
  week: string;
  progress: number;
  work_status: 'Not started' | 'On-going' | 'Blocked' | 'On hold' | 'Completed';
}

export interface SubmitWeeklyReportRequest {
  week: string;
  progress_notes?: string;
  blockers_notes?: string;
  next_steps_notes?: string;
  additional_notes?: string;
  actions: {
    action_id: string;
    progress: number;
    work_status: string;
  }[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface ActionQueryParams extends PaginationParams {
  category?: string;
  sub_category?: string;
  member_id?: string;
  week?: string;
  status?: string;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: Omit<User, 'password_hash'>;
  token: string;
  expires_in: number;
}
