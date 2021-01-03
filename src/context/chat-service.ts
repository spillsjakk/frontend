import React, { Context, useContext } from "react";

export interface Message {
  side: number;
  message_id: number;
}

export interface ChatService {
  onSubmit: () => void;
  onMessageInputChange: (message: string) => void;
  messages: Array<Message>;
  message: string;
  preapprovedMessages: Array<string>;
}

const ChatServiceContext: Context<Partial<ChatService>> = React.createContext(
  {}
);

export const ChatServiceProvider = ChatServiceContext.Provider;
export default ChatServiceContext;
export const useChatService = () => useContext(ChatServiceContext);
