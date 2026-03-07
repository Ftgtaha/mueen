import React from 'react';
import { Activity, ShieldCheck, Zap, Droplet, Battery, RefreshCcw } from 'lucide-react';

const VitalsDisplay = ({ glucose, ketones, glucagonLevel, battery, isPumping, isScanning, hasResult, requiredDose, onHardwareInject, onRefill }) => {

    if (!hasResult && !isScanning) {
        return (
            <div className="glass-panel p-8 mb-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[160px] animate-in fade-in duration-700">
                <div className="w-16 h-16 rounded-full bg-mueen-blue/10 flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-gray-500" />
                </div>
                <div>
                    <h3 className="text-gray-400 font-medium">وضع الاستعداد للإنقاذ</h3>
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">Ready to Rescue</p>
                </div>
            </div>
        );
    }

    if (isScanning) {
        return (
            <div className="glass-panel p-8 mb-6 flex flex-col items-center justify-center text-center space-y-6 min-h-[160px]">
                <div className="relative">
                    <Activity className="w-12 h-12 text-mueen-cyan animate-pulse" />
                    <div className="absolute inset-x-0 -bottom-2 h-1 bg-mueen-cyan/20 rounded-full overflow-hidden">
                        <div className="h-full bg-mueen-cyan w-1/2 animate-[progress_1s_ease-in-out_infinite]"></div>
                    </div>
                </div>
                <p className="text-mueen-cyan font-bold animate-pulse">جاري الفحص المجهري السريع...</p>
                <style dangerouslySetInnerHTML={{
                    __html: `
          @keyframes progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}} />
            </div>
        );
    }

    return (
        <div className="space-y-4 mb-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 gap-4">
                {/* Glucose Result */}
                <div className="glass-panel p-5 flex flex-col items-center justify-center relative overflow-hidden ring-1 ring-mueen-blue/20">
                    <div className="absolute top-0 right-0 p-2 opacity-20">
                        <Activity className="w-4 h-4 text-mueen-cyan" />
                    </div>
                    <span className="text-gray-400 text-xs mb-1">نتيجة الفحص</span>
                    <div className="text-4xl font-bold bg-gradient-to-br from-white to-mueen-cyan bg-clip-text text-transparent">
                        {Math.round(glucose)}
                    </div>
                    <span className="text-gray-500 text-[10px] uppercase">mg/dL</span>
                </div>

                {/* Ketone Result */}
                <div className="glass-panel p-5 flex flex-col items-center justify-center relative overflow-hidden ring-1 ring-mueen-blue/20">
                    <span className="text-gray-400 text-xs mb-1">الكيتونات</span>
                    <div className="text-2xl font-bold text-white">
                        {ketones.toFixed(1)}
                    </div>
                    <span className="text-gray-500 text-[10px] uppercase">mmol/L</span>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-3 flex items-center justify-between min-h-[50px]">
                    <div className="flex items-center space-x-2 space-x-reverse min-w-0 flex-1">
                        <Droplet className={`w-4 h-4 flex-shrink-0 ${isPumping ? 'text-red-500 animate-pulse' : 'text-mueen-blue'}`} />
                        <span className="text-gray-400 text-[10px] font-medium leading-tight truncate">كمية القلوكاجون</span>
                    </div>
                    <div className="flex items-baseline space-x-1 space-x-reverse flex-shrink-0 mr-2">
                        <span className="text-sm font-bold text-mueen-cyan leading-none">{glucagonLevel.toFixed(2)}</span>
                        <span className="text-[8px] text-gray-500 font-bold uppercase leading-none">ملي</span>
                    </div>
                </div>

                <div className="glass-panel p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2 space-x-reverse">
                        <Battery className="w-4 h-4 text-green-400" />
                        <span className="text-gray-400 text-[10px] font-medium leading-tight">البطارية</span>
                    </div>
                    <span className="text-sm font-bold">{battery}%</span>
                </div>
            </div>

            {/* Patient Action Buttons */}
            <div className="grid grid-cols-5 gap-2 mt-4">
                <button
                    onClick={onHardwareInject}
                    className={`col-span-4 py-2 px-4 rounded-xl font-bold flex flex-col items-center justify-center transition-all active:scale-95 border ${isPumping
                        ? 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse'
                        : 'bg-mueen-blue/20 border-mueen-blue/50 text-mueen-cyan hover:bg-mueen-blue/30 shadow-[0_0_20px_rgba(41,121,255,0.2)]'
                        }`}
                >
                    <div className="flex items-center space-x-2 space-x-reverse mb-1">
                        <Zap className={`w-5 h-5 ${isPumping ? 'animate-bounce' : ''}`} />
                        <span className="text-sm">{isPumping ? 'إيقاف الضخ' : 'تشغيل الضخ اليدوي'}</span>
                        <span className="text-xs opacity-70">[{glucagonLevel.toFixed(2)} متبقي]</span>
                    </div>
                    {!isPumping && requiredDose > 0 && (
                        <span className="text-[10px] bg-mueen-blue/30 text-white px-2 py-0.5 rounded-full mt-0.5 border border-mueen-cyan/30">
                            يحتاج المريض: {requiredDose} مل تقريباً
                        </span>
                    )}
                    {!isPumping && requiredDose === 0 && (
                        <span className="text-[10px] text-gray-400 mt-0.5">
                            حالة استقرار (لا يحتاج ضخ)
                        </span>
                    )}
                </button>

                <button
                    onClick={onRefill}
                    className="col-span-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95"
                    title="إعادة التعبئة"
                >
                    <RefreshCcw className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default VitalsDisplay;
