import Dashboard from './pages/Dashboard'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { BlockUIProvider } from './providers/BlockUIProvider'
import { AuthProvider } from './contexts/AuthContext'
import { Login } from './components/Login'

function App() {
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
