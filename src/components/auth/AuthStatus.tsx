import { useState } from 'react';
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useFirebase } from '@/contexts/FirebaseContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AuthStatus() {
  const { currentUser, loading } = useFirebase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Failed to sign in: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Failed to create account: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      setError('Failed to sign out: ' + (err instanceof Error ? err.message : String(err)));
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
            <Button onClick={handleSignOut} variant="destructive">
              Sign Out
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
              <Button type="submit" onClick={handleSignIn} className="flex-1">
                Sign In
              </Button>
              <Button type="button" onClick={handleSignUp} variant="outline" className="flex-1">
                Sign Up
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
