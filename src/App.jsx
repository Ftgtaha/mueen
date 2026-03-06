import React, { useState, useEffect, useRef } from 'react';
import PairingModal from './components/PairingModal';
import VitalsDisplay from './components/VitalsDisplay';
import MueenAvatar from './components/MueenAvatar';
import EmergencyCallUI from './components/EmergencyCallUI';
import PresenterControlPanel from './components/PresenterControlPanel';
import CalibrationModal from './components/CalibrationModal';
import LiveVitalsChart from './components/LiveVitalsChart';
import Sidebar from './components/Sidebar';
import ReportsView from './components/ReportsView';
import SmartAssistantView from './components/SmartAssistantView';
import RegisterView from './components/RegisterView';
import PatientSelectionView from './components/PatientSelectionView';
import PatientProfileView from './components/PatientProfileView';
import LabResultsView from './components/LabResultsView';
import { Menu, User, Settings, AlertTriangle, Users } from 'lucide-react';
import { supabase } from './supabaseClient';

const App = () => {
    // Session & User State
    const [isAdminView, setIsAdminView] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [patientSessionId, setPatientSessionId] = useState(null);
    const [patientData, setPatientData] = useState({
        name: 'جاري التحميل...',
        age: 24,
        bloodType: 'O+',
        phone: '',
        emergencyPhone: ''
    });

    // View & Sidebar State
    const [activeView, setActiveView] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Rescue States
    const [isScanning, setIsScanning] = useState(false);
    const [hasResult, setHasResult] = useState(false);
    const [scenario, setScenario] = useState('standby');

    // Vitals
    const [glucose, setGlucose] = useState(100);
    const [ketones, setKetones] = useState(0.2);
    const [glucagon, setGlucagon] = useState(100);
    const [battery, setBattery] = useState(98);
    const [chartData, setChartData] = useState([]);

    // Targets for smooth transition
    const [targetGlucose, setTargetGlucose] = useState(100);
    const [targetKetones, setTargetKetones] = useState(0.2);

    // Modals & UI
    const [showCalibration, setShowCalibration] = useState(false);
    const [emergencyCall, setEmergencyCall] = useState(false);
    const [emergencyReason, setEmergencyReason] = useState("");
    const [alertText, setAlertText] = useState("مُعين جاهز لمراقبة صحتك.. ضعه على الجلد للبدء بفحـص دوري.");
    const [isSpeaking, setIsSpeaking] = useState(false);

    const rescueTimerRef = useRef(null);
    const audioRef = useRef(null);
    const sosSequenceRef = useRef(null);

    const playVoice = (voiceId, onFinish) => {
        if (audioRef.current) {
            audioRef.current.pause();
        }

        const voiceMap = {
            'scanning': 'لَحْضة,  بنفحص سكرك الان',
            'warning_low': 'انتَبِه,  سكركْ بدا ينخفض,  بس تأكد بِواسِطَة الدم',
            'danger_hypo': 'تحذير، بدا هبوطْ حادْ في سكركْ ، بس تأكد بِواسِطَة الدم',
            'warning_ketones': 'صحتك تْهمّنا! عندكْ مؤشرات الحموضةْ مرتفعه! ! ، اتجه لِأقرب طوارئ',
            'danger_ketones': 'صحتك تْهمّنا! عندكْ مؤشرات الحموضةْ مرتفعه! ! ، اتجه لِأقرب طوارئ',
            'warning_high': 'انتبه، سكركْ بدا يرتفع  ، بس تأكد بِواسِطَة الدم',
            'danger_hyper': 'تحذير، بدا ارتفاعْ حادْ في سكركْ ، بس تأكد بِواسِطَة الدم',
            'pre_hypo': 'انتَبِه,  سكركْ بدا ينخفض,  بس تأكد بِواسِطَة الدم',
            'result_normal': 'ابشرك سكرك في المستوى الامن',
            'calling_emergency': 'ماشفنا منك استجابه!! الآن بنتواصل مع اهلك',
            'inject_success': 'بَشّركْ! ... تم الحقن بنجاح',
            'refill_success': 'اموركْ طيبه !، تمتْ إعادةْ   '
        };

        const filename = voiceMap[voiceId] || voiceId;
        const audio = new Audio(`/voice/${filename}.mp3`);
        audioRef.current = audio;

        audio.onplay = () => setIsSpeaking(true);
        audio.onended = () => {
            setIsSpeaking(false);
            if (onFinish) onFinish();
        };
        audio.onpause = () => setIsSpeaking(false);

        audio.play().catch(e => console.log("Audio play blocked or file missing:", e));
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        let channel;

        if (urlParams.get('view') === 'admin') {
            setIsAdminView(true);
        } else {
            const savedSession = localStorage.getItem('mueen_session');
            if (savedSession) {
                try {
                    const data = JSON.parse(savedSession);
                    setPatientData({
                        ...data,
                        emergencyName: data.emergency_name || data.emergencyName,
                        emergencyPhone: data.emergency_phone || data.emergencyPhone
                    });
                    setPatientSessionId(data.phone);
                    setIsRegistered(true);
                } catch (e) {
                    console.error("Session restoration failed:", e);
                }
            }
        }

        if (patientSessionId) {
            channel = supabase
                .channel('health_sync')
                .on('postgres_changes', {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'health_monitor',
                    filter: `short_id=eq.${patientSessionId}`
                }, (payload) => {
                    const data = payload.new;
                    if (data.scenario && data.scenario !== scenario) {
                        setScenario(data.scenario);
                        setHasResult(true);
                    }
                    if (data.glucose) setTargetGlucose(data.glucose);
                    if (data.ketones) setTargetKetones(data.ketones);
                    if (data.alert_text) setAlertText(data.alert_text);
                    if (data.glucagon !== undefined) setGlucagon(data.glucagon);
                })
                .subscribe();

            const fetchInitial = async () => {
                const { data } = await supabase
                    .from('health_monitor')
                    .select('*')
                    .eq('short_id', patientSessionId)
                    .single();

                if (data) {
                    setScenario(data.scenario);
                    setTargetGlucose(data.glucose);
                    setTargetKetones(data.ketones);
                    setAlertText(data.alert_text);
                    if (data.glucagon !== undefined) setGlucagon(data.glucagon);
                    setHasResult(true);
                }
            };
            fetchInitial();
        }

        const initialData = Array.from({ length: 24 }).map((_, i) => {
            const hour = i.toString().padStart(2, '0') + ':00';
            return {
                time: hour,
                glucose: 90 + Math.random() * 40,
                ketones: 0.1 + Math.random() * 0.3
            };
        });
        setChartData(initialData);

        return () => {
            if (channel) supabase.removeChannel(channel);
        };
    }, [patientSessionId]);

    useEffect(() => {
        if (isScanning) {
            playVoice('scanning');
        }
    }, [isScanning]);

    // MAIN SIMULATION LOOP (500ms)
    useEffect(() => {
        if (!hasResult) return;

        const interval = setInterval(() => {
            let currentG = glucose;
            let currentK = ketones;

            let stepSizeG = 2;
            if (scenario === 'pre_hypo' || scenario === 'normal' || scenario === 'recovering') {
                stepSizeG = 1;
            }

            setGlucose(prevG => {
                if (Math.abs(prevG - targetGlucose) <= stepSizeG) {
                    currentG = targetGlucose;
                    return targetGlucose;
                }
                const direction = targetGlucose > prevG ? 1 : -1;
                currentG = Math.round(prevG + (direction * stepSizeG));
                return currentG;
            });

            setKetones(prevK => {
                if (Math.abs(prevK - targetKetones) < 0.05) {
                    currentK = targetKetones;
                    return targetKetones;
                }
                const step = targetKetones > prevK ? 0.1 : -0.1;
                currentK = parseFloat((prevK + step).toFixed(1));
                return currentK;
            });

            let nextAlert = alertText;

            // --- EMERGENCY LOGIC (Vitals Monitoring Only) ---
            if (scenario === 'hypo_danger') {
                if (currentG < 80 && currentG >= 50) {
                    if (alertText !== "انتَبِه,  سكركْ بدا ينخفض,  بس تأكد بِواسِطَة الدم.") {
                        playVoice('warning_low');
                        nextAlert = "انتَبِه,  سكركْ بدا ينخفض,  بس تأكد بِواسِطَة الدم.";
                    }
                } else if (currentG < 50) {
                    const dangerMsg = "تحذير، بدا هبوطْ حادْ في سكركْ ، بس تأكد بِواسِطَة الدم.";
                    if (alertText !== dangerMsg) {
                        nextAlert = dangerMsg;
                    }
                    // SOS sequence is handled by a dedicated stable useEffect below
                }
            } else if (scenario === 'high_ketones') {
                if (currentK >= 1.5 && currentK < 2.5) {
                    if (alertText !== "صحتك تْهمّنا! عندكْ مؤشرات الحموضةْ مرتفعه! ! ، اتجه لِأقرب طوارئ.") {
                        playVoice('warning_ketones');
                        nextAlert = "صحتك تْهمّنا! عندكْ مؤشرات الحموضةْ مرتفعه! ! ، اتجه لِأقرب طوارئ.";
                    }
                } else if (currentK >= 2.5) {
                    if (alertText !== "صحتك تْهمّنا! عندكْ مؤشرات الحموضةْ مرتفعه! ! ، اتجه لِأقرب طوارئ.") {
                        playVoice('danger_ketones');
                        nextAlert = "صحتك تْهمّنا! عندكْ مؤشرات الحموضةْ مرتفعه! ! ، اتجه لِأقرب طوارئ.";
                    }
                    if (!emergencyCall && !rescueTimerRef.current) {
                        setEmergencyReason("رصد ارتفاع حاد كيتوني");
                        rescueTimerRef.current = setTimeout(() => {
                            playVoice('calling_emergency');
                            setAlertText("ماشفنا منك استجابه!! الآن بنتواصل مع اهلك.");
                            setTimeout(() => setEmergencyCall(true), 4000);
                        }, 8000);
                    }
                }
            } else if (scenario === 'hyper') {
                if (currentG >= 180 && currentG < 250) {
                    if (alertText !== "انتبه، سكركْ بدا يرتفع  ، بس تأكد بِواسِطَة الدم.") {
                        playVoice('warning_high');
                        nextAlert = "انتبه، سكركْ بدا يرتفع  ، بس تأكد بِواسِطَة الدم.";
                    }
                } else if (currentG >= 250) {
                    if (alertText !== "تحذير، بدا ارتفاعْ حادْ في سكركْ ، بس تأكد بِواسِطَة الدم.") {
                        playVoice('danger_hyper');
                        nextAlert = "تحذير، بدا ارتفاعْ حادْ في سكركْ ، بس تأكد بِواسِطَة الدم.";
                    }
                    if (!emergencyCall && !rescueTimerRef.current) {
                        setEmergencyReason("رصد ارتفاع حاد جداً");
                        rescueTimerRef.current = setTimeout(() => {
                            playVoice('calling_emergency');
                            setAlertText("ماشفنا منك استجابه!! الآن بنتواصل مع اهلك.");
                            setTimeout(() => setEmergencyCall(true), 4000);
                        }, 8000);
                    }
                }
            } else if (scenario === 'pre_hypo') {
                if (currentG <= 80 && currentG > 70) {
                    if (alertText !== "انتَبِه,  سكركْ بدا ينخفض,  بس تأكد بِواسِطَة الدم.") {
                        playVoice('pre_hypo');
                        nextAlert = "انتَبِه,  سكركْ بدا ينخفض,  بس تأكد بِواسِطَة الدم.";
                    }
                }
            } else if (scenario === 'normal') {
                if (currentG >= 80 && currentG <= 180) {
                    if (alertText !== "ابشرك سكرك في المستوى الامن.") {
                        playVoice('result_normal');
                        nextAlert = "ابشرك سكرك في المستوى الامن.";
                    }
                }
            }

            if (nextAlert !== alertText) {
                setAlertText(nextAlert);
            }

            setChartData(prev => {
                const newData = [...prev];
                const lastIdx = newData.length - 1;
                const jiggleG = currentG + (Math.random() * 2 - 1);
                newData[lastIdx] = {
                    ...newData[lastIdx],
                    glucose: jiggleG,
                    ketones: currentK
                };
                return newData;
            });
        }, 500);

        return () => clearInterval(interval);
    }, [hasResult, targetGlucose, targetKetones, glucose, ketones, scenario, alertText, emergencyCall]);

    // DEDICATED SOS SEQUENCE EFFECT (Stable & Non-Looping)
    useEffect(() => {
        if (scenario === 'hypo_danger' && glucose < 50 && !emergencyCall && sosSequenceRef.current === null) {
            setEmergencyReason("رصد هبوط حاد في السكر");
            sosSequenceRef.current = "ACTIVE";

            // Timing Chain: Danger 1 -> 2s Gap -> Danger 2 -> 3s Wait -> No Response -> 2s Delay -> UI
            const step4_ShowUI = () => {
                sosSequenceRef.current = setTimeout(() => {
                    setEmergencyCall(true);
                    sosSequenceRef.current = "SOS_UI_OPEN";
                }, 2000);
            };

            const step3_NoResponse = () => {
                sosSequenceRef.current = setTimeout(() => {
                    playVoice('calling_emergency', step4_ShowUI);
                    setAlertText("ماشفنا منك استجابه!! الآن بنتواصل مع اهلك.");
                }, 3000);
            };

            const step2_RepeatDanger = () => {
                sosSequenceRef.current = setTimeout(() => {
                    playVoice('danger_hypo', step3_NoResponse);
                }, 2000);
            };

            const step1_Start = () => {
                playVoice('danger_hypo', step2_RepeatDanger);
            };

            step1_Start();
        }

        // Cleanup: Reset lock if scenario is resolved manually or glucose recovers
        if (scenario !== 'hypo_danger' || glucose >= 80) {
            if (sosSequenceRef.current && typeof sosSequenceRef.current !== 'number') {
                sosSequenceRef.current = null;
            }
        }
    }, [scenario, glucose < 50, emergencyCall]);

    const startRescueScan = async (targetScenario) => {
        setHasResult(true);
        setIsScanning(false);
        setScenario(targetScenario);
        setEmergencyCall(false);
        setEmergencyReason("");

        if (rescueTimerRef.current) {
            if (typeof rescueTimerRef.current === 'number') clearTimeout(rescueTimerRef.current);
            rescueTimerRef.current = null;
        }
        if (sosSequenceRef.current) {
            if (typeof sosSequenceRef.current === 'number') clearTimeout(sosSequenceRef.current);
            sosSequenceRef.current = null;
        }

        let newG = glucose;
        let newK = ketones;

        switch (targetScenario) {
            case 'normal': newG = 115; newK = 0.2; break;
            case 'pre_hypo': newG = 74; newK = 0.3; break;
            case 'hypo_danger': newG = 20; newK = 0.4; break;
            case 'hyper': newG = 300; newK = 0.5; break;
            case 'high_ketones': newG = 230; newK = 3.2; break;
            default: break;
        }

        setTargetGlucose(newG);
        setTargetKetones(newK);

        await supabase.from('health_monitor').upsert({
            short_id: patientSessionId,
            patient_name: patientData.name || "مستخدِم مُعين",
            glucose: newG,
            ketones: newK,
            scenario: targetScenario,
            alert_text: "جاري مراقبة حالتك..."
        });
    };

    const handleHardwareInject = async () => {
        if (glucagon > 0) {
            playVoice('inject_success');
            setGlucagon(prev => Math.max(0, prev - 1));
            setScenario('recovering');
            setEmergencyCall(false);
            if (rescueTimerRef.current) {
                if (typeof rescueTimerRef.current === 'number') clearTimeout(rescueTimerRef.current);
                rescueTimerRef.current = null;
            }
            if (sosSequenceRef.current) {
                if (typeof sosSequenceRef.current === 'number') clearTimeout(sosSequenceRef.current);
                sosSequenceRef.current = null;
            }
            const successMsg = "بَشّركْ! ... تم الحقن بنجاح.";
            setAlertText(successMsg);
            setTargetGlucose(105);
            setTargetKetones(0.2);

            await supabase.from('health_monitor').update({
                scenario: 'recovering',
                glucose: 105,
                ketones: 0.2,
                alert_text: successMsg,
                glucagon: glucagon - 1
            }).eq('short_id', patientSessionId);
        }
    };

    const handleRefill = () => {
        playVoice('refill_success');
        setGlucagon(100);
        setAlertText("اموركْ طيبه !، تمتْ إعادةْ التعبئة.");
    };

    if (!isRegistered && !isAdminView) {
        return <RegisterView onComplete={(id, data) => {
            setPatientSessionId(id);
            setPatientData(data);
            setIsRegistered(true);
        }} />;
    }

    return (
        <div className="min-h-screen relative text-gray-200 overflow-x-hidden selection:bg-mueen-cyan/30"
            style={{ backgroundColor: '#090314' }}
        >
            <header className="p-4 flex justify-between items-center border-b border-white/5 sticky top-0 z-30" style={{ backgroundColor: '#13051c' }}>
                <div className="flex items-center">
                    <img src="/logo.png" alt="معين - MUEEN" className="h-16 w-auto" />
                </div>
                <div className="flex space-x-2 space-x-reverse">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-xl">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </header>

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onViewChange={(view) => {
                    if (view === 'settings') setShowCalibration(true);
                    else setActiveView(view);
                }}
                activeView={activeView}
            />

            <main className="p-4 space-y-6">
                {isAdminView && !patientSessionId ? (
                    <PatientSelectionView onSelect={(p) => {
                        setPatientSessionId(p.short_id);
                        setPatientData({
                            name: p.patient_name,
                            phone: p.short_id,
                            age: p.patient_age || 24,
                            gender: p.patient_gender || 'غير محدد',
                            weight: p.patient_weight || '--',
                            height: p.patient_height || '--',
                            usePump: p.use_pump || false,
                            emergencyName: p.emergency_name,
                            emergencyPhone: p.emergency_phone,
                            bloodType: 'O+'
                        });
                        setGlucose(p.glucose || 100);
                        setGlucagon(p.glucagon !== undefined ? p.glucagon : 100);
                        setScenario(p.scenario || 'standby');
                        setHasResult(true);
                    }} />
                ) : activeView === 'dashboard' ? (
                    <>
                        {isAdminView && (
                            <button
                                onClick={() => setPatientSessionId(null)}
                                className="w-full mb-4 p-2 bg-white/5 rounded-xl border border-white/10 text-[10px] text-gray-500 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                            >
                                <Users className="w-3 h-3" />
                                تغيير المريض الحالي
                            </button>
                        )}
                        <div className="glass-panel p-4 flex items-center justify-between mb-2" style={{ backgroundColor: 'rgba(26, 11, 60, 0.45)', border: '1px solid rgba(41, 121, 255, 0.2)' }}>
                            <div className="flex items-center space-x-3 space-x-reverse">
                                <div className="w-10 h-10 rounded-full bg-mueen-blue/20 flex items-center justify-center">
                                    <User className="text-mueen-cyan w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-white text-sm font-bold leading-none">{patientData.name}</h3>
                                    <p className="text-[9px] text-gray-500 mt-1.5 flex gap-2 items-center">
                                        <span>{patientData.age} سنة</span>
                                        <span className="opacity-30">|</span>
                                        <span>{patientData.gender}</span>
                                        <span className="opacity-30">|</span>
                                        <span>{patientData.weight}كجم</span>
                                        <span className="opacity-30">|</span>
                                        <span>{patientData.height}سم</span>
                                        {patientData.usePump && (
                                            <>
                                                <span className="opacity-30">|</span>
                                                <span className="text-mueen-cyan font-bold">مضخة</span>
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-mueen-cyan/10 px-2 py-1 rounded text-[8px] text-mueen-cyan font-bold uppercase animate-pulse">
                                {isAdminView ? 'Admin Mode' : 'Monitoring ON'}
                            </div>
                        </div>

                        <MueenAvatar scenario={scenario} alertText={alertText} isSpeaking={isSpeaking} />

                        <VitalsDisplay
                            glucose={glucose}
                            ketones={ketones}
                            battery={battery}
                            glucagonLevel={glucagon}
                            isScanning={isScanning}
                            hasResult={hasResult}
                        />

                        {hasResult && (
                            <div className="animate-in fade-in zoom-in duration-1000">
                                <LiveVitalsChart data={chartData} />
                            </div>
                        )}

                        <div className="glass-panel p-4 border-mueen-blue/20 bg-mueen-blue/[0.05]">
                            <p className="text-[11px] text-gray-400 leading-relaxed text-right">
                                <span className="text-mueen-cyan font-bold ml-1 uppercase">AI Tip:</span>
                                يقوم الجهاز بالفحص المجهري (Micro-needle) وتحديد الجرعة بدقة 100٪ بناءً على حالتك اللحظية.
                            </p>
                        </div>
                    </>
                ) : activeView === 'reports' ? (
                    <ReportsView onBack={() => setActiveView('dashboard')} />
                ) : activeView === 'profile' ? (
                    <PatientProfileView patientData={patientData} onBack={() => setActiveView('dashboard')} />
                ) : activeView === 'lab-results' ? (
                    <LabResultsView onBack={() => setActiveView('dashboard')} />
                ) : (
                    <SmartAssistantView onBack={() => setActiveView('dashboard')} />
                )}
            </main>

            <EmergencyCallUI
                isVisible={emergencyCall}
                reason={emergencyReason}
                contactName={patientData.emergencyName || "فهد (الأب)"}
                contactPhone={patientData.emergencyPhone || "05XXXXXXXXX"}
                onCancel={() => {
                    setEmergencyCall(false);
                    setScenario('normal');
                    setTargetGlucose(110);
                    if (rescueTimerRef.current) {
                        if (typeof rescueTimerRef.current === 'number') clearTimeout(rescueTimerRef.current);
                        rescueTimerRef.current = null;
                    }
                    if (sosSequenceRef.current) {
                        if (typeof sosSequenceRef.current === 'number') clearTimeout(sosSequenceRef.current);
                        sosSequenceRef.current = null;
                    }
                }}
            />

            <CalibrationModal
                isVisible={showCalibration}
                currentGlucose={glucose}
                onCalibrate={(val) => {
                    setGlucose(val);
                    setTargetGlucose(val);
                }}
                onClose={() => setShowCalibration(false)}
            />

            {isAdminView && patientSessionId && activeView === 'dashboard' && (
                <PresenterControlPanel
                    currentScenario={scenario}
                    onStartEmergency={startRescueScan}
                    onHardwareInject={handleHardwareInject}
                    onRefill={handleRefill}
                />
            )}
        </div>
    );
};

export default App;
