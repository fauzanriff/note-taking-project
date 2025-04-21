import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 md:px-8">
        <Outlet />
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <div className="container px-4 sm:px-6 md:px-8">
          <p>© {new Date().getFullYear()} React Starter. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
