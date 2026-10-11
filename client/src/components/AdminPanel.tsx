import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminApi, courseApi } from '../services/api';
import { User, AdminStats, ActivityLog, Course } from '../types';
import { 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Users, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  RotateCw, 
  BookOpen, 
  Crown, 
  CheckSquare, 
  Square, 
  History, 
  GraduationCap, 
  Lock, 
  Unlock,
  AlertTriangle,
  Send,
  Plus,
  Clock
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { user: currentUser, isHost } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'choose-student' | 'all-users' | 'analytics'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // "Choose the Student" state
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [showCourseAssignModal, setShowCourseAssignModal] = useState(false);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, statsRes, logsRes, coursesRes] = await Promise.all([
        adminApi.getUsers(),
        adminApi.getStats(),
        adminApi.getLogs(),
        courseApi.getCourses()
      ]);
      setUsers(usersRes.users);
      setStats(statsRes.stats);
      setLogs(logsRes.logs);
      setCourses(coursesRes.courses);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      showFeedback('error', err.message || 'Failed to load administration data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedbackMessage({ type, text });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // Approval handlers
  const handleApprove = async (userId: string, role?: 'student' | 'admin') => {
    try {
      const res = await adminApi.approveUser(userId, role);
      showFeedback('success', res.message);
      fetchData();
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to approve user');
    }
  };

  const handleReject = async (userId: string) => {
    try {
      const res = await adminApi.rejectUser(userId, 'Host declined registration access.');
      showFeedback('success', res.message);
      fetchData();
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to reject user');
    }
  };

  const handleRevoke = async (userId: string) => {
    try {
      const res = await adminApi.revokeUser(userId);
      showFeedback('success', res.message);
      fetchData();
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to revoke user');
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'student' | 'admin') => {
    try {
      const res = await adminApi.changeRole(userId, newRole);
      showFeedback('success', res.message);
      fetchData();
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to change role');
    }
  };

  // Student selection handlers
  const toggleStudentSelection = (userId: string) => {
    if (selectedStudentIds.includes(userId)) {
      setSelectedStudentIds(selectedStudentIds.filter((id) => id !== userId));
    } else {
      setSelectedStudentIds([...selectedStudentIds, userId]);
    }
  };

  const selectAllStudents = (studentsList: User[]) => {
    if (selectedStudentIds.length === studentsList.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(studentsList.map((s) => s.id));
    }
  };

  const handleBatchApprove = async (role?: 'student' | 'admin') => {
    if (selectedStudentIds.length === 0) return;
    try {
      const res = await adminApi.batchApprove(selectedStudentIds, role);
      showFeedback('success', res.message);
      setSelectedStudentIds([]);
      fetchData();
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to batch approve');
    }
  };

  const handleAssignCourses = async () => {
    if (selectedStudentIds.length === 0 || selectedCourseIds.length === 0) {
      showFeedback('error', 'Select at least one student and one course');
      return;
    }
    try {
      const res = await adminApi.chooseAndAssign(selectedStudentIds, selectedCourseIds);
      showFeedback('success', res.message);
      setShowCourseAssignModal(false);
      setSelectedCourseIds([]);
      fetchData();
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to assign courses');
    }
  };

  // Filtered users
  const pendingUsers = users.filter((u) => u.status === 'pending');
  const studentUsers = users.filter((u) => u.role === 'student');

  const filteredAllUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
              <Crown className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Host & Administrator Control Center
            </h1>
            {isHost && (
              <span className="text-xs bg-purple-600/30 text-purple-300 font-bold px-2 py-0.5 rounded-full border border-purple-500/30">
                SUPER ADMIN (YOU)
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm">
            Approve students and admins, assign courses to chosen students, and enforce access authorization.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={isLoading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold border border-gray-700 transition-colors"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedbackMessage && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center justify-between text-sm ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/60 border border-red-500/40 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-xs text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Metrics Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-8">
          <div className="p-4 rounded-2xl bg-[#0c1017] border border-white/[0.08] text-left">
            <div className="text-xs text-gray-400 font-medium">Pending Requests</div>
            <div className="text-2xl font-black text-amber-400 mt-1 flex items-center gap-2 font-mono">
              {stats.pendingApprovals}
              {stats.pendingApprovals > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5">Need host decision</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0c1017] border border-white/[0.08] text-left">
            <div className="text-xs text-gray-400 font-medium">Approved Students</div>
            <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">{stats.approvedStudents}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Active learners</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0c1017] border border-white/[0.08] text-left">
            <div className="text-xs text-gray-400 font-medium">Administrators</div>
            <div className="text-2xl font-black text-purple-400 mt-1 font-mono">{stats.totalAdmins}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Host & instructors</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0c1017] border border-white/[0.08] text-left">
            <div className="text-xs text-gray-400 font-medium">Total Registered</div>
            <div className="text-2xl font-black text-indigo-400 mt-1 font-mono">{stats.totalUsers}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Platform accounts</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0c1017] border border-white/[0.08] text-left">
            <div className="text-xs text-gray-400 font-medium">AI Roadmaps</div>
            <div className="text-2xl font-black text-sky-400 mt-1 font-mono">{stats.totalCourses}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Basic to advanced</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0c1017] border border-white/[0.08] text-left">
            <div className="text-xs text-gray-400 font-medium">AI Videos</div>
            <div className="text-2xl font-black text-rose-400 mt-1 font-mono">{stats.totalVideosGenerated}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Lessons generated</div>
          </div>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex border-b border-white/[0.06] mb-6 gap-2 overflow-x-auto pb-3">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'pending'
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Approval Queue</span>
          {pendingUsers.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-gray-950 font-bold">
              {pendingUsers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('choose-student')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'choose-student'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Choose Students & Assign</span>
          {selectedStudentIds.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-bold">
              {selectedStudentIds.length} Selected
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('all-users')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'all-users'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>All Users & Roles ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'analytics'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
              : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Activity Audit Logs</span>
        </button>
      </div>

      {/* TAB 1: PENDING APPROVAL QUEUE */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Pending Registrations Awaiting Host Decision</h2>
              <p className="text-xs text-gray-400">
                These users cannot use the platform until you approve them as a Student or Admin.
              </p>
            </div>
            {pendingUsers.length > 0 && (
              <button
                onClick={() => handleBatchApprove('student')}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Approve All as Students</span>
              </button>
            )}
          </div>

          {pendingUsers.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-gray-900/40 border border-gray-800 text-gray-400">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-80" />
              <div className="text-base font-semibold text-gray-300">Approval Queue is Clear!</div>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                All registered users have been processed. New registrations will appear here for your approval.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingUsers.map((u) => (
                <div
                  key={u.id}
                  className="p-5 rounded-2xl bg-gray-900/90 border border-amber-500/30 hover:border-amber-500/60 transition-all flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-white">{u.name}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                            u.role === 'admin' 
                              ? 'bg-purple-900/40 text-purple-300 border-purple-500/40' 
                              : 'bg-blue-900/40 text-blue-300 border-blue-500/40'
                          }`}>
                            Requested: {u.role}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">{u.email}</div>
                      </div>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 shrink-0">
                        Pending Host
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 bg-gray-950/60 p-3 rounded-xl border border-gray-800 my-3 italic">
                      "{u.bio || 'No application statement provided.'}"
                    </p>

                    <div className="text-[11px] text-gray-500">
                      Applied: {new Date(u.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-800">
                    <button
                      onClick={() => handleApprove(u.id, 'student')}
                      className="px-2.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                      title="Approve as Student learner"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Approve Student</span>
                    </button>

                    {isHost ? (
                      <button
                        onClick={() => handleApprove(u.id, 'admin')}
                        className="px-2.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                        title="Approve as Platform Admin (Host only)"
                      >
                        <Crown className="w-3.5 h-3.5" />
                        <span>Approve Admin</span>
                      </button>
                    ) : (
                      <div
                        className="px-2 py-2 rounded-xl bg-gray-950 border border-gray-800 text-gray-500 text-[11px] font-medium flex items-center justify-center gap-1 select-none"
                        title="Only the Platform Host can approve Administrator accounts"
                      >
                        <Lock className="w-3 h-3 text-gray-600" />
                        <span>Host Only</span>
                      </div>
                    )}

                    <button
                      onClick={() => handleReject(u.id)}
                      className="px-2.5 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                      title="Reject and deny access"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CHOOSE THE STUDENT & ASSIGN COURSES */}
      {activeTab === 'choose-student' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-900/60 p-4 rounded-2xl border border-gray-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                <span>Choose Students & Assign Courses</span>
              </h2>
              <p className="text-xs text-gray-400">
                Select individual students to batch approve, assign curated AI courses, or change permissions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => selectAllStudents(studentUsers)}
                className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 font-medium transition-colors"
              >
                {selectedStudentIds.length === studentUsers.length ? 'Deselect All' : 'Select All Students'}
              </button>

              <button
                onClick={() => setShowCourseAssignModal(true)}
                disabled={selectedStudentIds.length === 0}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-md shadow-blue-500/20"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Assign Course ({selectedStudentIds.length})</span>
              </button>

              <button
                onClick={() => handleBatchApprove('student')}
                disabled={selectedStudentIds.length === 0}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Batch Approve</span>
              </button>
            </div>
          </div>

          {/* Student Grid with Selection Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {studentUsers.map((s) => {
              const isSelected = selectedStudentIds.includes(s.id);
              const assignedCourseNames = (s.assignedCourses || [])
                .map((cid) => courses.find((c) => c.id === cid)?.title)
                .filter(Boolean);

              return (
                <div
                  key={s.id}
                  onClick={() => toggleStudentSelection(s.id)}
                  className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/15'
                      : 'bg-gray-900/80 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="text-blue-400">
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-blue-400" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">{s.name}</div>
                        <div className="text-xs text-gray-400">{s.email}</div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      s.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {s.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-2 my-2">
                    {s.bio || 'General AI student'}
                  </p>

                  <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">
                      Enrolled: {assignedCourseNames.length} Course{assignedCourseNames.length === 1 ? '' : 's'}
                    </span>
                    <span className="text-blue-400 hover:underline">
                      {isSelected ? 'Selected' : 'Click to Select'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: ALL USERS DIRECTORY & ROLE MANAGEMENT */}
      {activeTab === 'all-users' && (
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by student or admin name / email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none"
              >
                <option value="all">All Roles</option>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
                <option value="host">Host</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-950/80 text-gray-400 uppercase tracking-wider text-[11px] border-b border-gray-800">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Courses</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 text-gray-300">
                  {filteredAllUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          {u.name}
                          {u.role === 'host' && (
                            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded font-bold">
                              HOST
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-400">{u.email}</div>
                      </td>

                      <td className="py-3.5 px-4 capitalize">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          u.role === 'host'
                            ? 'bg-purple-900/40 text-purple-300'
                            : u.role === 'admin'
                            ? 'bg-indigo-900/40 text-indigo-300'
                            : 'bg-blue-900/40 text-blue-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                          u.status === 'approved'
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                            : u.status === 'pending'
                            ? 'bg-amber-950/60 text-amber-400 border-amber-500/30'
                            : 'bg-red-950/60 text-red-400 border-red-500/30'
                        }`}>
                          {u.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-gray-400">
                        {u.assignedCourses?.length || 0} Assigned
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {u.role === 'host' ? (
                          <span className="text-[11px] text-gray-500 italic">Protected Host</span>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            {u.status !== 'approved' && (
                              <button
                                onClick={() => handleApprove(u.id, u.role as any)}
                                className="px-2 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold transition-colors"
                              >
                                Approve
                              </button>
                            )}

                            {u.status === 'approved' && (
                              <button
                                onClick={() => handleRevoke(u.id)}
                                className="px-2 py-1 rounded bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-[11px] font-semibold transition-colors"
                                title="Reset access to pending"
                              >
                                Revoke
                              </button>
                            )}

                            {u.role === 'student' ? (
                              isHost ? (
                                <button
                                  onClick={() => handleRoleChange(u.id, 'admin')}
                                  className="px-2 py-1 rounded bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-[11px] font-semibold transition-colors"
                                  title="Promote student to Admin (Host only)"
                                >
                                  Make Admin
                                </button>
                              ) : null
                            ) : (
                              isHost ? (
                                <button
                                  onClick={() => handleRoleChange(u.id, 'student')}
                                  className="px-2 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-[11px] font-semibold transition-colors"
                                  title="Demote admin to Student"
                                >
                                  Make Student
                                </button>
                              ) : null
                            )}

                            <button
                              onClick={() => handleReject(u.id)}
                              className="px-2 py-1 rounded bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-[11px] font-semibold transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT ACTIVITY LOGS */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <span>Platform Activity Audit Trail</span>
          </h2>

          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-gray-800 text-purple-300 border border-gray-700">
                    {log.action}
                  </span>
                  <span className="text-gray-200">{log.details}</span>
                </div>
                <span className="text-[11px] text-gray-500 whitespace-nowrap ml-4">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CHOOSE COURSE TO ASSIGN */}
      {showCourseAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">
              Assign Courses to {selectedStudentIds.length} Chosen Student(s)
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Select the course roadmaps you want to make immediately accessible to the selected students:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto mb-6 pr-1">
              {courses.map((course) => {
                const isChecked = selectedCourseIds.includes(course.id);
                return (
                  <div
                    key={course.id}
                    onClick={() => {
                      if (isChecked) {
                        setSelectedCourseIds(selectedCourseIds.filter((id) => id !== course.id));
                      } else {
                        setSelectedCourseIds([...selectedCourseIds, course.id]);
                      }
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-colors flex items-center justify-between ${
                      isChecked
                        ? 'bg-blue-950/40 border-blue-500 text-white'
                        : 'bg-gray-950/60 border-gray-800 text-gray-300 hover:border-gray-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{course.title}</div>
                      <div className="text-[11px] text-gray-500">{course.levels?.length || 5} Levels • Basic to Advanced</div>
                    </div>
                    {isChecked ? (
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCourseAssignModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleAssignCourses}
                disabled={selectedCourseIds.length === 0}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-semibold shadow-lg shadow-blue-500/20"
              >
                Confirm Assignment ({selectedCourseIds.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
