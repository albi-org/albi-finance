import { supabase } from '@/supabase/supabase'
import { Button } from './ui/button' // Supondo que você use Shadcn/UI

export function Login() {
  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })

    if (error) {
      console.error('Error logging in:', error)
    }
  }

  return <Button onClick={signInWithGoogle}>Fazer Login com Google</Button>
}
