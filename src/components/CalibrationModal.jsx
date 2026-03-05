import React, { useState } from 'react';
import { Settings2, X } from 'lucide-react';

const CalibrationModal = ({ isVisible, currentGlucose, onCalibrate, onClose }) => {
    const [newValue, setNewValue] = useState(currentGlucose?.toString() || "");

    if (!isVisible) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const val = parseInt(newValue, 10);
        if (!isNaN(val) && val > 20 && val < 600) {
            onCalibrate(val);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-mueen-dark/80 flex items-center justify-center p-4 z-40 backdrop-blur-sm">
            <div className="glass-panel w-full max-w-sm p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 left-4 text-gray-400 hover:text-white" // Using RTL layout conventionally (top-left for close)
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-2 space-x-reverse mb-6">
                    <Settings2 className="w-6 h-6 text-mueen-cyan" />
                    <h2 className="text-xl font-bold text-white">معايرة الجهاز</h2>
                </div>

                <p className="text-gray-300 text-sm mb-6">
                    الرجاء إدخال قراءة فحص الدم الحالية عبر الوخز لضبط استشعار المراقبة المستمرة.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">القراءة الحالية (mg/dL)</label>
                        <input
                            type="number"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-mueen-cyan text-center"
                            placeholder="مثال: 110"
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-mueen-cyan text-black font-bold hover:bg-white transition-colors"
                    >
                        تأكيد المعايرة
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CalibrationModal;
