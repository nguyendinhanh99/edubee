'use client';

import { useState, useEffect, useRef } from 'react';
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

    // Xử lý khi chọn đáp án: Dừng lại ở màn hình feedback, KHÔNG tự động chuyển nữa
    const handleSelectAnswer = (optionId: string) => {
        if (selectedAnswerId) return;

        setSelectedAnswerId(optionId);
        const chosenOption = currentQ.options.find(opt => opt.id === optionId);
        const isCorrect = chosenOption?.isCorrect ?? false;
        setIsLastAnswerCorrect(isCorrect);

        // Phát âm thanh đúng/sai
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

        // Hiển thị màn hình feedback và DỪNG LẠI TẠI ĐÂY cho đến khi bấm nút Tiếp theo
        setShowFeedback(true);
    };

    // Chỉ chuyển sang câu tiếp theo khi bấm nút "Tiếp theo"
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

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 border-4 border-purple-200">

                {isCompleted ? (
                    <div className="text-center py-10 space-y-6">
                        <div className="text-6xl">🎉 🎆 🏆 🎆 🎉</div>
                        <h2 className="text-2xl font-black text-purple-900">
                            Chúc mừng bạn nhỏ đã hoàn thành xuất sắc
                        </h2>
                        <div className="text-4xl font-extrabold text-orange-500">
                            {totalScore} Điểm 🏆
                        </div>
                        <Link
                            href="/home"
                            className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-2xl shadow transition"
                        >
                            Hoàn thành
                        </Link>
                    </div>
                ) : !showFeedback ? (
                    <div>
                        <div className="flex justify-between items-center mb-6 bg-purple-50 p-4 rounded-2xl border border-purple-200">
                            <span className="font-bold text-purple-900 text-lg">{currentQ.question}</span>
                            
                            <button
                                onClick={() => speakText(currentQ.question)}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1.5 rounded-xl shadow transition text-xs flex items-center gap-1 shrink-0 ml-2"
                            >
                                🔊 Đọc lại
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {currentQ.options.map((opt) => {
                                let stateClass = "bg-gray-50 hover:bg-purple-50 border-gray-200 hover:border-purple-400";
                                if (selectedAnswerId === opt.id) {
                                    stateClass = isLastAnswerCorrect 
                                        ? "bg-green-100 border-green-500" 
                                        : "bg-red-100 border-red-500";
                                }

                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleSelectAnswer(opt.id)}
                                        disabled={selectedAnswerId !== null}
                                        className={`p-6 border-2 rounded-2xl flex flex-col items-center transition shadow-sm ${stateClass}`}
                                    >
                                        <span className="text-6xl mb-2">{opt.icon}</span>
                                        <span className="font-bold text-gray-700">{opt.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 animate-fadeIn">
                        <div className={`p-3 rounded-xl border font-bold text-center ${isLastAnswerCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-700'}`}>
                            {isLastAnswerCorrect ? `Tuyệt vời, chính xác! (+${currentQ.score} Điểm)` : 'Ôi, đáp án chưa đúng rồi!'}
                        </div>

                        <div className="w-full bg-black rounded-2xl overflow-hidden shadow-inner flex flex-col items-center">
                            <video
                                key={feedback.videoUrl}
                                autoPlay
                                loop
                                muted
                                playsInline
                                controls
                                className="w-full max-h-64 object-contain rounded-2xl"
                            >
                                <source src={feedback.videoUrl} type="video/mp4" />
                                Trình duyệt của bạn không hỗ trợ thẻ video.
                            </video>
                        </div>

                        {/* Khung Kiến thức: Tự động đọc và có nút Nghe lại */}
                        <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-sm text-gray-700 flex justify-between items-center">
                            <div>
                                <span className="font-bold">Kiến thức:</span> {feedback.knowledge}
                            </div>
                            <button 
                                onClick={() => speakText(feedback.knowledge)}
                                className="ml-3 bg-yellow-200 hover:bg-yellow-300 p-2 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1"
                                title="Nghe lại kiến thức"
                            >
                                🔊 Nghe
                            </button>
                        </div>

                        {/* Nút Tiếp theo giữ nguyên vị trí, chỉ khi bấm mới chuyển câu */}
                        <div className="flex justify-end pt-2">
                            <button onClick={handleNextQuestion} className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2.5 rounded-xl shadow transition">
                                Tiếp theo
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}