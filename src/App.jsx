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
import { Menu, User, Settings, AlertTriangle } from 'lucide-react';
import { supabase } from './supabaseClient';

const PATIENT_ID = 'mueen_demo_001'; // Unique identifier for the demo patient

function App() {
    const [isPaired, setIsPaired] = useState(false);
    const [isAdminView, setIsAdminView] = useState(false);

    // View & Sidebar State
    const [activeView, setActiveView] = useState('dashboard'); // dashboard or reports
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Rescue States
    const [isScanning, setIsScanning] = useState(false);
    const [hasResult, setHasResult] = useState(false);
    const [scenario, setScenario] = useState('standby');

    // Patient Profile State
    const [patientData, setPatientData] = useState({
        name: "سعد بن محمد",
        age: "45",
        bloodType: "O+"
    });

    // Emergency Contact State
    const [contactName, setContactName] = useState("فهد (الأب)");
    const [contactPhone, setContactPhone] = useState("05XXXXXXXXX");

    // Vitals
    const [glucose, setGlucose] = useState(100);
    const [ketones, setKetones] = useState(0.2);
    const [glucagon, setGlucagon] = useState(1.0);
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

    const rescueTimerRef = useRef(null);
    const audioRef = useRef(null);

    // High-Quality MP3 Voice Manager
    const playVoice = (filename) => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        // Paths assumed to be in /public/voice/
        const audio = new Audio(`/voice/${filename}.mp3`);
        audioRef.current = audio;
        audio.play().catch(e => console.log("Audio play blocked or file missing:", e));
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('view') === 'admin') {
            setIsAdminView(true);
            setIsPaired(true);
        }

        // --- Supabase Real-time Subscription ---
        const channel = supabase
            .channel('health_sync')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'health_monitor',
                filter: `short_id=eq.${PATIENT_ID}`
            }, (payload) => {
                const data = payload.new;
                // Sync values across devices
                if (data.scenario && data.scenario !== scenario) {
                    setScenario(data.scenario);
                    setHasResult(true);
                }
                if (data.glucose) setTargetGlucose(data.glucose);
                if (data.ketones) setTargetKetones(data.ketones);
                if (data.alert_text) setAlertText(data.alert_text);
            })
            .subscribe();

        // Initial Fetch
        const fetchInitial = async () => {
            const { data } = await supabase
                .from('health_monitor')
                .select('*')
                .eq('short_id', PATIENT_ID)
                .single();

            if (data) {
                setScenario(data.scenario);
                setTargetGlucose(data.glucose);
                setTargetKetones(data.ketones);
                setAlertText(data.alert_text);
                setHasResult(true);
                setIsPaired(true);
            }
        };
        fetchInitial();

        // Generate 24 hours of data
        const initialData = Array.from({ length: 24 }).map((_, i) => {
            const hour = i.toString().padStart(2, '0') + ':00';
            return {
                time: hour,
                glucose: 90 + Math.random() * 40,
                ketones: 0.1 + Math.random() * 0.3
            };
        });
        setChartData(initialData);

        return () => supabase.removeChannel(channel);
    }, []);

    // Triggering Specific Voicelines on scenario/alert change
    useEffect(() => {
        if (isScanning) {
            playVoice('scanning'); // "ثواني بس.. جاري فحص السكر..."
        }
    }, [isScanning]);

    // Smooth Transition & Dynamic Alert Engine
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

            // --- EMERGENCY LOGIC (Saudi Dialect UI) ---
            if (scenario === 'hypo_danger') {
                if (currentG <= 70 && currentG > 55) {
                    if (alertText !== "تنبيه.. السكر بدأ ينزل عن الطبيعي، تابع حالتك.") {
                        playVoice('warning_low');
                        nextAlert = "تنبيه.. السكر بدأ ينزل عن الطبيعي، تابع حالتك.";
                    }
                } else if (currentG <= 55) {
                    if (alertText !== "خطر! رصدنا هبوط حاد. تكفى احقن الحين قبل ما تدوخ.") {
                        playVoice('danger_hypo');
                        nextAlert = "خطر! رصدنا هبوط حاد. تكفى احقن الحين قبل ما تدوخ.";
                    }
                    if (!emergencyCall && !rescueTimerRef.current) {
                        setEmergencyReason("رصد هبوط حاد في السكر");
                        rescueTimerRef.current = setTimeout(() => {
                            playVoice('calling_emergency');
                            setAlertText("ما فيه رد.. جاري الاتصال بالطوارئ وأهلك الحين.");
                            setTimeout(() => setEmergencyCall(true), 4000);
                        }, 8000);
                    }
                }
            } else if (scenario === 'high_ketones') {
                if (currentK >= 1.5 && currentK < 2.5) {
                    if (alertText !== "تحذير.. الكيتونات مرتفعة شوي. يرجى مراقبة الحالة.") {
                        playVoice('warning_ketones');
                        nextAlert = "تحذير.. الكيتونات مرتفعة شوي. يرجى مراقبة الحالة.";
                    }
                } else if (currentK >= 2.5) {
                    if (alertText !== "خطر! الكيتونات مرتفعة مرة. احتمال حموضة بالدم، لازم طبيب فوراً.") {
                        playVoice('danger_ketones');
                        nextAlert = "خطر! الكيتونات مرتفعة مرة. احتمال حموضة بالدم، لازم طبيب فوراً.";
                    }
                    if (!emergencyCall && !rescueTimerRef.current) {
                        setEmergencyReason("رصد ارتفاع حاد كيتوني");
                        rescueTimerRef.current = setTimeout(() => {
                            playVoice('calling_emergency');
                            setAlertText("ما فيه رد.. جاري الاتصال بالطوارئ لتفادي غيبوبة الكيتونات...");
                            setTimeout(() => setEmergencyCall(true), 4000);
                        }, 8000);
                    }
                }
            } else if (scenario === 'hyper') {
                if (currentG >= 180 && currentG < 250) {
                    if (alertText !== "تنبيه.. السكر مرتفع. تأكد عبر فحص الدم التقليدي.") {
                        playVoice('warning_high');
                        nextAlert = "تنبيه.. السكر مرتفع. تأكد عبر فحص الدم التقليدي.";
                    }
                } else if (currentG >= 250) {
                    if (alertText !== "انتبه! السكر عندك مرتفع بالحيل. خطر غيبوبة، لازم مساعدة طبية.") {
                        playVoice('danger_hyper');
                        nextAlert = "انتبه! السكر عندك مرتفع بالحيل. خطر غيبوبة، لازم مساعدة طبية.";
                    }
                    if (!emergencyCall && !rescueTimerRef.current) {
                        setEmergencyReason("رصد ارتفاع حاد جداً");
                        rescueTimerRef.current = setTimeout(() => {
                            playVoice('calling_emergency');
                            setAlertText("ما فيه رد.. جاري إبلاغ جهات الاتصال والأهل الحين...");
                            setTimeout(() => setEmergencyCall(true), 4000);
                        }, 8000);
                    }
                }
            } else if (scenario === 'pre_hypo') {
                if (currentG <= 80 && currentG > 70) {
                    if (alertText !== "انتبه.. السكر مائل للهبوط، خذ لك شيء بسيط يرفعه.") {
                        playVoice('pre_hypo');
                        nextAlert = "انتبه.. السكر مائل للهبوط، خذ لك شيء بسيط يرفعه.";
                    }
                }
            } else if (scenario === 'normal') {
                if (alertText !== "أبشرك.. السكر في النطاق الطبيعي ووضعك تمام.") {
                    playVoice('result_normal');
                    nextAlert = "أبشرك.. السكر في النطاق الطبيعي ووضعك تمام.";
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

    const startRescueScan = async (targetScenario) => {
        setHasResult(true);
        setIsScanning(false);
        setScenario(targetScenario);
        setEmergencyCall(false);
        setEmergencyReason("");

        if (rescueTimerRef.current) clearTimeout(rescueTimerRef.current);
        rescueTimerRef.current = null;

        let newG = glucose;
        let newK = ketones;

        switch (targetScenario) {
            case 'normal':
                newG = 115;
                newK = 0.2;
                break;
            case 'pre_hypo':
                newG = 74;
                newK = 0.3;
                break;
            case 'hypo_danger':
                newG = 40;
                newK = 0.4;
                break;
            case 'hyper':
                newG = 280;
                newK = 0.5;
                break;
            case 'high_ketones':
                newG = 230;
                newK = 3.2;
                break;
            default:
                break;
        }

        setTargetGlucose(newG);
        setTargetKetones(newK);

        // --- Push to Supabase Cloud ---
        const { error } = await supabase
            .from('health_monitor')
            .upsert({
                short_id: PATIENT_ID,
                patient_name: patientData.name || "مستخدِم مُعين",
                glucose: newG,
                ketones: newK,
                scenario: targetScenario,
                alert_text: "جاري مراقبة حالتك..." // Default reset text
            });

        if (error) console.error("Supabase Error:", error);
    };

    const handleHardwareInject = () => {
        if (glucagon > 0.1) {
            playVoice('inject_success');
            setGlucagon(prev => Math.max(0, prev - 0.2));
            setScenario('recovering');
            setEmergencyCall(false);
            if (rescueTimerRef.current) clearTimeout(rescueTimerRef.current);
            rescueTimerRef.current = null;
            setAlertText("تم الحقن بنجاح.. أبشر بالعافية، جاري مراقبة حالتك.");
            setTargetGlucose(105);
            setTargetKetones(0.2);
        }
    };

    const handleRefill = () => {
        playVoice('refill_success');
        setGlucagon(1.0);
        setAlertText("تمت التعبئة بنجاح.. كبسولة القلوكاجون جاهزة للاستخدام.");
    };

    const handleManualPairing = (data) => {
        setPatientData({
            name: data.patientName,
            age: data.patientAge,
            bloodType: data.bloodType
        });
        setContactName(data.emergencyName);
        setContactPhone(data.emergencyPhone);
        setIsPaired(true);
        const silent = new Audio();
        silent.play().catch(() => { });
    };

    if (!isPaired) {
        return <PairingModal onPaired={handleManualPairing} />
    }

    return (
        <div
            className="min-h-screen pb-40 relative overflow-x-hidden md:max-w-[480px] md:mx-auto md:border-x md:border-white/10 md:shadow-2xl selection:bg-mueen-cyan/30"
            style={{ backgroundColor: '#090314' }}
        >
            <header
                className="p-4 flex justify-between items-center border-b border-white/5 sticky top-0 z-30"
                style={{ backgroundColor: '#13051c' }}
            >
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
                {activeView === 'dashboard' ? (
                    <>
                        <div className="glass-panel p-4 flex items-center justify-between mb-2" style={{ backgroundColor: 'rgba(26, 11, 60, 0.45)', border: '1px solid rgba(41, 121, 255, 0.2)' }}>
                            <div className="flex items-center space-x-3 space-x-reverse">
                                <div className="w-10 h-10 rounded-full bg-mueen-blue/20 flex items-center justify-center">
                                    <User className="text-mueen-cyan w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-white text-sm font-bold leading-none">{patientData.name}</h3>
                                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">Age: {patientData.age} | Blood: {patientData.bloodType}</p>
                                </div>
                            </div>
                            <div className="bg-mueen-cyan/10 px-2 py-1 rounded text-[8px] text-mueen-cyan font-bold uppercase animate-pulse">
                                Monitoring ON
                            </div>
                        </div>

                        <MueenAvatar scenario={scenario} alertText={alertText} />

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
                ) : (
                    <SmartAssistantView onBack={() => setActiveView('dashboard')} />
                )}
            </main>

            {/* PRESENTATION TOOLS */}
            {isAdminView && activeView === 'dashboard' && (
                <PresenterControlPanel onScenarioChange={startRescueScan} />
            )}

            <EmergencyCallUI
                isVisible={emergencyCall}
                reason={emergencyReason}
                contactName={contactName}
                contactPhone={contactPhone}
                onCancel={() => {
                    setEmergencyCall(false);
                    setScenario('normal');
                    setTargetGlucose(110);
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

            {isAdminView && (
                <PresenterControlPanel
                    currentScenario={scenario}
                    onStartEmergency={startRescueScan}
                    onHardwareInject={handleHardwareInject}
                    onRefill={handleRefill}
                />
            )}

        </div>
    );
}

export default App;
