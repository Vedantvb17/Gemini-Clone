export interface User {
  id: string
  phone: string
  countryCode: string
  isAuthenticated: boolean
}

export interface Country {
  name: {
    common: string
  }
  idd: {
    root: string
    suffixes: string[]
  }
  flag: string
  cca2: string
}

export interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  image?: string
}

export interface Chatroom {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  lastMessage?: Message
}

export interface AuthStore {
  user: User | null
  isLoading: boolean
  countries: Country[]
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setCountries: (countries: Country[]) => void
  login: (phone: string, countryCode: string, otp: string) => Promise<boolean>
  logout: () => void
  sendOTP: (phone: string, countryCode: string) => Promise<boolean>
}

export interface ChatStore {
  chatrooms: Chatroom[]
  currentChatroomId: string | null
  isTyping: boolean
  searchQuery: string
  addChatroom: (title: string) => void
  deleteChatroom: (id: string) => void
  setCurrentChatroom: (id: string) => void
  addMessage: (chatroomId: string, message: Omit<Message, 'id' | 'timestamp'>) => void
  setTyping: (typing: boolean) => void
  setSearchQuery: (query: string) => void
  loadMoreMessages: (chatroomId: string) => void
}

export interface ThemeStore {
  isDark: boolean
  toggle: () => void
}
