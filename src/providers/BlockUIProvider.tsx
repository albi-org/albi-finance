/* eslint-disable react-refresh/only-export-components */
import {
  BlockUIContext,
  type BlockUIContextType,
} from '@/contexts/BlockUIContext'
import { useCallback, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BlockUIProviderProps {
  children: React.ReactNode
  className?: string
}

export const BlockUIProvider = ({
  children,
  className,
}: BlockUIProviderProps) => {
  const [isBlocking, setIsBlocking] = useState(false)

  // Usamos useCallback para garantir que as funções não sejam recriadas a cada renderização
  const block = useCallback(() => setIsBlocking(true), [])
  const unblock = useCallback(() => setIsBlocking(false), [])

  const value: BlockUIContextType = { isBlocking, block, unblock }

  return (
    // O Provider em si se torna o container relativo
    <BlockUIContext.Provider value={value}>
      <div className={cn('relative', className)}>
        {isBlocking && (
          <div
            className={cn(
              'absolute inset-0 z-50 flex items-center justify-center',
              'bg-background/80 backdrop-blur-sm'
            )}
          >
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}
        {children}
      </div>
    </BlockUIContext.Provider>
  )
}
