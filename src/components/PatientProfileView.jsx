import React, { useState, useEffect } from 'react';
import { User, Activity, Ruler, Weight, Syringe, ShieldCheck, AlertCircle, Info, ArrowLeft, Thermometer, Plus, Trash2, CheckCircle2, Zap } from 'lucide-react';

const PatientProfileView = ({ patientData, onBack }) => {
    // State for Pump users
    const [pumpBasal, setPumpBasal] = useState('');
    const [pumpBolusDoses, setPumpBolusDoses] = useState(['']);

    // State for Injection users
    const [longActing, setLongActing] = useState('');
    const [shortActingDoses, setShortActingDoses] = useState(['']);

    // Generic Add/Remove dose fields
    const addDoseField = (setter, doses) => setter([...doses, '']);
    const removeDoseField = (setter, doses, index) => {
        const newDoses = doses.filter((_, i) => i !== index);
        setter(newDoses.length ? newDoses : ['']);
    };
    const updateDoseValue = (setter, doses, index, value) => {
        const newDoses = [...doses];
        newDoses[index] = value;
        setter(newDoses);
    };

    // Calculation logic
    const weight = parseFloat(patientData.weight) || 70;

    // Calculate TDD (Total Daily Dose)
    const calculateTDD = () => {
        if (patientData.usePump) {
            const basal = parseFloat(pumpBasal) || 0;
            const bolusTotal = pumpBolusDoses.reduce((acc, current) => acc + (parseFloat(current) || 0), 0);
            return basal + bolusTotal;
        } else {
            const long = parseFloat(longActing) || 0;
            const shortTotal = shortActingDoses.reduce((acc, current) => acc + (parseFloat(current) || 0), 0);
            return long + shortTotal;
        }
    };

    const tdd = calculateTDD();
    const unitsPerKg = weight > 0 ? tdd / weight : 0;

    const getInsulinStatus = () => {
        if (tdd === 0) return {
            text: 'يرجى إدخال الجرعات الحالية للبدء في التحليل الذكي لحالتك.',
            color: 'text-gray-400',
            status: 'pending',
            tip: 'إجمالي الجرعات اليومية (TDD) هو مفتاح فهم استقرار السكر.'
        };

        if (unitsPerKg < 0.3) return {
            text: 'جرعة منخفضة جداً مقارنة بوزنك الحالي.',
            color: 'text-mueen-cyan',
            status: 'low',
            tip: 'قد تحتاج لمراجعة الطبيب لزيادة الجرعة إذا كان السكر مرتفعاً باستمرار.'
        };
        if (unitsPerKg <= 0.65) return {
            text: 'الجرعة ممتازة ومتوازنة جداً مع وزن جسمك.',
            color: 'text-green-400',
            status: 'perfect',
            tip: 'استمر على هذا التوازن، فهو يقلل من مخاطر الهبوط المفاجئ.'
        };
        if (unitsPerKg <= 0.85) return {
            text: 'الجرعة عالية قليلاً، قد تكون عرضة لنوبات هبوط سكر.',
            color: 'text-yellow-400',
            status: 'high',
            tip: 'حاول تقليل النشويات أو زيادة النشاط البدني لتقليل الحاجة لهذه الكمية.'
        };
        return {
            text: 'تحذير: الجرعة عالية جداً! قد تشير لوجود مقاومة إنسولين شديدة.',
            color: 'text-red-400',
            status: 'danger',
            tip: 'يجب استشارة الطبيب لتعديل الخطة العلاجية وتجنب زيادة الوزن المستمرة.'
        };
    };

    const status = getInsulinStatus();

    return (
        <div className="flex flex-col h-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
                </button>
                <h1 className="text-xl font-bold text-white">الملف الطبي الشامل</h1>
                <div className="w-10" />
            </div>

            {/* Profile Summary Card */}
            <div className="glass-panel p-6 relative overflow-hidden border-mueen-blue/10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-mueen-cyan/10 blur-3xl -z-10" />

                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-mueen-cyan/10 flex items-center justify-center border border-mueen-cyan/20">
                        <User className="w-8 h-8 text-mueen-cyan" />
                    </div>
                    <div className="text-right flex-1">
                        <h2 className="text-2xl font-bold text-white">{patientData.name}</h2>
                        <div className="flex items-center gap-2 justify-end mt-1">
                            <p className="text-gray-500 text-xs font-bold">{patientData.phone}</p>
                            <ShieldCheck className="w-3 h-3 text-mueen-cyan" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: 'العمر', value: `${patientData.age} سنة`, icon: Thermometer },
                        { label: 'الجنس', value: patientData.gender, icon: Activity },
                        { label: 'الطول', value: `${patientData.height} سم`, icon: Ruler },
                        { label: 'الوزن', value: `${patientData.weight} كجم`, icon: Weight },
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
                            <item.icon className="w-4 h-4 text-gray-500 mb-1" />
                            <span className="text-[9px] text-gray-500 font-bold uppercase mb-1">{item.label}</span>
                            <span className="text-md font-bold text-white leading-none">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Insulin Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Syringe className="w-4 h-4 text-mueen-cyan" />
                        خطة توزيع الجرعات
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${patientData.usePump ? 'bg-mueen-cyan/10 text-mueen-cyan border border-mueen-cyan/30' : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'}`}>
                        {patientData.usePump ? 'نظام المضخة' : 'نظام الإبر'}
                    </div>
                </div>

                <div className="glass-panel p-6 border-white/5 bg-white/5">
                    {patientData.usePump ? (
                        <div className="space-y-6">
                            {/* Pump Basal */}
                            <div className="bg-mueen-cyan/5 p-4 rounded-2xl border border-mueen-cyan/10 text-right">
                                <label className="text-[10px] text-mueen-cyan mb-2 block font-bold uppercase tracking-wider flex items-center justify-end gap-2">
                                    معدل الضخ القاعدي (إجمالي اليوم) <Zap className="w-3 h-3" />
                                </label>
                                <div className="flex items-center gap-4">
                                    <span className="text-mueen-cyan text-sm font-bold">وحدة</span>
                                    <input
                                        type="number"
                                        value={pumpBasal}
                                        onChange={(e) => setPumpBasal(e.target.value)}
                                        className="bg-transparent border-none text-white text-2xl font-bold flex-1 text-center focus:ring-0 outline-none p-0"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Pump Bolus List */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-right mb-1 px-1">
                                    <button
                                        onClick={() => addDoseField(setPumpBolusDoses, pumpBolusDoses)}
                                        className="text-[10px] bg-mueen-cyan/10 text-mueen-cyan px-3 py-1 rounded-full flex items-center gap-1 border border-mueen-cyan/20 hover:bg-mueen-cyan/20 transition-all font-bold"
                                    >
                                        <Plus className="w-3 h-3" />
                                        إضافة جرعة (وجبة)
                                    </button>
                                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">جرعات الوجبات (Doses)</label>
                                </div>

                                <div className="grid grid-cols-1 gap-2">
                                    {pumpBolusDoses.map((dose, idx) => (
                                        <div key={idx} className="flex gap-2 items-center animate-in slide-in-from-right-4 duration-300">
                                            <button
                                                onClick={() => removeDoseField(setPumpBolusDoses, pumpBolusDoses, idx)}
                                                className="p-3 text-red-500/40 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <div className="flex-1 flex items-center bg-black/20 px-4 py-3 rounded-xl border border-white/5">
                                                <span className="text-gray-500 text-[10px] font-bold">وحدة</span>
                                                <input
                                                    type="number"
                                                    value={dose}
                                                    onChange={(e) => updateDoseValue(setPumpBolusDoses, pumpBolusDoses, idx, e.target.value)}
                                                    className="bg-transparent border-none text-white text-md font-bold flex-1 text-center focus:ring-0 outline-none p-0"
                                                    placeholder="0"
                                                />
                                                <label className="text-[10px] text-gray-500 font-bold min-w-[50px] text-left">جرعة {idx + 1}</label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Injection Long Acting */}
                            <div className="bg-purple-500/5 p-4 rounded-2xl border border-purple-500/10 text-right">
                                <label className="text-[10px] text-purple-400/80 mb-2 block font-bold uppercase tracking-wider flex items-center justify-end gap-2">
                                    إنسولين طويل المفعول (قاعدة) <Activity className="w-3 h-3" />
                                </label>
                                <div className="flex items-center gap-4">
                                    <span className="text-purple-400 text-sm font-bold">وحدة</span>
                                    <input
                                        type="number"
                                        value={longActing}
                                        onChange={(e) => setLongActing(e.target.value)}
                                        className="bg-transparent border-none text-white text-2xl font-bold flex-1 text-center focus:ring-0 outline-none p-0"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Injection Short Acting List */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-right mb-1 px-1">
                                    <button
                                        onClick={() => addDoseField(setShortActingDoses, shortActingDoses)}
                                        className="text-[10px] bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full flex items-center gap-1 border border-purple-500/20 hover:bg-purple-500/20 transition-all font-bold"
                                    >
                                        <Plus className="w-3 h-3" />
                                        إضافة جرعة وجبة
                                    </button>
                                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">جرعات قصير المفعول (الوجبات)</label>
                                </div>

                                <div className="grid grid-cols-1 gap-2">
                                    {shortActingDoses.map((dose, idx) => (
                                        <div key={idx} className="flex gap-2 items-center animate-in slide-in-from-right-4 duration-300">
                                            <button
                                                onClick={() => removeDoseField(setShortActingDoses, shortActingDoses, idx)}
                                                className="p-3 text-red-500/40 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <div className="flex-1 flex items-center bg-black/20 px-4 py-3 rounded-xl border border-white/5">
                                                <span className="text-gray-500 text-[10px] font-bold">وحدة</span>
                                                <input
                                                    type="number"
                                                    value={dose}
                                                    onChange={(e) => updateDoseValue(setShortActingDoses, shortActingDoses, idx, e.target.value)}
                                                    className="bg-transparent border-none text-white text-md font-bold flex-1 text-center focus:ring-0 outline-none p-0"
                                                    placeholder="0"
                                                />
                                                <label className="text-[10px] text-gray-500 font-bold min-w-[50px] text-left">جرعة {idx + 1}</label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Smart Analysis Card */}
                    <div className={`mt-8 p-5 rounded-3xl border relative overflow-hidden transition-all duration-700 ${status.status === 'perfect' ? 'bg-green-500/5 border-green-500/20' :
                        status.status === 'high' ? 'bg-yellow-500/10 border-yellow-500/20' :
                            status.status === 'danger' ? 'bg-red-500/10 border-red-500/20' :
                                'bg-white/5 border-white/10 opacity-70'
                        }`}>
                        <div className="flex items-start gap-4 text-right">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 justify-end mb-2">
                                    <h4 className={`text-md font-bold ${status.color}`}>تحليل مُعين الذكي</h4>
                                    <CheckCircle2 className={`w-4 h-4 ${status.status === 'perfect' ? 'text-green-400' : 'text-gray-600 opacity-20'}`} />
                                </div>

                                <p className="text-xs text-white/90 leading-relaxed font-bold mb-2">{status.text}</p>
                                <p className="text-[10px] text-gray-400 leading-relaxed italic">{status.tip}</p>

                                {status.status !== 'pending' && (
                                    <div className="mt-4 flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                                        <div className="text-right">
                                            <span className="block text-[8px] text-gray-500 uppercase font-bold tracking-wider">الإجمالي</span>
                                            <span className="text-sm font-bold text-white">{tdd.toFixed(1)} <span className="text-[10px] text-gray-500">وحدة</span></span>
                                        </div>
                                        <div className="w-px h-6 bg-white/10" />
                                        <div className="text-right">
                                            <span className="block text-[8px] text-gray-500 uppercase font-bold tracking-wider">وحدة لكل كجم</span>
                                            <span className={`text-sm font-bold ${status.color}`}>{unitsPerKg.toFixed(2)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Medical Disclaimer */}
            <div className="p-4 bg-mueen-blue/5 border border-mueen-blue/10 rounded-2xl mx-1">
                <div className="flex items-start gap-3 text-right group">
                    <div className="flex-1">
                        <p className="text-[9px] text-gray-500 leading-relaxed">
                            <span className="text-mueen-cyan font-bold ml-1 uppercase underline decoration-mueen-cyan/30 underline-offset-2">تنبيه طبي هام:</span>
                            هذا التحليل يتم بناءً على خوارزميات إحصائية لجرعات الإنسولين الكلية ولا يعتبر بديلاً عن الفحوصات الطبية الدقيقة. لا تقم بتغيير جرعاتك إلا بعد التحدث مع طبيبك المعالج.
                        </p>
                    </div>
                    <div className="p-2 bg-mueen-blue/10 rounded-lg">
                        <Info className="w-4 h-4 text-mueen-blue/60" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientProfileView;
