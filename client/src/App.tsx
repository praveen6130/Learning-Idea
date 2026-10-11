import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { PendingApprovalView } from './components/PendingApprovalView';
import { AdminPanel } from './components/AdminPanel';
import { CourseSearch } from './components/CourseSearch';
import { RoadmapView } from './components/RoadmapView';
import { AIVideoPlayer } from './components/AIVideoPlayer';
import { LessonCompanion } from './components/LessonCompanion';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { courseApi } from './services/api';
import { Course, Lesson, VideoStoryboard, UserProgress } from './types';
import { 
  Sparkles, 
  GraduationCap, 
  PlayCircle, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  LogIn, 
  UserPlus,
  Cpu,
  Video,
  Award,
  Terminal,
  Compass,
  CheckCircle2,
  Mic,
  Code2
} from 'lucide-react';

export const AppContent: React.FC = () => {
  const { user, isApproved, isAdmin, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState<'courses' | 'admin' | 'roadmap'>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoStoryboard | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  const showNotification = (type: 'success' | 'info', text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenAuth = (mode: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // Fetch courses when approved
  const loadCourses = async () => {
    if (!isApproved) return;
    try {
      const res = await courseApi.getCourses();
      setCourses(res.courses);
      if (!selectedCourse && res.courses.length > 0) {
        setSelectedCourse(res.courses[0]);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  useEffect(() => {
    if (isApproved) {
      loadCourses();
    }
  }, [isApproved]);

  // Fetch progress when course selected
  useEffect(() => {
    if (selectedCourse && isApproved) {
      const loadProgress = async () => {
        try {
          const res = await courseApi.getProgress(selectedCourse.id);
          setUserProgress(res.progress);
        } catch (err) {
          console.error('Error loading progress:', err);
        }
      };
      loadProgress();
    }
  }, [selectedCourse, isApproved]);

  // Handle roadmap generation
  const handleGenerateRoadmap = async (topic: string, goal: string) => {
    setIsGeneratingRoadmap(true);
    try {
      const res = await courseApi.generateRoadmap(topic, goal);
      setCourses((prev) => [res.course, ...prev]);
      setSelectedCourse(res.course);
      setCurrentTab('roadmap');
      showNotification('success', `Created AI Roadmap: ${res.course.title}`);
    } catch (err: any) {
      console.error('Roadmap error:', err);
      showNotification('info', err.message || 'Failed to generate roadmap');
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  // Handle video generation for a lesson
  const handleSelectLesson = async (lesson: Lesson, levelNumber: number) => {
    if (!selectedCourse) return;
    setIsGeneratingVideo(true);

    try {
      const res = await courseApi.generateVideo({
        courseId: selectedCourse.id,
        lessonId: lesson.id,
        topic: selectedCourse.topic,
        lessonTitle: lesson.title,
        levelNumber: levelNumber,
      });

      setActiveVideo(res.video);
      showNotification('success', `AI Video loaded for: ${lesson.title}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Video error:', err);
      showNotification('info', err.message || 'Failed to generate AI video');
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  // Handle marking lesson completion
  const handleToggleLessonCompletion = async (lessonId: string, currentCompleted: boolean) => {
    if (!selectedCourse) return;
    try {
      const res = await courseApi.saveProgress(selectedCourse.id, {
        lessonId,
        completed: !currentCompleted,
      });
      setUserProgress(res.progress);
    } catch (err) {
      console.error('Progress error:', err);
    }
  };

  // Handle quiz score
  const handleQuizCompleted = async (score: number) => {
    if (!selectedCourse || !activeVideo) return;
    try {
      const res = await courseApi.saveProgress(selectedCourse.id, {
        lessonId: activeVideo.lessonId,
        completed: true,
        quizScore: score,
      });
      setUserProgress(res.progress);
      showNotification('success', score === 100 ? 'Quiz passed with 100% score!' : 'Quiz recorded successfully.');
    } catch (err) {
      console.error('Quiz save error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-[#07090e] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4 p-8 rounded-3xl glass-card">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-indigo-400 animate-spin" />
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-white tracking-tight">CognitiveForge AI</div>
            <div className="text-xs text-gray-400 mt-1">Initializing secure learning environment...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#07090e] text-[#f1f5f9] flex flex-col bg-grid-subtle">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenAuth={(mode) => handleOpenAuth(mode || 'login')}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="px-4 py-3 rounded-2xl bg-[#0c1017]/95 border border-white/10 text-xs text-white shadow-2xl flex items-center gap-3 backdrop-blur-xl">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-medium">{notification.text}</span>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1">
        {/* =========================================================================
            SCENARIO 1: GUEST USER (PREMIUM COMMERCIAL LANDING EXPERIENCE)
        ========================================================================== */}
        {!user ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
            {/* Asymmetrical Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
              {/* Left Column: Authoritative Typography & Action CTAs */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span>Autonomous AI Masterclass Platform</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                  Learn any technical skill from{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-100 to-sky-300">
                    basic to advanced
                  </span>{' '}
                  with AI video lessons.
                </h1>

                <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-[55ch]">
                  Search any technical domain. Our engine generates multi-tier roadmaps and interactive video lessons with synchronized voice narration.
                </p>

                {/* Primary Action Buttons with Button-in-Button Trailing Icons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <button
                    onClick={() => handleOpenAuth('register')}
                    className="group px-6 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 flex items-center justify-between sm:justify-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Request Student Access</span>
                    <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>

                  <button
                    onClick={() => handleOpenAuth('login')}
                    className="px-6 py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-gray-200 border border-white/[0.08] font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <LogIn className="w-4 h-4 text-indigo-400" />
                    <span>Sign In to Workspace</span>
                  </button>
                </div>

                {/* Micro trust indicators */}
                <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-gray-400 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Host Gated Protection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>100% Autonomous Fallback</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Phone Password Recovery</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Interactive Architecture Preview Showcase (Double-Bezel) */}
              <div className="lg:col-span-5">
                <div className="double-bezel-card">
                  <div className="double-bezel-inner p-6 space-y-4">
                    {/* Header bar */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                        <span className="text-[11px] font-mono text-gray-400 ml-2">synthesizer_live.tsx</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        ONLINE
                      </span>
                    </div>

                    {/* Lesson Mock Screen */}
                    <div className="rounded-xl bg-[#07090e] p-4 border border-white/[0.06] space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">Stage 1: Basic Foundations</span>
                        <span className="text-[10px] text-indigo-400 font-mono">02:30 Synced</span>
                      </div>

                      {/* Interactive Diagram Mini-Node Map */}
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                        <div className="p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-200">
                          <Compass className="w-3.5 h-3.5 mx-auto mb-1 text-indigo-400" />
                          <span>Core Mental Model</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-gray-300">
                          <Code2 className="w-3.5 h-3.5 mx-auto mb-1 text-sky-400" />
                          <span>Syntax Sandbox</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-gray-300">
                          <Award className="w-3.5 h-3.5 mx-auto mb-1 text-amber-400" />
                          <span>Milestone Quiz</span>
                        </div>
                      </div>

                      {/* Audio waveform simulator */}
                      <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center justify-between text-[11px] text-gray-300">
                        <div className="flex items-center gap-2">
                          <Mic className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                          <span className="text-gray-400">Nova Voice:</span>
                          <span className="font-semibold text-white">"Welcome to this step-by-step masterclass..."</span>
                        </div>
                        <div className="flex items-center gap-0.5 h-3">
                          <span className="w-0.5 h-2 bg-indigo-400 animate-bounce" />
                          <span className="w-0.5 h-3 bg-indigo-400 animate-bounce delay-75" />
                          <span className="w-0.5 h-1.5 bg-indigo-400 animate-bounce delay-150" />
                        </div>
                      </div>
                    </div>

                    {/* Quick topic test pill */}
                    <div className="pt-2 flex items-center justify-between text-xs text-gray-400">
                      <span>Curriculum Generator:</span>
                      <span className="text-indigo-300 font-mono text-[11px]">5 Stages Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metric Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
              <div className="p-4 text-left">
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">5 Tiers</div>
                <div className="text-xs text-gray-400 mt-1">Basic to production curriculum</div>
              </div>
              <div className="p-4 text-left border-l border-white/[0.06]">
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">3 Tracks</div>
                <div className="text-xs text-gray-400 mt-1">Foundation, core and master tiers</div>
              </div>
              <div className="p-4 text-left border-l border-white/[0.06]">
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">Synced</div>
                <div className="text-xs text-gray-400 mt-1">Speech, code and karaoke subtitles</div>
              </div>
              <div className="p-4 text-left border-l border-white/[0.06]">
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">100% Gated</div>
                <div className="text-xs text-gray-400 mt-1">Host and administrator verification</div>
              </div>
            </div>

            {/* Asymmetrical Bento Feature Matrix (Anti-slop diversified grid) */}
            <div className="space-y-6 mb-24">
              <div className="text-left max-w-xl">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Engineered for commercial mastery.
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-2">
                  Four synchronized systems that make autonomous education feel like private 1-on-1 tutoring.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left">
                {/* Tile 1: 5-Stage Adaptive Roadmaps (Col 7) */}
                <div className="md:col-span-7 double-bezel-card">
                  <div className="double-bezel-inner p-8 flex flex-col justify-between h-full space-y-6">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/20">
                        <Layers className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">5-Stage Structured Roadmaps</h3>
                      <p className="text-xs text-gray-400 leading-relaxed max-w-[50ch]">
                        Every skill search generates an exhaustive curriculum: Stage 1 Foundations, Stage 2 Core Syntax, Stage 3 Asynchronous Pipelines, Stage 4 Production Hardening, and Stage 5 Capstone.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/[0.06] text-xs">
                      <div className="p-3 rounded-xl bg-[#07090e] border border-white/[0.04]">
                        <div className="font-bold text-emerald-400">🌱 Basic</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">Start to finish</div>
                      </div>
                      <div className="p-3 rounded-xl bg-[#07090e] border border-white/[0.04]">
                        <div className="font-bold text-sky-400">⚡ Main Body</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">Core architecture</div>
                      </div>
                      <div className="p-3 rounded-xl bg-[#07090e] border border-white/[0.04]">
                        <div className="font-bold text-purple-400">👑 Master</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">Zero-trust scale</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tile 2: Neural Video Narration & Synced Subtitles (Col 5) */}
                <div className="md:col-span-5 double-bezel-card">
                  <div className="double-bezel-inner p-8 flex flex-col justify-between h-full space-y-6">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 border border-purple-500/20">
                        <Video className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">Synchronized AI Video Lessons</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Multimodal scene generation creates storyboards with real-world analogies, blueprint diagrams, and live syntax execution.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#07090e] border border-white/[0.04] text-[11px] font-mono text-indigo-300">
                      ✓ Real-time Web Speech narration<br />
                      ✓ Synchronized karaoke subtitles<br />
                      ✓ Exportable lesson transcripts
                    </div>
                  </div>
                </div>

                {/* Tile 3: Interactive Practice & Companion Lab (Col 5) */}
                <div className="md:col-span-5 double-bezel-card">
                  <div className="double-bezel-inner p-8 flex flex-col justify-between h-full space-y-6">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4 border border-sky-500/20">
                        <Terminal className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">Companion Lab & Quizzes</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Test your comprehension with milestone quizzes, execution scratchpads, and persistent progress tracking.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                      <Award className="w-4 h-4" />
                      <span>100% Milestone verification</span>
                    </div>
                  </div>
                </div>

                {/* Tile 4: Institutional Verification & Security (Col 7) */}
                <div className="md:col-span-7 double-bezel-card">
                  <div className="double-bezel-inner p-8 flex flex-col justify-between h-full space-y-6">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">Host & Admin Gated Authorization</h3>
                      <p className="text-xs text-gray-400 leading-relaxed max-w-[50ch]">
                        Strict role hierarchy protects platform integrity. Unapproved accounts cannot access curricula. Admins manage students, while the Host retains singular authority over admin promotions.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                      <span className="px-2.5 py-1 rounded-lg bg-[#07090e] border border-white/[0.06]">Phone Verification</span>
                      <span className="px-2.5 py-1 rounded-lg bg-[#07090e] border border-white/[0.06]">Admin Approval Queue</span>
                      <span className="px-2.5 py-1 rounded-lg bg-[#07090e] border border-white/[0.06]">Encrypted Password Reset</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Closing Conversion Island */}
            <div className="double-bezel-card">
              <div className="double-bezel-inner p-8 sm:p-12 text-center space-y-6">
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Ready to master any domain at your own pace?
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
                  Register for access or sign in to generate your first custom roadmap with AI video masterclasses.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                  <button
                    onClick={() => handleOpenAuth('register')}
                    className="group px-7 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 flex items-center gap-3 transition-all hover:scale-[1.02]"
                  >
                    <span>Create Your Account</span>
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                  <button
                    onClick={() => handleOpenAuth('login')}
                    className="px-6 py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 border border-white/[0.08] font-semibold text-sm transition-all"
                  >
                    Sign In to Existing Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : !isApproved ? (
          /* =========================================================================
              SCENARIO 2: LOGGED IN USER PENDING HOST/ADMIN APPROVAL
          ========================================================================== */
          <PendingApprovalView />
        ) : (
          /* =========================================================================
              SCENARIO 3: APPROVED STUDENT OR HOST/ADMIN WORKSPACE
          ========================================================================== */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {/* ADMIN PANEL VIEW (ONLY FOR ADMIN OR HOST) */}
            {currentTab === 'admin' && isAdmin && <AdminPanel />}

            {/* COURSES SEARCH & ROADMAP GENERATOR VIEW */}
            {currentTab === 'courses' && (
              <CourseSearch
                courses={courses}
                onCourseSelect={(course) => {
                  setSelectedCourse(course);
                  setCurrentTab('roadmap');
                }}
                onGenerateRoadmap={handleGenerateRoadmap}
                isGenerating={isGeneratingRoadmap}
              />
            )}

            {/* 5-STAGE ROADMAP & AI VIDEO MASTERCLASS VIEW */}
            {currentTab === 'roadmap' && selectedCourse && (
              <div className="space-y-8">
                {/* AI Video Masterclass Player Overlay */}
                {activeVideo && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
                    <div className="lg:col-span-8">
                      <AIVideoPlayer
                        video={activeVideo}
                        onClose={() => setActiveVideo(null)}
                        onLessonComplete={() => {
                          handleToggleLessonCompletion(activeVideo.lessonId, false);
                        }}
                        isCompleted={userProgress?.completedLessons.includes(activeVideo.lessonId)}
                      />
                    </div>

                    <div className="lg:col-span-4">
                      <LessonCompanion
                        video={activeVideo}
                        onQuizCompleted={handleQuizCompleted}
                        savedScore={userProgress?.quizScores?.[activeVideo.lessonId]}
                      />
                    </div>
                  </div>
                )}

                {/* AI Video Generating Loader Banner */}
                {isGeneratingVideo && (
                  <div className="double-bezel-card">
                    <div className="double-bezel-inner p-8 text-center space-y-3">
                      <Sparkles className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                      <div className="text-base font-bold text-white tracking-tight">
                        Synthesizing AI Video Storyboard & Neural Voice Narration
                      </div>
                      <p className="text-xs text-gray-400 max-w-md mx-auto">
                        Generating multi-scene canvas visual assets, interactive code snippets, and synchronized speech for this lesson.
                      </p>
                    </div>
                  </div>
                )}

                {/* The 5-Stage Roadmap View */}
                <RoadmapView
                  course={selectedCourse}
                  progress={userProgress}
                  onBack={() => setCurrentTab('courses')}
                  onSelectLesson={handleSelectLesson}
                  onToggleLessonCompletion={handleToggleLessonCompletion}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      {/* Commercial Product Footer */}
      <footer className="border-t border-white/[0.06] bg-[#07090e] py-8 px-4 sm:px-6 text-xs text-gray-500 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">CognitiveForge AI</span>
            <span>• Commercial Autonomous Learning Infrastructure</span>
          </div>
          <div className="text-[11px] text-gray-500">
            Host Gatekeeper Protocol Active • Phone-Based Recovery System
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
