import React, { useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const MueenAvatar = ({ scenario, alertText, isSpeaking, isMuted, setIsMuted }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            if (isSpeaking) {
                // Ensure it starts from second 2.0 if it's currently at the forced pause state
                if (videoRef.current.currentTime < 2) {
                    videoRef.current.currentTime = 2;
                }
                videoRef.current.play().catch(e => console.log("Video play check:", e));
            } else {
                videoRef.current.pause();
                // Reset to second 2.0 instead of 0 to skip the initial closed-eyes frame
                videoRef.current.currentTime = 2;
            }
        }
    }, [isSpeaking]);
    // Determine styling based on scenario
    let glowColor = 'glow-cyan';
    let pulseClass = '';

    if (scenario === 'hypo_danger' || scenario === 'high_ketones') {
        glowColor = 'glow-red';
        pulseClass = 'animate-pulse';
    } else if (scenario === 'pre_hypo' || scenario === 'hyper') {
        glowColor = 'shadow-[0_0_20px_rgba(251,146,60,0.5)]'; // Orange
        pulseClass = 'animate-pulse';
    } else if (scenario === 'recovery') {
        glowColor = 'shadow-[0_0_20px_rgba(74,222,128,0.5)]'; // Green
    }

    return (
        <div className="glass-panel p-6 flex flex-col items-center justify-center relative min-h-[220px] mb-6">

            {/* Avatar Video (Aseel) */}
            <div className={`relative w-36 h-36 rounded-full bg-[#1a0b3c] border-2 border-mueen-blue/20 ${glowColor} ${pulseClass} transition-all duration-500 overflow-hidden flex items-center justify-center`}>
                <video
                    ref={videoRef}
                    src="/مع_الحفاظ_على_الفيديو_بحالته_ا.mp4"
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={{
                        objectPosition: 'center 0%',
                        transform: 'translateX(-1.2%)'
                    }}
                />
            </div>

            {/* Speech Bubble / Alert Text */}
            <div className={`mt-6 w-full max-w-[90%] p-4 rounded-xl border border-mueen-blue/20 relative transition-all duration-300 ${alertText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} bg-[#1a0b3c]/80 backdrop-blur-sm`} dir="rtl">
                {/* Pointer triangle */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-tl-sm bg-[#1a0b3c]/80 border-t border-l border-mueen-blue/20 rotate-45"></div>

                <div className="flex items-center gap-5">
                    <div className="flex flex-col items-center gap-1.5 min-w-[50px]">
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className={`p-2.5 rounded-full transition-all duration-300 border shadow-lg ${isMuted
                                ? 'bg-red-500/10 border-red-500/30 text-red-400 shadow-red-500/5'
                                : 'bg-mueen-cyan/10 border-mueen-cyan/30 text-mueen-cyan shadow-mueen-cyan/10 hover:bg-mueen-cyan/20'
                                } active:scale-95 hover:scale-105`}
                        >
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 font-bold" />}
                        </button>
                        <span className={`text-[9px] font-bold uppercase tracking-tight ${isMuted ? 'text-red-400/70' : 'text-mueen-cyan/70'}`}>
                            {isMuted ? 'تشغيل' : 'كتم'}
                        </span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-gray-200 flex-1 text-right">
                        {alertText || "..."}
                    </p>
                </div>
            </div>

        </div>
    );
};

export default MueenAvatar;
