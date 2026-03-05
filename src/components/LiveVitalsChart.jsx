import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const LiveVitalsChart = ({ data }) => {
    return (
        <div className="glass-panel p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-semibold text-gray-300">تخطيط حيوي مباشر</h2>
                <div className="flex items-center space-x-2 space-x-reverse text-xs">
                    <span className="flex items-center text-mueen-cyan"><span className="w-2 h-2 rounded-full bg-mueen-cyan ml-1"></span>السكر</span>
                    <span className="flex items-center text-orange-400"><span className="w-2 h-2 rounded-full bg-orange-400 ml-1"></span>الكيتون</span>
                </div>
            </div>

            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorGlucose" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorKetone" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="time"
                            stroke="#6b7280"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            interval={3}
                        />
                        <YAxis yAxisId="left" domain={[20, 300]} tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="right" orientation="right" domain={[0, 3]} hide />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(25, 10, 50, 0.9)', border: '1px solid rgba(41, 121, 255, 0.3)', borderRadius: '12px', backdropBlur: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />

                        {/* Safe zones */}
                        <ReferenceLine yAxisId="left" y={180} stroke="#ef4444" strokeDasharray="3 3" opacity={0.3} />
                        <ReferenceLine yAxisId="left" y={70} stroke="#ef4444" strokeDasharray="3 3" opacity={0.3} />

                        <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="glucose"
                            stroke="#00E5FF"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorGlucose)"
                            isAnimationActive={false}
                        />
                        <Area
                            yAxisId="right"
                            type="monotone"
                            dataKey="ketones"
                            stroke="#fb923c"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorKetone)"
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default LiveVitalsChart;
