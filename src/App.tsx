import Dashboard from './pages/Dashboard'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { BlockUIProvider } from './providers/BlockUIProvider'
import { AuthProvider } from './contexts/AuthContext'
import { Login } from './components/Login'

function App() {
  return (
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
