import React, { useState, useEffect } from 'react';
import { User, Users, Phone, ShieldCheck, HeartPulse, Activity, Ruler, Weight, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../supabaseClient';

const RegisterView = ({ onComplete }) => {
    // Registration State
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('ذكر');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [usePump, setUsePump] = useState(false);
    const [emergencyName, setEmergencyName] = useState('');
    const [emergencyPhone, setEmergencyPhone] = useState('');
    const [emergencyRelationship, setEmergencyRelationship] = useState('');
    const [emergencyDetails, setEmergencyDetails] = useState('');

    // UI & Loading State
    const [isLoading, setIsLoading] = useState(false);
    const [showAccountList, setShowAccountList] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFetchingAccounts, setIsFetchingAccounts] = useState(false);

    const fetchAccounts = async () => {
        setIsFetchingAccounts(true);
        try {
            const { data, error } = await supabase
                .from('health_monitor')
                .select('*')
                .order('patient_name', { ascending: true });

            if (error) throw error;
            setAccounts(data || []);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        } finally {
            setIsFetchingAccounts(false);
        }
    };

    useEffect(() => {
        if (showAccountList) {
            fetchAccounts();
        }
    }, [showAccountList]);

    const handleAccountSelect = (account) => {
        const patientData = {
            name: account.patient_name,
            phone: account.short_id,
            age: account.patient_age,
            gender: account.patient_gender,
            weight: account.patient_weight,
            height: account.patient_height,
            usePump: account.use_pump,
            emergencyName: account.emergency_name,
            emergencyPhone: account.emergency_phone,
            emergencyRelationship: account.emergency_relationship,
            emergencyDetails: account.emergency_details,
            bloodType: 'O+'
        };
        localStorage.setItem('mueen_session', JSON.stringify(patientData));
        onComplete(account.short_id, patientData);
    };

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
            emergencyName,
            emergencyPhone,
            emergencyRelationship,
            emergencyDetails,
            bloodType: 'O+'
        };

        try {
            const { error } = await supabase
                .from('health_monitor')
                .upsert({
                    short_id: phone,
                    patient_name: name,
                    scenario: 'standby',
                    glucose: 110,
                    ketones: 0.2,
                    alert_text: 'تم التسجيل بنجاح. ضعه على الجلد للبدء.',
                    patient_age: age,
                    patient_gender: gender,
                    patient_weight: weight,
                    patient_height: height,
                    use_pump: usePump,
                    emergency_name: emergencyName,
                    emergency_phone: emergencyPhone,
                    emergency_relationship: emergencyRelationship,
                    emergency_details: emergencyDetails
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

    const filteredAccounts = accounts.filter(acc =>
        (acc.patient_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (acc.short_id?.includes(searchTerm))
    );

    if (showAccountList) {
        return (
            <div className="min-h-screen flex flex-col p-4 sm:p-6 items-center justify-center animate-in fade-in duration-700" style={{ backgroundColor: '#090314' }}>
                <div className="w-full max-w-sm sm:max-w-md space-y-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-mueen-cyan/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-mueen-cyan/20">
                            <Users className="w-8 h-8 text-mueen-cyan" />
                        </div>
                        <h1 className="text-xl font-bold text-white mb-1">اختيار حساب موجود</h1>
                        <p className="text-gray-400 text-[10px]">اختر ملفك الشخصي للمتابعة</p>
                    </div>

                    <div className="glass-panel p-1 border-white/5 bg-white/5">
                        <div className="flex items-center px-4 py-2 gap-3">
                            <Search className="text-gray-500 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="بحث بالاسم أو رقم الجوال..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent border-none text-white text-xs focus:ring-0 flex-1 text-right outline-none"
                                dir="rtl"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                        {isFetchingAccounts ? (
                            <div className="text-center py-8">
                                <Activity className="w-6 h-6 text-mueen-cyan animate-pulse mx-auto mb-2" />
                                <p className="text-gray-500 text-xs">جاري تحميل الحسابات...</p>
                            </div>
                        ) : filteredAccounts.length > 0 ? (
                            filteredAccounts.map((acc) => (
                                <button
                                    key={acc.short_id}
                                    onClick={() => handleAccountSelect(acc)}
                                    className="w-full glass-panel p-4 border-white/5 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between group"
                                >
                                    <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-mueen-cyan transition-colors" />
                                    <div className="text-right">
                                        <p className="text-white text-sm font-bold">{acc.patient_name}</p>
                                        <p className="text-gray-500 text-[10px]">{acc.short_id}</p>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-xs text-center leading-relaxed">لم يتم العثور على حسابات مطابقة</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setShowAccountList(false)}
                        className="w-full py-4 border border-white/10 text-gray-400 font-bold rounded-xl hover:bg-white/5 transition-colors text-sm"
                    >
                        العودة لإنشاء حساب جديد
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col p-4 sm:p-6 items-center justify-center animate-in fade-in duration-700" style={{ backgroundColor: '#090314' }}>
            <div className="w-full max-w-sm sm:max-w-md space-y-6">
                <div className="text-center relative">
                    <button
                        onClick={() => setShowAccountList(true)}
                        className="absolute top-0 right-0 text-mueen-cyan text-[10px] bg-mueen-cyan/10 px-3 py-1.5 rounded-lg hover:bg-mueen-cyan/20 transition-colors border border-mueen-cyan/20"
                    >
                        اختيار حساب
                    </button>

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

                    <div className="flex flex-col sm:flex-row gap-3">
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

                    <div className="flex flex-col sm:flex-row gap-3">
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
                                placeholder="رقم جوال المريض"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="bg-transparent border-none text-white text-xs focus:ring-0 flex-1 text-right outline-none"
                                dir="rtl"
                                required
                            />
                        </div>
                    </div>

                    <div className="text-center pt-2">
                        <p className="text-mueen-cyan text-[10px] font-bold uppercase tracking-widest">جهة اتصال الطوارئ (SOS)</p>
                    </div>

                    <div className="glass-panel p-1 border-white/5 bg-white/5">
                        <div className="flex items-center px-4 py-2 gap-3">
                            <User className="text-red-400 w-3 h-3" />
                            <input
                                type="text"
                                placeholder="اسم قريب للاتصال به"
                                value={emergencyName}
                                onChange={(e) => setEmergencyName(e.target.value)}
                                className="bg-transparent border-none text-white text-xs focus:ring-0 flex-1 text-right outline-none"
                                dir="rtl"
                                required
                            />
                        </div>
                    </div>

                    <div className="glass-panel p-1 border-white/5 bg-white/5">
                        <div className="flex items-center px-4 py-2 gap-3">
                            <Phone className="text-red-400 w-3 h-3" />
                            <input
                                type="tel"
                                placeholder="رقم جوال القريب للطوارئ"
                                value={emergencyPhone}
                                onChange={(e) => setEmergencyPhone(e.target.value)}
                                className="bg-transparent border-none text-white text-xs focus:ring-0 flex-1 text-right outline-none"
                                dir="rtl"
                                required
                            />
                        </div>
                    </div>

                    <div className="glass-panel p-1 border-white/5 bg-white/5">
                        <div className="flex items-center px-4 py-2 gap-3">
                            <ShieldCheck className="text-red-400 w-3 h-3" />
                            <input
                                type="text"
                                placeholder="صلة القرابة (مثلاً: أب، أم)"
                                value={emergencyRelationship}
                                onChange={(e) => setEmergencyRelationship(e.target.value)}
                                className="bg-transparent border-none text-white text-xs focus:ring-0 flex-1 text-right outline-none"
                                dir="rtl"
                                required
                            />
                        </div>
                    </div>

                    <div className="glass-panel p-1 border-white/5 bg-white/5">
                        <div className="flex items-center px-4 py-2 gap-3">
                            <Activity className="text-red-400 w-3 h-3" />
                            <input
                                type="text"
                                placeholder="تفاصيل إضافية (اختياري)"
                                value={emergencyDetails}
                                onChange={(e) => setEmergencyDetails(e.target.value)}
                                className="bg-transparent border-none text-white text-xs focus:ring-0 flex-1 text-right outline-none"
                                dir="rtl"
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
