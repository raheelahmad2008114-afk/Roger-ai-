
import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatView from './ChatView';
import VoiceView from './VoiceView';
import { Conversation, Message, MessageRole } from '../types';

interface MainLayoutProps {
  onLogout: () => void;
}

type View = 'chat' | 'voice';

// Helper function to load conversations from localStorage
const loadConversations = (): Conversation[] => {
  try {
    const savedConversations = localStorage.getItem('roger-ai-conversations');
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations);
      // Basic validation
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Failed to load conversations from localStorage', error);
  }
  // Default state if nothing is loaded or data is invalid
  return [{ id: Date.now().toString(), title: 'New Chat', messages: [] }];
};


const MainLayout: React.FC<MainLayoutProps> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState<View>('chat');
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  // Set the initial active conversation to the first one from the loaded list.
  const [activeConversationId, setActiveConversationId] = useState<string>(conversations[0].id);

  // Effect to save conversations to localStorage whenever they change
  useEffect(() => {
    try {
        localStorage.setItem('roger-ai-conversations', JSON.stringify(conversations));
    } catch (error) {
        console.error('Failed to save conversations to localStorage', error);
    }
  }, [conversations]);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const createNewChat = useCallback(() => {
    const newId = Date.now().toString();
    const newConversation: Conversation = {
      id: newId,
      title: 'New Chat',
      messages: [],
    };
    setConversations(prev => [...prev, newConversation]);
    setActiveConversationId(newId);
    setActiveView('chat');
  }, []);

  const updateMessages = (newMessages: Message[]) => {
    if (!activeConversation) return;

    const updatedConversation = { ...activeConversation, messages: newMessages };
    if (activeConversation.messages.length === 0 && newMessages.length > 0) {
        const firstUserMessage = newMessages.find(m => m.role === MessageRole.USER);
        if (firstUserMessage) {
            updatedConversation.title = firstUserMessage.content.substring(0, 25) + '...';
        }
    }
    setConversations(conversations.map(c => (c.id === activeConversationId ? updatedConversation : c)));
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        activeView={activeView}
        onSetView={setActiveView}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSetActiveConversationId={setActiveConversationId}
        onNewChat={createNewChat}
        onLogout={onLogout}
      />
      <main className="flex-1 bg-slate-800/50">
        {activeConversation && activeView === 'chat' && (
           <ChatView key={activeConversationId} conversation={activeConversation} onUpdateMessages={updateMessages} />
        )}
        {activeView === 'voice' && <VoiceView />}
      </main>
    </div>
  );
};

export default MainLayout;
