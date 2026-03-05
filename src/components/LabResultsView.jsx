import React, { useState } from 'react';
import { FileText, Upload, Plus, Trash2, Calendar, Search, ArrowLeft, Info, CheckCircle2, FileUp, Sparkles } from 'lucide-react';

const LabResultsView = ({ onBack }) => {
    const [reports, setReports] = useState([
        { id: 1, name: 'فحص دم شامل - دوري', date: '2024-02-15', type: 'PDF', size: '1.2 MB' },
        { id: 2, name: 'تحليل مستوى مخزون السكر', date: '2024-01-10', type: 'JPG', size: '2.4 MB' }
    ]);

    const [isDragging, setIsDragging] = useState(false);

    const handleFileUpload = (e) => {
        // Simulated upload
        const newReport = {
            id: Date.now(),
            name: 'تقرير جديد - قيد المعالجة',
            date: new Date().toISOString().split('T')[0],
            type: 'PDF',
            size: '0.8 MB'
        };
        setReports([newReport, ...reports]);
    };

    const deleteReport = (id) => {
        setReports(reports.filter(r => r.id !== id));
    };

    return (
        <div className="flex flex-col h-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
                </button>
                <h1 className="text-xl font-bold text-white">التحاليل والتقارير الطبية</h1>
                <div className="w-10" />
            </div>

            {/* AI Assistant Promo Card */}
            <div className="glass-panel p-5 border-mueen-cyan/20 bg-gradient-to-br from-mueen-cyan/10 to-transparent relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Sparkles className="w-12 h-12 text-mueen-cyan" />
                </div>
                <div className="flex items-start gap-4 text-right">
                    <div className="flex-1">
                        <h3 className="text-md font-bold text-mueen-cyan mb-2 flex items-center justify-end gap-2">
                            قريباً: مناقشة التحاليل بالذكاء الاصطناعي
                            <Sparkles className="w-4 h-4" />
                        </h3>
                        <p className="text-xs text-gray-400 leading-relaxed font-bold">
                            ارفع تقاريرك الآن.. قريباً سيتمكن "مُعين" من قراءة نتائج تحاليلك، تلخيصها، ومناقشتها معك لتقديم خطة علاجية أدق.
                        </p>
                    </div>
                </div>
            </div>

            {/* Upload Area */}
            <div
                className={`glass-panel p-10 border-dashed border-2 transition-all duration-300 flex flex-col items-center justify-center text-center space-y-4 cursor-pointer relative overflow-hidden ${isDragging ? 'border-mueen-cyan bg-mueen-cyan/10 scale-[0.98]' : 'border-white/10 hover:border-mueen-cyan/40 hover:bg-white/5'
                    }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileUpload(); }}
                onClick={() => document.getElementById('report-up').click()}
            >
                <input type="file" id="report-up" className="hidden" onChange={handleFileUpload} />
                <div className="w-16 h-16 rounded-full bg-mueen-cyan/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <FileUp className="w-8 h-8 text-mueen-cyan" />
                </div>
                <div>
                    <h3 className="text-white font-bold text-md">اسحب وأفلت تقريرك هنا</h3>
                    <p className="text-gray-500 text-xs mt-1">أو اضغط لاختيار ملف (PDF, JPG, PNG)</p>
                </div>
                {isDragging && (
                    <div className="absolute inset-0 bg-mueen-cyan/10 backdrop-blur-sm flex items-center justify-center animate-pulse">
                        <span className="text-mueen-cyan font-bold">اترك الملف للرفع..</span>
                    </div>
                )}
            </div>

            {/* Reports List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-mueen-cyan" />
                        سجل الفحوصات الدورية
                    </h3>
                    <span className="text-[10px] text-gray-500 font-bold">{reports.length} تقارير</span>
                </div>

                <div className="space-y-2">
                    {reports.length > 0 ? (
                        reports.map((report) => (
                            <div key={report.id} className="glass-panel p-4 flex items-center gap-4 border-white/5 bg-white/5 hover:bg-white/10 transition-all group animate-in slide-in-from-right-4 duration-300">
                                <button onClick={() => deleteReport(report.id)} className="p-2 text-red-500/20 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                <div className="flex-1 text-right">
                                    <h4 className="text-sm font-bold text-white group-hover:text-mueen-cyan transition-colors">{report.name}</h4>
                                    <div className="flex items-center justify-end gap-3 mt-1">
                                        <span className="text-[10px] text-gray-500 flex items-center gap-1 font-bold">
                                            {report.size}
                                            <Info className="w-3 h-3" />
                                        </span>
                                        <span className="text-[10px] text-gray-400 flex items-center gap-1 font-bold">
                                            {report.date}
                                            <Calendar className="w-3 h-3 text-mueen-cyan/50" />
                                        </span>
                                    </div>
                                </div>

                                <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center border border-white/10">
                                    <span className="text-[10px] font-black text-mueen-cyan">{report.type}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-10 text-center opacity-30">
                            <FileText className="w-12 h-12 mx-auto mb-2 text-gray-500" />
                            <p className="text-sm text-gray-500">لا توجد تقارير مرفوعة حالياً</p>
                        </div>
                    )}
                </div>
            </div>

            {/* AI Medical Disclaimer */}
            <div className="p-4 bg-mueen-blue/5 border border-mueen-blue/10 rounded-2xl mx-1">
                <div className="flex items-start gap-3 text-right">
                    <div className="flex-1">
                        <p className="text-[9px] text-gray-500 leading-relaxed">
                            <span className="text-mueen-cyan font-bold ml-1 uppercase underline decoration-mueen-cyan/30 underline-offset-2">تنبيه:</span>
                            رفع التقارير مخصص للمتابعة الشخصية حالياً. سيتم إخطارك فور تفعيل ميزة التحليل الذكي للتقارير الطبية.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabResultsView;
