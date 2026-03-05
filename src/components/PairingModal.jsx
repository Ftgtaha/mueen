import React, { useState } from 'react';
import { QrCode, Smartphone, CheckCircle2, User, Phone, Activity, Heart, Calendar } from 'lucide-react';

const PairingModal = ({ onPaired }) => {
    const [step, setStep] = useState('profile'); // profile -> emergency -> pairing -> success

    // Patient Profile
    const [patientName, setPatientName] = useState('');
    const [patientAge, setPatientAge] = useState('');
    const [bloodType, setBloodType] = useState('O+');

    // Emergency Contact
    const [emergencyName, setEmergencyName] = useState('');
    const [emergencyPhone, setEmergencyPhone] = useState('');

    const goToEmergency = (e) => {
        e.preventDefault();
        if (patientName && patientAge) {
            setStep('emergency');
        }
    };

    const handleStartPairing = (e) => {
        e.preventDefault();
        if (emergencyName && emergencyPhone) {
            setStep('pairing');
            setTimeout(() => setStep('success'), 3000);
            setTimeout(() => onPaired({
                patientName,
                patientAge,
                bloodType,
                emergencyName,
                emergencyPhone
            }), 4500);
        }
    };

    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    return (
        <div className="fixed inset-0 bg-mueen-dark z-[100] flex items-center justify-center p-6" style={{ backgroundColor: '#090314' }}>
            <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in duration-500">

                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-white tracking-tight">مُعين (MUEEN)</h1>
                    <p className="text-gray-500 text-sm">نظام مراقبة الصحة الذكي 24/7</p>
                </div>

                <div className="glass-panel p-8 relative overflow-hidden" style={{ backgroundColor: 'rgba(26, 11, 60, 0.45)', border: '1px solid rgba(41, 121, 255, 0.2)' }}>

                    {/* STEP 1: Patient Profile */}
                    {step === 'profile' && (
                        <form onSubmit={goToEmergency} className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                            <div className="space-y-4">
                                <p className="text-xs text-mueen-cyan font-bold uppercase tracking-widest text-center mb-4">إنشاء الملف الطبي</p>

                                <div className="relative">
                                    <User className="absolute right-3 top-3 w-5 h-5 text-gray-500" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="اسم المريض الثلاثي"
                                        value={patientName}
                                        onChange={(e) => setPatientName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-11 pl-4 text-white placeholder:text-gray-600 focus:border-mueen-cyan/50 focus:outline-none transition-all text-right"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative">
                                        <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-500" />
                                        <input
                                            required
                                            type="number"
                                            placeholder="العمر"
                                            value={patientAge}
                                            onChange={(e) => setPatientAge(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-11 pl-4 text-white placeholder:text-gray-600 focus:border-mueen-cyan/50 focus:outline-none transition-all text-right"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Heart className="absolute right-3 top-3 w-5 h-5 text-gray-500" />
                                        <select
                                            value={bloodType}
                                            onChange={(e) => setBloodType(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-11 pl-4 text-white focus:border-mueen-cyan/50 focus:outline-none transition-all appearance-none text-right"
                                        >
                                            {bloodTypes.map(t => <option key={t} value={t} className="bg-[#13051c]">{t}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-mueen-cyan text-mueen-dark font-bold py-4 rounded-xl hover:bg-white transition-all active:scale-95 shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                            >
                                التالي
                            </button>
                        </form>
                    )}

                    {/* STEP 2: Emergency Contact */}
                    {step === 'emergency' && (
                        <form onSubmit={handleStartPairing} className="space-y-6 animate-in slide-in-from-left-4 duration-500">
                            <div className="space-y-4">
                                <p className="text-xs text-mueen-cyan font-bold uppercase tracking-widest text-center mb-4">جهة الاتصال للطوارئ</p>

                                <div className="relative">
                                    <User className="absolute right-3 top-3 w-5 h-5 text-gray-500" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="اسم قريب (مثلاً: فهد - الأب)"
                                        value={emergencyName}
                                        onChange={(e) => setEmergencyName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-11 pl-4 text-white placeholder:text-gray-600 focus:border-mueen-cyan/50 focus:outline-none transition-all text-right"
                                    />
                                </div>

                                <div className="relative">
                                    <Phone className="absolute right-3 top-3 w-5 h-5 text-gray-500" />
                                    <input
                                        required
                                        type="tel"
                                        placeholder="رقم جوال قريبك"
                                        value={emergencyPhone}
                                        onChange={(e) => setEmergencyPhone(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pr-11 pl-4 text-white placeholder:text-gray-600 focus:border-mueen-cyan/50 focus:outline-none transition-all text-right"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-mueen-cyan text-mueen-dark font-bold py-4 rounded-xl hover:bg-white transition-all active:scale-95 shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                            >
                                بدء اقتران الحساس
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep('profile')}
                                className="w-full text-gray-500 text-xs py-2"
                            >
                                رجوع لتعديل البيانات
                            </button>
                        </form>
                    )}

                    {/* STEP 3: Pairing */}
                    {step === 'pairing' && (
                        <div className="flex flex-col items-center space-y-8 py-4 animate-in fade-in duration-500">
                            <div className="relative w-48 h-48">
                                <div className="absolute inset-0 border-4 border-mueen-cyan/20 rounded-3xl animate-[spin_4s_linear_infinite]"></div>
                                <div className="absolute inset-4 border-2 border-mueen-cyan/40 rounded-2xl animate-[spin_2s_linear_infinite_reverse]"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <QrCode className="w-20 h-20 text-mueen-cyan animate-pulse" />
                                </div>
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-mueen-cyan font-bold tracking-widest animate-pulse italic">CONNECTING SENSOR...</p>
                                <div className="flex justify-center gap-1">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-1.5 h-1.5 bg-mueen-cyan rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Success */}
                    {step === 'success' && (
                        <div className="flex flex-col items-center space-y-6 py-4 animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-mueen-cyan/10 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.2)]">
                                <CheckCircle2 className="w-12 h-12 text-mueen-cyan" />
                            </div>
                            <div className="text-center">
                                <h2 className="text-xl font-bold text-white mb-1">تم الربط بنجاح!</h2>
                                <p className="text-gray-500 text-xs">جاري تهيئة مركز الرعاية الصحية الخاص بك...</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-center space-x-2 space-x-reverse opacity-40">
                    <Activity className="w-4 h-4 text-gray-500" />
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">Healthcare Node: MUEEN-LIVE-V2</span>
                </div>

            </div>
        </div>
    );
};

export default PairingModal;
