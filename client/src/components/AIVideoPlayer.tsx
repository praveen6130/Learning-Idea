import React, { useState, useEffect, useRef } from 'react';
import { VideoStoryboard, VideoScene, Subtitle } from '../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Cpu, 
  Code, 
  Terminal, 
  Award, 
  MessageSquareQuote,
  ChevronRight,
  ChevronLeft,
  X,
  Mic,
  Sliders
} from 'lucide-react';

interface AIVideoPlayerProps {
  video: VideoStoryboard;
  onClose: () => void;
  onLessonComplete: () => void;
  isCompleted?: boolean;
}

export const AIVideoPlayer: React.FC<AIVideoPlayerProps> = ({
  video,
  onClose,
  onLessonComplete,
  isCompleted = false,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [activeVoiceName, setActiveVoiceName] = useState<string>('Nova (Warm AI Educator)');

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const totalDuration = video.durationSeconds || 150;

  // Identify current scene based on currentTime
  let accumulatedTime = 0;
  let activeSceneIndex = 0;

  for (let i = 0; i < video.scenes.length; i++) {
    const dur = video.scenes[i].durationSeconds || 30;
    if (currentTime >= accumulatedTime && currentTime < accumulatedTime + dur) {
      activeSceneIndex = i;
      break;
    }
    accumulatedTime += dur;
    if (i === video.scenes.length - 1) {
      activeSceneIndex = video.scenes.length - 1;
    }
  }

  const activeScene = video.scenes[activeSceneIndex] || video.scenes[0];

  // Identify active subtitle
  const activeSubtitle = video.subtitles?.find(
    (s) => currentTime >= s.startTime && currentTime <= s.endTime
  );

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.1 * playbackSpeed;
          if (next >= totalDuration) {
            setIsPlaying(false);
            onLessonComplete();
            return totalDuration;
          }
          return Math.round(next * 10) / 10;
        });
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, totalDuration]);

  // Web Speech API synthesis for narration
  const speakCurrentScene = (scene: VideoScene) => {
    if (!('speechSynthesis' in window) || isMuted) return;

    window.speechSynthesis.cancel();

    if (!scene.narration) return;

    const utterance = new SpeechSynthesisUtterance(scene.narration);
    utterance.rate = playbackSpeed;
    utterance.pitch = activeVoiceName.includes('Orion') ? 0.9 : 1.05;

    // Pick suitable voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const preferred = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
      if (preferred) utterance.voice = preferred;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Sync speech when scene changes or play state toggles
  useEffect(() => {
    if (isPlaying && !isMuted) {
      speakCurrentScene(activeScene);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying, activeSceneIndex, isMuted, playbackSpeed]);

  const togglePlay = () => {
    if (currentTime >= totalDuration) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (isPlaying && !isMuted) {
      // Find scene for new time
      let acc = 0;
      for (const sc of video.scenes) {
        if (newTime >= acc && newTime < acc + sc.durationSeconds) {
          speakCurrentScene(sc);
          break;
        }
        acc += sc.durationSeconds;
      }
    }
  };

  const handleJumpToScene = (index: number) => {
    let t = 0;
    for (let i = 0; i < index; i++) {
      t += video.scenes[i].durationSeconds;
    }
    handleSeek(t);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  };

  // Video recording / export simulation
  const handleDownloadVideo = () => {
    setIsDownloading(true);
    setTimeout(() => {
      // Generate WebM dummy or text package for download
      const content = `AI Video Lesson Export: ${video.title}
Course: ${video.topic}
Duration: ${video.durationFormatted}
Scenes: ${video.scenes.length}
Generated via CognitiveForge AI Platform

Narration Script:
${video.scenes.map((s) => `[Scene ${s.sceneNumber}: ${s.title}]\n${s.narration}`).join('\n\n')}
`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${video.title.replace(/[^a-zA-Z0-9]/g, '_')}_AI_Video_Script.txt`;
      link.click();
      URL.revokeObjectURL(url);
      setIsDownloading(false);
    }, 1200);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className={`bg-gray-950 rounded-3xl overflow-hidden border border-gray-800 shadow-2xl flex flex-col relative ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full'
      }`}
    >
      {/* Video Player Header Bar */}
      <div className="bg-gray-900/90 border-b border-gray-800 px-5 py-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white animate-spin" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white truncate max-w-xs sm:max-w-md">
                {video.title}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 shrink-0">
                AI GENERATED VIDEO
              </span>
            </div>
            <div className="text-[11px] text-gray-400">
              Stage {video.levelNumber} • Scene {activeSceneIndex + 1} of {video.scenes.length}: {activeScene.title}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Narrator voice indicator */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-gray-950 border border-gray-800 text-[11px] text-gray-300">
            <Mic className={`w-3.5 h-3.5 ${isSpeaking ? 'text-emerald-400 animate-pulse' : 'text-gray-500'}`} />
            <span className="truncate max-w-[120px]">{activeVoiceName.split(' ')[0]} Voice</span>
          </div>

          <button
            onClick={handleDownloadVideo}
            disabled={isDownloading}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-750 text-gray-300 hover:text-white transition-colors text-xs flex items-center gap-1.5"
            title="Download Video & Lesson Package"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isDownloading ? 'Exporting...' : 'Export'}</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-800 hover:bg-red-900/40 text-gray-400 hover:text-red-300 transition-colors"
            title="Close video"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* THE DYNAMIC AI VIDEO STAGE (VISUAL CANVAS) */}
      <div className="relative w-full aspect-video bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 flex flex-col items-center justify-center p-6 overflow-hidden select-none">
        {/* Animated background ambient grids */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(99, 102, 241, 0.4) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(168, 85, 247, 0.4) 2%, transparent 0%)`,
            backgroundSize: '100px 100px'
          }}
        />

        {/* AI Tutor HUD Waveform (Animated when speaking) */}
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-gray-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-800 z-10">
          <div className="flex items-center gap-1 h-3">
            <span className={`w-1 rounded-full bg-indigo-400 transition-all ${isSpeaking ? 'h-3 animate-bounce' : 'h-1'}`} />
            <span className={`w-1 rounded-full bg-blue-400 transition-all ${isSpeaking ? 'h-4 animate-bounce delay-75' : 'h-1'}`} />
            <span className={`w-1 rounded-full bg-purple-400 transition-all ${isSpeaking ? 'h-2 animate-bounce delay-150' : 'h-1'}`} />
            <span className={`w-1 rounded-full bg-pink-400 transition-all ${isSpeaking ? 'h-3.5 animate-bounce delay-100' : 'h-1'}`} />
          </div>
          <span className="text-[10px] font-semibold text-gray-300">
            {isSpeaking ? 'AI Tutor Narrating' : 'Narrator Ready'}
          </span>
        </div>

        {/* =========================================================================
            SCENE 1: HOOK & INTRODUCTION
        ========================================================================== */}
        {activeScene.type === 'hook' && (
          <div className="max-w-2xl w-full text-center space-y-4 animate-in fade-in zoom-in-95 duration-500 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{activeScene.visual.badgeText || `Stage ${video.levelNumber} Masterclass`}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
              {activeScene.visual.headline}
            </h2>

            <p className="text-xs sm:text-sm text-indigo-200/80 max-w-lg mx-auto font-medium">
              {activeScene.visual.subheadline}
            </p>

            {/* Creative Real-World Mental Model / Metaphor */}
            {activeScene.visual.metaphor && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-purple-950/70 to-blue-950/80 border border-indigo-500/40 text-left backdrop-blur-md shadow-xl max-w-lg mx-auto">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold mb-1">
                  <span className="text-sm">💡</span>
                  <span className="uppercase tracking-wider text-[10px] text-amber-300 font-bold">Creative Analogy:</span>
                  <span className="text-white font-semibold truncate">{activeScene.visual.metaphor.title}</span>
                </div>
                <p className="text-xs text-indigo-100/90 leading-relaxed font-normal">
                  {activeScene.visual.metaphor.analogy}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4">
              {activeScene.visual.points?.map((pt, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-gray-900/80 border border-gray-800/90 text-left backdrop-blur-sm shadow-md"
                >
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold mb-1.5">
                    0{i + 1}
                  </div>
                  <div className="text-xs font-semibold text-gray-200">{pt}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            SCENE 2: SYSTEM ARCHITECTURE & DIAGRAM
        ========================================================================== */}
        {activeScene.type === 'diagram' && (
          <div className="max-w-3xl w-full text-center space-y-4 animate-in fade-in zoom-in-95 duration-500 z-10">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>{activeScene.visual.headline}</span>
            </div>

            <p className="text-xs text-gray-400 mb-2">{activeScene.visual.subheadline}</p>

            {/* Architecture Node Visualizer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {activeScene.visual.diagramNodes?.map((node, i) => {
                const isActive = (currentTime % 4) >= i;

                return (
                  <div
                    key={node.id}
                    className={`p-3.5 rounded-2xl border transition-all text-left relative overflow-hidden ${
                      isActive
                        ? 'bg-blue-950/70 border-blue-400 shadow-lg shadow-blue-500/20 scale-102'
                        : 'bg-gray-900/60 border-gray-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-gray-400">Step 0{i + 1}</span>
                      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-blue-400 animate-ping' : 'bg-gray-700'}`} />
                    </div>

                    <div className="font-bold text-xs text-white mb-1">{node.label}</div>
                    <div className="text-[11px] text-gray-400 leading-tight">{node.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            SCENE 3: LIVE CODE & IMPLEMENTATION
        ========================================================================== */}
        {activeScene.type === 'code' && (
          <div className="max-w-2xl w-full animate-in fade-in zoom-in-95 duration-500 z-10">
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Code className="w-4 h-4" />
                <span>{activeScene.visual.headline}</span>
              </div>
              <span className="text-[11px] text-gray-500">Live Syntax Execution</span>
            </div>

            {/* Simulated IDE Window */}
            <div className="bg-gray-950 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden font-mono text-xs">
              {/* Window controls header */}
              <div className="bg-gray-900 px-4 py-2 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[10px] text-gray-400">pipeline_engine.ts</span>
                <span className="text-[10px] text-emerald-400 font-bold">READY</span>
              </div>

              {/* Code editor body */}
              <div className="p-4 text-gray-300 max-h-48 overflow-y-auto leading-relaxed text-[11px] sm:text-xs">
                <pre className="whitespace-pre-wrap">{activeScene.visual.code || '// Execution active'}</pre>
              </div>

              {/* Mini Terminal Output */}
              <div className="bg-gray-900/90 border-t border-gray-800 px-3 py-1.5 flex items-center gap-2 text-[10px] text-gray-400">
                <Terminal className="w-3 h-3 text-emerald-400" />
                <span>Status: Compiled successfully • 0 errors • Execution time: 14ms</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCENE 4: PRO-TIPS & PITFALLS
        ========================================================================== */}
        {activeScene.type === 'tips_and_pitfalls' && (
          <div className="max-w-2xl w-full space-y-3 animate-in fade-in zoom-in-95 duration-500 z-10">
            <div className="text-center mb-2">
              <h3 className="text-lg sm:text-xl font-bold text-white">{activeScene.visual.headline}</h3>
              <p className="text-xs text-gray-400">{activeScene.visual.subheadline}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Recommended Patterns (DO) */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 shadow-md">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2.5 uppercase tracking-wider">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Best Practices (DO)</span>
                </div>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  {activeScene.visual.doList?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Critical Traps (DON'T) */}
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 shadow-md">
                <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5 mb-2.5 uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Costly Traps (AVOID)</span>
                </div>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  {activeScene.visual.dontList?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold shrink-0">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCENE 5: RECAP & CELEBRATION
        ========================================================================== */}
        {activeScene.type === 'recap_and_quiz' && (
          <div className="max-w-xl w-full text-center space-y-4 animate-in fade-in zoom-in-95 duration-500 z-10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/30 text-gray-950">
              <Award className="w-9 h-9" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {activeScene.visual.headline || 'Skill Stage Accomplished! 🎉'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                You have mastered the foundations of {video.lessonTitle}. Take the quiz below to cement your knowledge!
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-900/90 border border-indigo-500/40 text-left">
              <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                Challenge Mission
              </div>
              <div className="text-xs text-gray-200 font-medium">
                {video.practiceMission || 'Solve the multiple choice quiz below to complete this milestone.'}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            REAL-TIME SYNCHRONIZED KARAOKE SUBTITLES
        ========================================================================== */}
        {showSubtitles && activeSubtitle && (
          <div className="absolute bottom-6 max-w-xl mx-auto px-4 py-2 rounded-2xl bg-gray-950/85 backdrop-blur-md border border-gray-700/80 shadow-2xl text-center z-20 pointer-events-none">
            <span className="text-xs sm:text-sm font-semibold text-yellow-300 drop-shadow">
              "{activeSubtitle.text}"
            </span>
          </div>
        )}
      </div>

      {/* TIMELINE SCRUBBER BAR */}
      <div className="bg-gray-900/90 px-4 pt-3 pb-1 border-t border-gray-800">
        <div className="relative flex items-center group">
          <input
            type="range"
            min={0}
            max={totalDuration}
            step={0.1}
            value={currentTime}
            onChange={(e) => handleSeek(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:h-2 transition-all"
          />
        </div>

        {/* Scene Jump Pills */}
        <div className="flex items-center justify-between gap-1 mt-2 overflow-x-auto pb-1">
          {video.scenes.map((scene, idx) => (
            <button
              key={scene.sceneNumber}
              onClick={() => handleJumpToScene(idx)}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeSceneIndex === idx
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <span>{idx + 1}. {scene.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* PLAYER CONTROLS FOOTER */}
      <div className="bg-gray-900 px-4 py-3 flex items-center justify-between text-xs border-t border-gray-800/80">
        <div className="flex items-center gap-3">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-transform active:scale-95"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          {/* Replay Button */}
          <button
            onClick={() => handleSeek(0)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            title="Replay from start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Time display */}
          <span className="text-gray-400 font-mono text-[11px]">
            {formatTime(currentTime)} / {formatTime(totalDuration)}
          </span>
        </div>

        {/* Center / Right Player Options */}
        <div className="flex items-center gap-3">
          {/* Voice Switcher */}
          <select
            value={activeVoiceName}
            onChange={(e) => setActiveVoiceName(e.target.value)}
            className="bg-gray-950 border border-gray-800 rounded-lg px-2 py-1 text-[11px] text-gray-300 focus:outline-none hidden sm:block"
          >
            <option value="Nova (Warm AI Educator)">Voice: Nova (Educator)</option>
            <option value="Orion (Deep Tech Lead)">Voice: Orion (Tech Lead)</option>
            <option value="Echo (Analytical Guide)">Voice: Echo (Analytical)</option>
          </select>

          {/* Playback speed */}
          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
            className="bg-gray-950 border border-gray-800 rounded-lg px-2 py-1 text-[11px] text-gray-300 focus:outline-none"
          >
            <option value="0.75">0.75x</option>
            <option value="1">1.0x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2.0x</option>
          </select>

          {/* CC Toggle */}
          <button
            onClick={() => setShowSubtitles(!showSubtitles)}
            className={`px-2 py-1 rounded text-[11px] font-bold border transition-colors ${
              showSubtitles
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                : 'text-gray-500 border-gray-800'
            }`}
          >
            CC
          </button>

          {/* Mute/Unmute */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded text-gray-400 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded text-gray-400 hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
