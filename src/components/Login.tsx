import { Button } from './ui/button' // Supondo que você use Shadcn/UI
import { useAuth } from '@/hooks/useAuth'
import { Navigate } from 'react-router-dom'

export function Login() {
  const { signInWithGoogle, user, loading: authLoading } = useAuth()

  if (!authLoading && user) {
    return <Navigate to="/dashboard" replace />
  }

  if (authLoading) {
    return <div>Verificando autenticação...</div>
  }

  return <Button onClick={signInWithGoogle}>Fazer Login com Google</Button>
}
