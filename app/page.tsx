'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function WelcomePage() {
  const [isMuted, setIsMuted] = useState(false);

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-4 selection:bg-white selection:text-orange-600">
      
      {/* 1. Các hiệu ứng hình khối trang trí nền chuyển động mượt mà */}
      <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-white/15 blur-2xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-yellow-300/20 blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 h-20 w-20 rounded-full bg-white/10 blur-xl animate-bounce duration-1000 pointer-events-none" />

      {/* Nút bật/tắt âm thanh (Tính năng UX tiện ích cho app trẻ em) */}
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="absolute top-6 right-6 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-lg transition hover:scale-110 active:scale-95"
        title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
      >
        <span className="text-xl">{isMuted ? '🔇' : '🔊'}</span>
      </button>

      {/* 2. Khung nội dung chính (Glassmorphism chuẩn hiện đại) */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full rounded-[48px] bg-white/15 p-8 sm:p-10 backdrop-blur-2xl shadow-[0_16px_40px_0_rgba(0,0,0,0.18)] border border-white/30 text-center">
        
        {/* Badge định vị thương hiệu nhỏ phía trên */}
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1.5 border border-white/25 shadow-sm">
          <span className="animate-spin text-sm">✨</span>
          <span className="text-xs font-bold tracking-wide text-white uppercase">Học mà chơi • Chơi mà học</span>
        </div>

        {/* Biểu tượng chính với hiệu ứng bóng và bay lượn */}
        <div className="relative my-4 flex h-40 w-40 sm:h-48 sm:w-48 items-center justify-center text-7xl sm:text-8xl animate-bounce duration-1000">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 to-yellow-200/40 blur-2xl -z-10 animate-pulse" />
          <span className="filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.15)]">🐬</span>
        </div>

        {/* Tên thương hiệu edubee */}
        <div className="mb-2">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
            edu<span className="text-amber-200">cat</span>
          </h1>
        </div>

        {/* Mô tả ngắn gọn, thân thiện */}
        <p className="mb-8 text-sm sm:text-base text-orange-50 font-medium max-w-[280px] leading-relaxed">
          Cùng bé khám phá thế giới diệu kỳ qua hàng trăm bài học và trò chơi vui nhộn!
        </p>

        {/* 3. Nút Khám Phá Ngay với hiệu ứng tương tác cao cấp */}
        <Link 
          href="/home"
          className="group relative inline-flex items-center justify-center w-full rounded-2xl bg-gradient-to-r from-white via-orange-50 to-white px-8 py-4 text-lg font-black text-orange-600 shadow-[0_10px_25px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_15px_30px_rgba(0,0,0,0.25)] active:scale-95 border border-white/60"
        >
          <span className="tracking-wide">Khám Phá Ngay</span>
          <span className="ml-3 transition-transform duration-300 group-hover:translate-x-2 text-xl">
            🚀
          </span>
        </Link>

        {/* Thông tin nhỏ dưới cùng */}
        <span className="mt-6 text-[11px] text-white/70 font-semibold tracking-wider uppercase">
          Phiên bản tương tác thông minh 🌟
        </span>

      </div>
    </main>
  );
}