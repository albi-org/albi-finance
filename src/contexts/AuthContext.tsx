/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, createContext } from 'react'
import { authService, type User } from '@/services/firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

// Exporte o Contexto para que o hook possa usá-lo
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Exporte o Componente Provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      const user = await authService.signInWithGoogle()
      if (user) {
        setUser(user)
      }
    } catch (error) {
      console.error('Error logging in:', error)
    }
  }

  const signOut = async () => {
    try {
      await authService.signOut()
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value = { user, loading, signInWithGoogle, signOut }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
