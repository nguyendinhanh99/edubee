
'use client';

import { useState } from 'react';
import Link from 'next/link';
import FeedbackModal from '@/components/FeedbackModal';

export default function HomePage() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const subjects = [
    { name: 'Động vật', icon: '🦊', active: true, href: '/quiz' },
    { name: 'Tiếng Việt', icon: '📖', active: false },
    { name: 'Toán', icon: '🔢', active: false },
    { name: 'Khoa học', icon: '🔬', active: false },
    { name: 'Nghệ thuật', icon: '🎨', active: false },
    { name: 'Văn hóa', icon: '🏮', active: false },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 border-4 border-purple-200">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-purple-900 font-extrabold px-3 py-1 rounded-lg text-lg">EduBee</span>
            <span className="text-gray-600 font-medium">EduBee – Học mà chơi, chơi mà giỏi!</span>
          </div>
          <button 
            onClick={() => setIsFeedbackOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow transition"
          >
            Góp ý 💌
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-gray-700">
          Phiên bản thử nghiệm, rất mong nhận được sự góp ý của quý thầy cô, quý phụ huynh và các bạn nhỏ ủng hộ.
        </div>

        <div className="grid grid-cols-3 gap-4">
          {subjects.map((sub, index) => (
            sub.active ? (
              <Link 
                key={index} 
                href={sub.href!}
                className="flex flex-col items-center justify-center p-6 bg-purple-50 hover:bg-purple-100 border-2 border-purple-400 rounded-2xl shadow transition cursor-pointer"
              >
                <span className="text-4xl mb-2">{sub.icon}</span>
                <span className="font-bold text-purple-900">{sub.name}</span>
              </Link>
            ) : (
              <div 
                key={index}
                className="flex flex-col items-center justify-center p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl opacity-60 cursor-not-allowed"
              >
                <span className="text-4xl mb-2">{sub.icon}</span>
                <span className="font-semibold text-gray-500 text-sm text-center">{sub.name}</span>
                <span className="text-[10px] text-orange-500 font-bold mt-1">Đang phát triển</span>
              </div>
            )
          ))}
        </div>
      </div>

      {isFeedbackOpen && <FeedbackModal onClose={() => setIsFeedbackOpen(false)} />}
    </div>
  );
}