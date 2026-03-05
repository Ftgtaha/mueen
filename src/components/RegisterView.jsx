import React, { useState } from 'react';
import { User, Phone, ShieldCheck, ArrowLeft, HeartPulse, Activity, Ruler, Weight } from 'lucide-react';
import { supabase } from '../supabaseClient';

const RegisterView = ({ onComplete }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('ذكر');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [usePump, setUsePump] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !phone) return;

        setIsLoading(true);
        const patientData = {
            name,
            phone,
            age,
            gender,
            weight,
            height,
            usePump,
            bloodType: 'O+'
        };

        try {
            const { error } = await supabase
                .from('health_monitor')
                .upsert({
                    short_id: phone,
                    patient_name: name,
                    scenario: 'standby',
                    glucose: 100,
                    ketones: 0.2,
                    alert_text: 'تم التسجيل بنجاح. ضعه على الجلد للبدء.',
                    // --- Added for enhanced profile ---
                    patient_age: age,
                    patient_gender: gender,
                    patient_weight: weight,
                    patient_height: height,
                    use_pump: usePump
                });

            if (error) throw error;

            localStorage.setItem('mueen_session', JSON.stringify(patientData));
            onComplete(phone, patientData);
        } catch (error) {
            console.error('Registration error:', error);
            alert('حدث خطأ أثناء التسجيل، يرجى المحاولة مرة أخرى.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col p-4 sm:p-6 items-center justify-center animate-in fade-in duration-700" style={{ backgroundColor: '#090314' }}>
            <div className="w-full max-w-sm sm:max-w-md space-y-6">
                <div className="text-center">
                    <div className="w-16 h-16 bg-mueen-cyan/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-mueen-cyan/20">
                        <HeartPulse className="w-8 h-8 text-mueen-cyan" />
                    </div>
                    <img src="/logo.png" alt="MUEEN" className="h-10 mx-auto mb-2" />
                    <h1 className="text-xl font-bold text-white mb-1">تسجيل مريض جديد</h1>
                    <p className="text-gray-400 text-[10px]">يرجى إكمال الملف الصحي للبدء</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="glass-panel p-1 border-white/5 bg-white/5">
                        <div className="flex items-center px-4 py-2 gap-3">
                            <User className="text-mueen-cyan w-4 h-4" />
                            <input
                                type="text"
                                placeholder="الاسم الكامل"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-transparent border-none text-white text-xs focus:ring-0 flex-1 text-right outline-none"
                                dir="rtl"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="glass-panel p-1 border-white/5 bg-white/5 flex-1">
                            <div className="flex items-center px-4 py-2 gap-3">
                                <input
                                    type="number"
                                    placeholder="العمر"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    className="bg-transparent border-none text-white text-xs focus:ring-0 flex-1 text-right outline-none"
                                    dir="rtl"
                                    required
                                />
                            </div>
                        </div>
                        <div className="glass-panel p-1 border-white/5 bg-white/5 flex-1">
                            <div className="flex items-center px-4 py-2 gap-3">
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="bg-transparent border-none text-white text-xs focus:ring-0 flex-1 text-right outline-none appearance-none"
                                    dir="rtl"
                                >
                                    <option value="ذكر" className="bg-[#13051c]">ذكر</option>
                                    <option value="أنثى" className="bg-[#13051c]">أنثى</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="glass-panel p-1 border-white/5 bg-white/5 flex-1">
                            <div className="flex items-center px-4 py-2 gap-3">
                                <Weight className="text-mueen-cyan/50 w-3 h-3" />
                                <input
                                    type="number"
                                    placeholder="الوزن (كجم)"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    className="bg-transparent border-none text-white text-xs focus:ring-0 flex-1 text-right outline-none"
                                    dir="rtl"
                                    required
                                />
                            </div>
                        </div>
                        <div className="glass-panel p-1 border-white/5 bg-white/5 flex-1">
                            <div className="flex items-center px-4 py-2 gap-3">
                                <Ruler className="text-mueen-cyan/50 w-3 h-3" />
                                <input
                                    type="number"
                                    placeholder="الطول (سم)"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    className="bg-transparent border-none text-white text-xs focus:ring-0 flex-1 text-right outline-none"
                                    dir="rtl"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-1 border-white/5 bg-white/5">
                        <div className="flex items-center px-4 py-2 gap-3">
                            <Phone className="text-mueen-cyan w-3 h-3" />
                            <input
                                type="tel"
                                placeholder="رقم الجوال (كمعرّف للجهاز)"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="bg-transparent border-none text-white text-xs focus:ring-0 flex-1 text-right outline-none"
                                dir="rtl"
                                required
                            />
                        </div>
                    </div>

                    <div className="glass-panel p-3 border-white/5 bg-white/5">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <Activity className="text-mueen-cyan w-4 h-4" />
                                <span className="text-white text-[10px] font-bold">هل تستخدم مضخة إنسولين؟</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setUsePump(!usePump)}
                                className={`w-10 h-5 rounded-full transition-colors relative ${usePump ? 'bg-mueen-cyan' : 'bg-gray-700'}`}
                            >
                                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${usePump ? 'left-[2px]' : 'left-[22px]'}`} />
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-mueen-cyan text-mueen-dark font-bold rounded-xl hover:scale-[1.01] transition-transform active:scale-[0.99] disabled:opacity-50 text-sm shadow-lg shadow-mueen-cyan/10"
                    >
                        {isLoading ? 'جاري إنشاء الملف...' : 'حفظ البيانات والبدء'}
                    </button>
                </form>

                <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                    من خلال التسجيل، أنت توافق على شروط الاستخدام وسياسة الخصوصية الخاصة بنظام مُعين.
                </p>
            </div>
        </div>
    );
};

export default RegisterView;
