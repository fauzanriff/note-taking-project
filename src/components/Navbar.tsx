import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Button } from '@/components'
import { useFirebase } from '@/contexts/FirebaseContext'

export default function Navbar() {
  const { currentUser, signOut } = useFirebase();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="text-xl font-bold">React Starter</span>
        </Link>
        <nav className="flex gap-4 sm:gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "font-medium text-primary" : "font-medium text-muted-foreground hover:text-primary"
            }
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "font-medium text-primary" : "font-medium text-muted-foreground hover:text-primary"
            }
          >
            About
          </NavLink>
          <NavLink
            to="/notes"
            className={({ isActive }) =>
              isActive ? "font-medium text-primary" : "font-medium text-muted-foreground hover:text-primary"
            }
          >
            Notes
          </NavLink>
          <Button variant="outline" size="sm" asChild>
            <a href="https://github.com/fauzanriff/react-firebase-starter" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </Button>

          {currentUser ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              disabled={isLoading}
            >
              {isLoading ? 'Logging out...' : 'Logout'}
            </Button>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
