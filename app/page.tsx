'use client';

import Link from 'next/link';

export default function WelcomePage() {
  return (
    <main className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-orange-400 via-orange-500 to-amber-500 p-4">
      {/* Các hiệu ứng bong bóng trang trí nền */}
      <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-orange-300/20 blur-3xl pointer-events-none" />

      {/* Khung nội dung chính */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full rounded-[40px] bg-white/20 p-8 sm:p-10 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] border border-white/30 text-center">
        
        {/* Biểu tượng với hiệu ứng bay lượn nhẹ nhàng */}
        <div className="relative mb-6 flex h-44 w-44 sm:h-52 sm:w-52 items-center justify-center text-8xl sm:text-9xl animate-bounce duration-1000">
          <div className="absolute inset-0 rounded-full bg-white/30 blur-xl -z-10 animate-pulse" />
          🐬
        </div>

        {/* Tên thương hiệu edubee */}
        <div className="mb-2">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
            edu<span className="text-amber-200">cat</span>
          </h1>
        </div>

        <p className="mb-8 text-sm sm:text-base text-orange-50 font-medium max-w-[260px]">
          Cùng bé khám phá thế giới diệu kỳ qua những bài học vui nhộn!
        </p>

        {/* Nút Khám Phá Ngay */}
        <Link 
          href="/home"
          className="group relative inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-lg font-bold text-orange-600 shadow-[0_10px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:bg-orange-50 hover:scale-105 hover:shadow-[0_15px_25px_rgba(0,0,0,0.2)] active:scale-95"
        >
          <span>Khám Phá Ngay</span>
          <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
            🚀
          </span>
        </Link>
      </div>
    </main>
  );
}