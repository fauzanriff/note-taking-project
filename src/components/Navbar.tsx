import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Button } from '@/components'
import { useFirebase } from '@/contexts/FirebaseContext'
import { Menu, X, User, LogOut, Github } from 'lucide-react'

export default function Navbar() {
  const { currentUser, signOut } = useFirebase();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
      setIsProfileMenuOpen(false);
    }
  };

  // Handle click outside to close the profile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="text-xl font-bold">React Starter</span>
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-muted focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-4">
          <nav className="flex gap-4 sm:gap-6 items-center">
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
            <a
              href="https://github.com/fauzanriff/react-firebase-starter"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center h-9 w-9 rounded-full border border-muted hover:border-primary transition-colors"
              aria-label="GitHub repository"
            >
              <Github className="h-5 w-5" />
            </a>

            {currentUser ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className={`flex items-center justify-center h-9 w-9 rounded-full border ${isProfileMenuOpen ? 'border-primary bg-muted' : 'border-muted hover:border-primary'}`}
                  aria-label="User menu"
                >
                  <User className="h-5 w-5" />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-background border rounded-md shadow-lg z-10">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      disabled={isLoading}
                      className="w-full flex items-center px-4 py-2 text-sm text-left hover:bg-muted"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {isLoading ? 'Logging out...' : 'Logout'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}
          </nav>
        </div>

        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="absolute top-16 left-0 right-0 bg-background border-b shadow-lg z-20 md:hidden"
          >
            <nav className="flex flex-col p-4 gap-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "font-medium text-primary" : "font-medium text-muted-foreground hover:text-primary"
                }
                end
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive ? "font-medium text-primary" : "font-medium text-muted-foreground hover:text-primary"
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </NavLink>
              <NavLink
                to="/notes"
                className={({ isActive }) =>
                  isActive ? "font-medium text-primary" : "font-medium text-muted-foreground hover:text-primary"
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Notes
              </NavLink>
              <a
                href="https://github.com/fauzanriff/react-firebase-starter"
                target="_blank"
                rel="noreferrer"
                className="flex items-center font-medium text-muted-foreground hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </a>

              {currentUser ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={isLoading}
                  className="flex items-center font-medium text-destructive hover:text-destructive/80"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isLoading ? 'Logging out...' : 'Logout'}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center font-medium text-primary hover:text-primary/80"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
