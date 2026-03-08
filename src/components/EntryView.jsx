import React, { useState } from 'react';
import { User, Shield, Users } from 'lucide-react';

const EntryView = ({ onSelectRole }) => {
    const [animationClass, setAnimationClass] = useState('animate-in fade-in zoom-in duration-500');

    const handleSelect = (role) => {
        setAnimationClass('animate-out fade-out zoom-out duration-300');
        setTimeout(() => {
            onSelectRole(role);
        }, 300);
    };

    return (
        <div className="min-h-screen bg-[#090314] flex flex-col items-center justify-center p-6 text-gray-200 selection:bg-mueen-cyan/30">
            {/* Background elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-mueen-blue/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mueen-cyan/5 rounded-full blur-[100px] pointer-events-none" />

            <div className={`w-full max-w-sm space-y-8 relative z-10 ${animationClass}`}>
                {/* Logo and Welcome */}
                <div className="text-center space-y-4">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-mueen-cyan/20 blur-xl rounded-full" />
                        <img src="/logo.png" alt="معين - MUEEN" className="h-24 w-auto mx-auto relative z-10 drop-shadow-2xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">مرحباً بك في مُعين</h1>
                        <p className="text-gray-400 text-sm">أرجو تحديد صفة الدخول للمتابعة</p>
                    </div>
                </div>

                {/* Role Selection Cards */}
                <div className="space-y-4 mt-8">
                    {/* Patient Option */}
                    <button
                        onClick={() => handleSelect('patient')}
                        className="w-full group relative overflow-hidden rounded-2xl p-1 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-mueen-cyan/20 to-mueen-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative glass-panel bg-gradient-to-br from-[#13051c] to-[#0d0714] border border-white/5 group-hover:border-mueen-cyan/30 p-6 flex items-center justify-end gap-5 rounded-xl">
                            <div className="text-right">
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-mueen-cyan transition-colors">دخول كمريض</h3>
                                <p className="text-xs text-gray-400">لإنشاء حساب أو متابعة حالتك الصحية</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-mueen-cyan/10 transition-colors">
                                <User className="w-6 h-6 text-gray-400 group-hover:text-mueen-cyan transition-colors" />
                            </div>
                        </div>
                    </button>

                    {/* Parent/Guardian Option */}
                    <button
                        onClick={() => handleSelect('parent')}
                        className="w-full group relative overflow-hidden rounded-2xl p-1 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-mueen-cyan/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative glass-panel bg-gradient-to-br from-[#13051c] to-[#0d0714] border border-white/5 group-hover:border-mueen-cyan/30 p-6 flex items-center justify-end gap-5 rounded-xl">
                            <div className="text-right">
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-mueen-cyan transition-colors">دخول ولي أمر</h3>
                                <p className="text-xs text-gray-400">لمتابعة حالة المريض عن بعد ومراقبة المؤشرات</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-mueen-cyan/10 transition-colors">
                                <Users className="w-6 h-6 text-gray-400 group-hover:text-mueen-cyan transition-colors" />
                            </div>
                        </div>
                    </button>

                    {/* Admin Option */}
                    <button
                        onClick={() => handleSelect('admin')}
                        className="w-full group relative overflow-hidden rounded-2xl p-1 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative glass-panel bg-gradient-to-br from-[#13051c] to-[#0d0714] border border-white/5 group-hover:border-purple-400/30 p-6 flex items-center justify-end gap-5 rounded-xl">
                            <div className="text-right">
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">تجربة السيناريوهات(ادمن)</h3>
                                <p className="text-xs text-gray-400">لمتابعة المرضى وتسجيل بياناتهم</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-purple-500/10 transition-colors">
                                <Shield className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors" />
                            </div>
                        </div>
                    </button>
                </div>

                <div className="text-center pt-8">
                    <p className="text-[10px] text-gray-600">
                        مُعين - نظام متكامل لإدارة ومراقبة مرض السكري
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EntryView;
