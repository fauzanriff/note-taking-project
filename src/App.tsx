import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Firebase
import { FirebaseProvider } from '@/contexts/FirebaseContext'

// Layouts
import RootLayout from '@/components/layout/RootLayout'

// Pages
import Home from '@/pages/Home'
import About from '@/pages/About'
import NotFound from '@/pages/NotFound'

function App() {
  return (
    <FirebaseProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FirebaseProvider>
  )
}

export default App
