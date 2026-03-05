import React, { useEffect } from 'react';
import { Syringe, RefreshCcw, Hand, AlertCircle, Activity, Flame, ShieldAlert, ArrowUpCircle } from 'lucide-react';

const PresenterControlPanel = ({ onStartEmergency, onHardwareInject, onRefill, currentScenario }) => {

    const handleKeyDown = (e) => {
        if (e.key === '1') onStartEmergency('normal');
        if (e.key === '2') onStartEmergency('pre_hypo');
        if (e.key === '3') onStartEmergency('hypo_danger');
        if (e.key === '4') onHardwareInject();
        if (e.key === '5') onRefill();
        if (e.key === '6') onStartEmergency('hyper');
        if (e.key === '7') onStartEmergency('high_ketones');
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onStartEmergency, onHardwareInject, onRefill]);

    const scenarios = [
        { id: 'normal', name: 'سليم (80-180)', icon: Activity, color: 'text-mueen-cyan', num: '1' },
        { id: 'pre_hypo', name: 'تحذير (70-79)', icon: ShieldAlert, color: 'text-yellow-500', num: '2' },
        { id: 'hypo_danger', name: 'خطر هبوط (20-69)', icon: AlertCircle, color: 'text-red-500', num: '3' },
        { id: 'hyper', name: 'ارتفاع (300+)', icon: ArrowUpCircle, color: 'text-orange-500', num: '6' },
        { id: 'high_ketones', name: 'خطر كيتونات', icon: Flame, color: 'text-purple-500', num: '7' },
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
                                <span className="text-[7px] text-gray-500 mt-0.5">[{s.num}]</span>
                            </button>
                        )
                    })}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-5 gap-2">
                    <button
                        onClick={onHardwareInject}
                        className="col-span-4 py-3 px-4 rounded-xl bg-mueen-blue/20 border border-mueen-blue/50 text-mueen-cyan font-bold flex items-center justify-center space-x-2 space-x-reverse hover:bg-mueen-blue/30 transition-all active:scale-95 shadow-[0_0_20px_rgba(41,121,255,0.2)]"
                    >
                        <Syringe className="w-5 h-5" />
                        <span>محاكاة ضغطة زر الحقن [4]</span>
                    </button>

                    <button
                        onClick={onRefill}
                        className="col-span-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95"
                        title="إعادة التعبئة [5]"
                    >
                        <RefreshCcw className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-center text-[9px] text-gray-600 italic">Keybinds: 1, 2, 3, 6, 7 (Scenarios) | 4, 5 (Hardware)</p>
            </div>
        </div>
    );
};

export default PresenterControlPanel;
