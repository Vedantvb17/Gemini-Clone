import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ChatStore, Chatroom, Message } from '@/types'
import { generateId } from '@/lib/utils'

// Sample AI responses for demo
const AI_RESPONSES = [
  "I'm Gemini, your AI assistant. How can I help you today?",
  "That's an interesting question! Let me think about that...",
  "I understand what you're asking. Here's my perspective on this topic:",
  "Great question! Based on what you've shared, I'd suggest:",
  "I'm here to help! Could you provide a bit more context so I can give you a better answer?",
  "That's a complex topic. Let me break it down for you:",
  "I appreciate you sharing that with me. Here's what I think:",
  "Thanks for the question! This is something I encounter often, and here's my take:",
]

const DUMMY_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    content: "Hi there! I'm your AI assistant Gemini. How can I help you today?",
    isUser: false,
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    id: 'msg-2',
    content: "Hello! Can you help me with some coding questions?",
    isUser: true,
    timestamp: new Date(Date.now() - 86340000),
  },
  {
    id: 'msg-3',
    content: "Of course! I'd be happy to help you with coding questions. What specific programming topic or problem would you like assistance with?",
    isUser: false,
    timestamp: new Date(Date.now() - 86330000),
  }
]

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chatrooms: [
        {
          id: 'default-chat',
          title: 'General Chat',
          messages: DUMMY_MESSAGES,
          createdAt: new Date(Date.now() - 86400000),
          lastMessage: DUMMY_MESSAGES[DUMMY_MESSAGES.length - 1]
        }
      ],
      currentChatroomId: 'default-chat',
      isTyping: false,
      searchQuery: '',

      addChatroom: (title) => {
        const newChatroom: Chatroom = {
          id: generateId(),
          title,
          messages: [],
          createdAt: new Date(),
        }
        
        set(state => ({
          chatrooms: [newChatroom, ...state.chatrooms],
          currentChatroomId: newChatroom.id
        }))
      },

      deleteChatroom: (id) => {
        set(state => {
          const updatedChatrooms = state.chatrooms.filter(room => room.id !== id)
          const newCurrentId = state.currentChatroomId === id 
            ? (updatedChatrooms[0]?.id || null) 
            : state.currentChatroomId
          
          return {
            chatrooms: updatedChatrooms,
            currentChatroomId: newCurrentId
          }
        })
      },

      setCurrentChatroom: (id) => set({ currentChatroomId: id }),

      addMessage: (chatroomId, messageData) => {
        const message: Message = {
          ...messageData,
          id: generateId(),
          timestamp: new Date()
        }

        set(state => ({
          chatrooms: state.chatrooms.map(room => 
            room.id === chatroomId 
              ? { 
                  ...room, 
                  messages: [...room.messages, message],
                  lastMessage: message
                }
              : room
          )
        }))

        // Simulate AI response if user message
        if (messageData.isUser) {
          set({ isTyping: true })
          
          setTimeout(() => {
            const aiResponse: Message = {
              id: generateId(),
              content: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
              isUser: false,
              timestamp: new Date()
            }

            set(state => ({
              chatrooms: state.chatrooms.map(room => 
                room.id === chatroomId 
                  ? { 
                      ...room, 
                      messages: [...room.messages, aiResponse],
                      lastMessage: aiResponse
                    }
                  : room
              ),
              isTyping: false
            }))
          }, Math.random() * 2000 + 1000) // 1-3 seconds delay
        }
      },

      setTyping: (typing) => set({ isTyping: typing }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      loadMoreMessages: (chatroomId) => {
        // Simulate loading more messages with dummy data
        const dummyMessages: Message[] = Array.from({ length: 10 }, (_, i) => ({
          id: generateId(),
          content: `This is an older message #${i + 1}`,
          isUser: Math.random() > 0.5,
          timestamp: new Date(Date.now() - (86400000 * 2) - (i * 3600000))
        }))

        set(state => ({
          chatrooms: state.chatrooms.map(room => 
            room.id === chatroomId 
              ? { ...room, messages: [...dummyMessages, ...room.messages] }
              : room
          )
        }))
      }
    }),
    {
      name: 'gemini-chat-storage',
      partialize: (state) => ({ 
        chatrooms: state.chatrooms,
        currentChatroomId: state.currentChatroomId 
      })
    }
  )
)
