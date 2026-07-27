'use client';

import Link from 'next/link';

interface GameItem {
  title: string;
  description: string;
  icon: string;
  href?: string;
  active: boolean;
  badge?: string;
  color: string;
}

export default function GamesHubPage() {
  const games: GameItem[] = [
    {
      title: 'Vượt Chướng Ngại Vật',
      description: 'Chạy đua tốc độ, trả lời nhanh câu hỏi để né tránh chướng ngại vật và săn XP!',
      icon: '🏃‍♂️',
      href: '/games/obstacle', // Đường dẫn tới trang game vượt chướng ngại vật
      active: true,
      badge: 'Hot 🔥',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Lật thẻ nhớ',
      description: 'Lật các ô thẻ để tìm cặp hình giống nhau, rèn luyện trí nhớ.',
      icon: '🧠',
      href: '/games/memory',
      active: false,
      badge: 'Sắp ra mắt',
      color: 'from-amber-500 to-orange-500'
    },
    {
      title: 'Đố vui nhanh',
      description: 'Thử thách trả lời nhanh các câu hỏi thú vị với đồng hồ đếm giờ.',
      icon: '⚡',
      active: false,
      badge: 'Sắp ra mắt',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      title: 'Kéo thả thông minh',
      description: 'Kéo thả đáp án vào ô trống để hoàn thành thử thách.',
      icon: '🧩',
      active: false,
      badge: 'Sắp ra mắt',
      color: 'from-emerald-500 to-teal-500'
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-10 px-4 flex flex-col items-center justify-between">
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-8 border border-white/60">
        
        {/* Header của trang Games */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200 text-2xl text-white">
              🎮
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Khu Vực Trò Chơi
              </h1>
              <p className="text-xs md:text-sm text-gray-500 font-medium">
                Vừa học vừa chơi, phát triển tư duy mỗi ngày!
              </p>
            </div>
          </div>

          <Link 
            href="/home"
            className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all shadow-sm"
          >
            <span>🏠</span>
            <span>Trang chủ</span>
          </Link>
        </div>

        {/* Lưới danh sách các game */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {games.map((game, index) => (
            game.active ? (
              <Link 
                key={index} 
                href={game.href!}
                className="group relative flex flex-col p-6 bg-gradient-to-b from-white to-purple-50/40 hover:from-purple-50 hover:to-purple-100/60 border-2 border-purple-200 hover:border-purple-400 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                {game.badge && (
                  <span className="absolute top-4 right-4 bg-rose-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm animate-pulse">
                    {game.badge}
                  </span>
                )}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${game.color} flex items-center justify-center text-3xl shadow-md mb-4 group-hover:scale-110 transition-transform`}>
                  {game.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-purple-700 transition-colors">
                  {game.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                  {game.description}
                </p>
              </Link>
            ) : (
              <div 
                key={index}
                className="relative flex flex-col p-6 bg-gray-50/60 border-2 border-dashed border-gray-200 rounded-3xl opacity-70 cursor-not-allowed select-none"
              >
                <span className="absolute top-4 right-4 bg-gray-200 text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {game.badge}
                </span>
                <div className="w-14 h-14 rounded-2xl bg-gray-200 flex items-center justify-center text-3xl shadow-sm mb-4 grayscale">
                  {game.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-1">
                  {game.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                  {game.description}
                </p>
              </div>
            )
          ))}
        </div>

      </div>

      <footer className="mt-8 text-center text-xs text-gray-400 font-medium">
        © 2026 EduCat. All rights reserved.
      </footer>
    </main>
  );
}