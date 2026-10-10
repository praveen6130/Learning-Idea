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
  Zap,
  Check,
  Compass,
  Crown,
  Flame,
  CheckCircle
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
        return <Cpu className="w-3.5 h-3.5 text-blue-400" />;
      case 'security_matrix':
        return <Shield className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-purple-400" />;
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Navigation & Breadcrumb */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Course Search</span>
      </button>

      {/* Course Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-950/40 to-gray-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                AI COURSE ROADMAP
              </span>
              <span className="text-xs text-gray-400">
                {course.duration || 'Comprehensive 5 Stages'}
              </span>
              <span className="text-xs text-purple-400 font-semibold">
                Goal: {course.targetGoal}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {course.title}
            </h1>

            <p className="text-sm text-gray-300 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Progress Card */}
          <div className="w-full lg:w-72 bg-gray-950/80 border border-gray-800 rounded-2xl p-5 shrink-0 shadow-lg">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-gray-400 font-medium">Curriculum Progress</span>
              <span className="font-bold text-emerald-400">{progressPercent}%</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400">
              <span>{completedCount} of {totalLessons} completed</span>
              <span className="text-purple-300 font-semibold">{course.levels?.length || 5} Stages</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TRACK CHOOSER: ALLOW USER TO CHOOSE WHAT THEY WANT TO LEARN
          (Basic vs Main Body vs Master vs All)
      ========================================================================== */}
      <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 shadow-xl mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Compass className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base sm:text-lg font-extrabold text-white">
            Choose What You Need to Learn:
          </h2>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Select your target level to focus on. Each track features granular sub-contents from starting to ending with tailored creative AI-generated videos:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* TRACK 1: BASIC (START TO END) */}
          <button
            type="button"
            onClick={() => setSelectedTrack('basic')}
            className={`p-4 rounded-2xl text-left border transition-all ${
              selectedTrack === 'basic'
                ? 'bg-emerald-950/50 border-emerald-500 shadow-lg shadow-emerald-500/20 scale-102 ring-1 ring-emerald-400'
                : 'bg-gray-950/70 border-gray-800 hover:border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">🌱</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                START TO END
              </span>
            </div>
            <div className="font-extrabold text-sm text-white mb-1">
              Basic Foundations Track
            </div>
            <p className="text-[11px] text-gray-400 leading-snug">
              From absolute zero setup, syntax, logic & building your first mini-project.
            </p>
          </button>

          {/* TRACK 2: MAIN BODY (CORE IMPLEMENTATION) */}
          <button
            type="button"
            onClick={() => setSelectedTrack('main_body')}
            className={`p-4 rounded-2xl text-left border transition-all ${
              selectedTrack === 'main_body'
                ? 'bg-blue-950/50 border-blue-500 shadow-lg shadow-blue-500/20 scale-102 ring-1 ring-blue-400'
                : 'bg-gray-950/70 border-gray-800 hover:border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">⚡</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                CORE SYSTEM
              </span>
            </div>
            <div className="font-extrabold text-sm text-white mb-1">
              Main Body Track
            </div>
            <p className="text-[11px] text-gray-400 leading-snug">
              Core architecture, state lifecycles, APIs & asynchronous service patterns.
            </p>
          </button>

          {/* TRACK 3: MASTER TIER (DEEP SYSTEMS) */}
          <button
            type="button"
            onClick={() => setSelectedTrack('master')}
            className={`p-4 rounded-2xl text-left border transition-all ${
              selectedTrack === 'master'
                ? 'bg-purple-950/50 border-purple-500 shadow-lg shadow-purple-500/20 scale-102 ring-1 ring-purple-400'
                : 'bg-gray-950/70 border-gray-800 hover:border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">👑</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                ELITE TIER
              </span>
            </div>
            <div className="font-extrabold text-sm text-white mb-1">
              Master Level Track
            </div>
            <p className="text-[11px] text-gray-400 leading-snug">
              Engine internals, zero-trust security hardening, scale & production capstone.
            </p>
          </button>

          {/* TRACK 4: ALL 5 STAGES */}
          <button
            type="button"
            onClick={() => setSelectedTrack('all')}
            className={`p-4 rounded-2xl text-left border transition-all ${
              selectedTrack === 'all'
                ? 'bg-indigo-950/50 border-indigo-500 shadow-lg shadow-indigo-500/20 scale-102 ring-1 ring-indigo-400'
                : 'bg-gray-950/70 border-gray-800 hover:border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">🌟</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                FULL 5 LEVELS
              </span>
            </div>
            <div className="font-extrabold text-sm text-white mb-1">
              All Stages Journey
            </div>
            <p className="text-[11px] text-gray-400 leading-snug">
              Complete end-to-end curriculum from Basic to Advanced Masterclass.
            </p>
          </button>
        </div>

        {/* Selected Track Banner Notification */}
        <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>
              {selectedTrack === 'basic' && "Now displaying: Basic Foundations Track (from starting to ending). Choose any sub-topic below to generate its creative AI video!"}
              {selectedTrack === 'main_body' && "Now displaying: Main Body Track. Master core architecture and data flow with creative AI-generated videos!"}
              {selectedTrack === 'master' && "Now displaying: Master Level Track. Explore engine internals, security and production capstone with creative AI-generated videos!"}
              {selectedTrack === 'all' && "Now displaying: Full 5-Stage Roadmap from Basic to Advanced. Select any topic to generate AI video."}
            </span>
          </div>

          <span className="text-indigo-400 font-semibold shrink-0 hidden sm:inline">
            {displayedLevels?.length || 0} Stage{(displayedLevels?.length || 0) === 1 ? '' : 's'} Active
          </span>
        </div>
      </div>

      {/* Progressive Roadmap Levels */}
      <div className="space-y-8 relative">
        {/* Timeline spine line */}
        <div className="hidden md:block absolute left-8 top-10 bottom-10 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 opacity-30" />

        {displayedLevels?.map((level) => {
          const isCollapsed = collapsedLevels[level.levelNumber] || false;
          const levelCompletedLessons = level.modules.reduce(
            (acc, m) => acc + m.lessons.filter((l) => completedSet.has(l.id)).length,
            0
          );
          const levelTotalLessons = level.modules.reduce((acc, m) => acc + m.lessons.length, 0);
          const isLevelComplete = levelTotalLessons > 0 && levelCompletedLessons === levelTotalLessons;

          // Stage colors
          const stageColors: Record<number, { bg: string; text: string; border: string }> = {
            1: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
            2: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
            3: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
            4: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
            5: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
          };

          const color = stageColors[level.levelNumber] || stageColors[1];

          return (
            <div
              key={level.levelNumber}
              className="relative pl-0 md:pl-20 transition-all"
            >
              {/* Level node marker badge on timeline */}
              <div className="hidden md:flex absolute left-4 top-5 w-8 h-8 rounded-full bg-gray-900 border-2 border-indigo-500 text-indigo-300 items-center justify-center font-black text-xs shadow-md shadow-indigo-500/30 z-10">
                {level.levelNumber}
              </div>

              {/* Level Container Card */}
              <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-6 shadow-xl backdrop-blur-md">
                {/* Level Title Bar */}
                <div
                  onClick={() => toggleLevelCollapse(level.levelNumber)}
                  className="flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${color.bg} ${color.text} ${color.border}`}>
                        {level.badge}
                      </span>
                      {isLevelComplete && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center gap-1 border border-emerald-500/30">
                          <Check className="w-3 h-3" />
                          <span>Stage Mastered</span>
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                      {level.levelTitle}
                    </h2>

                    <p className="text-xs text-gray-400 leading-relaxed">
                      {level.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-gray-500 hidden sm:inline">
                      {levelCompletedLessons}/{levelTotalLessons} done
                    </span>
                    <button className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors">
                      {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Level Modules & Lessons */}
                {!isCollapsed && (
                  <div className="mt-6 space-y-6 pt-6 border-t border-gray-800/80">
                    {level.modules.map((module) => (
                      <div key={module.id} className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-gray-850">
                          <div className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                            <span>{module.title}</span>
                          </div>
                          <span className="text-[11px] text-gray-500">{module.estimatedTime}</span>
                        </div>

                        {/* Module sub-topics overview pill bar */}
                        {module.subTopicsSummary && module.subTopicsSummary.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 my-1">
                            {module.subTopicsSummary.map((st, i) => (
                              <span
                                key={i}
                                className="text-[10px] bg-gray-950/60 text-gray-400 px-2 py-0.5 rounded border border-gray-800"
                              >
                                {st}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Lessons Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          {module.lessons.map((lesson) => {
                            const isDone = completedSet.has(lesson.id);

                            return (
                              <div
                                key={lesson.id}
                                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                                  isDone
                                    ? 'bg-gray-950/60 border-emerald-500/30'
                                    : 'bg-gray-950/90 border-gray-800 hover:border-indigo-500/50 hover:bg-gray-900/90'
                                }`}
                              >
                                <div>
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                      <span className="p-1 rounded bg-gray-900 border border-gray-800">
                                        {getVisualIcon(lesson.visualType)}
                                      </span>
                                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                        {lesson.visualType?.replace('_', ' ')}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-gray-500" />
                                        {lesson.duration}
                                      </span>

                                      {/* Completion checkbox button */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onToggleLessonCompletion(lesson.id, isDone);
                                        }}
                                        className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                                          isDone
                                            ? 'bg-emerald-500 text-gray-950'
                                            : 'border border-gray-700 text-transparent hover:border-gray-500'
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

                                  {/* Sub-topics sequence from start to end */}
                                  {lesson.subTopics && lesson.subTopics.length > 0 && (
                                    <div className="mb-3 p-2.5 rounded-xl bg-gray-900/90 border border-gray-800/80">
                                      <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <Sparkles className="w-3 h-3 text-amber-300" />
                                        <span>Sub-Topics (Starting to Ending):</span>
                                      </div>
                                      <ul className="space-y-1 text-[11px] text-gray-300">
                                        {lesson.subTopics.map((sub, sIdx) => (
                                          <li key={sIdx} className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                                            <span className="truncate">{sub}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Key concept pills */}
                                  <div className="flex flex-wrap gap-1.5 mb-4">
                                    {lesson.keyConcepts?.slice(0, 3).map((concept, idx) => (
                                      <span
                                        key={idx}
                                        className="text-[10px] bg-gray-900 text-gray-400 px-2 py-0.5 rounded-md border border-gray-800"
                                      >
                                        {concept}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Primary Action: Launch Creative AI Video */}
                                <button
                                  onClick={() => onSelectLesson(lesson, level.levelNumber)}
                                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all hover:scale-101"
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
          );
        })}
      </div>
    </div>
  );
};
