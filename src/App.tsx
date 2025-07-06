import Dashboard from './pages/Dashboard'

import { Login } from './components/Login'
import { useState, useEffect } from 'react'
import { supabase } from '@/supabase/supabase'
import type { Session } from '@supabase/supabase-js'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { BlockUIProvider } from './providers/BlockUIProvider'

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
    // <div className="flex flex-col items-center justify-center min-h-screen">
    //   <header className="p-4">
    //     <h1 className="text-2xl font-bold">Meu App com Supabase</h1>
    //   </header>
    //   <main>
    //     {!session ? (
    //       <Login />
    //     ) : (
    //       <div>
    //         <p>Olá, {session.user.email}!</p>
    //         <Button onClick={handleLogout} variant={'destructive'}>
    //           Sair
    //         </Button>
    //       </div>
    //     )}
    //   </main>
    // </div>

    <BrowserRouter>
      <BlockUIProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </AuthProvider>
      </BlockUIProvider>
    </BrowserRouter>
  )
}

export default App
