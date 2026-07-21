'use client';

export default function FeedbackModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border-4 border-purple-300 relative">
                <h2 className="text-2xl font-black text-purple-900 text-center mb-4">Hòm thư góp ý 📬</h2>

                <div className="space-y-3 text-sm">
                    <a
                        href="https://www.facebook.com/nguyen.dinh.anh.199356/?locale=vi_VN"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block transition hover:opacity-90"
                    >
                        <div className="p-3 bg-gray-50 rounded-xl border cursor-pointer">
                            <p className="text-gray-500 font-medium">Phản hồi qua Facebook</p>
                            <p className="font-bold text-blue-600">Nguyễn Đình Anh</p>
                        </div>
                    </a>

                    <div className="p-3 bg-gray-50 rounded-xl border">
                        <p className="text-gray-500 font-medium">Phản hồi qua điện thoại</p>
                        <p className="font-bold text-gray-800">0865 2345 54</p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl border">
                        <p className="text-gray-500 font-medium">Phản hồi qua Gmail</p>
                        <p className="font-bold text-gray-800">anvami27@gmail.com</p>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                        <p className="text-sm text-purple-950 font-medium mb-3 leading-relaxed">
                            Nếu bạn yêu thích EduBee và muốn đồng hành cùng chúng mình trong việc phát triển thêm nội dung học tập cho các bé, bạn có thể tự nguyện ủng hộ dự án:
                        </p>
                        <div className="flex justify-between items-center">
                            <div className="text-sm space-y-1.5 text-gray-800">
                                <p>Ngân hàng: <span className="font-bold text-purple-900">MBBANK</span></p>
                                <p>STK: <span className="font-bold text-red-600 text-base">448881999</span></p>
                                <p>Chủ TK: <span className="font-bold text-purple-900">Nguyễn Đình Anh</span></p>
                            </div>
                            <div className="w-35 h-35 bg-white rounded-lg flex items-center justify-center border shadow-sm overflow-hidden p-1">
                                <img
                                    src="/assets/QR.jpg"
                                    alt="QR Ủng hộ dự án"
                                    className="w-full h-full object-cover rounded"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition shadow"
                >
                    Quay lại
                </button>
            </div>
        </div>
    );
}