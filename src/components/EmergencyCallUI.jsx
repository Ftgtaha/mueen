import React from 'react';
import { PhoneCall, AlertTriangle, MapPin } from 'lucide-react';

const EmergencyCallUI = ({ isVisible, onCancel, reason, contactName, contactPhone, onInject, isPumping, glucagonLevel }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-red-950/95 flex flex-col items-center justify-center p-6 z-50 animate-in fade-in duration-500 backdrop-blur-xl">

            {/* Pulse Animation */}
            <div className="w-32 h-32 rounded-full bg-red-500/20 flex items-center justify-center mb-8 animate-pulse">
                <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.8)] relative z-10">
                    <PhoneCall className="w-10 h-10 text-white animate-bounce" />
                </div>
            </div>

            <div className="text-center space-y-4 mb-8">
                <h1 className="text-4xl font-bold text-white tracking-wider flex flex-col items-center justify-center">
                    <AlertTriangle className="w-12 h-12 text-yellow-500 mb-2" />
                    <span>حالة إنقاذ طارئة</span>
                </h1>
                <p className="text-red-200 text-lg px-4 font-bold">{reason || "تم رصد حالة صحية حرجة"}</p>
                <p className="text-red-300/70 text-sm px-4">لم يتم استقبال أي رد فعل من المريض. يتم الآن إبلاغ الطوارئ.</p>
            </div>

            {/* Simulated GPS Location */}
            <div className="w-full max-w-xs glass-panel p-4 mb-6 flex items-center space-x-3 space-x-reverse border-red-500/30">
                <div className="bg-red-500/20 p-2 rounded-lg">
                    <MapPin className="w-5 h-5 text-red-500" />
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase">موقع المريض الحالي (GPS)</p>
                    <p className="text-sm font-bold text-white">حي الملقا، الرياض، السعودية</p>
                </div>
            </div>

            <div className="w-full max-w-xs space-y-4 text-center">
                <div className="bg-white/5 py-4 px-6 rounded-2xl border border-white/10 space-y-1">
                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">جاري الاتصال بـ</p>
                    <p className="text-white text-xl font-bold">{contactName}</p>
                    <p className="text-mueen-cyan font-mono text-lg">{contactPhone}</p>
                </div>

                {/* Emergency Action Button */}
                <button
                    onClick={onInject}
                    className={`w-full py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 border-2 ${isPumping
                        ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                        : 'bg-white text-red-950 border-white hover:bg-gray-100 shadow-[0_0_30px_rgba(255,255,255,0.3)]'
                        }`}
                >
                    <Zap className={`w-6 h-6 ${isPumping ? 'animate-bounce' : ''}`} />
                    <div className="text-right">
                        <p className="text-lg leading-none">{isPumping ? 'إيقاف ضخ الجلوكاجون' : 'بدء ضخ الجلوكاجون (إنقاذ)'}</p>
                        <p className="text-[10px] opacity-70 mt-1">المتبقي في العبوة: {glucagonLevel?.toFixed(2)} مل</p>
                    </div>
                </button>

                <button
                    onClick={onCancel}
                    className="w-full py-2 text-gray-500 hover:text-white transition-colors text-xs underline"
                >
                    إلغاء المحاكاة (للمطور)
                </button>
            </div>

        </div>
    );
};

export default EmergencyCallUI;
