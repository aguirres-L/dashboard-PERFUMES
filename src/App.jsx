import Home from './pages/Home'
import Login from './pages/Login'
import { AuthProvider, useAuth } from './context/AuthContext'
import InitializeDatabase from './components/admin/InitializeDatabase';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? <Home /> : <Login />}
{/*       {process.env.NODE_ENV === 'development' && <InitializeDatabase />}
     */}</>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
