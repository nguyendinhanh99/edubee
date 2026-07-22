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
  lessonTitle: string; // Đã đổi từ levelName thành lessonTitle để đồng bộ dữ liệu
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

  // Sử dụng useRef để lưu trạng thái mới nhất phục vụ cho việc cleanup / beforeunload
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

  // Hàm lưu kết quả vào localStorage với khóa 'math_quiz_history'
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

  // Tự động lưu kết quả nếu bé thoát trang / đóng tab giữa chừng
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
        lessonTitle: `Quiz: ${currentLevel.levelName}`, // Đồng bộ thuộc tính hiển thị
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

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-pink-100 via-purple-50 to-indigo-100 p-6 flex flex-col items-center justify-between">
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-between">
        <Link 
          href="/math"
          onClick={() => saveResultToLocalStorage(score, wrongQuestions)}
          className="bg-white px-4 py-2 rounded-2xl shadow-sm text-gray-700 font-semibold hover:bg-gray-50 transition"
        >
          ⬅️ Quay lại môn Toán
        </Link>
        <span className="text-sm font-extrabold text-purple-600 bg-white px-4 py-1.5 rounded-full shadow-sm">
          ⭐ {currentLevel.levelName}
        </span>
        <button
          onClick={() => speakText(currentQ.title)}
          className="bg-white p-3 rounded-2xl shadow-sm text-xl hover:bg-purple-50 transition cursor-pointer"
          title="Nghe đọc lại"
        >
          🔊
        </button>
      </div>

      {/* Nội dung Quiz */}
      {!isLevelFinished && !isAllCompleted ? (
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-200 flex flex-col items-center text-center my-auto transition-all duration-300">
          <div className="w-full flex justify-between items-center mb-2">
            <span className="text-sm font-bold uppercase tracking-wider text-pink-500 bg-pink-50 px-4 py-1 rounded-full">
              Câu hỏi {currentIndex + 1} / {questions.length}
            </span>
            <button 
              onClick={saveResultsOnEarlyFinish}
              className="text-xs text-gray-500 hover:text-purple-600 underline font-medium cursor-pointer"
            >
              Kết thúc sớm & xem kết quả
            </button>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4">
            {currentQ.title}
          </h2>

          <div className="text-3xl sm:text-5xl font-extrabold mb-6 bg-purple-50 px-6 py-3 rounded-2xl shadow-inner tracking-wider text-purple-700">
            {currentQ.equation}
          </div>

          <div className="grid grid-cols-2 gap-4 w-full mb-6">
            {currentQ.options.map((option, index) => {
              let btnStyle = "bg-purple-50 text-purple-700 border-2 border-purple-200 hover:bg-purple-100";
              
              if (selectedOption !== null) {
                if (option === currentQ.correctAnswer) {
                  btnStyle = "bg-emerald-500 text-white border-2 border-emerald-600 animate-bounce";
                } else if (option === selectedOption) {
                  btnStyle = "bg-rose-500 text-white border-2 border-rose-600";
                } else {
                  btnStyle = "bg-gray-100 text-gray-400 border-2 border-gray-200 opacity-50";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(option)}
                  disabled={selectedOption !== null}
                  className={`py-4 rounded-2xl font-extrabold text-2xl shadow transition cursor-pointer ${btnStyle}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div className={`w-full p-4 rounded-2xl mb-6 text-center ${isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
              <p className="font-bold text-lg mb-1">
                {isCorrect ? '🎉 Chính xác! Bé rất thông minh!' : '❌ Chưa chính xác rồi!'}
              </p>
              <p className="text-sm font-medium">{currentQ.explanation}</p>
            </div>
          )}

          {selectedOption !== null && (
            <button
              onClick={handleNextQuestion}
              className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-lg shadow-lg transition cursor-pointer"
            >
              {currentIndex < questions.length - 1 ? 'Câu tiếp theo ➔' : 'Hoàn thành cấp độ 🏆'}
            </button>
          )}
        </div>
      ) : isLevelFinished && !isAllCompleted ? (
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8 border-4 border-emerald-300 flex flex-col items-center text-center my-auto transition-all duration-300">
          <div className="text-6xl mb-4">🌟</div>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
            Hoàn thành {currentLevel.levelName}!
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Bé đã sẵn sàng để bước lên cấp độ thử thách tiếp theo chưa nào?
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={handleNextLevel}
              className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-lg shadow-xl hover:from-emerald-600 hover:to-teal-700 transition cursor-pointer"
            >
              🚀 Lên cấp độ tiếp theo ➔
            </button>
            <button
              onClick={saveResultsOnEarlyFinish}
              className="py-3 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm shadow transition cursor-pointer"
            >
              Xem kết quả ngay
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 border-4 border-yellow-300 flex flex-col items-center text-center my-auto transition-all duration-300 max-h-[85vh] overflow-y-auto">
          <div className="text-5xl mb-2">👑</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1">
            Tổng kết kết quả của bé
          </h2>
          <p className="text-md text-gray-600 mb-4">
            Tổng điểm tích lũy: <span className="text-purple-600 font-extrabold text-xl">{score} điểm</span>
          </p>

          <div className="w-full text-left mb-6">
            <h3 className="font-bold text-gray-700 text-base mb-2 border-b pb-1 flex items-center justify-between">
              <span>📋 Nhật ký câu trả lời sai:</span>
              <span className="text-xs text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                {wrongQuestions.length} câu cần ôn lại
              </span>
            </h3>

            {wrongQuestions.length === 0 ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-center text-sm font-medium">
                🎉 Tuyệt vời! Bé không trả lời sai câu nào trong phiên chơi này!
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {wrongQuestions.map((item, idx) => (
                  <div key={idx} className="bg-rose-50/60 border border-rose-200 p-3 rounded-2xl text-sm">
                    <p className="text-xs font-bold text-purple-600 mb-0.5">{item.lessonTitle}</p>
                    <p className="font-extrabold text-gray-800">{item.title} ({item.equation})</p>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs">
                      <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md font-medium">
                        Bé chọn: <strong>{item.selectedOption}</strong>
                      </span>
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-medium">
                        Đáp án đúng: <strong>{item.correctAnswer}</strong>
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 italic">💡 {item.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={restartAll}
              className="flex-1 py-3 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-lg shadow transition cursor-pointer"
            >
              🔄 Chơi lại từ đầu
            </button>
            <Link
              href="/math"
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-lg text-center shadow-lg hover:from-purple-700 hover:to-indigo-700 transition block"
            >
              🏠 Về trang chủ Toán
            </Link>
          </div>
        </div>
      )}

      <div className="text-gray-500 text-sm mt-4">
        Trò chơi trắc nghiệm edubee 🌟
      </div>
    </main>
  );
}