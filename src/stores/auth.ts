import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthStore, User, Country } from '@/types'
import { generateId } from '@/lib/utils'

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      countries: [],

      setUser: (user) => set({ user }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setCountries: (countries) => set({ countries }),

      sendOTP: async (phone, countryCode) => {
        set({ isLoading: true })
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        set({ isLoading: false })
        
        // Always return true for demo purposes
        return true
      },

      login: async (phone, countryCode, otp) => {
        set({ isLoading: true })
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Simple OTP validation (accept any 6-digit code for demo)
        if (otp.length === 6 && /^\d+$/.test(otp)) {
          const user: User = {
            id: generateId(),
            phone,
            countryCode,
            isAuthenticated: true
          }
          
          set({ user, isLoading: false })
          return true
        }
        
        set({ isLoading: false })
        return false
      },

      logout: () => {
        set({ user: null })
      }
    }),
    {
      name: 'gemini-auth-storage',
      partialize: (state) => ({ user: state.user })
    }
  )
)
