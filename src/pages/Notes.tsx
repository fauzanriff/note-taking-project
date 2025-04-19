import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '@/contexts/FirebaseContext';
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

// Define the Note type
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useFirebase();
  const navigate = useNavigate();

  // Fetch notes from Firestore
  useEffect(() => {
    if (!currentUser) return;

    const notesRef = collection(db, 'notes');
    const q = query(
      notesRef,
      // Filter notes by the current user
      // where('userId', '==', currentUser.uid),
      // Order by updatedAt in descending order (newest first)
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesList: Note[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Omit<Note, 'id'>;
        notesList.push({
          id: doc.id,
          ...data,
        });
      });
      setNotes(notesList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Create a new note
  const createNewNote = async () => {
    if (!currentUser) return;

    try {
      const newNote = {
        title: 'Untitled Note',
        content: '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        userId: currentUser.uid,
      };

      const docRef = await addDoc(collection(db, 'notes'), newNote);
      navigate(`/notes/${docRef.id}`);
    } catch (error) {
      console.error('Error creating new note:', error);
    }
  };

  // Truncate content for preview
  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // Format date
  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Notes</h1>
        <Button onClick={createNewNote} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          New Note
        </Button>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">You don't have any notes yet.</p>
          <Button onClick={createNewNote} variant="outline" className="flex items-center gap-2 mx-auto">
            <PlusCircle className="h-4 w-4" />
            Create your first note
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((note) => (
            <Card 
              key={note.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/notes/${note.id}`)}
            >
              <CardHeader className="pb-2">
                <CardTitle>{note.title || 'Untitled Note'}</CardTitle>
                <CardDescription>
                  {formatDate(note.updatedAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-muted-foreground">
                  {truncateContent(note.content) || 'No content'}
                </p>
              </CardContent>
              <CardFooter className="pt-2 text-xs text-muted-foreground">
                Last updated {formatDate(note.updatedAt)}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
