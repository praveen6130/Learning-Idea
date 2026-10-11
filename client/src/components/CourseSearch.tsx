import React, { useState } from 'react';
import { Course } from '../types';
import { 
  Search, 
  Sparkles, 
  GraduationCap, 
  ArrowRight, 
  Layers, 
  Flame,
  CheckCircle2,
  Clock,
  BookOpen
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
    <div className="space-y-12">
      {/* Search Header Banner & Generator */}
      <div className="double-bezel-card">
        <div className="double-bezel-inner p-6 sm:p-10 space-y-6">
          <div className="max-w-2xl text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Autonomous Curriculum Engine</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Search any skill to build your curriculum
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Type any technology, framework, or theoretical discipline. Our engine creates a 5-stage roadmap with tailored AI video lessons.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTopic}
                onChange={(e) => setSearchTopic(e.target.value)}
                placeholder="Search any skill (e.g. React 19, Python Data Systems, Quantum Algorithms)..."
                disabled={isGenerating}
                className="w-full bg-[#07090e] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <span className="text-xs text-gray-400 shrink-0 font-medium">Learning Track Goal:</span>
                <select
                  value={selectedGoal}
                  onChange={(e) => setSelectedGoal(e.target.value)}
                  disabled={isGenerating}
                  className="bg-[#07090e] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 w-full sm:w-auto cursor-pointer"
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
                className="px-7 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Synthesizing Curriculum...</span>
                  </>
                ) : (
                  <>
                    <span>Generate AI Roadmap</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Popular Masterclass Pill Chips */}
          <div className="pt-4 border-t border-white/[0.06]">
            <div className="text-[11px] font-semibold text-gray-400 mb-2.5 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Recommended Topics:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {quickPills.map((pill) => (
                <button
                  key={pill}
                  type="button"
                  onClick={() => handlePillClick(pill)}
                  disabled={isGenerating}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-gray-300 text-xs font-medium border border-white/[0.06] hover:border-white/20 transition-all flex items-center gap-1.5"
                >
                  <span>{pill}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Available Roadmaps Library */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Active Curricula & Roadmaps</h2>
              <p className="text-[11px] text-gray-400">Select any generated course to access lessons and AI video masterclasses</p>
            </div>
          </div>
          <span className="text-xs text-gray-400 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
            {courses.length} Course{courses.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const totalLessons = course.levels?.reduce(
              (acc, lvl) => acc + lvl.modules.reduce((mAcc, m) => mAcc + m.lessons.length, 0),
              0
            ) || 0;

            return (
              <div
                key={course.id}
                onClick={() => onCourseSelect(course)}
                className="group double-bezel-card cursor-pointer hover:scale-[1.01]"
              >
                <div className="double-bezel-inner p-6 flex flex-col justify-between h-full space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                        5 STAGES
                      </span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-gray-500" />
                        {course.duration || 'Comprehensive'}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-white group-hover:text-indigo-200 transition-colors line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{totalLessons} Lessons with AI Video</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
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
