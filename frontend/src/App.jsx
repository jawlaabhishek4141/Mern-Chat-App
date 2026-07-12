import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import NotFoundPage from './pages/NotFoundPage';

/** Keeps a logged-in user off /login by bouncing them back to the chat. */
function LoginRoute() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <LoginPage />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: 'var(--toast-bg, #14262f)',
                  color: '#edeef0',
                  fontFamily: 'IBM Plex Sans, sans-serif',
                  fontSize: '13.5px',
                },
                success: { iconTheme: { primary: '#6fa98c', secondary: '#0e1b22' } },
                error: { iconTheme: { primary: '#e1604f', secondary: '#0e1b22' } },
              }}
            />
            <Routes>
              <Route path="/login" element={<LoginRoute />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
