'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import quizData from '@/app/data/quizData.json';

export default function QuizPage() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
    const [isLastAnswerCorrect, setIsLastAnswerCorrect] = useState<boolean | null>(null);
    const [showFeedback, setShowFeedback] = useState<boolean>(false);
    const [totalScore, setTotalScore] = useState<number>(0);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    
    const currentQ = quizData.questions[currentQuestionIndex];
    const feedback = isLastAnswerCorrect ? currentQ.correctFeedback : currentQ.incorrectFeedback;

    // --- HÀM ĐỌC VĂN BẢN CHUNG (Sử dụng Web Speech API) ---
    const speakText = (text: string) => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'vi-VN';
        utterance.rate = 0.75;
        utterance.pitch = 1.1;

        window.speechSynthesis.speak(utterance);
    };

    // 1. Tự động đọc câu hỏi khi hiển thị màn hình câu hỏi
    useEffect(() => {
        if (!isCompleted && !showFeedback) {
            const timer = setTimeout(() => {
                speakText(currentQ.question);
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [currentQuestionIndex, showFeedback, isCompleted, currentQ.question]);

    // 2. Tự động đọc phần "Kiến thức" khi chuyển sang màn hình feedback
    useEffect(() => {
        if (!isCompleted && showFeedback && feedback?.knowledge) {
            const timer = setTimeout(() => {
                speakText(feedback.knowledge);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [showFeedback, feedback?.knowledge, isCompleted]);

    useEffect(() => {
        return () => {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // Xử lý khi chọn đáp án
    const handleSelectAnswer = (optionId: string) => {
        if (selectedAnswerId) return;

        setSelectedAnswerId(optionId);
        const chosenOption = currentQ.options.find(opt => opt.id === optionId);
        const isCorrect = chosenOption?.isCorrect ?? false;
        setIsLastAnswerCorrect(isCorrect);

        if (isCorrect) {
            setTotalScore(prev => prev + currentQ.score);
        }
        
        if (isCorrect && currentQ.correctFeedback?.soundUrl) {
            const audio = new Audio(currentQ.correctFeedback.soundUrl);
            audio.play().catch(error => console.log("Không thể phát âm thanh:", error));
        } else if (!isCorrect && currentQ.incorrectFeedback?.soundUrl) {
            const audio = new Audio(currentQ.incorrectFeedback.soundUrl);
            audio.play().catch(error => console.log("Không thể phát âm thanh:", error));
        }

        setShowFeedback(true);
    };

    // Chuyển sang câu tiếp theo
    const handleNextQuestion = () => {
        setSelectedAnswerId(null);
        setIsLastAnswerCorrect(null);
        setShowFeedback(false);
        
        if (currentQuestionIndex + 1 < quizData.questions.length) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setIsCompleted(true);
        }
    };

    // Tính toán tiến độ phần trăm câu hỏi
    const progressPercentage = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;

    return (
        <main className="relative min-h-screen w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 sm:p-6 flex flex-col items-center justify-between overflow-hidden selection:bg-yellow-300 selection:text-purple-900">
            
            {/* Hiệu ứng nền trang trí mượt mà */}
            <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl animate-pulse pointer-events-none" />
            <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-yellow-300/20 blur-3xl animate-pulse pointer-events-none" />

            {/* Header Điều Hướng */}
            <div className="relative z-10 w-full max-w-2xl flex items-center justify-between bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/25 shadow-lg mb-4">
                <div className="flex items-center gap-2">
                    <Link 
                        href="/home"
                        className="bg-white/20 hover:bg-white/30 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm border border-white/20"
                        title="Về trang chủ hệ thống"
                    >
                        <span>🏠</span> Trang Chủ
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-black text-yellow-200 bg-black/20 px-3.5 py-1.5 rounded-xl border border-white/10">
                        ⭐ {totalScore} Điểm
                    </span>
                </div>
            </div>

            {/* Khung nội dung Quiz chính */}
            <div className="relative z-10 w-full max-w-xl bg-white/95 backdrop-blur-2xl rounded-[36px] shadow-[0_16px_40px_rgba(0,0,0,0.2)] p-6 sm:p-8 border border-white/50 flex flex-col items-center my-auto transition-all duration-300">

                {isCompleted ? (
                    <div className="text-center py-8 space-y-6 w-full animate-fadeIn">
                        <div className="text-7xl animate-bounce">🎉 🏆 🎉</div>
                        <h2 className="text-2xl sm:text-3xl font-black text-purple-900">
                            Chúc mừng bạn nhỏ đã hoàn thành xuất sắc!
                        </h2>
                        <div className="text-4xl sm:text-5xl font-black text-orange-500 bg-orange-50 py-4 rounded-3xl border-2 border-orange-200">
                            {totalScore} Điểm ⭐
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <Link
                                href="/home"
                                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-lg text-center shadow-lg hover:from-purple-700 hover:to-indigo-700 transition block"
                            >
                                🏠 Về Trang Chủ
                            </Link>
                        </div>
                    </div>
                ) : !showFeedback ? (
                    <div className="w-full">
                        {/* Thanh tiến độ & Số câu hỏi */}
                        <div className="w-full mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-black uppercase tracking-wider text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                                    Câu hỏi {currentQuestionIndex + 1} / {quizData.questions.length}
                                </span>
                            </div>
                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5 shadow-inner">
                                <div 
                                    className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        </div>

                        {/* Tiêu đề câu hỏi & Nút đọc */}
                        <div className="flex justify-between items-center mb-6 bg-purple-50/80 p-4 rounded-2xl border-2 border-purple-100 shadow-inner">
                            <span className="font-extrabold text-purple-900 text-base sm:text-lg leading-relaxed">{currentQ.question}</span>
                            <button
                                onClick={() => speakText(currentQ.question)}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold p-2.5 rounded-xl shadow transition text-base shrink-0 ml-3 cursor-pointer"
                                title="Đọc lại câu hỏi"
                            >
                                🔊
                            </button>
                        </div>

                        {/* Danh sách lựa chọn đáp án */}
                        <div className="grid grid-cols-2 gap-4">
                            {currentQ.options.map((opt) => {
                                let stateClass = "bg-white hover:bg-purple-50/80 border-2 border-purple-100 hover:border-purple-300 text-gray-700 shadow-md";
                                if (selectedAnswerId === opt.id) {
                                    stateClass = isLastAnswerCorrect 
                                        ? "bg-emerald-500 text-white border-2 border-emerald-600 shadow-lg animate-bounce" 
                                        : "bg-rose-500 text-white border-2 border-rose-600 shadow-lg";
                                }

                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleSelectAnswer(opt.id)}
                                        disabled={selectedAnswerId !== null}
                                        className={`p-6 rounded-3xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${stateClass}`}
                                    >
                                        <span className="text-5xl sm:text-6xl mb-2 filter drop-shadow-sm">{opt.icon}</span>
                                        <span className="font-black text-sm sm:text-base text-center">{opt.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 w-full animate-fadeIn">
                        {/* Thông báo kết quả đúng/sai */}
                        <div className={`p-4 rounded-2xl border-2 font-black text-center text-base sm:text-lg shadow-sm ${isLastAnswerCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                            {isLastAnswerCorrect ? `🎉 Tuyệt vời, chính xác! (+${currentQ.score} Điểm)` : '❌ Ôi, đáp án chưa đúng rồi!'}
                        </div>

                        {/* Khung video phản hồi */}
                        <div className="w-full bg-black rounded-2xl overflow-hidden shadow-inner flex flex-col items-center border-2 border-purple-100">
                            <video
                                key={feedback.videoUrl}
                                autoPlay
                                loop
                                muted
                                playsInline
                                controls
                                className="w-full max-h-56 object-contain rounded-2xl"
                            >
                                <source src={feedback.videoUrl} type="video/mp4" />
                                Trình duyệt của bạn không hỗ trợ thẻ video.
                            </video>
                        </div>

                        {/* Khung Kiến thức */}
                        <div className="p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-200 text-xs sm:text-sm text-gray-700 flex justify-between items-center shadow-sm">
                            <div className="leading-relaxed">
                                <span className="font-black text-yellow-900 block mb-0.5">💡 Kiến thức cần nhớ:</span> 
                                {feedback.knowledge}
                            </div>
                            <button 
                                onClick={() => speakText(feedback.knowledge)}
                                className="ml-3 bg-yellow-300 hover:bg-yellow-400 text-yellow-900 p-2.5 rounded-xl text-sm font-bold shrink-0 transition flex items-center gap-1 shadow cursor-pointer"
                                title="Nghe lại kiến thức"
                            >
                                🔊 Nghe
                            </button>
                        </div>

                        {/* Nút Tiếp theo */}
                        <div className="flex justify-end pt-2">
                            <button 
                                onClick={handleNextQuestion} 
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
                            >
                                Câu tiếp theo ➔
                            </button>
                        </div>
                    </div>
                )}

            </div>

            {/* Footer nhỏ */}
            <div className="relative z-10 text-white/80 text-xs mt-4 font-semibold tracking-wider uppercase">
                Hệ thống học tập tương tác edubee 🌟
            </div>
        </main>
    );
}