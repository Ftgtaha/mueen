import React, { useEffect } from 'react';
import { Syringe, RefreshCcw, Hand, AlertCircle, Activity, Flame, ShieldAlert, ArrowUpCircle } from 'lucide-react';

const PresenterControlPanel = ({ onStartEmergency, onHardwareInject, onRefill, currentScenario, glucagon, isPumping, requiredDose }) => {
    const scenarios = [
        { id: 'normal', name: 'سليم (80-180)', icon: Activity, color: 'text-mueen-cyan' },
        { id: 'pre_hypo', name: 'تحذير (70-79)', icon: ShieldAlert, color: 'text-yellow-500' },
        { id: 'hypo_danger', name: 'خطر هبوط (20-69)', icon: AlertCircle, color: 'text-red-500' },
        { id: 'hyper', name: 'ارتفاع (300+)', icon: ArrowUpCircle, color: 'text-orange-500' },
        { id: 'high_ketones', name: 'خطر كيتونات', icon: Flame, color: 'text-purple-500' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 border-t border-mueen-blue/30 z-[100] backdrop-blur-xl">
            <div className="max-w-md mx-auto space-y-4">
                <h3 className="text-gray-400 text-[10px] mb-1 uppercase tracking-[0.2em] text-center font-bold font-sans">Presenter Control Panel</h3>

                {/* Scenario Selection Buttons */}
                <div className="grid grid-cols-5 gap-1.5">
                    {scenarios.map((s) => {
                        const Icon = s.icon;
                        return (
                            <button
                                key={s.id}
                                onClick={() => onStartEmergency(s.id)}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${currentScenario === s.id
                                    ? 'bg-white/10 border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                <Icon className={`w-4 h-4 mb-1 ${s.color}`} />
                                <span className="text-[8px] text-white font-bold text-center leading-tight">{s.name}</span>
                            </button>
                        )
                    })}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-5 gap-2">
                    <button
                        onClick={onHardwareInject}
                        className={`col-span-4 py-2 px-4 rounded-xl font-bold flex flex-col items-center justify-center transition-all active:scale-95 border ${isPumping
                            ? 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse'
                            : 'bg-mueen-blue/20 border-mueen-blue/50 text-mueen-cyan hover:bg-mueen-blue/30 shadow-[0_0_20px_rgba(41,121,255,0.2)]'
                            }`}
                    >
                        <div className="flex items-center space-x-2 space-x-reverse mb-1">
                            <Syringe className={`w-5 h-5 ${isPumping ? 'animate-bounce' : ''}`} />
                            <span className="text-sm">{isPumping ? 'إيقاف الضخ' : 'بدء الضخ'}</span>
                            <span className="text-xs opacity-70">[{glucagon.toFixed(2)} متبقي]</span>
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
        </div>
    );
};

export default PresenterControlPanel;
