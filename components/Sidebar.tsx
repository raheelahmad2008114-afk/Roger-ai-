import React from 'react';
import { Conversation } from '../types';
import { ChatIcon, VoiceIcon, LogoutIcon, PlusIcon } from './icons';

interface SidebarProps {
  activeView: 'chat' | 'voice';
  onSetView: (view: 'chat' | 'voice') => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSetActiveConversationId: (id: string) => void;
  onNewChat: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSetView,
  conversations,
  activeConversationId,
  onSetActiveConversationId,
  onNewChat,
  onLogout,
}) => {
  return (
    <aside className="w-64 bg-slate-900 text-gray-200 flex flex-col p-4 border-r border-slate-700/50">
      <div className="flex items-center mb-6">
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-red-500">
          Roger AI
        </h1>
      </div>

      <button
        onClick={onNewChat}
        className="flex items-center justify-center w-full px-4 py-2 mb-4 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:ring-offset-slate-900 transition-colors"
      >
        <PlusIcon className="w-4 h-4 mr-2" />
        New Chat
      </button>

      <div className="flex bg-slate-800 rounded-lg p-1 mb-4">
        <NavButton
          label="Chat"
          icon={<ChatIcon className="w-5 h-5" />}
          isActive={activeView === 'chat'}
          onClick={() => onSetView('chat')}
        />
        <NavButton
          label="Voice"
          icon={<VoiceIcon className="w-5 h-5" />}
          isActive={activeView === 'voice'}
          onClick={() => onSetView('voice')}
        />
      </div>

      <nav className="flex-1 overflow-y-auto pr-1 -mr-2">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">History</h2>
        <ul>
          {conversations.map((convo) => (
            <li key={convo.id}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onSetActiveConversationId(convo.id);
                  onSetView('chat');
                }}
                className={`block px-3 py-2 text-sm rounded-md truncate ${
                  activeConversationId === convo.id && activeView === 'chat'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                {convo.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-2 text-sm font-medium text-slate-300 rounded-md hover:bg-slate-700/50 hover:text-white"
        >
          <LogoutIcon className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

const NavButton: React.FC<{ label: string; icon: React.ReactNode; isActive: boolean; onClick: () => void; }> = ({ label, icon, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center px-3 py-1.5 text-sm rounded-md transition-colors ${
        isActive ? 'bg-rose-600 text-white shadow' : 'text-slate-300 hover:bg-slate-700'
      }`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
);


export default Sidebar;