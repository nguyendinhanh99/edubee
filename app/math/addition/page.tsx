'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import additionData from '@/app/data/math_addition.json';

export default function AdditionFlashcardPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flashcards = additionData.flashcards;
  const currentCard = flashcards[currentIndex];

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

  // Tách phương trình (ví dụ: "5 + 3 = 8")
  const parts = currentCard.equation.split(' ');
  const num1 = parts[0];
  const operator = parts[1];
  const num2 = parts[2];
  const equals = parts[3];
  const result = parts[4];

  // Tách chuỗi icon từ trường icon (ví dụ: "🍎 + 🍎 = 🍎🍎") thành các phần riêng biệt
  const iconParts = currentCard.icon.split(' ');
  const group1Icons = iconParts[0] || '';
  const opSign = iconParts[1] || '+';
  const group2Icons = iconParts[2] || '';
  const eqSign = iconParts[3] || '=';
  const resultIcons = iconParts[4] || '';

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-emerald-100 via-teal-50 to-blue-50 p-6 flex flex-col items-center justify-between">
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-between">
        <Link 
          href="/math"
          className="bg-white px-4 py-2 rounded-2xl shadow-sm text-gray-700 font-semibold hover:bg-gray-50 transition"
        >
          ⬅️ Quay lại
        </Link>
        <span className="text-lg font-extrabold text-teal-600 bg-white px-4 py-1 rounded-full shadow-sm">
          Bài tập: {currentIndex + 1} / {flashcards.length}
        </span>
        
        <button
          onClick={() => speakText(currentCard.questionText)}
          className="bg-white p-3 rounded-2xl shadow-sm text-xl hover:bg-teal-50 transition cursor-pointer"
          title="Nghe đọc lại"
        >
          🔊
        </button>
      </div>

      {/* Nội dung Phép cộng chính */}
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8 border-4 border-teal-200 flex flex-col items-center text-center my-auto transition-all duration-300">
        
        {/* Phép tính */}
        <div className="text-4xl sm:text-6xl font-extrabold mb-4 bg-teal-50 px-6 py-3 rounded-2xl shadow-inner tracking-wider flex items-center gap-3">
          <span className="text-teal-700">{num1}</span>
          <span className="text-rose-500">{operator}</span>
          <span className="text-teal-700">{num2}</span>
          <span className="text-amber-500">{equals}</span>
          <span className="text-emerald-600">{result}</span>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {currentCard.title}
        </h2>
        
        {/* Sắp xếp hình ảnh trực quan thành các nhóm rõ ràng, có khung bao quanh từng vế */}
        <div className="my-6 bg-blue-50 w-full p-4 rounded-2xl shadow-inner flex flex-wrap items-center justify-center gap-3">
          {/* Nhóm 1 */}
          <div className="bg-white px-3 py-2 rounded-xl shadow-sm border border-blue-100 text-2xl sm:text-3xl flex flex-wrap justify-center max-w-[120px] gap-1">
            {group1Icons}
          </div>
          
          {/* Dấu cộng */}
          <span className="text-2xl font-extrabold text-rose-500">{opSign}</span>

          {/* Nhóm 2 */}
          <div className="bg-white px-3 py-2 rounded-xl shadow-sm border border-blue-100 text-2xl sm:text-3xl flex flex-wrap justify-center max-w-[120px] gap-1">
            {group2Icons}
          </div>

          {/* Dấu bằng */}
          <span className="text-2xl font-extrabold text-amber-500">{eqSign}</span>

          {/* Kết quả tổng */}
          <div className="bg-emerald-50 px-3 py-2 rounded-xl shadow-sm border border-emerald-200 text-2xl sm:text-3xl flex flex-wrap justify-center max-w-[150px] gap-1">
            {resultIcons}
          </div>
        </div>

        <p className="text-lg text-gray-600 font-medium mb-4">
          {currentCard.description}
        </p>
        
        <button 
          onClick={() => speakText(currentCard.countText)}
          className="bg-teal-100 hover:bg-teal-200 text-teal-800 font-bold px-6 py-2 rounded-full text-base transition cursor-pointer shadow-sm"
        >
          📢 Nghe đọc phép tính: {currentCard.countText}
        </button>
      </div>

      {/* Thanh điều hướng */}
      <div className="w-full max-w-xl flex flex-col gap-4">
        <div className="flex justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex-1 py-3 rounded-2xl font-bold text-lg shadow transition ${
              currentIndex === 0 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-teal-600 hover:bg-teal-50 border-2 border-teal-200'
            }`}
          >
            ⬅️ Phép toán trước
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === flashcards.length - 1}
            className={`flex-1 py-3 rounded-2xl font-bold text-lg shadow transition ${
              currentIndex === flashcards.length - 1 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-teal-500 text-white hover:bg-teal-600'
            }`}
          >
            Phép toán tiếp ➡️
          </button>
        </div>

        {currentIndex === flashcards.length - 1 && (
          <Link
            href="/math"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xl text-center shadow-xl hover:from-emerald-700 hover:to-teal-700 transition block"
          >
            🎉 Hoàn thành chương trình Phép Cộng! Quay lại trang chủ ➔
          </Link>
        )}
      </div>
    </main>
  );
}