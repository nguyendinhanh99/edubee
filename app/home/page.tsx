'use client';

import { useState } from 'react';
import Link from 'next/link';
import FeedbackModal from '@/components/FeedbackModal';
interface Subject {
  name: string;
  icon: string;
  active: boolean;
  href?: string;
  badge?: string;
  description?: string;
}

export default function HomePage() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const subjects: Subject[] = [
    { 
      name: 'Động vật', 
      icon: '🦊', 
      active: true, 
      href: '/quiz',
      description: 'Khám phá thế giới loài vật'
    },
    { 
      name: 'Toán học', 
      icon: '🔢', 
      active: true, 
      href: '/math',
      description: 'Luyện tập tư duy con số'
    },
    { 
      name: 'Trò chơi', 
      icon: '🎮', 
      active: true, 
      href: '/games', // Bạn có thể đổi đường dẫn tới trang game thực tế của bạn
      badge: 'Mới 🔥',
      description: 'Vừa học vừa chơi cực vui'
    },
    { 
      name: 'Tiếng Việt', 
      icon: '📖', 
      active: false,
      description: 'Học chữ cái và tập đọc'
    },
    { 
      name: 'Khoa học', 
      icon: '🔬', 
      active: false,
      description: 'Thí nghiệm kỳ thú'
    },
    { 
      name: 'Nghệ thuật', 
      icon: '🎨', 
      active: false,
      description: 'Tập tô màu và sáng tạo'
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-10 px-4 flex flex-col items-center justify-between">
      {/* Container chính */}
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-8 border border-white/60">
        
        {/* Header trang */}
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-100 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 to-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200 text-2xl">
              🐱
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                EduCat
              </h1>
              <p className="text-xs md:text-sm text-gray-500 font-medium">
                Học mà chơi, chơi mà giỏi!
              </p>
            </div>
          </div>

          <button 
            onClick={() => setIsFeedbackOpen(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Góp ý</span>
            <span>💌</span>
          </button>
        </header>

        {/* Thông báo phiên bản thử nghiệm */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-4 mb-8 flex items-start gap-3 shadow-sm">
          <span className="text-xl">💡</span>
          <p className="text-xs md:text-sm text-amber-900 leading-relaxed font-medium">
            <strong className="font-bold">Phiên bản thử nghiệm:</strong> Rất mong nhận được sự góp ý của quý thầy cô, quý phụ huynh và các bạn nhỏ để EduCat ngày càng hoàn thiện hơn.
          </p>
        </div>

        {/* Tiêu đề danh sách */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-800">Chọn chủ đề học tập</h2>
          <p className="text-xs text-gray-400">Khám phá các bài học và trò chơi thú vị bên dưới</p>
        </div>

        {/* Lưới các môn học / trò chơi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {subjects.map((sub, index) => (
            sub.active ? (
              <Link 
                key={index} 
                href={sub.href!}
                className="group relative flex flex-col items-start p-5 bg-gradient-to-b from-white to-purple-50/40 hover:from-purple-50 hover:to-purple-100/60 border-2 border-purple-200 hover:border-purple-400 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                {sub.badge && (
                  <span className="absolute top-3 right-3 bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                    {sub.badge}
                  </span>
                )}
                <div className="text-4xl mb-3 p-3 bg-white rounded-2xl shadow-md group-hover:scale-110 transition-transform duration-300">
                  {sub.icon}
                </div>
                <h3 className="font-bold text-gray-800 text-base mb-0.5 group-hover:text-purple-700 transition-colors">
                  {sub.name}
                </h3>
                {sub.description && (
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {sub.description}
                  </p>
                )}
              </Link>
            ) : (
              <div 
                key={index}
                className="relative flex flex-col items-start p-5 bg-gray-50/60 border-2 border-dashed border-gray-200 rounded-2xl opacity-60 cursor-not-allowed select-none"
              >
                <span className="absolute top-3 right-3 bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Sắp ra mắt
                </span>
                <div className="text-4xl mb-3 p-3 bg-gray-100 rounded-2xl grayscale">
                  {sub.icon}
                </div>
                <h3 className="font-semibold text-gray-500 text-base mb-0.5">
                  {sub.name}
                </h3>
                {sub.description && (
                  <p className="text-xs text-gray-400 line-clamp-1">
                    {sub.description}
                  </p>
                )}
              </div>
            )
          ))}
        </div>

      </div>

      {/* Footer nhỏ */}
      <footer className="mt-8 text-center text-xs text-gray-400 font-medium">
        © 2026 EduCat. All rights reserved.
      </footer>

      {/* Modal góp ý */}
      {isFeedbackOpen && <FeedbackModal onClose={() => setIsFeedbackOpen(false)} />}
    </main>
  );
}