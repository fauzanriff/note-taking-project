import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Firebase
import { FirebaseProvider } from '@/contexts/FirebaseContext'

// Auth
import { ProtectedRoute } from '@/features/auth'

// Layouts
import { RootLayout } from '@/components'

// Pages
import { Home, About, NotFound } from '@/features/home'
import { Login } from '@/features/auth'
import { Notes, NoteDetail } from '@/features/notes'

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
