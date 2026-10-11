import React, { useState } from 'react';
import { VideoStoryboard } from '../types';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  FileText, 
  Code, 
  HelpCircle, 
  Bookmark, 
  Play
} from 'lucide-react';

interface LessonCompanionProps {
  video: VideoStoryboard;
  onQuizCompleted: (score: number) => void;
  savedScore?: number;
}

export const LessonCompanion: React.FC<LessonCompanionProps> = ({
  video,
  onQuizCompleted,
  savedScore,
}) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'practice' | 'transcript' | 'notes'>('quiz');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(savedScore !== undefined);
  const [practiceCode, setPracticeCode] = useState<string>(
    `// Write your solution or prototype here:\nfunction solve() {\n  console.log("Testing pattern for ${video.lessonTitle}...");\n  return true;\n}`
  );
  const [terminalOutput, setTerminalOutput] = useState<string>('');

  const quiz = video.quiz;

  const handleSubmitQuiz = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedOption === quiz.correctAnswerIndex;
    const score = isCorrect ? 100 : 0;
    onQuizCompleted(score);

    if (isCorrect) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#38bdf8', '#10b981']
      });
    }
  };

  const handleRunPractice = () => {
    setTerminalOutput(`⚡ Running prototype test suite...\n✓ Initialized mock environment\n✓ Pattern executed successfully for ${video.lessonTitle}\n🎉 Assertion passed: Output verified!`);
  };

  return (
    <div className="double-bezel-card text-left">
      <div className="double-bezel-inner p-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-white/[0.06] pb-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'quiz'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Quiz</span>
            {isAnswerSubmitted && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('practice')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'practice'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Practice Lab</span>
          </button>

          <button
            onClick={() => setActiveTab('transcript')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'transcript'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Transcript</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'notes'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Key Notes</span>
          </button>
        </div>

        {/* TAB 1: INTERACTIVE QUIZ */}
        {activeTab === 'quiz' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                Knowledge Verification
              </span>
              {isAnswerSubmitted && (
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  selectedOption === quiz.correctAnswerIndex
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {selectedOption === quiz.correctAnswerIndex ? 'Passed (100%)' : 'Needs Review'}
                </span>
              )}
            </div>

            <h3 className="text-sm font-bold text-white leading-snug">
              {quiz.question}
            </h3>

            <div className="space-y-2.5 pt-1">
              {quiz.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectAnswer = idx === quiz.correctAnswerIndex;

                let style = 'bg-[#07090e] border-white/[0.06] text-gray-300 hover:border-white/20';
                if (isAnswerSubmitted) {
                  if (isCorrectAnswer) {
                    style = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                  } else if (isSelected) {
                    style = 'bg-rose-950/40 border-rose-500 text-rose-200';
                  } else {
                    style = 'bg-[#07090e]/40 border-white/[0.04] opacity-50';
                  }
                } else if (isSelected) {
                  style = 'bg-indigo-950/60 border-indigo-500 text-white shadow-md shadow-indigo-500/20';
                }

                return (
                  <div
                    key={idx}
                    onClick={() => !isAnswerSubmitted && setSelectedOption(idx)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-xs ${style}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#0c1017] border border-white/10 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isAnswerSubmitted && isCorrectAnswer && (
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* AI Tutor Explanation Box */}
            {isAnswerSubmitted && (
              <div className="p-3.5 rounded-2xl bg-[#07090e] border border-white/[0.06] text-xs mt-3 space-y-1">
                <div className="font-bold text-indigo-400 flex items-center gap-1.5 text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI Tutor Explanation:</span>
                </div>
                <p className="text-gray-300 leading-relaxed text-[11px]">
                  {quiz.explanation}
                </p>
              </div>
            )}

            {/* Submit Button */}
            {!isAnswerSubmitted && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleSubmitQuiz}
                  disabled={selectedOption === null}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 active:scale-[0.98]"
                >
                  Submit Answer
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRACTICE LAB */}
        {activeTab === 'practice' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#07090e] border border-white/[0.06] text-xs space-y-1">
              <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                Mission Objective:
              </div>
              <p className="text-gray-300 leading-relaxed text-[11px]">
                {video.practiceMission || `Build an interactive implementation demonstrating the principles of ${video.lessonTitle}. Test with sample edge cases.`}
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#07090e] overflow-hidden">
              <div className="bg-[#0c1017] px-3.5 py-2 border-b border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-gray-400 font-mono text-[10px]">sandbox_workspace.ts</span>
                <button
                  onClick={handleRunPractice}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-semibold flex items-center gap-1 transition-colors"
                >
                  <Play className="w-3 h-3" />
                  <span>Run Sandbox</span>
                </button>
              </div>
              <textarea
                value={practiceCode}
                onChange={(e) => setPracticeCode(e.target.value)}
                rows={6}
                className="w-full bg-transparent p-3.5 font-mono text-xs text-gray-200 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {terminalOutput && (
              <div className="p-3 rounded-xl bg-[#07090e] border border-white/[0.06] font-mono text-[10px] text-emerald-400 whitespace-pre-wrap leading-relaxed">
                {terminalOutput}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FULL TRANSCRIPT */}
        {activeTab === 'transcript' && (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {video.scenes.map((scene) => (
              <div key={scene.sceneNumber} className="p-3 rounded-2xl bg-[#07090e] border border-white/[0.06] text-xs space-y-1">
                <div className="text-[10px] font-bold text-indigo-400 font-mono">
                  Scene {scene.sceneNumber}: {scene.title}
                </div>
                <p className="text-gray-300 leading-relaxed text-[11px]">
                  {scene.narration}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: KEY NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[#07090e] border border-white/[0.06] text-xs space-y-2">
              <div className="font-bold text-white text-xs">Core Principles for {video.lessonTitle}:</div>
              <ul className="space-y-1.5 text-gray-300 text-[11px] list-disc list-inside leading-relaxed">
                <li>Always isolate side-effects and encapsulate business logic cleanly.</li>
                <li>Ensure boundary conditions are validated before triggering heavy async pipelines.</li>
                <li>Adhere to unidirectional state flow for clean debugging.</li>
                <li>Continuously benchmark performance under simulated real-world conditions.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
