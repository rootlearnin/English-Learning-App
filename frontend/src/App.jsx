import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { BookOpen, LogOut, LayoutDashboard } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Lesson from './pages/Lesson';

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
          <BookOpen size={24} />
          <span className="text-gray-900">English<span className="text-indigo-600">Learning</span></span>
        </Link>

        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 font-medium transition"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <div className="w-px h-5 bg-gray-300" />
              <span className="text-sm text-gray-500 hidden sm:block">{user.name}</span>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-medium transition"
              >
                <LogOut size={16} />
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                Início
              </Link>
              <Link
                to="/login"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
              >
                Entrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/lesson/:id" element={<PrivateRoute><Lesson /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
