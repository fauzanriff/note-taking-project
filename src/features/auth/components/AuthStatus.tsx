import { useState } from 'react';
import { useFirebase } from '@/contexts/FirebaseContext';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components';

export default function AuthStatus() {
  const { currentUser, loading, signIn, signUp, signOut } = useFirebase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setIsLoading(true);
      await signIn(email, password);
    } catch (err) {
      setError('Failed to sign in: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setIsLoading(true);
      await signUp(email, password);
    } catch (err) {
      setError('Failed to create account: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
    } catch (err) {
      setError('Failed to sign out: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading authentication status...</div>;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Authentication Status</CardTitle>
        <CardDescription>
          {currentUser ? 'You are currently signed in' : 'You are not signed in'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentUser ? (
          <div className="space-y-4">
            <p>Signed in as: {currentUser.email}</p>
            <Button
              onClick={handleSignOut}
              variant="destructive"
              disabled={isLoading}
            >
              {isLoading ? 'Signing Out...' : 'Sign Out'}
            </Button>
          </div>
        ) : (
          <form className="space-y-4">
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
                required
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <div className="flex space-x-2">
              <Button
                type="submit"
                onClick={handleSignIn}
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
              <Button
                type="button"
                onClick={handleSignUp}
                variant="outline"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        This is a demo of Firebase Authentication. In a real app, you would want to implement more robust error handling and validation.
      </CardFooter>
    </Card>
  );
}
