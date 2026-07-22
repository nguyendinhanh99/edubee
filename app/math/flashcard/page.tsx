'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import mathData from '@/app/data/math_numbers.json';

export default function NumberFlashcardPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flashcards = mathData.flashcards;
  const currentCard = flashcards[currentIndex];

  // Hàm phát âm thanh an toàn tuyệt đối, bắt mọi loại lỗi hệ thống
  const speakText = (text: string) => {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'vi-VN';
        utterance.rate = 0.9;
        
        // Bắt lỗi ngầm nếu hệ thống chặn
        utterance.onerror = (e) => {
          console.warn("Hệ thống âm thanh bị chặn hoặc không khả dụng:", e);
        };

        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.warn("Trình duyệt không hỗ trợ Web Speech API", error);
    }
  };

  // Tự động gọi đọc khi chuyển thẻ
  useEffect(() => {
    const timer = setTimeout(() => {
      speakText(currentCard.questionText);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-amber-100 via-orange-50 to-purple-50 p-6 flex flex-col items-center justify-between">
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-between">
        <Link 
          href="/math"
          className="bg-white px-4 py-2 rounded-2xl shadow-sm text-gray-700 font-semibold hover:bg-gray-50 transition"
        >
          ⬅️ Quay lại
        </Link>
        <span className="text-lg font-extrabold text-orange-600 bg-white px-4 py-1 rounded-full shadow-sm">
          Thẻ học: {currentIndex + 1} / {flashcards.length}
        </span>
        
        {/* Nút bấm nghe lại thủ công */}
        <button
          onClick={() => speakText(currentCard.questionText)}
          className="bg-white p-3 rounded-2xl shadow-sm text-xl hover:bg-orange-50 transition cursor-pointer"
          title="Nghe đọc lại"
        >
          🔊
        </button>
      </div>

      {/* Nội dung Flashcard chính */}
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8 border-4 border-orange-200 flex flex-col items-center text-center my-auto transition-all duration-300">
        <span className="text-6xl sm:text-8xl font-extrabold text-orange-500 mb-4 bg-orange-50 w-32 h-32 rounded-full flex items-center justify-center shadow-inner">
          {currentCard.number}
        </span>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {currentCard.title}
        </h2>
        
        <div className="text-5xl my-6 bg-purple-50 w-full py-6 rounded-2xl shadow-inner">
          {currentCard.icon}
        </div>

        <p className="text-lg text-gray-600 font-medium mb-2">
          {currentCard.description}
        </p>
        
        <span className="inline-block bg-orange-100 text-orange-700 font-bold px-4 py-1.5 rounded-full text-sm">
          Số lượng: {currentCard.countText}
        </span>
      </div>

      {/* Thanh điều hướng thẻ & Nút làm bài Quiz */}
      <div className="w-full max-w-xl flex flex-col gap-4">
        <div className="flex justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex-1 py-3 rounded-2xl font-bold text-lg shadow transition ${
              currentIndex === 0 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-orange-600 hover:bg-orange-50 border-2 border-orange-200'
            }`}
          >
            ⬅️ Thẻ trước
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === flashcards.length - 1}
            className={`flex-1 py-3 rounded-2xl font-bold text-lg shadow transition ${
              currentIndex === flashcards.length - 1 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            Thẻ tiếp theo ➡️
          </button>
        </div>

        {/* Nút chuyển sang phần Quiz khi học xong */}
        {currentIndex === flashcards.length - 1 && (
          <Link
            href="/math/quiz"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xl text-center shadow-xl hover:from-purple-700 hover:to-indigo-700 transition animate-bounce block"
          >
            🎯 Đã học xong! Bắt đầu làm Quiz thử thách ngay ➔
          </Link>
        )}
      </div>
    </main>
  );
}