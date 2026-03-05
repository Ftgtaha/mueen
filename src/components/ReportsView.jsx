import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, ChevronLeft, Info } from 'lucide-react';

const ReportsView = ({ onBack }) => {
    const [timeframe, setTimeframe] = React.useState('7d');

    // Simulated Time in Range (TIR) Data
    const tirData = {
        '3d': [
            { level: 'مرتفع جداً (>250)', value: 5, color: '#9d174d' },
            { level: 'مرتفع (>180)', value: 15, color: '#ef4444' },
            { level: 'في النطاق (80-180)', value: 70, color: '#10b981' },
            { level: 'منخفض (70-79)', value: 7, color: '#f97316' },
            { level: 'منخفض جداً (<70)', value: 3, color: '#7f1d1d' },
        ],
        '7d': [
            { level: 'مرتفع جداً (>250)', value: 4, color: '#9d174d' },
            { level: 'مرتفع (>180)', value: 12, color: '#ef4444' },
            { level: 'في النطاق (80-180)', value: 75, color: '#10b981' },
            { level: 'منخفض (70-79)', value: 6, color: '#f97316' },
            { level: 'منخفض جداً (<70)', value: 3, color: '#7f1d1d' },
        ],
        '1m': [
            { level: 'مرتفع جداً (>250)', value: 8, color: '#9d174d' },
            { level: 'مرتفع (>180)', value: 18, color: '#ef4444' },
            { level: 'في النطاق (80-180)', value: 65, color: '#10b981' },
            { level: 'منخفض (70-79)', value: 5, color: '#f97316' },
            { level: 'منخفض جداً (<70)', value: 4, color: '#7f1d1d' },
        ],
        '3m': [
            { level: 'مرتفع جداً (>250)', value: 10, color: '#9d174d' },
            { level: 'مرتفع (>180)', value: 20, color: '#ef4444' },
            { level: 'في النطاق (80-180)', value: 60, color: '#10b981' },
            { level: 'منخفض (70-79)', value: 6, color: '#f97316' },
            { level: 'منخفض جداً (<70)', value: 4, color: '#7f1d1d' },
        ],
        '6m': [
            { level: 'مرتفع جداً (>250)', value: 12, color: '#9d174d' },
            { level: 'مرتفع (>180)', value: 22, color: '#ef4444' },
            { level: 'في النطاق (80-180)', value: 55, color: '#10b981' },
            { level: 'منخفض (70-79)', value: 7, color: '#f97316' },
            { level: 'منخفض جداً (<70)', value: 4, color: '#7f1d1d' },
        ],
        '1y': [
            { level: 'مرتفع جداً (>250)', value: 15, color: '#9d174d' },
            { level: 'مرتفع (>180)', value: 25, color: '#ef4444' },
            { level: 'في النطاق (80-180)', value: 50, color: '#10b981' },
            { level: 'منخفض (70-79)', value: 8, color: '#f97316' },
            { level: 'منخفض جداً (<70)', value: 2, color: '#7f1d1d' },
        ]
    };

    const currentData = tirData[timeframe];

    const timeframes = [
        { id: '3d', label: '3 أيام' },
        { id: '7d', label: '7 أيام' },
        { id: '1m', label: 'شهر' },
        { id: '3m', label: '3 أشهر' },
        { id: '6m', label: '6 أشهر' },
        { id: '1y', label: 'سنة' }
    ];

    return (
        <div className="animate-in slide-in-from-left-4 duration-500">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors">
                    <ChevronLeft className="w-6 h-6 rotate-180" />
                </button>
                <h1 className="text-xl font-bold text-white mr-2">تقارير الصحة الحيوية</h1>
            </div>

            {/* Timeframe Selector */}
            <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar">
                {timeframes.map(tf => (
                    <button
                        key={tf.id}
                        onClick={() => setTimeframe(tf.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${timeframe === tf.id
                                ? 'bg-mueen-cyan text-mueen-dark shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                                : 'bg-white/5 text-gray-500 hover:bg-white/10'
                            }`}
                    >
                        {tf.label}
                    </button>
                ))}
            </div>

            {/* Time in Range Chart */}
            <div className="glass-panel p-6 mb-6" style={{ backgroundColor: 'rgba(26, 11, 60, 0.45)', border: '1px solid rgba(41, 121, 255, 0.2)' }}>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-sm font-bold text-white">الوقت في النطاق (TIR)</h2>
                        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tight">Time in Range Analysis</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-mueen-cyan/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-mueen-cyan" />
                    </div>
                </div>

                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={currentData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                            <XAxis type="number" hide domain={[0, 100]} />
                            <YAxis
                                dataKey="level"
                                type="category"
                                hide
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(25, 10, 50, 0.95)', border: '1px solid rgba(41, 121, 255, 0.3)', borderRadius: '12px' }}
                                cursor={{ fill: 'transparent' }}
                                formatter={(value) => [`${value}%`]}
                            />
                            <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={32}>
                                {currentData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend & Stats */}
                <div className="space-y-3 mt-4">
                    {currentData.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between group">
                            <div className="flex items-center space-x-3 space-x-reverse">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{item.level}</span>
                            </div>
                            <span className="text-xs font-bold text-white">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Insight Box */}
            <div className="p-4 rounded-2xl bg-mueen-cyan/[0.03] border border-mueen-cyan/20 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-mueen-cyan" />
                    <span className="text-xs font-bold text-mueen-cyan">تحليل الذكاء الاصطناعي</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed text-right">
                    نلاحظ أن نسبة السكر لديك بقيت في النطاق بنسبة <span className="text-white font-bold">{tirData[timeframe][2].value}%</span> خلال الفترة المحددة.
                    ننصحك بتقليل النشاط البدني العنيف خلال فترة المساء لتجنب الانخفاضات المفاجئة.
                </p>
            </div>
        </div>
    );
};

export default ReportsView;
