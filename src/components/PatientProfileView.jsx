import React, { useState, useEffect } from 'react';
import { User, Activity, Ruler, Weight, SyringeRow, ShieldCheck, AlertCircle, Info, ArrowLeft, Thermometer } from 'lucide-react';

const PatientProfileView = ({ patientData, onBack }) => {
    const [longActing, setLongActing] = useState(0);
    const [shortActingTotal, setShortActingTotal] = useState(0);
    const [pumpTotal, setPumpTotal] = useState(0);

    // Calculation logic
    const weight = parseFloat(patientData.weight) || 70;
    const tdd = patientData.usePump ? pumpTotal : (parseFloat(longActing) + parseFloat(shortActingTotal));

    // Units per kg
    const unitsPerKg = tdd / weight;

    const getInsulinStatus = () => {
        if (tdd === 0) return { text: 'يرجى إدخال الجرعات للتحليل', color: 'text-gray-400', status: 'pending' };

        if (unitsPerKg < 0.4) return { text: 'جرعة منخفضة نسبياً', color: 'text-mueen-cyan', status: 'low' };
        if (unitsPerKg <= 0.7) return { text: 'الجرعة مناسبة جداً لحالتك', color: 'text-green-400', status: 'perfect' };
        if (unitsPerKg <= 0.9) return { text: 'الجرعة عالية قليلاً، انتبه للهبوط', color: 'text-yellow-400', status: 'high' };
        return { text: 'الجرعة زائدة! قد تسبب مقاومة إنسولين', color: 'text-red-400', status: 'danger' };
    };

    const status = getInsulinStatus();

    return (
        <div className="flex flex-col h-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
                </button>
                <h1 className="text-xl font-bold text-white">الملف الطبي الشامل</h1>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Profile Summary Card */}
            <div className="glass-panel p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mueen-cyan to-transparent opacity-50" />

                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-mueen-cyan/10 flex items-center justify-center border border-mueen-cyan/20">
                        <User className="w-8 h-8 text-mueen-cyan" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{patientData.name}</h2>
                        <p className="text-mueen-cyan text-xs font-bold uppercase tracking-widest">{patientData.phone}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 mb-1">
                            <Thermometer className="w-3 h-3 text-gray-400" />
                            <span className="text-[10px] text-gray-400 font-bold uppercase">العمر</span>
                        </div>
                        <span className="text-lg font-bold text-white">{patientData.age} سنة</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 mb-1">
                            <Activity className="w-3 h-3 text-gray-400" />
                            <span className="text-[10px] text-gray-400 font-bold uppercase">الجنس</span>
                        </div>
                        <span className="text-lg font-bold text-white">{patientData.gender}</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 mb-1">
                            <Ruler className="w-3 h-3 text-gray-400" />
                            <span className="text-[10px] text-gray-400 font-bold uppercase">الطول</span>
                        </div>
                        <span className="text-lg font-bold text-white">{patientData.height} سم</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 mb-1">
                            <Weight className="w-3 h-3 text-gray-400" />
                            <span className="text-[10px] text-gray-400 font-bold uppercase">الوزن</span>
                        </div>
                        <span className="text-lg font-bold text-white">{patientData.weight} كجم</span>
                    </div>
                </div>
            </div>

            {/* Insulin Management Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        إدارة جرعات الإنسولين
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${patientData.usePump ? 'bg-mueen-cyan/10 text-mueen-cyan border border-mueen-cyan/30' : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'}`}>
                        {patientData.usePump ? 'نظام المضخة الذكي' : 'نظام الإبر اليدوي'}
                    </div>
                </div>

                <div className="glass-panel p-6 border-white/5 bg-white/5">
                    {patientData.usePump ? (
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs text-gray-400 mb-2 block text-right">إجمالي استهلاك الإنسولين اليومي (مجموع الوحدات)</label>
                                <div className="flex items-center gap-3 bg-black/20 p-4 rounded-2xl border border-white/5">
                                    <span className="text-gray-500 text-xs font-bold">وحدة</span>
                                    <input
                                        type="number"
                                        value={pumpTotal}
                                        onChange={(e) => setPumpTotal(e.target.value)}
                                        className="bg-transparent border-none text-white text-2xl font-bold flex-1 text-center focus:ring-0 outline-none"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-400 mb-2 block text-right">إنسولين طويل المفعول (قاعدة)</label>
                                    <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                                        <span className="text-gray-500 text-xs font-bold">وحدة</span>
                                        <input
                                            type="number"
                                            value={longActing}
                                            onChange={(e) => setLongActing(e.target.value)}
                                            className="bg-transparent border-none text-white text-lg font-bold flex-1 text-center focus:ring-0 outline-none"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div className="w-full h-px bg-white/5" />
                                <div>
                                    <label className="text-xs text-gray-400 mb-2 block text-right">مجموع الإنسولين قصير المفعول (وجبات)</label>
                                    <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5">
                                        <span className="text-gray-500 text-xs font-bold">وحدة</span>
                                        <input
                                            type="number"
                                            value={shortActingTotal}
                                            onChange={(e) => setShortActingTotal(e.target.value)}
                                            className="bg-transparent border-none text-white text-lg font-bold flex-1 text-center focus:ring-0 outline-none"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Analysis result */}
                    <div className={`mt-8 p-4 rounded-2xl border ${status.status === 'perfect' ? 'bg-green-500/5 border-green-500/20' :
                            status.status === 'high' ? 'bg-yellow-500/5 border-yellow-500/20' :
                                status.status === 'danger' ? 'bg-red-500/5 border-red-500/20' :
                                    'bg-white/5 border-white/10'
                        } transition-all duration-500`}>
                        <div className="flex items-start gap-3 text-right">
                            <div className="flex-1">
                                <h4 className={`text-sm font-bold mb-1 ${status.color}`}>تحليل مُعين الذكي:</h4>
                                <p className="text-[11px] text-gray-400 leading-relaxed">{status.text}</p>
                                {status.status !== 'pending' && (
                                    <div className="mt-3 flex items-center justify-end gap-2 text-[10px] text-gray-500 font-bold italic">
                                        <span>إجمالي الجرعات: {tdd} وحدة</span>
                                        <div className="w-1 h-1 bg-gray-700 rounded-full" />
                                        <span>نسبة الاستهلاك: {unitsPerKg.toFixed(2)} وحدة/كجم</span>
                                    </div>
                                )}
                            </div>
                            <div className={`p-2 rounded-xl border bg-black/20 ${status.color}`}>
                                {status.status === 'danger' ? <AlertCircle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="p-4 bg-mueen-blue/5 border border-mueen-blue/10 rounded-2xl">
                <div className="flex items-start gap-3 text-right group">
                    <div className="flex-1">
                        <p className="text-[9px] text-gray-500 leading-relaxed">
                            <span className="text-mueen-cyan font-bold ml-1 uppercase">ملاحظة طبية:</span>
                            التحليل أعلاه يعتمد على معايير الجرعة الكلية لوزن الجسم. يرجى دائماً استشارة طبيبك المختص قبل تغيير أي جرعة. مُعين يساعدك في الفهم فقط.
                        </p>
                    </div>
                    <Info className="w-4 h-4 text-mueen-blue/40 mt-0.5" />
                </div>
            </div>
        </div>
    );
};

export default PatientProfileView;
