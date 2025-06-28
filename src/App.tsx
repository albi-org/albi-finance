// src/App.tsx (Exemplo)

import { useState, useEffect } from 'react'
import { supabase } from '@/supabase/supabase'
import type { Session } from '@supabase/supabase-js'
import { Login } from './components/Login' // Importe seu componente de login

function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    // Pega a sessão ativa ao carregar a página
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Ouve as mudanças no estado de autenticação (login, logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    // Limpa a inscrição quando o componente for desmontado
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <header className="p-4">
        <h1 className="text-2xl font-bold">Meu App com Supabase</h1>
      </header>
      <main>
        {!session ? (
          <Login />
        ) : (
          <div>
            <p>Olá, {session.user.email}!</p>
            <button
              onClick={handleLogout}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Sair
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
