
export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
}

export interface Message {
  role: MessageRole;
  content: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

export interface TranscriptionEntry {
  speaker: 'user' | 'model';
  text: string;
}
