import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

/**
 * A floating bubble that toggles a minimal voice assistant panel.
 * This component is deliberately lightweight and uses only the existing
 * voice control hooks from the Dashboard page via props.
 */
interface VoiceBubbleProps {
  isLiveActive: boolean;
  setIsLiveActive: (v: boolean) => void;
  isVoiceEnabled: boolean;
  setIsVoiceEnabled: (v: boolean) => void;
  speakText: (text: string) => void;
  liveOrbState: string;
}

const VoiceBubble: React.FC<VoiceBubbleProps> = ({
  isLiveActive,
  setIsLiveActive,
  isVoiceEnabled,
  setIsVoiceEnabled,
  speakText,
  liveOrbState,
}) => {
  const [showPanel, setShowPanel] = useState(false);

  const toggleLive = () => {
    const newState = !isLiveActive;
    setIsLiveActive(newState);
    setShowPanel(newState);
    if (newState) {
      speakText('Nexous Live Voice Mode online.');
    }
  };

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={toggleLive}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-violet-600 to-emerald-500 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Toggle Nexous Live Voice"
      >
        {isLiveActive ? <MicOff size={24} className="text-white" /> : <Mic size={24} className="text-white" />}
      </button>

      {/* Minimal overlay panel */}
      {showPanel && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-glass-grad backdrop-blur-xl p-6 rounded-2xl w-96 shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-zinc-100">Nexous Live Voice</h3>
            <p className="text-sm text-zinc-300 mb-2">Status: {liveOrbState}</p>
            <button
              onClick={toggleLive}
              className="mt-4 w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded"
            >
              End Session
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceBubble;
