// Export Firebase configuration
export { default as app, db, auth, analytics } from './config'

// Export Firebase services
export * from './firestore'
export * from './auth'

// Re-export Firebase types that might be needed
export type { User } from 'firebase/auth'
export type { Timestamp } from 'firebase/firestore'
