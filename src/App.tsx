import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Firebase
import { FirebaseProvider } from '@/contexts/FirebaseContext'

// Auth
import ProtectedRoute from '@/components/auth/ProtectedRoute'

// Layouts
import RootLayout from '@/components/layout/RootLayout'

// Pages
import Home from '@/pages/Home'
import About from '@/pages/About'
import NotFound from '@/pages/NotFound'
import Login from '@/pages/Login'
import Notes from '@/pages/Notes'
import NoteDetail from '@/pages/NoteDetail'

function App() {
  return (
    <FirebaseProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RootLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="notes" element={<Notes />} />
              <Route path="notes/:noteId" element={<NoteDetail />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </FirebaseProvider>
  )
}

export default App
