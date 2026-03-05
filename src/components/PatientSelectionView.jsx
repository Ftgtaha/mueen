import React, { useState, useEffect } from 'react';
import { Users, Search, Activity, ChevronRight, User, Trash2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

const PatientSelectionView = ({ onSelect }) => {
    const [patients, setPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleDelete = async (e, patientId) => {
        e.stopPropagation(); // Prevent onSelect from firing
        if (!window.confirm('هل أنت متأكد من حذف هذا المريض؟ سيتم إنهاء الجلسة تماماً.')) return;

        try {
            const { error } = await supabase
                .from('health_monitor')
                .delete()
                .eq('short_id', patientId);

            if (error) throw error;
            setPatients(prev => prev.filter(p => p.short_id !== patientId));
        } catch (error) {
            console.error('Delete error:', error);
            alert('حدث خطأ أثناء الحذف، يرجى المحاولة مرة أخرى.');
        }
    };

    useEffect(() => {
        const fetchPatients = async () => {
            const { data, error } = await supabase
                .from('health_monitor')
                .select('*')
                .order('updated_at', { ascending: false });

            if (data) setPatients(data);
            setIsLoading(false);
        };

        fetchPatients();

        // Real-time listener for new registrations
        const channel = supabase
            .channel('patient_list')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'health_monitor' }, () => {
                fetchPatients();
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-white">إدارة المرضى المتصلين</h1>
                    <p className="text-xs text-gray-500 mt-1 font-bold uppercase tracking-tighter">Active Monitoring Sessions</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-mueen-blue/20 flex items-center justify-center border border-mueen-blue/30">
                    <Users className="text-mueen-cyan w-6 h-6" />
                </div>
            </div>

            <div className="glass-panel p-3 border-white/5 bg-white/5 flex items-center gap-3">
                <Search className="text-gray-500 w-4 h-4" />
                <input
                    type="text"
                    placeholder="البحث عن مريض بالاسم أو الجوال..."
                    className="bg-transparent border-none text-white text-xs focus:ring-0 flex-1 text-right outline-none"
                    dir="rtl"
                />
            </div>

            <div className="grid gap-4">
                {isLoading ? (
                    <div className="text-center py-10">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-mueen-cyan"></div>
                        <p className="mt-4 text-gray-400 text-xs">جاري جلب قائمة المرضى...</p>
                    </div>
                ) : patients.length === 0 ? (
                    <div className="text-center py-10 glass-panel">
                        <User className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                        <p className="text-gray-500 text-xs font-bold">لا يوجد مرضى متصلين حالياً</p>
                    </div>
                ) : (
                    patients.map((patient) => (
                        <div className="relative group/card overflow-hidden rounded-2xl">
                            <button
                                key={patient.short_id}
                                onClick={() => onSelect(patient)}
                                className="w-full glass-panel p-4 flex items-center justify-between group hover:border-mueen-cyan/50 transition-all active:scale-[0.98] text-right"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-mueen-cyan rotate-180" />
                                <div className="flex items-center gap-4">
                                    <div>
                                        <h3 className="text-white text-sm font-extrabold">{patient.patient_name}</h3>
                                        <p className="text-[10px] text-gray-500 mt-1">الجوال: {patient.short_id}</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-mueen-cyan/10 transition-colors">
                                        <Activity className="w-5 h-5 text-gray-500 group-hover:text-mueen-cyan" />
                                    </div>
                                </div>
                            </button>
                            <button
                                onClick={(e) => handleDelete(e, patient.short_id)}
                                className="absolute left-10 top-1/2 -translate-y-1/2 p-3 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl opacity-0 group-hover/card:opacity-100 transition-all z-10"
                                title="حذف المريض"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="p-4 bg-mueen-blue/5 border border-white/5 rounded-2xl">
                <p className="text-[10px] text-gray-500 leading-relaxed">
                    * يتم جلب هذه البيانات من السيرفر بشكل لحظي. بمجرد اختيار المريض، ستتمكن من إرسال السيناريوهات ومراقبة حالته الصحية مباشرة.
                </p>
            </div>
        </div>
    );
};

export default PatientSelectionView;
