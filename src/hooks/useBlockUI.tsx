import { useContext } from 'react'
import {
  BlockUIContext,
  type BlockUIContextType,
} from '@/contexts/BlockUIContext'

export const useBlockUI = (): BlockUIContextType => {
  const context = useContext(BlockUIContext)
  if (context === undefined) {
    throw new Error('useBlockUI must be used within a BlockUIProvider')
  }
  return context
}
