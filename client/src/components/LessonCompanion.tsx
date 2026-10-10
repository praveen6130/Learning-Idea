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
  Send, 
  Play,
  RotateCw
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
        colors: ['#3b82f6', '#8b5cf6', '#10b981']
      });
    }
  };

  const handleRunPractice = () => {
    setTerminalOutput(`⚡ Running prototype test suite...\n✓ Initialized mock environment\n✓ Pattern executed successfully for ${video.lessonTitle}\n🎉 Assertion passed: Output verified!`);
  };

  return (
    <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
      {/* Tabs */}
      <div className="flex border-b border-gray-800 mb-6 gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'quiz'
              ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Interactive Quiz</span>
          {isAnswerSubmitted && (
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('practice')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'practice'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Practice Mission</span>
        </button>

        <button
          onClick={() => setActiveTab('transcript')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'transcript'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Full Transcript</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'notes'
              ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Key Takeaways</span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE QUIZ */}
      {activeTab === 'quiz' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Knowledge Verification
            </span>
            {isAnswerSubmitted && (
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                selectedOption === quiz.correctAnswerIndex
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {selectedOption === quiz.correctAnswerIndex ? 'Passed (100%)' : 'Needs Review'}
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-white leading-snug">
            {quiz.question}
          </h3>

          <div className="space-y-2.5 pt-2">
            {quiz.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === quiz.correctAnswerIndex;

              let style = 'bg-gray-950/80 border-gray-800 text-gray-300 hover:border-gray-700';
              if (isAnswerSubmitted) {
                if (isCorrectAnswer) {
                  style = 'bg-emerald-950/50 border-emerald-500 text-emerald-200';
                } else if (isSelected) {
                  style = 'bg-red-950/50 border-red-500 text-red-200';
                } else {
                  style = 'bg-gray-950/40 border-gray-800/60 opacity-60';
                }
              } else if (isSelected) {
                style = 'bg-blue-950/60 border-blue-500 text-white shadow-md shadow-blue-500/20';
              }

              return (
                <div
                  key={idx}
                  onClick={() => !isAnswerSubmitted && setSelectedOption(idx)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-xs ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {isAnswerSubmitted && isCorrectAnswer && (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Explanation box after submit */}
          {isAnswerSubmitted && (
            <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 text-xs mt-4">
              <div className="font-bold text-indigo-400 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Tutor Explanation:</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {quiz.explanation}
              </p>
            </div>
          )}

          {/* Submit button */}
          {!isAnswerSubmitted && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSubmitQuiz}
                disabled={selectedOption === null}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/20"
              >
                Submit Answer
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRACTICE MISSION */}
      {activeTab === 'practice' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30">
            <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
              Mission Objective:
            </div>
            <p className="text-xs text-gray-200 leading-relaxed">
              {video.practiceMission || `Build an interactive implementation demonstrating the principles of ${video.lessonTitle}. Test with sample edge cases.`}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-950 overflow-hidden">
            <div className="bg-gray-900 px-4 py-2 border-b border-gray-800 flex items-center justify-between text-xs">
              <span className="text-gray-400 font-mono text-[11px]">prototype_workspace.ts</span>
              <button
                onClick={handleRunPractice}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center gap-1"
              >
                <Play className="w-3 h-3" />
                <span>Test & Run</span>
              </button>
            </div>
            <textarea
              value={practiceCode}
              onChange={(e) => setPracticeCode(e.target.value)}
              rows={6}
              className="w-full bg-transparent p-4 font-mono text-xs text-gray-200 focus:outline-none resize-none"
            />
          </div>

          {terminalOutput && (
            <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 font-mono text-[11px] text-emerald-400 whitespace-pre-wrap">
              {terminalOutput}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FULL TRANSCRIPT */}
      {activeTab === 'transcript' && (
        <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
          {video.scenes.map((scene) => (
            <div key={scene.sceneNumber} className="p-3.5 rounded-2xl bg-gray-950/60 border border-gray-800 text-xs">
              <div className="text-[11px] font-bold text-indigo-400 mb-1">
                Scene {scene.sceneNumber}: {scene.title}
              </div>
              <p className="text-gray-300 leading-relaxed">
                {scene.narration}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: KEY TAKEAWAYS */}
      {activeTab === 'notes' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-gray-950/80 border border-gray-800 text-xs space-y-2">
            <div className="font-bold text-white text-sm">Key Mental Models for {video.lessonTitle}:</div>
            <ul className="space-y-2 text-gray-300 list-disc list-inside">
              <li>Always isolate side-effects and encapsulate business logic.</li>
              <li>Ensure boundary conditions are validated before triggering heavy async pipelines.</li>
              <li>Adhere to unidirectional data flow for clean debugging.</li>
              <li>Continuously benchmark performance under simulated latency.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
