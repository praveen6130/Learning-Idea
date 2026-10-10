import React, { useState } from 'react';
import { Course } from '../types';
import { 
  Search, 
  Sparkles, 
  GraduationCap, 
  ArrowRight, 
  Layers, 
  Compass, 
  Zap, 
  Flame,
  CheckCircle,
  PlayCircle
} from 'lucide-react';

interface CourseSearchProps {
  onCourseSelect: (course: Course) => void;
  onGenerateRoadmap: (topic: string, goal: string) => Promise<void>;
  courses: Course[];
  isGenerating: boolean;
}

export const CourseSearch: React.FC<CourseSearchProps> = ({
  onCourseSelect,
  onGenerateRoadmap,
  courses,
  isGenerating,
}) => {
  const [searchTopic, setSearchTopic] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('Comprehensive Mastery (Basic to Advanced)');

  const quickPills = [
    'AI Agents & Autonomous Workflows',
    'Full-Stack React & Node Systems',
    'Machine Learning & Neural Nets',
    'Cybersecurity & Ethical Hacking',
    'Cloud DevOps & Kubernetes',
    'Prompt Engineering & LLM APIs',
    'Rust Systems Programming',
    '3D Game Design & Blender'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTopic.trim() || isGenerating) return;
    onGenerateRoadmap(searchTopic.trim(), selectedGoal);
  };

  const handlePillClick = (pill: string) => {
    setSearchTopic(pill);
    if (!isGenerating) {
      onGenerateRoadmap(pill, selectedGoal);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero section */}
      <div className="text-center max-w-3xl mx-auto mb-10 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Autonomous AI Curriculum & Video Synthesis</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-4">
          Master Any Skill From{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Basic to Advanced
          </span>
        </h1>

        <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Search any course, technology, or domain. The AI creates a comprehensive multi-tier roadmap and synthesizes personalized AI video lessons with interactive code and real-time narration.
        </p>
      </div>

      {/* Main Search & Generator Card */}
      <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden mb-12">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTopic}
              onChange={(e) => setSearchTopic(e.target.value)}
              placeholder="Search any skill (e.g. Python for Data Science, React 19, Quantum Computing, Public Speaking)..."
              disabled={isGenerating}
              className="w-full bg-gray-950/80 border border-gray-700/80 rounded-2xl pl-12 pr-4 py-4 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-gray-400 shrink-0 font-medium">Learning Goal:</span>
              <select
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
                disabled={isGenerating}
                className="bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 w-full sm:w-auto"
              >
                <option value="Comprehensive Mastery (Basic to Advanced)">
                  Comprehensive Mastery (Basic to Advanced)
                </option>
                <option value="Career Transition & Portfolio Projects">
                  Career Transition & Portfolio Projects
                </option>
                <option value="Quick Crash Course & Hands-on Drills">
                  Quick Crash Course & Hands-on Drills
                </option>
                <option value="Advanced Architectural Deep-Dive">
                  Advanced Architectural Deep-Dive
                </option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isGenerating || !searchTopic.trim()}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all hover:scale-102"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Synthesizing AI Roadmap...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Basic to Advanced Roadmap</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="mt-6 pt-5 border-t border-gray-800/80">
          <div className="text-xs font-semibold text-gray-400 mb-3 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Popular Masterclass Topics:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {quickPills.map((pill) => (
              <button
                key={pill}
                type="button"
                onClick={() => handlePillClick(pill)}
                disabled={isGenerating}
                className="px-3 py-1.5 rounded-xl bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 text-xs font-medium border border-gray-700/60 hover:border-gray-500 transition-colors flex items-center gap-1.5"
              >
                <span>{pill}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Available & Enrolled Courses Library */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">Course Library & Active Roadmaps</h2>
          </div>
          <span className="text-xs text-gray-400">
            {courses.length} Roadmap{courses.length === 1 ? '' : 's'} available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => {
            const totalLessons = course.levels?.reduce(
              (acc, lvl) => acc + lvl.modules.reduce((mAcc, m) => mAcc + m.lessons.length, 0),
              0
            ) || 0;

            return (
              <div
                key={course.id}
                onClick={() => onCourseSelect(course)}
                className="group p-5 rounded-3xl bg-gray-900/80 border border-gray-800 hover:border-indigo-500/50 hover:bg-gray-850 transition-all cursor-pointer shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      5-STAGE ROADMAP
                    </span>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                      {course.duration || 'Comprehensive'}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-white group-hover:text-blue-300 transition-colors mb-2 line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between">
                  <div className="text-[11px] text-gray-400">
                    <span className="font-semibold text-gray-200">{totalLessons}</span> Lessons with AI Video
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 group-hover:text-blue-300">
                    <span>Open Roadmap</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
