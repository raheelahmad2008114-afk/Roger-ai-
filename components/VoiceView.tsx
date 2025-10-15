import React from 'react';
import { useVoiceInteraction } from '../hooks/useVoiceInteraction';
import { MicIcon, LoaderIcon } from './icons';

const VoiceView: React.FC = () => {
  const {
    isRecording,
    isConnecting,
    startSession,
    endSession,
    transcriptionHistory
  } = useVoiceInteraction();
  
  const handleToggleRecording = () => {
    if (isRecording) {
      endSession();
    } else {
      startSession();
    }
  };

  const getStatusText = () => {
    if (isConnecting) return 'Connecting...';
    if (isRecording) return 'Listening... Press to stop.';
    return 'Press the microphone to start speaking.';
  };

  return (
    <div className="flex flex-col h-full items-center justify-center p-6 text-center bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="flex-1 flex flex-col justify-end items-center w-full max-w-4xl">
        <div className="w-full text-left space-y-4 overflow-y-auto mb-8 p-4 bg-slate-900/50 rounded-lg min-h-[200px]">
          {transcriptionHistory.length === 0 && !isRecording && !isConnecting && (
              <p className="text-slate-400 text-center">Your conversation will appear here.</p>
          )}
          {transcriptionHistory.map((entry, index) => (
              <div key={index} className={entry.speaker === 'user' ? 'text-rose-400' : 'text-slate-200'}>
                  <span className="font-bold capitalize">{entry.speaker}: </span>
                  <span>{entry.text}</span>
              </div>
          ))}
           {isRecording && transcriptionHistory.length === 0 && (
             <p className="text-slate-400 animate-pulse">Listening...</p>
           )}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4">
        <button
          onClick={handleToggleRecording}
          disabled={isConnecting}
          className={`relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-rose-500/50
            ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-rose-600 hover:bg-rose-700'}
            ${isConnecting ? 'cursor-not-allowed bg-slate-600' : ''}
          `}
        >
          {isConnecting ? (
            <LoaderIcon className="w-10 h-10 text-white animate-spin" />
          ) : (
            <MicIcon className="w-10 h-10 text-white" />
          )}
          {isRecording && (
            <span className="absolute w-full h-full bg-red-500 rounded-full animate-ping opacity-75"></span>
          )}
        </button>
        <p className="text-slate-400 text-sm h-5">{getStatusText()}</p>
      </div>
    </div>
  );
};

export default VoiceView;