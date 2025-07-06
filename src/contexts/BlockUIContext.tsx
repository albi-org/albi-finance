import { createContext } from 'react'

export interface BlockUIContextType {
  isBlocking: boolean
  block: () => void
  unblock: () => void
}

export const BlockUIContext = createContext<BlockUIContextType | undefined>(
  undefined
)
