import React, { useState, useRef, useEffect } from 'react';
import { Conversation, Message, MessageRole } from '../types';
import { sendMessage } from '../services/geminiService';
import { SendIcon, LoaderIcon, MicIcon, StopIcon } from './icons';
import { useVoiceInteraction } from '../hooks/useVoiceInteraction';

interface ChatViewProps {
  conversation: Conversation;
  onUpdateMessages: (messages: Message[]) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ conversation, onUpdateMessages }) => {
  const draftKey = `roger-ai-draft-${conversation.id}`;
  const [input, setInput] = useState(() => localStorage.getItem(draftKey) || '');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleTranscriptionUpdate = (text: string) => {
    setInput(text);
    if (text) {
      localStorage.setItem(draftKey, text);
    } else {
      localStorage.removeItem(draftKey);
    }
  };

  const {
    isRecording: isVoiceRecording,
    isConnecting: isVoiceConnecting,
    startSession: startVoiceSession,
    endSession: endVoiceSession,
  } = useVoiceInteraction({
    onLiveTranscriptionUpdate: handleTranscriptionUpdate,
    onTranscriptionComplete: handleTranscriptionUpdate,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: MessageRole.USER, content: input };
    const newMessages = [...conversation.messages, userMessage];
    onUpdateMessages(newMessages);
    setInput('');
    localStorage.removeItem(draftKey);
    setIsLoading(true);

    try {
      const modelResponse = await sendMessage(input, conversation.messages);
      const modelMessage: Message = { role: MessageRole.MODEL, content: modelResponse };
      onUpdateMessages([...newMessages, modelMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: MessageRole.MODEL,
        content: 'Sorry, I encountered an error. Please try again.',
      };
      onUpdateMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMicClick = () => {
    if (isVoiceRecording) {
      endVoiceSession();
    } else {
      startVoiceSession({ disableAudioOutput: true });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    if (value) {
      localStorage.setItem(draftKey, value);
    } else {
      localStorage.removeItem(draftKey);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {conversation.messages.length === 0 && (
              <div className="text-center mt-20">
                  <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-red-500">
                      Hello!
                  </h1>
                  <p className="text-slate-400 mt-2">How can I help you today?</p>
              </div>
          )}
          {conversation.messages.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-4 ${
                msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`p-4 rounded-2xl max-w-2xl prose prose-invert prose-p:my-0 ${
                  msg.role === MessageRole.USER
                    ? 'bg-rose-600 text-white rounded-br-none'
                    : 'bg-slate-700 text-gray-200 rounded-bl-none'
                }`}
                dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br />') }}
              >
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
                <div className="p-4 rounded-2xl bg-slate-700 text-gray-200 rounded-bl-none">
                    <LoaderIcon className="w-6 h-6 animate-spin text-rose-400"/>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="px-6 pb-6 bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center bg-slate-700 rounded-lg p-2 border border-slate-600 focus-within:border-rose-500 transition-colors">
            <textarea
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                }
                }}
                placeholder="Type your message or use the microphone..."
                rows={1}
                className="flex-1 bg-transparent text-gray-100 placeholder-slate-400 focus:outline-none resize-none px-2"
            />
            <button
                onClick={handleMicClick}
                disabled={isVoiceConnecting || isLoading}
                className="p-2 rounded-md text-white disabled:text-slate-500 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors mr-2"
                aria-label={isVoiceRecording ? 'Stop recording' : 'Start recording'}
            >
              {isVoiceConnecting ? (
                  <LoaderIcon className="w-5 h-5 animate-spin" />
              ) : isVoiceRecording ? (
                  <StopIcon className="w-5 h-5 text-red-500" />
              ) : (
                  <MicIcon className="w-5 h-5" />
              )}
            </button>
            <button
                onClick={handleSend}
                disabled={isLoading || !input.trim() || isVoiceRecording}
                className="p-2 rounded-md bg-rose-600 text-white disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-rose-700 transition-colors"
                aria-label="Send message"
            >
                <SendIcon className="w-5 h-5" />
            </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;