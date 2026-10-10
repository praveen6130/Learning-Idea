export type UserRole = 'host' | 'admin' | 'student';
export type UserStatus = 'approved' | 'pending' | 'rejected' | 'revoked';

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  status: UserStatus;
  bio?: string;
  createdAt: string;
  assignedCourses?: string[];
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  summary: string;
  visualType: 'code_walkthrough' | 'architecture_diagram' | 'concept_blueprint' | 'algorithm_flowchart' | 'security_matrix' | string;
  keyConcepts: string[];
  subTopics?: string[];
  trackCategory?: 'basic' | 'main_body' | 'master';
}

export interface Module {
  id: string;
  title: string;
  estimatedTime: string;
  lessons: Lesson[];
  subTopicsSummary?: string[];
}

export interface Level {
  levelNumber: number;
  levelTitle: string;
  description: string;
  badge: string;
  trackCategory?: 'basic' | 'main_body' | 'master';
  modules: Module[];
}

export interface Course {
  id: string;
  title: string;
  topic: string;
  targetGoal: string;
  level: string;
  duration: string;
  createdAt: string;
  createdBy?: string;
  description: string;
  levels: Level[];
}

export interface DiagramNode {
  id: string;
  label: string;
  desc: string;
  status: 'active' | 'ready' | 'completed';
}

export interface VideoScene {
  sceneNumber: number;
  type: 'hook' | 'diagram' | 'code' | 'tips_and_pitfalls' | 'recap_and_quiz';
  durationSeconds: number;
  title: string;
  narration: string;
  visual: {
    headline: string;
    subheadline?: string;
    points?: string[];
    badgeText?: string;
    metaphor?: { title: string; analogy: string; icon?: string };
    diagramNodes?: DiagramNode[];
    highlightNode?: string;
    code?: string;
    highlightLines?: number[];
    doList?: string[];
    dontList?: string[];
    trophyText?: string;
    quizPreview?: string;
    visualStyle?: string;
  };
}

export interface Subtitle {
  id: string;
  sceneNumber: number;
  startTime: number;
  endTime: number;
  text: string;
}

export interface Quiz {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface VideoStoryboard {
  id: string;
  courseId: string;
  lessonId: string;
  title: string;
  topic: string;
  lessonTitle: string;
  levelNumber: number;
  trackCategory?: string;
  durationSeconds: number;
  durationFormatted: string;
  narratorVoice: string;
  scenes: VideoScene[];
  subtitles: Subtitle[];
  quiz: Quiz;
  practiceMission?: string;
}

export interface UserProgress {
  userId: string;
  courseId: string;
  completedLessons: string[];
  lastAccessedLesson: string | null;
  quizScores: Record<string, number>;
  updatedAt: string;
}

export interface AdminStats {
  totalUsers: number;
  approvedStudents: number;
  pendingApprovals: number;
  totalAdmins: number;
  totalCourses: number;
  totalVideosGenerated: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}
