import React from 'react';
import { X, Home, BarChart3, Settings, Sparkles, LogOut } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, onViewChange, activeView }) => {
    const menuItems = [
        { id: 'dashboard', label: 'لوحة التحكم', icon: Home },
        { id: 'profile', label: 'الملف الطبي', icon: User },
        { id: 'reports', label: 'التقارير الصحية', icon: BarChart3 },
        { id: 'assistant', label: 'المساعد أصـيل', icon: Sparkles },
        { id: 'settings', label: 'الإعـدادات', icon: Settings },
    ];

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-in fade-in duration-300"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Panel */}
            <div className={`fixed top-0 right-0 h-full w-72 z-[70] transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ backgroundColor: '#13051c' }}>
                <div className="flex flex-col h-full border-l border-white/5">

                    {/* Header */}
                    <div className="p-6 flex items-center justify-between border-b border-white/5">
                        <div className="flex items-center">
                            <img src="/logo.png" alt="MUEEN" className="h-10 w-auto" />
                        </div>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 mt-4">
                        {menuItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onViewChange(item.id);
                                    onClose();
                                }}
                                className={`w-full flex items-center space-x-4 space-x-reverse px-4 py-4 rounded-2xl transition-all ${activeView === item.id
                                    ? 'bg-mueen-cyan/10 text-mueen-cyan border border-mueen-cyan/20'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-mueen-cyan' : 'text-gray-400'}`} />
                                <span className="text-sm font-bold">{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    {/* Footer / Version */}
                    <div className="p-6 border-t border-white/5 space-y-4">
                        <button className="w-full flex items-center space-x-3 space-x-reverse text-gray-500 hover:text-red-400 transition-colors px-2 py-2">
                            <LogOut className="w-5 h-5" />
                            <span className="text-xs font-bold">تسجيل الخروج</span>
                        </button>
                        <div className="text-[10px] text-gray-600 uppercase tracking-widest text-center">
                            MUEEN V2.0.4 - 2026
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
