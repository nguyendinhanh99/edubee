'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ALL_QUESTIONS, Question, LeaderboardEntry } from './questions';

export default function ObstacleGamePage() {
  const [step, setStep] = useState<'select_grade' | 'select_difficulty' | 'playing' | 'game_over' | 'victory' | 'leaderboard'>('select_grade');
  const [selectedGradeGroup, setSelectedGradeGroup] = useState<'preschool' | 'grade1' | 'grade2' | 'grade3' | 'grade4' | 'grade5' | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const [playerName, setPlayerName] = useState('');
  const [hasSaved, setHasSaved] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const savedScores = localStorage.getItem('educat_obstacle_leaderboard');
    if (savedScores) {
      try {
        setLeaderboard(JSON.parse(savedScores));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Hàm đọc văn bản (Hỗ trợ đọc kèm đáp án nếu là Mầm non)
  const speakText = useCallback((text: string, options?: string[]) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    let fullTextToSpeak = text;

    // Nếu là khối Mầm non và có truyền danh sách các đáp án, tiến hành ghép thêm nội dung đọc A, B, C, D
    if (selectedGradeGroup === 'preschool' && options && options.length > 0) {
      const labels = ['Đáp án A:', 'Đáp án B:', 'Đáp án C:', 'Đáp án D:'];
      const optionsText = options
        .map((opt, idx) => `${labels[idx] || ''} ${opt}`)
        .join('. ');
      fullTextToSpeak = `${text}. ${optionsText}`;
    }

    const utterance = new SpeechSynthesisUtterance(fullTextToSpeak);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.9; // Đọc chậm hơn một chút cho các bé mầm non dễ nghe

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [selectedGradeGroup]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const startGameSession = (gradeGroup: 'preschool' | 'grade1' | 'grade2' | 'grade3' | 'grade4' | 'grade5', diff: 'easy' | 'medium' | 'hard') => {
    let filtered = ALL_QUESTIONS.filter(q => q.gradeGroup === gradeGroup && q.difficulty === diff);
    if (filtered.length < 25) {
      filtered = ALL_QUESTIONS.filter(q => q.gradeGroup === gradeGroup);
    }
    let pool = [...filtered];
    while (pool.length < 25 && pool.length > 0) {
      pool = [...pool, ...filtered];
    }
    if (pool.length === 0) {
      pool = [...ALL_QUESTIONS];
      while (pool.length < 25) {
        pool = [...pool, ...ALL_QUESTIONS];
      }
    }

    const randomizedQuestions = shuffleArray(pool).slice(0, 25).map((q) => {
      const correctOptionText = q.options[q.correct];
      const shuffledOptions = shuffleArray(q.options);
      const newCorrectIndex = shuffledOptions.indexOf(correctOptionText);

      return {
        ...q,
        options: shuffledOptions,
        correct: newCorrectIndex,
      };
    });

    setActiveQuestions(randomizedQuestions);
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setXp(0);
    setCoins(0);
    setCombo(0);
    setLives(3);
    setTimeLeft(diff === 'easy' ? 30 : diff === 'medium' ? 20 : 10);
    setHasSaved(false);
    setPlayerName('');
    setSelectedDifficulty(diff);
    setSelectedGradeGroup(gradeGroup);
    setStep('playing');

    if (randomizedQuestions[0]) {
      setTimeout(() => speakText(randomizedQuestions[0].question, randomizedQuestions[0].options), 500);
    }
  };

  const handleAnswer = useCallback((selectedIndex: number) => {
    if (feedback !== null) return;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    const currentQ = activeQuestions[currentIndex];
    if (!currentQ) return;

    const isCorrect = selectedIndex === currentQ.correct;

    if (isCorrect) {
      const earnedXp = 20 + combo * 5;
      const earnedCoins = 5 + combo * 2;
      setScore((prev) => prev + 100 + combo * 10);
      setCorrectCount((prev) => prev + 1);
      setXp((prev) => prev + earnedXp);
      setCoins((prev) => prev + earnedCoins);
      setCombo((prev) => prev + 1);
      setFeedback('correct');
    } else {
      setCombo(0);
      setScore((prev) => Math.max(0, prev - 30)); 
      setLives((prev) => Math.max(0, prev - 1));  
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      setLives((currentLives) => {
        if (currentLives <= 0) {
          setStep('game_over');
          return 0;
        }

        if (currentIndex + 1 < activeQuestions.length) {
          const nextIdx = currentIndex + 1;
          setCurrentIndex(nextIdx);
          setTimeLeft(selectedDifficulty === 'easy' ? 30 : selectedDifficulty === 'medium' ? 20 : 10);
          
          if (activeQuestions[nextIdx]) {
            speakText(activeQuestions[nextIdx].question, activeQuestions[nextIdx].options);
          }
        } else {
          setStep('victory');
        }
        return currentLives;
      });
    }, 1500);
  }, [activeQuestions, currentIndex, combo, feedback, selectedDifficulty, speakText]);

  useEffect(() => {
    if (step !== 'playing' || feedback !== null) return;

    if (timeLeft <= 0) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setStep('game_over');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, step, feedback]);

  const saveScoreToLeaderboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || hasSaved) return;

    const gradeMap = { 
      preschool: 'Mầm Non', 
      grade1: 'Lớp 1', 
      grade2: 'Lớp 2', 
      grade3: 'Lớp 3', 
      grade4: 'Lớp 4', 
      grade5: 'Lớp 5' 
    };
    const diffMap = { easy: 'Cơ bản', medium: 'Nâng cao', hard: 'Chuyên gia' };

    const newEntry: LeaderboardEntry = {
      name: playerName.trim(),
      score,
      gradeLabel: selectedGradeGroup ? gradeMap[selectedGradeGroup] : 'Khác',
      difficultyLabel: selectedDifficulty ? diffMap[selectedDifficulty] : 'Khác',
      date: new Date().toLocaleDateString('vi-VN')
    };

    const updatedList = [...leaderboard, newEntry].sort((a, b) => b.score - a.score).slice(0, 10);
    setLeaderboard(updatedList);
    localStorage.setItem('educat_obstacle_leaderboard', JSON.stringify(updatedList));
    setHasSaved(true);
  };

  const currentMilestone = Math.min(5, Math.floor(currentIndex / 5) + 1);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 py-8 px-4 flex flex-col items-center justify-between text-white selection:bg-yellow-400 selection:text-purple-950">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/15">
        
        {/* Header game */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 bg-yellow-400/20 rounded-2xl border border-yellow-400/30">🏃‍♂️</span>
            <div>
              <h1 className="text-base md:text-lg font-black tracking-wide bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-300 bg-clip-text text-transparent">
                Hành Trình Tri Thức
              </h1>
              <p className="text-[11px] text-gray-400 font-medium">Chinh phục 25 thử thách qua 5 chặng</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setStep('leaderboard')}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
            >
              <span>🏆</span> BXH
            </button>
            <Link 
              href="/games"
              className="bg-white/10 hover:bg-white/20 text-white/90 border border-white/10 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
            >
              <span>🏠</span> Thoát
            </Link>
          </div>
        </div>

        {/* 1. MÀN HÌNH CHỌN KHỐI LỚP */}
        {step === 'select_grade' && (
          <div className="text-center py-2">
            <h2 className="text-2xl font-black mb-2 text-yellow-300 tracking-wide">Chọn Khối Lớp Của Bạn</h2>
            <p className="text-sm text-gray-300 mb-6 font-normal">Lựa chọn cấp học phù hợp để bắt đầu hành trình chinh phục tri thức!</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-lg mx-auto mb-6">
              <button
                onClick={() => setStep('select_difficulty')}
                onMouseDown={() => setSelectedGradeGroup('preschool')}
                className="flex items-center p-4 bg-gradient-to-r from-pink-950/60 to-purple-950/60 hover:from-pink-900/80 hover:to-purple-900/80 border-2 border-pink-500/40 hover:border-pink-400 rounded-2xl text-left transition-all duration-300 transform hover:scale-[1.02] shadow-lg sm:col-span-2 group"
              >
                <span className="text-3xl mr-4 bg-pink-500/20 p-3 rounded-2xl group-hover:scale-110 transition-transform">🧸</span>
                <div>
                  <h3 className="font-bold text-base text-yellow-200">Mầm Non (4 - 6 tuổi)</h3>
                  <p className="text-xs text-gray-300">Làm quen hình khối, nhận biết thế giới và đếm số (Tự động đọc cả đáp án).</p>
                </div>
              </button>

              <button
                onClick={() => setStep('select_difficulty')}
                onMouseDown={() => setSelectedGradeGroup('grade1')}
                className="flex items-center p-3.5 bg-gradient-to-r from-blue-950/60 to-indigo-950/60 hover:from-blue-900/80 border border-blue-500/40 hover:border-blue-400 rounded-2xl text-left transition-all duration-300 transform hover:scale-[1.02] shadow group"
              >
                <span className="text-2xl mr-3 bg-blue-500/20 p-2.5 rounded-xl group-hover:scale-110 transition-transform">🎒</span>
                <div>
                  <h3 className="font-bold text-sm text-yellow-200">Lớp 1</h3>
                  <p className="text-[11px] text-gray-300">Phép tính cộng trừ & số đếm cơ bản.</p>
                </div>
              </button>

              <button
                onClick={() => setStep('select_difficulty')}
                onMouseDown={() => setSelectedGradeGroup('grade2')}
                className="flex items-center p-3.5 bg-gradient-to-r from-cyan-950/60 to-blue-950/60 hover:from-cyan-900/80 border border-cyan-500/40 hover:border-cyan-400 rounded-2xl text-left transition-all duration-300 transform hover:scale-[1.02] shadow group"
              >
                <span className="text-2xl mr-3 bg-cyan-500/20 p-2.5 rounded-xl group-hover:scale-110 transition-transform">📚</span>
                <div>
                  <h3 className="font-bold text-sm text-yellow-200">Lớp 2</h3>
                  <p className="text-[11px] text-gray-300">Mở rộng tư duy tính toán & tìm X.</p>
                </div>
              </button>

              <button
                onClick={() => setStep('select_difficulty')}
                onMouseDown={() => setSelectedGradeGroup('grade3')}
                className="flex items-center p-3.5 bg-gradient-to-r from-emerald-950/60 to-teal-950/60 hover:from-emerald-900/80 border border-emerald-500/40 hover:border-emerald-400 rounded-2xl text-left transition-all duration-300 transform hover:scale-[1.02] shadow group"
              >
                <span className="text-2xl mr-3 bg-emerald-500/20 p-2.5 rounded-xl group-hover:scale-110 transition-transform">✏️</span>
                <div>
                  <h3 className="font-bold text-sm text-yellow-200">Lớp 3</h3>
                  <p className="text-[11px] text-gray-300">Bảng nhân chia & đại lượng thời gian.</p>
                </div>
              </button>

              <button
                onClick={() => setStep('select_difficulty')}
                onMouseDown={() => setSelectedGradeGroup('grade4')}
                className="flex items-center p-3.5 bg-gradient-to-r from-amber-950/60 to-orange-950/60 hover:from-amber-900/80 border border-amber-500/40 hover:border-amber-400 rounded-2xl text-left transition-all duration-300 transform hover:scale-[1.02] shadow group"
              >
                <span className="text-2xl mr-3 bg-amber-500/20 p-2.5 rounded-xl group-hover:scale-110 transition-transform">📐</span>
                <div>
                  <h3 className="font-bold text-sm text-yellow-200">Lớp 4</h3>
                  <p className="text-[11px] text-gray-300">Hình học, diện tích & dấu hiệu chia hết.</p>
                </div>
              </button>

              <button
                onClick={() => setStep('select_difficulty')}
                onMouseDown={() => setSelectedGradeGroup('grade5')}
                className="flex items-center p-3.5 bg-gradient-to-r from-purple-950/60 to-pink-950/60 hover:from-purple-900/80 border border-purple-500/40 hover:border-purple-400 rounded-2xl text-left transition-all duration-300 transform hover:scale-[1.02] shadow sm:col-span-2 group"
              >
                <span className="text-2xl mr-3 bg-purple-500/20 p-2.5 rounded-xl group-hover:scale-110 transition-transform">🚀</span>
                <div>
                  <h3 className="font-bold text-sm text-yellow-200">Lớp 5</h3>
                  <p className="text-[11px] text-gray-300">Phân số nâng cao, phần trăm & thể tích hình khối.</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* 2. MÀN HÌNH CHỌN ĐỘ KHÓ (Cơ bản 30s, Nâng cao 20s, Chuyên gia 10s) */}
        {step === 'select_difficulty' && (
          <div className="text-center py-4">
            <h2 className="text-2xl font-black mb-2 text-yellow-300 tracking-wide">Chọn Mức Độ Thử Thách</h2>
            <p className="text-sm text-gray-300 mb-6 font-normal">Cấp độ càng cao, tốc độ phản xạ càng nhanh và phần thưởng càng lớn!</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
              <button
                onClick={() => startGameSession(selectedGradeGroup || 'preschool', 'easy')}
                className="p-5 bg-green-950/40 hover:bg-green-900/60 border-2 border-green-500/40 hover:border-green-400 rounded-2xl transition-all transform hover:-translate-y-1 shadow-lg text-center group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🌱</div>
                <h3 className="font-bold text-green-300 text-base mb-1">Cơ bản</h3>
                <p className="text-xs font-bold text-yellow-300 bg-green-500/20 py-1 px-2 rounded-lg mt-2">⏱️ 30 giây / câu</p>
              </button>

              <button
                onClick={() => startGameSession(selectedGradeGroup || 'preschool', 'medium')}
                className="p-5 bg-amber-950/40 hover:bg-amber-900/60 border-2 border-amber-500/40 hover:border-amber-400 rounded-2xl transition-all transform hover:-translate-y-1 shadow-lg text-center group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">⚡</div>
                <h3 className="font-bold text-amber-300 text-base mb-1">Nâng cao</h3>
                <p className="text-xs font-bold text-yellow-300 bg-amber-500/20 py-1 px-2 rounded-lg mt-2">⏱️ 20 giây / câu</p>
              </button>

              <button
                onClick={() => startGameSession(selectedGradeGroup || 'preschool', 'hard')}
                className="p-5 bg-rose-950/40 hover:bg-rose-900/60 border-2 border-rose-500/40 hover:border-rose-400 rounded-2xl transition-all transform hover:-translate-y-1 shadow-lg text-center group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🔥</div>
                <h3 className="font-bold text-rose-300 text-base mb-1">Chuyên gia</h3>
                <p className="text-xs font-bold text-yellow-300 bg-rose-500/20 py-1 px-2 rounded-lg mt-2">⏱️ 10 giây / câu</p>
              </button>
            </div>

            <button
              onClick={() => setStep('select_grade')}
              className="text-xs text-gray-400 hover:text-white underline font-medium transition"
            >
              ← Quay lại chọn khối lớp
            </button>
          </div>
        )}

        {/* 3. MÀN HÌNH CHƠI CHÍNH */}
        {step === 'playing' && activeQuestions[currentIndex] && (
          <div>
            {/* Status Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4 text-xs font-bold">
              <div className="bg-purple-950/50 p-2.5 rounded-2xl border border-purple-500/30 text-center shadow-inner">
                <span className="block text-purple-300/80 font-normal text-[11px] mb-0.5">Sinh lực</span>
                <span className="text-sm tracking-widest text-red-400">
                  {lives === 3 ? '❤️❤️❤️' : lives === 2 ? '❤️❤️🖤' : lives === 1 ? '❤️🖤🖤' : '🖤🖤🖤'}
                </span>
              </div>
              <div className="bg-amber-500/10 p-2.5 rounded-2xl border border-amber-500/30 text-center shadow-inner">
                <span className="block text-amber-300/80 font-normal text-[11px] mb-0.5">Điểm / XP</span>
                <span className="text-yellow-300 text-xs">🎯 {score} | ⭐ {xp}</span>
              </div>
              <div className="bg-rose-500/10 p-2.5 rounded-2xl border border-rose-500/30 text-center shadow-inner">
                <span className="block text-rose-300/80 font-normal text-[11px] mb-0.5">Chuỗi liên tiếp</span>
                <span className="text-rose-400">🔥 x{combo}</span>
              </div>
              <div className={`p-2.5 rounded-2xl border text-center shadow-inner transition-colors ${timeLeft <= 3 ? 'bg-red-500/20 text-red-300 border-red-500 animate-pulse' : 'bg-blue-950/50 border-blue-500/30 text-blue-300'}`}>
                <span className="block font-normal text-[11px] mb-0.5 opacity-80">Thời gian</span>
                <span>⏱️ {timeLeft}s</span>
              </div>
            </div>

            {/* THANH TIẾN TRÌNH DÙNG ICON CHO CÁC MỐC */}
            <div className="relative bg-gradient-to-r from-slate-900/90 via-indigo-950/90 to-slate-900/90 rounded-2xl p-4 mb-5 border border-white/15 shadow-inner">
              <div className="text-[11px] text-gray-300 font-semibold mb-3 flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Tiến độ: Câu {currentIndex + 1} / 25
                </span>
                <span className="text-yellow-300 font-bold bg-yellow-400/10 px-2.5 py-0.5 rounded-full border border-yellow-400/30">
                  🎯 Chặng {currentMilestone} / 5
                </span>
              </div>

              {/* Track 25 bước nhỏ và icon tại các mốc lớn */}
              <div className="relative h-12 bg-slate-900/80 rounded-xl flex items-center justify-between px-3 border border-slate-700/60 my-2">
                {Array.from({ length: 25 }).map((_, idx) => {
                  const isPassed = idx < currentIndex;
                  const isCurrent = idx === currentIndex;
                  const isCheckpoint = idx % 5 === 0;

                  if (isCheckpoint) {
                    const milestoneNum = (idx / 5) + 1;
                    const milestoneIcons = ['🌱', '⭐', '🚀', '💎', '🏆'];
                    const iconSymbol = milestoneIcons[milestoneNum - 1] || '🎯';

                    return (
                      <div key={idx} className="relative z-10 flex flex-col items-center">
                        <div 
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${
                            isPassed 
                              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/40' 
                              : isCurrent 
                              ? 'bg-yellow-400 text-purple-950 shadow-lg shadow-yellow-400/60 scale-125 ring-4 ring-yellow-400/20' 
                              : 'bg-slate-800 text-slate-300 border border-slate-600'
                          }`}
                        >
                          {isPassed ? '✓' : iconSymbol}
                        </div>
                        <span className="absolute -bottom-5 text-[9px] text-gray-400 font-semibold whitespace-nowrap">
                          {idx === 20 ? 'Đích' : `Mốc ${milestoneNum}`}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div 
                      key={idx} 
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        isPassed 
                          ? 'bg-emerald-400/80 shadow-sm shadow-emerald-400/40 scale-105' 
                          : isCurrent 
                          ? 'bg-yellow-400 scale-150 ring-4 ring-yellow-400/30' 
                          : 'bg-slate-700/80'
                      }`}
                    />
                  );
                })}

                {/* Nhân vật di chuyển mượt mà */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-out z-20 text-2xl -ml-3"
                  style={{
                    left: `${(currentIndex / 24) * 92 + 4}%`,
                  }}
                >
                  <span className={`inline-block filter drop-shadow-md ${feedback === 'wrong' ? 'shake text-red-400' : 'animate-bounce'}`}>
                    {feedback === 'wrong' ? '💥' : '🐱🏃‍♂️'}
                  </span>
                </div>
              </div>
              <div className="h-3"></div>
            </div>

            {/* KHUNG HIỂN THỊ CÂU HỎI & NÚT ĐỌC ÂM THANH */}
            <div className="relative bg-slate-900/60 backdrop-blur-md rounded-2xl p-5 mb-4 border border-white/10 shadow-lg text-center">
              <div className="absolute top-3 left-3 text-[10px] uppercase tracking-wider text-amber-300 font-bold bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-500/30">
                Thử thách {currentIndex + 1} / 25
              </div>

              <button
                onClick={() => speakText(activeQuestions[currentIndex]?.question, activeQuestions[currentIndex]?.options)}
                className={`absolute top-3 right-3 px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 shadow-sm ${
                  isSpeaking 
                    ? 'bg-yellow-400 text-purple-950 border-yellow-300 animate-pulse' 
                    : 'bg-white/10 hover:bg-white/20 text-yellow-300 border-white/20'
                }`}
                title="Nghe đọc câu hỏi và đáp án"
              >
                <span>{isSpeaking ? '🔊 Đang đọc...' : '🔊 Đọc câu hỏi & đáp án'}</span>
              </button>

              <div className="my-3 text-3xl">
                {feedback === 'correct' ? '✨ Tuyệt vời! Tiến bước' : feedback === 'wrong' ? '💥 Va chạm chướng ngại vật!' : '💡'}
              </div>

              <h2 className="text-base md:text-lg font-black text-yellow-100 mt-2 leading-relaxed px-4">
                {activeQuestions[currentIndex]?.question}
              </h2>
            </div>

            {/* Feedback thông báo trạng thái */}
            {feedback === 'correct' && (
              <div className="mb-4 text-center bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 py-2.5 rounded-xl font-bold text-xs shadow-sm animate-pulse">
                🎉 Chính xác! Tăng tốc tiến về phía trước!
              </div>
            )}
            {feedback === 'wrong' && (
              <div className="mb-4 text-center bg-rose-500/20 border border-rose-500/50 text-rose-300 py-2.5 rounded-xl font-bold text-xs shadow-sm animate-pulse">
                ⚠️ Chưa chính xác! Trừ 30 điểm, mất 1 sinh lực và reset chuỗi combo.
              </div>
            )}

            {/* Các lựa chọn đáp án */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeQuestions[currentIndex]?.options.map((option, idx) => (
                <button
                  key={idx}
                  disabled={feedback !== null}
                  onClick={() => handleAnswer(idx)}
                  className="bg-white/10 hover:bg-white/15 border border-white/15 hover:border-yellow-400 text-white font-medium p-3.5 rounded-2xl text-left transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex items-center shadow-sm group"
                >
                  <span className="w-8 h-8 rounded-xl bg-white/10 group-hover:bg-yellow-400 group-hover:text-purple-950 text-center mr-3 font-bold text-yellow-300 flex items-center justify-center shrink-0 transition-colors">
                    {['A', 'B', 'C', 'D'][idx]}
                  </span>
                  <span className="text-sm md:text-base font-semibold">{option}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. MÀN HÌNH VỀ ĐÍCH THẮNG LỢI */}
        {step === 'victory' && (
          <div className="text-center py-6">
            <div className="text-6xl mb-3 animate-bounce">
              🎉🏆🎊
            </div>
            <h2 className="text-2xl font-black mb-2 text-yellow-300 tracking-wide">
              VIN QUANG VỀ ĐÍCH!
            </h2>
            <p className="text-gray-300 text-sm mb-6 font-normal">
              Chúc mừng bạn đã xuất sắc vượt qua toàn bộ 25 thử thách tri thức!
            </p>

            <div className="bg-slate-900/60 border border-white/15 rounded-2xl p-4 mb-6 max-w-sm mx-auto grid grid-cols-2 gap-3 text-center shadow-inner">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="block text-[11px] text-gray-400 mb-1 font-medium">Tổng điểm</span>
                <span className="text-xl font-black text-yellow-400">{score}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="block text-[11px] text-gray-400 mb-1 font-medium">Câu đúng</span>
                <span className="text-xl font-black text-emerald-400">{correctCount} / 25</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="block text-[11px] text-gray-400 mb-1 font-medium">Điểm kinh nghiệm</span>
                <span className="text-xl font-black text-blue-400">⭐ {xp}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="block text-[11px] text-gray-400 mb-1 font-medium">Xu vàng thưởng</span>
                <span className="text-xl font-black text-amber-400">🪙 {coins}</span>
              </div>
            </div>

            {!hasSaved ? (
              <form onSubmit={saveScoreToLeaderboard} className="bg-slate-900/60 border border-white/15 p-4 rounded-2xl max-w-sm mx-auto mb-6">
                <label className="block text-xs text-yellow-200 font-bold mb-2">📝 Lưu thành tích vào Bảng Xếp Hạng</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập tên hiển thị của bạn..."
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    required
                    maxLength={20}
                    className="flex-1 bg-black/40 border border-white/20 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 shadow-inner"
                  />
                  <button
                    type="submit"
                    className="bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-bold px-4 py-2 rounded-xl text-sm shadow transition"
                  >
                    Lưu
                  </button>
                </div>
              </form>
            ) : (
              <div className="mb-6 text-emerald-400 font-bold text-xs bg-emerald-500/20 border border-emerald-500/40 p-3 rounded-xl max-w-sm mx-auto shadow-sm">
                ✅ Đã lưu thành tích vào Bảng Xếp Hạng thành công!
              </div>
            )}

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setStep('select_grade')}
                className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-purple-950 font-black px-6 py-3 rounded-xl shadow-lg transition transform hover:scale-105 text-sm"
              >
                🔄 Thử Lại Chặng Đua
              </button>
              <button
                onClick={() => setStep('leaderboard')}
                className="bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold px-6 py-3 rounded-xl transition text-sm shadow"
              >
                🏆 Xem BXH
              </button>
            </div>
          </div>
        )}

        {/* 5. MÀN HÌNH KẾT THÚC (HẾT MẠNG HOẶC HẾT GIỜ) */}
        {step === 'game_over' && (
          <div className="text-center py-6">
            <div className="text-6xl mb-3 animate-bounce">
              🧗‍♂️
            </div>
            <h2 className="text-2xl font-black mb-2 text-rose-400 tracking-wide">
              {timeLeft <= 0 ? 'HẾT THỜI GIAN TRẢ LỜI!' : 'Hành Trình Tạm Dừng'}
            </h2>
            <p className="text-gray-300 text-sm mb-6 font-normal">
              {timeLeft <= 0 ? 'Bạn đã không kịp đưa ra đáp án trước khi đồng hồ điểm về 0.' : 'Bạn đã sử dụng hết sinh lực trên đường đua.'} Hãy tích lũy kinh nghiệm và thử sức lại nhé!
            </p>

            <div className="bg-slate-900/60 border border-white/15 rounded-2xl p-4 mb-6 max-w-sm mx-auto grid grid-cols-2 gap-3 text-center shadow-inner">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="block text-[11px] text-gray-400 mb-1 font-medium">Điểm tích lũy</span>
                <span className="text-xl font-black text-yellow-400">{score}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="block text-[11px] text-gray-400 mb-1 font-medium">Câu đúng</span>
                <span className="text-xl font-black text-emerald-400">{correctCount} / 25</span>
              </div>
            </div>

            {!hasSaved ? (
              <form onSubmit={saveScoreToLeaderboard} className="bg-slate-900/60 border border-white/15 p-4 rounded-2xl max-w-sm mx-auto mb-6">
                <label className="block text-xs text-yellow-200 font-bold mb-2">📝 Lưu điểm thành tích này vào BXH?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập tên hiển thị của bạn..."
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    required
                    maxLength={20}
                    className="flex-1 bg-black/40 border border-white/20 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 shadow-inner"
                  />
                  <button
                    type="submit"
                    className="bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-bold px-4 py-2 rounded-xl text-sm shadow transition"
                  >
                    Lưu
                  </button>
                </div>
              </form>
            ) : (
              <div className="mb-6 text-emerald-400 font-bold text-xs bg-emerald-500/20 border border-emerald-500/40 p-3 rounded-xl max-w-sm mx-auto shadow-sm">
                ✅ Đã lưu thành tích vào Bảng Xếp Hạng!
              </div>
            )}

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setStep('select_grade')}
                className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-purple-950 font-black px-6 py-3 rounded-xl shadow-lg transition transform hover:scale-105 text-sm"
              >
                🔄 Thử Lại Ngay
              </button>
              <button
                onClick={() => setStep('leaderboard')}
                className="bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold px-6 py-3 rounded-xl transition text-sm shadow"
              >
                🏆 Xem BXH
              </button>
            </div>
          </div>
        )}

        {/* 6. BẢNG XẾP HẠNG (LEADERBOARD) */}
        {step === 'leaderboard' && (
          <div className="py-2">
            <h2 className="text-xl font-black mb-1 text-yellow-300 text-center tracking-wide">🏆 Bảng Xếp Hạng Vượt Chướng Ngại Vật</h2>
            <p className="text-xs text-gray-300 text-center mb-6 font-normal">Vinh danh các nhà thám hiểm thông thái xuất sắc nhất hệ thống</p>

            <div className="bg-slate-900/60 border border-white/15 rounded-2xl p-4 max-h-72 overflow-y-auto mb-6 shadow-inner">
              {leaderboard.length === 0 ? (
                <p className="text-center text-xs text-gray-400 py-8">Chưa có dữ liệu xếp hạng. Hãy hoàn thành chặng đua để trở thành người dẫn đầu!</p>
              ) : (
                <div className="space-y-2">
                  {leaderboard.map((item, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                        index === 0 ? 'bg-yellow-500/20 border-yellow-500/50 shadow-sm' : 
                        index === 1 ? 'bg-slate-300/15 border-slate-300/30' : 
                        index === 2 ? 'bg-amber-700/20 border-amber-700/30' : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shadow-sm ${
                          index === 0 ? 'bg-yellow-400 text-purple-950' :
                          index === 1 ? 'bg-slate-300 text-purple-950' :
                          index === 2 ? 'bg-amber-600 text-white' : 'bg-white/15 text-white'
                        }`}>
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="font-bold text-sm text-white">{item.name}</h4>
                          <span className="text-[10px] text-gray-400 font-medium">{item.gradeLabel} • {item.difficultyLabel} ({item.date})</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-yellow-400 font-black text-base">{item.score}</span>
                        <span className="block text-[10px] text-gray-400 font-medium">điểm</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setStep('select_grade')}
                className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 text-purple-950 font-black px-6 py-3 rounded-xl shadow-lg transition transform hover:scale-105 text-sm"
              >
                🎮 Bắt Đầu Thử Thách Ngay
              </button>
            </div>
          </div>
        )}

      </div>

      <footer className="mt-6 text-center text-xs text-gray-400 font-medium tracking-wide">
        🐝 EduCat – Nền tảng học tập thông minh qua trò chơi tương tác 🌟
      </footer>
    </main>
  );
}