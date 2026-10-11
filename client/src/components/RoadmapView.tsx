import React, { useState } from 'react';
import { Course, Lesson, Level, UserProgress } from '../types';
import { 
  ArrowLeft, 
  Sparkles, 
  PlayCircle, 
  CheckCircle2, 
  Clock, 
  Award, 
  Code, 
  Cpu, 
  Shield, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  BookOpen,
  Check,
  Compass,
  Crown,
  Flame
} from 'lucide-react';

interface RoadmapViewProps {
  course: Course;
  progress: UserProgress | null;
  onBack: () => void;
  onSelectLesson: (lesson: Lesson, levelNumber: number) => void;
  onToggleLessonCompletion: (lessonId: string, currentCompleted: boolean) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  course,
  progress,
  onBack,
  onSelectLesson,
  onToggleLessonCompletion,
}) => {
  const [collapsedLevels, setCollapsedLevels] = useState<Record<number, boolean>>({});
  const [selectedTrack, setSelectedTrack] = useState<'all' | 'basic' | 'main_body' | 'master'>('all');

  const toggleLevelCollapse = (levelNumber: number) => {
    setCollapsedLevels((prev) => ({
      ...prev,
      [levelNumber]: !prev[levelNumber],
    }));
  };

  const completedSet = new Set(progress?.completedLessons || []);

  const totalLessons = course.levels?.reduce(
    (acc, lvl) => acc + lvl.modules.reduce((mAcc, m) => mAcc + m.lessons.length, 0),
    0
  ) || 0;

  const completedCount = completedSet.size;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const getVisualIcon = (visualType: string) => {
    switch (visualType) {
      case 'code_walkthrough':
        return <Code className="w-3.5 h-3.5 text-emerald-400" />;
      case 'architecture_diagram':
        return <Cpu className="w-3.5 h-3.5 text-sky-400" />;
      case 'security_matrix':
        return <Shield className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  // Filter levels based on chosen learning track
  const displayedLevels = course.levels?.filter((level) => {
    if (selectedTrack === 'all') return true;
    if (selectedTrack === 'basic') {
      return level.trackCategory === 'basic' || level.levelNumber <= 2;
    }
    if (selectedTrack === 'main_body') {
      return level.trackCategory === 'main_body' || level.levelNumber === 2 || level.levelNumber === 3;
    }
    if (selectedTrack === 'master') {
      return level.trackCategory === 'master' || level.levelNumber >= 4;
    }
    return true;
  });

  return (
    <div className="space-y-8 text-left">
      {/* Top Breadcrumb Navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Course Search</span>
      </button>

      {/* Course Header Banner (Double-Bezel) */}
      <div className="double-bezel-card">
        <div className="double-bezel-inner p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  AI MASTERCLASS ROADMAP
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {course.duration || 'Comprehensive 5 Stages'}
                </span>
                <span className="text-xs text-indigo-300 font-medium">
                  Goal: {course.targetGoal}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                {course.title}
              </h1>

              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-[65ch]">
                {course.description}
              </p>
            </div>

            {/* Curriculum Progress Card */}
            <div className="w-full lg:w-72 bg-[#07090e] border border-white/[0.08] rounded-2xl p-5 shrink-0 shadow-lg space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 font-medium">Curriculum Progress</span>
                <span className="font-bold text-emerald-400 font-mono">{progressPercent}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span>{completedCount} of {totalLessons} completed</span>
                <span className="text-indigo-300 font-semibold">{course.levels?.length || 5} Stages</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Track Selector Station */}
      <div className="double-bezel-card">
        <div className="double-bezel-inner p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm sm:text-base font-extrabold text-white">
              Choose What You Need to Learn:
            </h2>
          </div>
          <p className="text-xs text-gray-400">
            Select your target level to focus on. Each track features granular sub-contents from starting to ending with tailored creative AI-generated videos:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* TRACK 1: BASIC */}
            <button
              type="button"
              onClick={() => setSelectedTrack('basic')}
              className={`p-4 rounded-2xl text-left border transition-all ${
                selectedTrack === 'basic'
                  ? 'bg-emerald-950/30 border-emerald-500/60 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                  : 'bg-[#07090e] border-white/[0.06] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">🌱</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  START TO END
                </span>
              </div>
              <div className="font-bold text-xs text-white mb-1">
                Basic Foundations Track
              </div>
              <p className="text-[11px] text-gray-400 leading-snug">
                From absolute zero setup, syntax, logic and your first mini-project.
              </p>
            </button>

            {/* TRACK 2: MAIN BODY */}
            <button
              type="button"
              onClick={() => setSelectedTrack('main_body')}
              className={`p-4 rounded-2xl text-left border transition-all ${
                selectedTrack === 'main_body'
                  ? 'bg-sky-950/30 border-sky-500/60 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/40'
                  : 'bg-[#07090e] border-white/[0.06] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">⚡</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30">
                  CORE SYSTEM
                </span>
              </div>
              <div className="font-bold text-xs text-white mb-1">
                Main Body Track
              </div>
              <p className="text-[11px] text-gray-400 leading-snug">
                Core architecture, state lifecycles, APIs and asynchronous pipelines.
              </p>
            </button>

            {/* TRACK 3: MASTER */}
            <button
              type="button"
              onClick={() => setSelectedTrack('master')}
              className={`p-4 rounded-2xl text-left border transition-all ${
                selectedTrack === 'master'
                  ? 'bg-purple-950/30 border-purple-500/60 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/40'
                  : 'bg-[#07090e] border-white/[0.06] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">👑</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  ELITE TIER
                </span>
              </div>
              <div className="font-bold text-xs text-white mb-1">
                Master Level Track
              </div>
              <p className="text-[11px] text-gray-400 leading-snug">
                Engine internals, zero-trust security hardening, scale and capstone.
              </p>
            </button>

            {/* TRACK 4: ALL 5 STAGES */}
            <button
              type="button"
              onClick={() => setSelectedTrack('all')}
              className={`p-4 rounded-2xl text-left border transition-all ${
                selectedTrack === 'all'
                  ? 'bg-indigo-950/30 border-indigo-500/60 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/40'
                  : 'bg-[#07090e] border-white/[0.06] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">🌟</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  FULL 5 STAGES
                </span>
              </div>
              <div className="font-bold text-xs text-white mb-1">
                All Stages Journey
              </div>
              <p className="text-[11px] text-gray-400 leading-snug">
                Complete end-to-end curriculum from Basic to Advanced Masterclass.
              </p>
            </button>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {selectedTrack === 'basic' && "Now displaying: Basic Foundations Track (start to finish). Select any sub-topic below to watch its creative AI video."}
                {selectedTrack === 'main_body' && "Now displaying: Main Body Track. Master core architecture and data flow with AI-generated videos."}
                {selectedTrack === 'master' && "Now displaying: Master Level Track. Explore engine internals, security and capstone with AI videos."}
                {selectedTrack === 'all' && "Now displaying: Full 5-Stage Roadmap from Basic to Advanced. Select any topic to generate AI video."}
              </span>
            </div>

            <span className="text-indigo-400 font-semibold font-mono text-[11px] shrink-0 hidden sm:inline">
              {displayedLevels?.length || 0} Stage{(displayedLevels?.length || 0) === 1 ? '' : 's'} Active
            </span>
          </div>
        </div>
      </div>

      {/* Progressive Roadmap Levels Spine */}
      <div className="space-y-8 relative">
        <div className="hidden md:block absolute left-8 top-10 bottom-10 w-0.5 bg-gradient-to-b from-indigo-500 via-sky-500 to-purple-500 opacity-20" />

        {displayedLevels?.map((level) => {
          const isCollapsed = collapsedLevels[level.levelNumber] || false;
          const levelCompletedLessons = level.modules.reduce(
            (acc, m) => acc + m.lessons.filter((l) => completedSet.has(l.id)).length,
            0
          );
          const levelTotalLessons = level.modules.reduce((acc, m) => acc + m.lessons.length, 0);
          const isLevelComplete = levelTotalLessons > 0 && levelCompletedLessons === levelTotalLessons;

          return (
            <div
              key={level.levelNumber}
              className="relative pl-0 md:pl-20 transition-all"
            >
              {/* Level Node Milestone Beacon */}
              <div className="hidden md:flex absolute left-4 top-5 w-8 h-8 rounded-full bg-[#0c1017] border-2 border-indigo-500 text-indigo-300 items-center justify-center font-bold text-xs shadow-md shadow-indigo-500/20 z-10">
                {level.levelNumber}
              </div>

              {/* Level Container Card */}
              <div className="double-bezel-card">
                <div className="double-bezel-inner p-6 space-y-4">
                  {/* Level Title Bar */}
                  <div
                    onClick={() => toggleLevelCollapse(level.levelNumber)}
                    className="flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/[0.04] text-indigo-300 border border-white/10">
                          {level.badge}
                        </span>
                        {isLevelComplete && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center gap-1 border border-emerald-500/30">
                            <Check className="w-3 h-3" />
                            <span>Mastered</span>
                          </span>
                        )}
                      </div>

                      <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-indigo-200 transition-colors">
                        {level.levelTitle}
                      </h2>

                      <p className="text-xs text-gray-400 leading-relaxed max-w-[65ch]">
                        {level.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-gray-400 font-mono hidden sm:inline">
                        {levelCompletedLessons}/{levelTotalLessons} done
                      </span>
                      <button className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 transition-colors">
                        {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Level Modules & Lessons */}
                  {!isCollapsed && (
                    <div className="mt-6 space-y-6 pt-6 border-t border-white/[0.06]">
                      {level.modules.map((module) => (
                        <div key={module.id} className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-white/[0.04]">
                            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                              <span>{module.title}</span>
                            </div>
                            <span className="text-[11px] text-gray-400 font-mono">{module.estimatedTime}</span>
                          </div>

                          {/* Module Sub-Topics Overview Pills */}
                          {module.subTopicsSummary && module.subTopicsSummary.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 my-1">
                              {module.subTopicsSummary.map((st, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] bg-[#07090e] text-gray-400 px-2 py-0.5 rounded border border-white/[0.06]"
                                >
                                  {st}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Lessons Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                            {module.lessons.map((lesson) => {
                              const isDone = completedSet.has(lesson.id);

                              return (
                                <div
                                  key={lesson.id}
                                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                                    isDone
                                      ? 'bg-emerald-950/15 border-emerald-500/30'
                                      : 'bg-[#07090e] border-white/[0.06] hover:border-indigo-500/40'
                                  }`}
                                >
                                  <div>
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                      <div className="flex items-center gap-1.5">
                                        <span className="p-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                                          {getVisualIcon(lesson.visualType)}
                                        </span>
                                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                          {lesson.visualType?.replace('_', ' ')}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
                                          <Clock className="w-3 h-3 text-gray-500" />
                                          {lesson.duration}
                                        </span>

                                        {/* Completion Checkbox */}
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleLessonCompletion(lesson.id, isDone);
                                          }}
                                          className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                                            isDone
                                              ? 'bg-emerald-500 text-[#07090e]'
                                              : 'border border-white/20 text-transparent hover:border-white/40'
                                          }`}
                                          title={isDone ? 'Mark uncompleted' : 'Mark completed'}
                                        >
                                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                                        </button>
                                      </div>
                                    </div>

                                    <h3 className="font-bold text-sm text-white mb-1.5">
                                      {lesson.title}
                                    </h3>

                                    <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">
                                      {lesson.summary}
                                    </p>

                                    {/* Granular Sub-Topics Checklist */}
                                    {lesson.subTopics && lesson.subTopics.length > 0 && (
                                      <div className="mb-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                        <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                          <Sparkles className="w-3 h-3 text-amber-300" />
                                          <span>Topics Covered (Start to End):</span>
                                        </div>
                                        <ul className="space-y-1 text-[11px] text-gray-300">
                                          {lesson.subTopics.map((sub, sIdx) => (
                                            <li key={sIdx} className="flex items-center gap-2">
                                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                                              <span className="truncate">{sub}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    {/* Key Concept Chips */}
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                      {lesson.keyConcepts?.slice(0, 3).map((concept, idx) => (
                                        <span
                                          key={idx}
                                          className="text-[10px] bg-white/[0.03] text-gray-400 px-2 py-0.5 rounded border border-white/[0.04]"
                                        >
                                          {concept}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Primary Action Button */}
                                  <button
                                    onClick={() => onSelectLesson(lesson, level.levelNumber)}
                                    className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98]"
                                  >
                                    <PlayCircle className="w-4 h-4 text-amber-300" />
                                    <span>Generate & Watch Creative AI Video</span>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
