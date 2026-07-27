'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import quizData from '@/app/data/math_quiz.json';

interface WrongQuestion {
  id: number;
  title: string;
  equation: string;
  selectedOption: string;
  correctAnswer: string;
  explanation: string;
  lessonTitle: string;
}

export default function MathQuizPage() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  
  const [wrongQuestions, setWrongQuestions] = useState<WrongQuestion[]>([]);
  const [isLevelFinished, setIsLevelFinished] = useState(false);
  const [isAllCompleted, setIsAllCompleted] = useState(false);

  const stateRef = useRef({ score, wrongQuestions, isAllCompleted });
  useEffect(() => {
    stateRef.current = { score, wrongQuestions, isAllCompleted };
  });

  const levels = quizData.levels;
  const currentLevel = levels[currentLevelIndex];
  const questions = currentLevel.questions;
  const currentQ = questions[currentIndex];

  const speakText = (text: string) => {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'vi-VN';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.warn("Lỗi phát âm thanh:", error);
    }
  };

  useEffect(() => {
    if (!isLevelFinished && !isAllCompleted) {
      speakText(currentQ.title);
    }
  }, [currentIndex, currentLevelIndex, isLevelFinished, isAllCompleted]);

  const saveResultToLocalStorage = (finalScore: number, wrongs: WrongQuestion[]) => {
    try {
      if (finalScore > 0 || wrongs.length > 0) {
        const historyData = {
          date: new Date().toLocaleString('vi-VN'),
          score: finalScore,
          wrongQuestions: wrongs,
        };
        const existingHistory = JSON.parse(localStorage.getItem('math_quiz_history') || '[]');
        localStorage.setItem('math_quiz_history', JSON.stringify([historyData, ...existingHistory]));
      }
    } catch (error) {
      console.warn("Không thể lưu lịch sử vào localStorage:", error);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!stateRef.current.isAllCompleted) {
        saveResultToLocalStorage(stateRef.current.score, stateRef.current.wrongQuestions);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (!stateRef.current.isAllCompleted) {
        saveResultToLocalStorage(stateRef.current.score, stateRef.current.wrongQuestions);
      }
    };
  }, []);

  const handleAnswerClick = (option: string) => {
    if (selectedOption !== null) return;

    setSelectedOption(option);
    const correct = option === currentQ.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
      speakText("Chính xác! Bé giỏi quá!");
    } else {
      speakText("Tiếc quá, chưa đúng rồi!");
      const newWrongItem: WrongQuestion = {
        id: currentQ.id,
        title: currentQ.title,
        equation: currentQ.equation,
        selectedOption: option,
        correctAnswer: currentQ.correctAnswer,
        explanation: currentQ.explanation,
        lessonTitle: `Quiz: ${currentLevel.levelName}`,
      };
      setWrongQuestions(prev => [...prev, newWrongItem]);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsLevelFinished(true);
      speakText(`Bé đã hoàn thành ${currentLevel.levelName}. Chúc mừng bé!`);
    }
  };

  const handleNextLevel = () => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsCorrect(null);
      setIsLevelFinished(false);
    } else {
      setIsAllCompleted(true);
      speakText("Bé đã phá đảo toàn bộ các cấp độ Toán học! Xuất sắc quá!");
      saveResultToLocalStorage(score, wrongQuestions);
    }
  };

  const saveResultsOnEarlyFinish = () => {
    setIsAllCompleted(true);
    saveResultToLocalStorage(score, wrongQuestions);
  };

  const restartAll = () => {
    setCurrentLevelIndex(0);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setScore(0);
    setWrongQuestions([]);
    setIsLevelFinished(false);
    setIsAllCompleted(false);
  };

  // Tính toán phần trăm tiến độ thanh progress bar
  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <main className="relative min-h-screen w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 sm:p-6 flex flex-col items-center justify-between overflow-hidden selection:bg-yellow-300 selection:text-purple-900">
      
      {/* Các hiệu ứng nền trang trí mượt mà */}
      <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-yellow-300/20 blur-3xl animate-pulse pointer-events-none" />

      {/* Header Điều Hướng Chuyên Nghiệp */}
      <div className="relative z-10 w-full max-w-2xl flex items-center justify-between bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/25 shadow-lg mb-4">
        <div className="flex items-center gap-2">
          <Link 
            href="/home"
            onClick={() => saveResultToLocalStorage(score, wrongQuestions)}
            className="bg-white/20 hover:bg-white/30 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm border border-white/20"
            title="Về trang chủ hệ thống"
          >
            <span>🏠</span> Trang Chủ
          </Link>
          <Link 
            href="/math"
            onClick={() => saveResultToLocalStorage(score, wrongQuestions)}
            className="bg-white/20 hover:bg-white/30 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm border border-white/20"
          >
            <span>⬅️</span> Môn Toán
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-black text-yellow-200 bg-black/20 px-3.5 py-1.5 rounded-xl border border-white/10">
            ⭐ {currentLevel.levelName}
          </span>
          <button
            onClick={() => speakText(currentQ.title)}
            className="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-xl text-base transition cursor-pointer border border-white/20 shadow-sm"
            title="Nghe đọc lại câu hỏi"
          >
            🔊
          </button>
        </div>
      </div>

      {/* Nội dung chính Quiz */}
      {!isLevelFinished && !isAllCompleted ? (
        <div className="relative z-10 w-full max-w-xl bg-white/90 backdrop-blur-2xl rounded-[36px] shadow-[0_16px_40px_rgba(0,0,0,0.2)] p-6 sm:p-8 border border-white/50 flex flex-col items-center text-center my-auto transition-all duration-300">
          
          {/* Progress bar hiện đại */}
          <div className="w-full mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                Câu {currentIndex + 1} / {questions.length}
              </span>
              <button 
                onClick={saveResultsOnEarlyFinish}
                className="text-xs text-gray-500 hover:text-purple-600 underline font-semibold transition cursor-pointer"
              >
                Kết thúc sớm & xem kết quả
              </button>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-4 leading-snug">
            {currentQ.title}
          </h2>

          {/* Equation Box */}
          <div className="text-3xl sm:text-5xl font-black mb-6 bg-gradient-to-r from-purple-50 to-pink-50 px-8 py-4 rounded-3xl shadow-inner tracking-wider text-purple-700 border border-purple-100">
            {currentQ.equation}
          </div>

          {/* Các nút lựa chọn A, B, C, D */}
          <div className="grid grid-cols-2 gap-3.5 w-full mb-6">
            {currentQ.options.map((option, index) => {
              let btnStyle = "bg-white text-purple-700 border-2 border-purple-100 hover:border-purple-300 hover:bg-purple-50/80 shadow-md";
              
              if (selectedOption !== null) {
                if (option === currentQ.correctAnswer) {
                  btnStyle = "bg-emerald-500 text-white border-2 border-emerald-600 shadow-lg animate-bounce";
                } else if (option === selectedOption) {
                  btnStyle = "bg-rose-500 text-white border-2 border-rose-600 shadow-lg";
                } else {
                  btnStyle = "bg-gray-100 text-gray-400 border-2 border-gray-200 opacity-40 shadow-none";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(option)}
                  disabled={selectedOption !== null}
                  className={`py-4 rounded-2xl font-black text-2xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${btnStyle}`}
                >
                  <span className="text-xs opacity-60 bg-black/10 w-6 h-6 rounded-full flex items-center justify-center">
                    {['A', 'B', 'C', 'D'][index]}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>

          {/* Thông báo kết quả đúng/sai từng câu */}
          {selectedOption !== null && (
            <div className={`w-full p-4 rounded-2xl mb-6 text-center animate-fadeIn ${isCorrect ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-200' : 'bg-rose-50 text-rose-800 border-2 border-rose-200'}`}>
              <p className="font-extrabold text-base mb-1">
                {isCorrect ? '🎉 Chính xác! Bé rất thông minh!' : '❌ Chưa chính xác rồi!'}
              </p>
              <p className="text-xs sm:text-sm font-medium text-gray-600">{currentQ.explanation}</p>
            </div>
          )}

          {/* Nút chuyển câu tiếp theo */}
          {selectedOption !== null && (
            <button
              onClick={handleNextQuestion}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              {currentIndex < questions.length - 1 ? 'Câu tiếp theo ➔' : 'Hoàn thành cấp độ 🏆'}
            </button>
          )}
        </div>
      ) : isLevelFinished && !isAllCompleted ? (
        <div className="relative z-10 w-full max-w-xl bg-white/95 backdrop-blur-2xl rounded-[36px] shadow-2xl p-8 border-4 border-emerald-300 flex flex-col items-center text-center my-auto transition-all duration-300">
          <div className="text-7xl mb-4 animate-bounce">🌟🏆🌟</div>
          <h2 className="text-3xl font-black text-gray-800 mb-2">
            Hoàn thành {currentLevel.levelName}!
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-8 font-medium">
            Bé đã hoàn thành xuất sắc thử thách này. Sẵn sàng bước lên cấp độ tiếp theo chưa nào?
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={handleNextLevel}
              className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-lg shadow-xl hover:from-emerald-600 hover:to-teal-700 transition transform hover:scale-[1.02] cursor-pointer"
            >
              🚀 Lên cấp độ tiếp theo ➔
            </button>
            <button
              onClick={saveResultsOnEarlyFinish}
              className="py-3 px-5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm shadow transition cursor-pointer"
            >
              Xem tổng kết ngay
            </button>
          </div>
        </div>
      ) : (
        <div className="relative z-10 w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-[36px] shadow-2xl p-6 sm:p-8 border-4 border-yellow-300 flex flex-col items-center text-center my-auto transition-all duration-300 max-h-[85vh] overflow-y-auto">
          <div className="text-6xl mb-2 animate-bounce">👑🎉👑</div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-1">
            Tổng Kết Kết Quả Của Bé
          </h2>
          <p className="text-sm text-gray-600 mb-6 font-medium">
            Tổng điểm tích lũy: <span className="text-purple-600 font-black text-2xl">⭐ {score} điểm</span>
          </p>

          <div className="w-full text-left mb-6">
            <h3 className="font-bold text-gray-700 text-sm mb-3 border-b pb-1.5 flex items-center justify-between">
              <span>📋 Nhật ký câu trả lời cần ôn lại:</span>
              <span className="text-xs text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full font-bold">
                {wrongQuestions.length} câu
              </span>
            </h3>

            {wrongQuestions.length === 0 ? (
              <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-800 p-5 rounded-2xl text-center text-sm font-bold shadow-inner">
                🎉 Tuyệt vời! Bé không trả lời sai câu nào trong toàn bộ phiên chơi này!
              </div>
            ) : (
              <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
                {wrongQuestions.map((item, idx) => (
                  <div key={idx} className="bg-rose-50/80 border border-rose-200 p-3.5 rounded-2xl text-sm shadow-sm">
                    <p className="text-xs font-bold text-purple-600 mb-0.5">{item.lessonTitle}</p>
                    <p className="font-black text-gray-800 text-base">{item.title} ({item.equation})</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="bg-rose-100 text-rose-700 px-2.5 py-1 rounded-lg font-bold">
                        Bé chọn: <strong>{item.selectedOption}</strong>
                      </span>
                      <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg font-bold">
                        Đáp án đúng: <strong>{item.correctAnswer}</strong>
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1.5 italic">💡 {item.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={restartAll}
              className="flex-1 py-3.5 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-base shadow transition cursor-pointer"
            >
              🔄 Chơi lại từ đầu
            </button>
            <Link
              href="/home"
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-base text-center shadow-lg hover:from-purple-700 hover:to-indigo-700 transition block"
            >
              🏠 Về Trang Chủ
            </Link>
          </div>
        </div>
      )}

      {/* Footer nhỏ */}
      <div className="relative z-10 text-white/80 text-xs mt-4 font-semibold tracking-wider uppercase">
        Trò chơi trắc nghiệm thông minh edubee 🌟
      </div>
    </main>
  );
}