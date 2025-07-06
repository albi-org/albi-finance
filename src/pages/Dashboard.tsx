import { useAuth } from '@/hooks/useAuth'
import { Navigate } from 'react-router-dom'
import React from 'react'
import { Button } from '@/components/ui/button'

const Dashboard: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth()

  if (!authLoading && !user) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      Olá você está no dashboard.
      <Button variant={'outline'} onClick={signOut}>Deslogar</Button>
    </>
  )
}

export default Dashboard
