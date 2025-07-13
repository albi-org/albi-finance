import Dashboard from './pages/Dashboard'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { BlockUIProvider } from './providers/BlockUIProvider'
import { AuthProvider } from './contexts/AuthContext'
import { Login } from '@/pages/Login'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  )
}

export default App
