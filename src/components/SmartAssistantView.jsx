import React, { useState } from 'react';
import { Send, Image as ImageIcon, Camera, ChevronLeft, Bot, User, Sparkles } from 'lucide-react';

const SmartAssistantView = ({ onBack }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: 'أهلاً بك! أنا "أصيل"، مساعدك الذكي في نظام مُعين. أنا هنا لمساعدتك في تحليل حالتك الصحية، تقديم النصائح الوقائية، أو الإجابة على استفساراتك الطبية. كيف يمكنني خدمتك اليوم؟',
            time: '١٠:٠٠ ص'
        }
    ]);
    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newUserMsg = {
            id: Date.now(),
            type: 'user',
            text: inputValue,
            time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');

        // Simulated AI response
        setTimeout(() => {
            const botResponse = {
                id: Date.now() + 1,
                type: 'bot',
                text: 'أبشر، معك أصيل. شكراً لاستفسارك! هذا العرض تجريبي يوضح كيف يمكنني مستقبلاً تحليل صور الكدمات وربطها ببياناتك الحيوية بدقة عالية.',
                time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botResponse]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-[600px] animate-in slide-in-from-left-4 duration-500">
            {/* Header */}
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors">
                    <ChevronLeft className="w-6 h-6 rotate-180" />
                </button>
                <div className="flex items-center mr-2">
                    <div>
                        <h1 className="text-lg font-bold text-white leading-none">أصـيل</h1>
                        <p className="text-[10px] text-mueen-cyan font-bold uppercase tracking-widest mt-1">Asseel AI Assistant</p>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto space-y-4 p-4 glass-panel mb-4 no-scrollbar" style={{ backgroundColor: 'rgba(26, 11, 60, 0.3)', border: '1px solid rgba(41, 121, 255, 0.1)' }}>
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-start' : 'justify-end'} items-end gap-3 animate-in fade-in slide-in-from-bottom-2`}>
                        {msg.type === 'bot' && (
                            <div className="w-32 h-32 flex-shrink-0 mb-1 rounded-full overflow-hidden border-2 border-mueen-cyan/30 shadow-[0_0_15px_rgba(34,211,238,0.2)] bg-[#3c1e70]">
                                <img src="/معين 2.jpeg" alt="Asseel" className="w-full h-full object-contain" />
                            </div>
                        )}
                        <div className={`max-w-[70%] p-4 rounded-2xl text-xs leading-relaxed ${msg.type === 'user'
                            ? 'bg-mueen-cyan text-mueen-dark font-bold rounded-tr-none'
                            : 'bg-white/10 text-gray-300 rounded-tl-none border border-white/5'
                            }`}>
                            {msg.text}
                            <div className={`text-[8px] mt-2 opacity-50 ${msg.type === 'user' ? 'text-mueen-dark' : 'text-gray-500'}`}>
                                {msg.time}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Future Feature Teaser (Image Upload) */}
                <div className="flex justify-center py-2">
                    <div className="bg-mueen-cyan/5 border border-mueen-cyan/20 px-4 py-2 rounded-full flex items-center gap-2">
                        <Camera className="w-3 h-3 text-mueen-cyan" />
                        <span className="text-[9px] text-mueen-cyan font-bold">يمكنك إرفاق صور الكدمات للتحليل (قريباً)</span>
                    </div>
                </div>
            </div>

            {/* Input Area */}
            <div className="p-2 glass-panel flex items-center gap-2" style={{ backgroundColor: 'rgba(26, 11, 60, 0.6)' }}>
                <button className="p-3 text-gray-400 hover:text-mueen-cyan transition-colors bg-white/5 rounded-xl group relative">
                    <ImageIcon className="w-5 h-5" />
                    <span className="absolute -top-10 right-0 bg-mueen-cyan text-mueen-dark text-[8px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">إرفاق صورة</span>
                </button>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="اسألني عن حالتك الصحية..."
                    className="flex-1 bg-transparent border-none text-white text-xs py-3 focus:ring-0 text-right outline-none"
                    dir="rtl"
                />
                <button
                    onClick={handleSend}
                    className="p-3 bg-mueen-cyan text-mueen-dark rounded-xl hover:scale-105 transition-transform active:scale-95"
                >
                    <Send className="w-5 h-5 rotate-180" />
                </button>
            </div>

            <p className="text-[9px] text-gray-600 text-center mt-3">
                * فكرة مستقبلية: تحليل الصور والبيانات بواسطة نماذج رؤية متقدمة (Vision AI)
            </p>
        </div>
    );
};

export default SmartAssistantView;
