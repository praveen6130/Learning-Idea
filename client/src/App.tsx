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
  Award
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
      showNotification('success', score === 100 ? 'Quiz passed with 100% score! 🎉' : 'Quiz recorded.');
    } catch (err) {
      console.error('Quiz save error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <Sparkles className="w-8 h-8 text-indigo-400 animate-spin" />
          <span className="text-sm font-semibold text-gray-300">Loading CognitiveForge AI...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenAuth={(mode) => handleOpenAuth(mode || 'login')}
      />

      {/* Floating Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="px-4 py-3 rounded-2xl bg-gray-900 border border-indigo-500/40 text-xs text-white shadow-2xl flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{notification.text}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1">
        {/* SCENARIO 1: USER IS NOT LOGGED IN */}
        {!user ? (
          <div className="max-w-6xl mx-auto px-4 py-16 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Next-Gen Autonomous AI Learning</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6">
              Learn Any Skill From{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Basic to Advanced
              </span>{' '}
              With AI-Generated Videos
            </h1>

            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Search any course, topic, or engineering domain. Our AI generates an end-to-end 5-level curriculum and synthesizes interactive video masterclasses with synced narration, live code execution, and architectural diagrams.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button
                onClick={() => handleOpenAuth('login')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-102"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Your Account</span>
              </button>

              <button
                onClick={() => handleOpenAuth('register')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-700 font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-102"
              >
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span>Request Access (Register)</span>
              </button>
            </div>

            {/* Feature preview cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-white text-base mb-2">5-Stage AI Roadmaps</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Progression from Stage 1: Basic Foundations all the way to Stage 5: Production Capstone.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                  <Video className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-white text-base mb-2">AI Video Storyboards</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Synthesized videos with dynamic canvas layouts, live code typing, architecture diagrams, and speech narration.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-white text-base mb-2">Host & Admin Protection</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Private learning environment where administrators verify student applications and curate assignments.
                </p>
              </div>
            </div>
          </div>
        ) : !isApproved ? (
          /* SCENARIO 2: LOGGED IN USER IS PENDING HOST/ADMIN APPROVAL */
          <PendingApprovalView />
        ) : (
          /* SCENARIO 3: APPROVED USER (OR HOST) HAS FULL ACCESS */
          <>
            {/* ADMIN PANEL VIEW (ONLY FOR ADMIN OR HOST) */}
            {currentTab === 'admin' && isAdmin && <AdminPanel />}

            {/* COURSES SEARCH VIEW */}
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

            {/* ROADMAP & VIDEO VIEW */}
            {currentTab === 'roadmap' && selectedCourse && (
              <div className="space-y-8">
                {/* AI Video Player Overlay */}
                {activeVideo && (
                  <div className="max-w-6xl mx-auto px-4 pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <AIVideoPlayer
                          video={activeVideo}
                          onClose={() => setActiveVideo(null)}
                          onLessonComplete={() => {
                            handleToggleLessonCompletion(activeVideo.lessonId, false);
                          }}
                          isCompleted={userProgress?.completedLessons.includes(activeVideo.lessonId)}
                        />
                      </div>

                      <div className="lg:col-span-1">
                        <LessonCompanion
                          video={activeVideo}
                          onQuizCompleted={handleQuizCompleted}
                          savedScore={userProgress?.quizScores?.[activeVideo.lessonId]}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Video Generating Loader banner */}
                {isGeneratingVideo && (
                  <div className="max-w-6xl mx-auto px-4 pt-6">
                    <div className="p-8 rounded-3xl bg-indigo-950/40 border border-indigo-500/40 text-center space-y-3">
                      <Sparkles className="w-10 h-10 text-amber-300 animate-spin mx-auto" />
                      <div className="text-lg font-bold text-white">
                        Synthesizing AI Video Storyboard & Voice Narration...
                      </div>
                      <p className="text-xs text-indigo-200">
                        Analyzing curriculum topic, generating visual diagrams, code walkthrough, and synchronized speech.
                      </p>
                    </div>
                  </div>
                )}

                {/* The 5-stage Roadmap */}
                <RoadmapView
                  course={selectedCourse}
                  progress={userProgress}
                  onBack={() => setCurrentTab('courses')}
                  onSelectLesson={handleSelectLesson}
                  onToggleLessonCompletion={handleToggleLessonCompletion}
                />
              </div>
            )}
          </>
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

      {/* Footer */}
      <footer className="border-t border-gray-900 bg-gray-950 py-6 px-4 text-center text-xs text-gray-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-400">CognitiveForge AI Platform</span>
            <span>• Basic to Advanced Autonomous Video Learning</span>
          </div>
          <div className="text-[11px] text-gray-500">
            Host & Admin Approval Protection Active • Phone Recovery Enabled
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
