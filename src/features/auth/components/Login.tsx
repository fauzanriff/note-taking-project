import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/api/firebase';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components';
import { useFirebase } from '@/contexts/FirebaseContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useFirebase();

  // If user is already logged in, redirect to the home page or the page they were trying to access
  const from = location.state?.from?.pathname || '/';

  if (currentUser) {
    navigate(from, { replace: true });
    return null;
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // On successful authentication, navigate to the redirect path
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        `Failed to ${isSignUp ? 'sign up' : 'sign in'}: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">React Starter</h1>
          <p className="mt-2 text-muted-foreground">
            {isSignUp ? 'Create a new account' : 'Sign in to your account'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isSignUp ? 'Sign Up' : 'Sign In'}</CardTitle>
            <CardDescription>
              {isSignUp
                ? 'Enter your details to create a new account'
                : 'Enter your credentials to access your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading
                  ? 'Loading...'
                  : isSignUp
                  ? 'Create Account'
                  : 'Sign In'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center">
              {isSignUp ? (
                <p>
                  Already have an account?{' '}
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => setIsSignUp(false)}
                  >
                    Sign in
                  </Button>
                </p>
              ) : (
                <p>
                  Don't have an account?{' '}
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => setIsSignUp(true)}
                  >
                    Sign up
                  </Button>
                </p>
              )}
            </div>
            <div className="text-xs text-muted-foreground text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
