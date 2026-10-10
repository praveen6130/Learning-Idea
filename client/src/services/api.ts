import { User, Course, VideoStoryboard, UserProgress, AdminStats, ActivityLog } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    const error: any = new Error(data.message || 'API request failed');
    error.status = res.status;
    error.code = data.error;
    error.data = data;
    throw error;
  }

  return data;
}

// Authentication APIs
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    request<{ token: string; user: User; message: string; isApproved: boolean }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (payload: { name: string; email: string; password: string; phoneNumber: string; role?: string; bio?: string }) =>
    request<{ token: string; user: User; message: string; requiresApproval: boolean }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  forgotPassword: (payload: { email: string; phoneNumber: string; newPassword: string }) =>
    request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMe: () =>
    request<{ user: User; isApproved: boolean }>('/auth/me'),

  switchPersona: (persona: 'host' | 'student-approved' | 'student-pending' | 'admin-pending') =>
    request<{ token: string; user: User; message: string; isApproved: boolean }>('/auth/switch-persona', {
      method: 'POST',
      body: JSON.stringify({ persona }),
    }),
};

// Admin APIs
export const adminApi = {
  getUsers: (filters?: { status?: string; role?: string; search?: string }) => {
    const params = new URLSearchParams(filters as any);
    return request<{ users: User[] }>(`/admin/users?${params.toString()}`);
  },

  approveUser: (userId: string, role?: 'student' | 'admin') =>
    request<{ message: string; user: User }>(`/admin/users/${userId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ role }),
    }),

  rejectUser: (userId: string, reason?: string) =>
    request<{ message: string; user: User }>(`/admin/users/${userId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  revokeUser: (userId: string) =>
    request<{ message: string; user: User }>(`/admin/users/${userId}/revoke`, {
      method: 'POST',
    }),

  changeRole: (userId: string, role: 'student' | 'admin') =>
    request<{ message: string; user: User }>(`/admin/users/${userId}/role`, {
      method: 'POST',
      body: JSON.stringify({ role }),
    }),

  batchApprove: (userIds: string[], role?: 'student' | 'admin') =>
    request<{ message: string; approvedCount: number }>('/admin/users/batch-approve', {
      method: 'POST',
      body: JSON.stringify({ userIds, role }),
    }),

  assignCourseToStudent: (userId: string, courseIds: string[]) =>
    request<{ message: string; user: User }>(`/admin/users/${userId}/assign-course`, {
      method: 'POST',
      body: JSON.stringify({ courseIds }),
    }),

  chooseAndAssign: (studentIds: string[], courseIds: string[]) =>
    request<{ message: string; studentCount: number }>('/admin/users/choose-and-assign', {
      method: 'POST',
      body: JSON.stringify({ studentIds, courseIds }),
    }),

  getStats: () =>
    request<{ stats: AdminStats }>('/admin/stats'),

  getLogs: () =>
    request<{ logs: ActivityLog[] }>('/admin/logs'),
};

// Course & Video APIs
export const courseApi = {
  getCourses: () =>
    request<{ courses: Course[] }>('/courses/all'),

  getCourseById: (id: string) =>
    request<{ course: Course }>(`/courses/${id}`),

  generateRoadmap: (topic: string, targetGoal?: string) =>
    request<{ message: string; course: Course }>('/courses/generate-roadmap', {
      method: 'POST',
      body: JSON.stringify({ topic, targetGoal }),
    }),

  generateVideo: (params: { courseId: string; lessonId: string; topic: string; lessonTitle: string; levelNumber: number }) =>
    request<{ message: string; video: VideoStoryboard; cached: boolean }>('/courses/generate-video', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  getVideo: (courseId: string, lessonId: string) =>
    request<{ video: VideoStoryboard }>(`/courses/${courseId}/video/${lessonId}`),

  getProgress: (courseId: string) =>
    request<{ progress: UserProgress }>(`/courses/${courseId}/progress`),

  saveProgress: (courseId: string, data: { lessonId: string; completed?: boolean; quizScore?: number }) =>
    request<{ message: string; progress: UserProgress }>(`/courses/${courseId}/progress`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Settings APIs
export const settingsApi = {
  getSettings: () =>
    request<{ settings: any }>('/settings'),

  updateSettings: (updates: any) =>
    request<{ message: string; settings: any }>('/settings', {
      method: 'POST',
      body: JSON.stringify(updates),
    }),
};
