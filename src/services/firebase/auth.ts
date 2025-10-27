import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from './config'

// Google Auth Provider
const googleProvider = new GoogleAuthProvider()

export const authService = {
  // Sign in with Google
  async signInWithGoogle(): Promise<User | null> {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      return result.user
    } catch (error) {
      console.error('Error signing in with Google:', error)
      throw new Error('Failed to sign in with Google')
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
      throw new Error('Failed to sign out')
    }
  },

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback)
  },
}

export type { User }
