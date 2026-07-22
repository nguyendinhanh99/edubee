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

export default function MathTopicsPage() {
  const [history, setHistory] = useState<ExerciseHistoryItem[]>([]);
  const [selectedSessionIndex, setSelectedSessionIndex] = useState<number | null>(0); // Mặc định chọn lần chơi mới nhất

  useEffect(() => {
    try {
      // Đọc từ kho lưu trữ 'math_exercises_history' thay vì 'math_quiz_history'
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

  const topics = [
    {
      id: 'numbers',
      title: 'Numbers',
      vietnameseTitle: 'Làm quen với số & Đếm',
      icon: '🔢',
      description: 'Học đếm số từ 1 đến 10 qua các hình ảnh sinh động.',
      color: 'from-amber-400 to-orange-500',
      borderColor: 'border-orange-200',
      active: true,
      href: '/math/flashcard',
    },
    {
      id: 'addition',
      title: 'Addition',
      vietnameseTitle: 'Phép cộng vui nhộn',
      icon: '➕',
      description: 'Cùng cộng gộp các con vật và đồ vật đáng yêu.',
      color: 'from-emerald-400 to-teal-500',
      borderColor: 'border-emerald-200',
      active: true, 
      href: '/math/addition',
    },
    {
      id: 'subtraction',
      title: 'Subtraction',
      vietnameseTitle: 'Phép trừ trực quan',
      icon: '➖',
      description: 'Khám phá phép trừ qua các trò chơi bớt dần thú vị.',
      color: 'from-sky-400 to-blue-500',
      borderColor: 'border-blue-200',
      active: true, 
      href: '/math/subtraction',
    },
  ];

  const activities = [
    {
      id: 'quiz',
      title: 'Math Quiz',
      vietnameseTitle: 'Trò chơi Thử thách',
      icon: '🎮',
      description: 'Bé tham gia trả lời câu hỏi trắc nghiệm vui nhộn để tích điểm!',
      color: 'from-pink-400 to-rose-500',
      borderColor: 'border-rose-200',
      href: '/math/quiz',
    },
    {
      id: 'exercises',
      title: 'Practice Exercises',
      vietnameseTitle: 'Bài tập thực hành',
      icon: '📝',
      description: 'Làm các bài tập củng cố kiến thức đã học.',
      color: 'from-purple-400 to-indigo-500',
      borderColor: 'border-purple-200',
      href: '/math/exercises',
    },
    {
      id: 'results',
      title: 'My Results',
      vietnameseTitle: 'Kết quả của bé',
      icon: '🏆',
      description: 'Xem lại thành tích, huy hiệu và số điểm bé đã đạt được.',
      color: 'from-yellow-400 to-amber-500',
      borderColor: 'border-yellow-200',
      href: '/math/results',
    },
  ];

  const currentSelectedSession = selectedSessionIndex !== null && history[selectedSessionIndex] ? history[selectedSessionIndex] : null;

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-orange-100 via-purple-50 to-pink-50 p-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <Link 
          href="/"
          className="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl shadow-sm text-gray-700 font-semibold hover:bg-gray-50 transition"
        >
          <span>🏠</span>
          <span>Trang chủ</span>
        </Link>
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-purple-900">
            edu<span className="text-orange-500">bee</span> ➔ Toán Học
          </h1>
        </div>
        <div className="w-24"></div>
      </div>

      {/* Tiêu đề phần chọn chủ đề học */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          🧠 Chọn Chủ Đề Học Tập
        </h2>
        <p className="text-gray-600">
          Bé hãy chọn một chủ đề bên dưới để bắt đầu hành trình khám phá nhé!
        </p>
      </div>

      {/* Danh sách chủ đề học lý thuyết */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-12">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            href={topic.href}
            className={`group relative flex flex-col items-center text-center p-8 bg-white rounded-3xl border-2 ${topic.borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
          >
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${topic.color} flex items-center justify-center text-4xl shadow-md mb-6 group-hover:scale-110 transition-transform duration-300`}>
              {topic.icon}
            </div>

            <span className="text-sm font-bold uppercase tracking-wider text-orange-600 mb-1">
              {topic.title}
            </span>
            <h3 className="text-xl font-extrabold text-gray-800 mb-3">
              {topic.vietnameseTitle}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {topic.description}
            </p>

            <span className="mt-auto inline-flex items-center justify-center w-full py-3 px-6 rounded-xl bg-purple-50 text-purple-700 font-bold group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
              Bắt đầu học ➔
            </span>
          </Link>
        ))}
      </div>

      {/* Tiêu đề phần Trò chơi & Kiểm tra */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          🎯 Trò Chơi & Luyện Tập
        </h2>
        <p className="text-gray-600">
          Thử sức với các trò chơi trắc nghiệm và xem thành tích của bé nào!
        </p>
      </div>

      {/* Danh sách Quiz, Bài tập và Kết quả */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-12">
        {activities.map((activity) => (
          <Link
            key={activity.id}
            href={activity.href}
            className={`group relative flex flex-col items-center text-center p-8 bg-white rounded-3xl border-2 ${activity.borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
          >
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${activity.color} flex items-center justify-center text-4xl shadow-md mb-6 group-hover:scale-110 transition-transform duration-300`}>
              {activity.icon}
            </div>

            <span className="text-sm font-bold uppercase tracking-wider text-purple-600 mb-1">
              {activity.title}
            </span>
            <h3 className="text-xl font-extrabold text-gray-800 mb-3">
              {activity.vietnameseTitle}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {activity.description}
            </p>

            <span className="mt-auto inline-flex items-center justify-center w-full py-3 px-6 rounded-xl bg-orange-50 text-orange-600 font-bold group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
              Tham gia ngay ➔
            </span>
          </Link>
        ))}
      </div>

      {/* UI Xem lại lịch sử & chi tiết kết quả Bài tập dành cho Phụ huynh */}
      <div className="w-full max-w-4xl bg-white rounded-3xl border-2 border-amber-200 p-8 shadow-xl mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b gap-3">
          <div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Dành cho phụ huynh
            </span>
            <h3 className="text-xl font-extrabold text-gray-800 mt-1">
              📊 Lịch sử & Chi tiết kết quả bài tập của bé
            </h3>
          </div>
          <Link
            href="/math/results"
            className="text-sm font-bold text-purple-600 hover:text-purple-800 bg-purple-50 px-4 py-2 rounded-xl transition"
          >
            Trang kết quả đầy đủ ➔
          </Link>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p className="text-sm">Chưa có kết quả luyện tập nào được ghi nhận gần đây.</p>
            <Link
              href="/math/exercises"
              className="inline-block mt-3 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl shadow transition"
            >
              Làm bài tập ngay 📝
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cột trái: Danh sách các lần làm bài (để click chọn) */}
            <div className="md:col-span-1 border-r md:pr-4 flex flex-col gap-2 max-h-80 overflow-y-auto">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">Chọn lần làm bài:</p>
              {history.map((session, idx) => {
                const isSelected = selectedSessionIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedSessionIndex(idx)}
                    className={`w-full text-left p-3 rounded-2xl border transition cursor-pointer flex flex-col gap-1 ${
                      isSelected 
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md' 
                        : 'bg-gray-50 hover:bg-purple-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span>Lần #{history.length - idx}</span>
                      <span className={`px-2 py-0.5 rounded-full ${isSelected ? 'bg-purple-700 text-white' : 'bg-amber-100 text-amber-800'}`}>
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

            {/* Cột phải: Hiển thị đầy đủ thông tin chi tiết của lần làm bài được chọn */}
            <div className="md:col-span-2 flex flex-col gap-4">
              {currentSelectedSession && (
                <>
                  <div className="flex flex-wrap items-center justify-between bg-amber-50/60 p-4 rounded-2xl border border-amber-100">
                    <div>
                      <p className="text-xs text-gray-500">🕒 Thời gian làm bài:</p>
                      <p className="text-sm font-bold text-gray-800">{currentSelectedSession.date}</p>
                    </div>
                    <div className="mt-2 sm:mt-0 bg-white px-4 py-2 rounded-xl shadow-sm border border-amber-200">
                      <span className="text-xs text-gray-500 block">Điểm số đạt được:</span>
                      <span className="text-lg font-extrabold text-amber-600">{currentSelectedSession.score} điểm</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-700 text-sm mb-3 flex items-center justify-between">
                      <span>📋 Nhật ký câu trả lời sai:</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${currentSelectedSession.wrongQuestions.length === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {currentSelectedSession.wrongQuestions.length === 0 ? 'Không có câu sai 🎉' : `${currentSelectedSession.wrongQuestions.length} câu sai`}
                      </span>
                    </h4>

                    {currentSelectedSession.wrongQuestions.length === 0 ? (
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-center text-sm font-medium">
                        🎉 Tuyệt vời! Bé không trả lời sai câu nào trong lần làm bài này!
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {currentSelectedSession.wrongQuestions.map((item, idx) => (
                          <div key={idx} className="bg-rose-50/50 border border-rose-100 p-3 rounded-2xl text-xs flex flex-col gap-1">
                            <span className="font-bold text-purple-600">{item.lessonTitle}</span>
                            <p className="font-extrabold text-gray-800 text-sm">{item.title} ({item.equation})</p>
                            <div className="flex flex-wrap gap-3 mt-1">
                              <span className="text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                                Bé chọn: <strong>{item.selectedOption}</strong>
                              </span>
                              <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                                Đáp án đúng: <strong>{item.correctAnswer}</strong>
                              </span>
                            </div>
                            <p className="text-gray-500 italic mt-0.5">💡 {item.explanation}</p>
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
    </main>
  );
}