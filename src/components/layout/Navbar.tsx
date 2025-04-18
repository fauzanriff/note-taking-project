import { Link, NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function Navbar() {
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
          <Button variant="outline" size="sm" asChild>
            <a href="https://github.com/shadcn-ui/ui" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </Button>
        </nav>
      </div>
    </header>
  )
}
