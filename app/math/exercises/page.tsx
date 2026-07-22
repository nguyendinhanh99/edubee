'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import exercisesData from '@/app/data/math_exercises.json';

interface WrongExerciseQuestion {
  id: number;
  title: string;
  equation: string;
  selectedOption: string;
  correctAnswer: string;
  explanation: string;
  lessonTitle: string;
}

export default function MathExercisesPage() {
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState<WrongExerciseQuestion[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const lessons = exercisesData.lessons;
  const currentLesson = selectedLessonIndex !== null ? lessons[selectedLessonIndex] : null;
  const currentQ = currentLesson ? currentLesson.questions[currentIndex] : null;

  const stateRef = useRef({ score, wrongQuestions, isFinished });
  useEffect(() => {
    stateRef.current = { score, wrongQuestions, isFinished };
  });

  const saveResultToLocalStorage = (finalScore: number, wrongs: WrongExerciseQuestion[]) => {
    try {
      if (finalScore > 0 || wrongs.length > 0) {
        const historyData = {
          date: new Date().toLocaleString('vi-VN'),
          score: finalScore,
          wrongQuestions: wrongs,
        };
        const existingHistory = JSON.parse(localStorage.getItem('math_exercises_history') || '[]');
        localStorage.setItem('math_exercises_history', JSON.stringify([historyData, ...existingHistory]));
      }
    } catch (error) {
      console.warn("Không thể lưu lịch sử bài tập:", error);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!stateRef.current.isFinished && selectedLessonIndex !== null) {
        saveResultToLocalStorage(stateRef.current.score, stateRef.current.wrongQuestions);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (!stateRef.current.isFinished && selectedLessonIndex !== null) {
        saveResultToLocalStorage(stateRef.current.score, stateRef.current.wrongQuestions);
      }
    };
  }, [selectedLessonIndex]);

  const handleAnswerClick = (option: string) => {
    if (selectedOption !== null || !currentQ || !currentLesson) return;

    setSelectedOption(option);
    const correct = option === currentQ.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
    } else {
      const newItem: WrongExerciseQuestion = {
        id: currentQ.id,
        title: currentQ.title,
        equation: currentQ.equation,
        selectedOption: option,
        correctAnswer: currentQ.correctAnswer,
        explanation: currentQ.explanation,
        lessonTitle: currentLesson.title,
      };
      setWrongQuestions(prev => [...prev, newItem]);
    }
  };

  const handleNext = () => {
    if (!currentLesson) return;
    setSelectedOption(null);
    setIsCorrect(null);
    if (currentIndex < currentLesson.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      saveResultToLocalStorage(score, wrongQuestions);
    }
  };

  const handleEarlyFinish = () => {
    setIsFinished(true);
    saveResultToLocalStorage(score, wrongQuestions);
  };

  const restartLesson = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setScore(0);
    setWrongQuestions([]);
    setIsFinished(false);
  };

  const backToLessonList = () => {
    if (!isFinished && selectedLessonIndex !== null) {
      saveResultToLocalStorage(score, wrongQuestions);
    }
    setSelectedLessonIndex(null);
    restartLesson();
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-purple-100 via-indigo-50 to-pink-100 p-6 flex flex-col items-center justify-between">
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-between">
        <Link 
          href="/math"
          onClick={() => {
            if (!isFinished && selectedLessonIndex !== null) {
              saveResultToLocalStorage(score, wrongQuestions);
            }
          }}
          className="bg-white px-4 py-2 rounded-2xl shadow-sm text-gray-700 font-semibold hover:bg-gray-50 transition"
        >
          ⬅️ Quay lại môn Toán
        </Link>
        <span className="text-sm font-extrabold text-indigo-600 bg-white px-4 py-1.5 rounded-full shadow-sm">
          📝 Bài tập thực hành
        </span>
        <div className="w-24"></div>
      </div>

      {/* Màn hình 1: Chọn bài tập */}
      {selectedLessonIndex === null ? (
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 border-4 border-indigo-200 my-auto text-center">
          <h2 className="text-2xl font-extrabold text-gray-800 mb-2">🧠 Chọn Bài Tập Thực Hành</h2>
          <p className="text-gray-500 mb-6 text-sm">Bé hãy chọn một bài bên dưới để bắt đầu làm bài nhé!</p>

          <div className="grid grid-cols-1 gap-4">
            {lessons.map((lesson, index) => (
              <button
                key={lesson.id}
                onClick={() => {
                  setSelectedLessonIndex(index);
                  restartLesson();
                }}
                className="flex items-center justify-between p-5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 transition group cursor-pointer shadow-sm"
              >
                <div className="text-left">
                  <h3 className="font-extrabold text-indigo-900 text-lg group-hover:text-indigo-700">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{lesson.questions.length} câu hỏi trắc nghiệm</p>
                </div>
                <span className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold group-hover:bg-indigo-700 transition">
                  Làm bài ➔
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : !isFinished && currentQ && currentLesson ? (
        /* Màn hình 2: Đang làm bài */
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8 border-4 border-indigo-200 flex flex-col items-center text-center my-auto transition-all duration-300">
          <div className="w-full flex justify-between items-center mb-2">
            <button 
              onClick={backToLessonList}
              className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl hover:bg-indigo-100 transition cursor-pointer"
            >
              ⬅️ Chọn bài khác
            </button>
            <span className="text-sm font-bold uppercase tracking-wider text-purple-500 bg-purple-50 px-4 py-1 rounded-full">
              Câu {currentIndex + 1} / {currentLesson.questions.length}
            </span>
            <button 
              onClick={handleEarlyFinish}
              className="text-xs text-gray-500 hover:text-indigo-600 underline font-medium cursor-pointer"
            >
              Nộp sớm
            </button>
          </div>

          <h3 className="text-xs font-bold text-indigo-500 mt-2 mb-1">{currentLesson.title}</h3>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800 mb-3">
            {currentQ.title}
          </h2>

          <div className="text-3xl sm:text-4xl font-extrabold mb-6 bg-indigo-50 px-6 py-3 rounded-2xl shadow-inner tracking-wider text-indigo-700">
            {currentQ.equation}
          </div>

          <div className="grid grid-cols-2 gap-4 w-full mb-6">
            {currentQ.options.map((option, index) => {
              let btnStyle = "bg-indigo-50 text-indigo-700 border-2 border-indigo-200 hover:bg-indigo-100";
              
              if (selectedOption !== null) {
                if (option === currentQ.correctAnswer) {
                  btnStyle = "bg-emerald-500 text-white border-2 border-emerald-600";
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
                  className={`py-4 rounded-2xl font-extrabold text-xl shadow transition cursor-pointer ${btnStyle}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div className={`w-full p-4 rounded-2xl mb-6 text-center ${isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
              <p className="font-bold text-lg mb-1">
                {isCorrect ? '🎉 Chính xác!' : '❌ Chưa chính xác!'}
              </p>
              <p className="text-sm font-medium">{currentQ.explanation}</p>
            </div>
          )}

          {selectedOption !== null && (
            <button
              onClick={handleNext}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-lg shadow-lg transition cursor-pointer"
            >
              {currentLesson && currentIndex < currentLesson.questions.length - 1 ? 'Câu tiếp theo ➔' : 'Xem kết quả tổng kết 🏆'}
            </button>
          )}
        </div>
      ) : (
        /* Màn hình 3: Tổng kết kết quả bài tập */
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 border-4 border-yellow-300 flex flex-col items-center text-center my-auto transition-all duration-300 max-h-[85vh] overflow-y-auto">
          <div className="text-5xl mb-2">🏆</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1">
            Tổng kết {currentLesson?.title}
          </h2>
          <p className="text-md text-gray-600 mb-4">
            Số điểm đạt được: <span className="text-indigo-600 font-extrabold text-xl">{score} / {currentLesson?.questions.length} điểm</span>
          </p>

          <div className="w-full text-left mb-6">
            <h3 className="font-bold text-gray-700 text-base mb-2 border-b pb-1 flex items-center justify-between">
              <span>📋 Nhật ký câu trả lời sai:</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${wrongQuestions.length === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {wrongQuestions.length === 0 ? 'Hoàn hảo! Không sai câu nào 🎉' : `${wrongQuestions.length} câu cần ôn lại`}
              </span>
            </h3>

            {wrongQuestions.length === 0 ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-center text-sm font-medium">
                🎉 Tuyệt vời! Bé đã trả lời đúng toàn bộ các câu hỏi của bài này!
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {wrongQuestions.map((item, idx) => (
                  <div key={idx} className="bg-rose-50/60 border border-rose-200 p-3 rounded-2xl text-sm">
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
              onClick={restartLesson}
              className="flex-1 py-3 rounded-2xl bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold text-lg shadow transition cursor-pointer"
            >
              🔄 Làm lại bài này
            </button>
            <button
              onClick={backToLessonList}
              className="flex-1 py-3 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-lg shadow transition cursor-pointer"
            >
              📚 Chọn bài tập khác
            </button>
          </div>
        </div>
      )}

      <div className="text-gray-500 text-sm mt-4">
        Trò chơi trắc nghiệm edubee 🌟
      </div>
    </main>
  );
}