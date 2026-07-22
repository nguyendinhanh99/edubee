'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface WrongExerciseQuestion {
  id: number;
  title: string;
  equation: string;
  selectedOption: string;
  correctAnswer: string;
  explanation: string;
  lessonTitle: string;
}

interface ExerciseHistoryItem {
  date: string;
  score: number;
  wrongQuestions: WrongExerciseQuestion[];
}

export default function MathResultsPage() {
  const [history, setHistory] = useState<ExerciseHistoryItem[]>([]);
  const [selectedSessionIndex, setSelectedSessionIndex] = useState<number | null>(0);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('math_exercises_history');
      if (savedHistory) {
        const parsed: ExerciseHistoryItem[] = JSON.parse(savedHistory);
        setHistory(parsed);
        if (parsed.length > 0) {
          setSelectedSessionIndex(0);
        }
      }
    } catch (error) {
      console.warn("Không thể tải kết quả từ localStorage:", error);
    }
  }, []);

  const currentSelectedSession = selectedSessionIndex !== null && history[selectedSessionIndex] ? history[selectedSessionIndex] : null;

  // Tính toán thống kê tổng quan
  const totalSessions = history.length;
  const bestScore = history.length > 0 ? Math.max(...history.map(item => item.score)) : 0;
  const totalCorrectAnswers = history.reduce((acc, curr) => acc + curr.score, 0);

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-amber-100 via-purple-50 to-pink-100 p-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <Link 
          href="/math"
          className="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl shadow-sm text-gray-700 font-semibold hover:bg-gray-50 transition"
        >
          <span>⬅️</span>
          <span>Quay lại Toán học</span>
        </Link>
        <span className="text-sm font-extrabold text-amber-600 bg-white px-4 py-1.5 rounded-full shadow-sm">
          🏆 Thành tích của bé
        </span>
        <div className="w-24"></div>
      </div>

      {/* Tiêu đề chính */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2">
          🌟 Bảng Vàng Thành Tích 🌟
        </h1>
        <p className="text-gray-600">
          Cùng nhìn lại hành trình nỗ lực và các mốc điểm tuyệt vời của bé nhé!
        </p>
      </div>

      {/* Thẻ thống kê tổng quan (Dashboard Stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl w-full mb-8">
        <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-md flex items-center space-x-4">
          <div className="text-4xl bg-amber-100 p-3 rounded-2xl">🎯</div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">Tổng số lần làm bài</p>
            <p className="text-2xl font-extrabold text-gray-800">{totalSessions} <span className="text-sm font-normal text-gray-500">lần</span></p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border-2 border-purple-200 shadow-md flex items-center space-x-4">
          <div className="text-4xl bg-purple-100 p-3 rounded-2xl">👑</div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">Điểm cao nhất</p>
            <p className="text-2xl font-extrabold text-purple-600">{bestScore} <span className="text-sm font-normal text-gray-500">điểm</span></p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border-2 border-emerald-200 shadow-md flex items-center space-x-4">
          <div className="text-4xl bg-emerald-100 p-3 rounded-2xl">⭐</div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">Tổng câu đúng tích lũy</p>
            <p className="text-2xl font-extrabold text-emerald-600">{totalCorrectAnswers} <span className="text-sm font-normal text-gray-500">câu</span></p>
          </div>
        </div>
      </div>

      {/* Khu vực chi tiết lịch sử bài làm */}
      <div className="w-full max-w-4xl bg-white rounded-3xl border-4 border-amber-200 p-8 shadow-2xl mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b gap-3">
          <div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Nhật ký chi tiết
            </span>
            <h3 className="text-xl font-extrabold text-gray-800 mt-1">
              📊 Lịch sử làm bài tập thực hành
            </h3>
          </div>
          <Link
            href="/math/exercises"
            className="text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-2xl shadow transition"
          >
            Làm thêm bài tập mới 📝
          </Link>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 text-gray-500 flex flex-col items-center">
            <span className="text-6xl mb-3">📭</span>
            <p className="text-base font-bold text-gray-700">Chưa có kết quả bài tập nào được ghi nhận.</p>
            <p className="text-sm text-gray-500 mt-1 mb-4">Bé hãy thử tham gia làm bài tập thực hành để tích lũy điểm số nhé!</p>
            <Link
              href="/math/exercises"
              className="text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-2xl shadow-lg transition"
            >
              Bắt đầu làm bài ngay 🚀
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cột trái: Danh sách các phiên làm bài */}
            <div className="md:col-span-1 border-r md:pr-4 flex flex-col gap-2 max-h-96 overflow-y-auto">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">Danh sách các lần làm:</p>
              {history.map((session, idx) => {
                const isSelected = selectedSessionIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedSessionIndex(idx)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition cursor-pointer flex flex-col gap-1.5 ${
                      isSelected 
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md' 
                        : 'bg-gray-50 hover:bg-purple-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span>Lần #{history.length - idx}</span>
                      <span className={`px-2.5 py-0.5 rounded-full ${isSelected ? 'bg-purple-700 text-white' : 'bg-amber-100 text-amber-800'}`}>
                        {session.score} điểm
                      </span>
                    </div>
                    <span className={`text-[11px] truncate ${isSelected ? 'text-purple-200' : 'text-gray-400'}`}>
                      {session.date}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Cột phải: Chi tiết phiên làm bài được chọn */}
            <div className="md:col-span-2 flex flex-col gap-4">
              {currentSelectedSession && (
                <>
                  <div className="flex flex-wrap items-center justify-between bg-amber-50/80 p-4 rounded-2xl border border-amber-200">
                    <div>
                      <p className="text-xs text-gray-500">🕒 Thời gian nộp bài:</p>
                      <p className="text-sm font-bold text-gray-800">{currentSelectedSession.date}</p>
                    </div>
                    <div className="mt-2 sm:mt-0 bg-white px-5 py-2.5 rounded-xl shadow-sm border border-amber-200 text-center">
                      <span className="text-xs text-gray-500 block">Điểm số:</span>
                      <span className="text-xl font-extrabold text-amber-600">{currentSelectedSession.score} điểm</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-700 text-sm mb-3 flex items-center justify-between">
                      <span>📋 Chi tiết các câu trả lời sai:</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${currentSelectedSession.wrongQuestions.length === 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                        {currentSelectedSession.wrongQuestions.length === 0 ? 'Hoàn hảo! Không sai câu nào 🎉' : `${currentSelectedSession.wrongQuestions.length} câu cần ôn tập`}
                      </span>
                    </h4>

                    {currentSelectedSession.wrongQuestions.length === 0 ? (
                      <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-800 p-6 rounded-3xl text-center">
                        <p className="text-2xl mb-1">🎉</p>
                        <p className="font-extrabold text-base mb-1">Xuất sắc quá!</p>
                        <p className="text-sm font-medium">Bé đã trả lời đúng toàn bộ câu hỏi trong lần làm bài này.</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        {currentSelectedSession.wrongQuestions.map((item, idx) => (
                          <div key={idx} className="bg-rose-50/60 border border-rose-200 p-4 rounded-2xl text-xs flex flex-col gap-1.5 shadow-sm">
                            <span className="font-extrabold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md w-fit border border-purple-100">
                              📚 {item.lessonTitle}
                            </span>
                            <p className="font-extrabold text-gray-800 text-sm mt-1">{item.title} ({item.equation})</p>
                            <div className="flex flex-wrap gap-3 mt-1">
                              <span className="text-rose-700 bg-rose-100 px-2.5 py-1 rounded-lg font-semibold">
                                Bé chọn: <strong>{item.selectedOption}</strong>
                              </span>
                              <span className="text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg font-semibold">
                                Đáp án đúng: <strong>{item.correctAnswer}</strong>
                              </span>
                            </div>
                            <p className="text-gray-600 italic mt-1 bg-white p-2 rounded-xl border border-rose-100">
                              💡 <strong>Giải thích:</strong> {item.explanation}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="text-gray-500 text-sm mt-2">
        Trò chơi trắc nghiệm edubee 🌟
      </div>
    </main>
  );
}