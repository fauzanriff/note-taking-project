import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFirebase } from '@/contexts/FirebaseContext';
import { doc, getDoc, updateDoc, Timestamp, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Trash2, Save } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
}

export default function NoteDetail() {
  const { noteId } = useParams<{ noteId: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastEdit, setLastEdit] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(true);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { currentUser } = useFirebase();
  const navigate = useNavigate();

  // Save note to Firestore
  const saveNote = useCallback(async () => {
    if (!noteId || !currentUser || !note) return;

    try {
      setSaving(true);
      // Make sure we get the content from the refs
      if (!titleRef.current || !contentRef.current) {
        console.error('Title or content ref is null');
        return;
      }

      const title = titleRef.current.innerText || 'Untitled Note';
      const content = contentRef.current.innerHTML || '';

      console.log('Saving note:', { title, content });

      await updateDoc(doc(db, 'notes', noteId), {
        title,
        content,
        updatedAt: Timestamp.now(),
      });

      setNote({
        ...note,
        title,
        content,
        updatedAt: Timestamp.now(),
      });

      setIsSaved(true);
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setSaving(false);
    }
  }, [noteId, currentUser, note]);

  // Fetch note data
  useEffect(() => {
    const fetchNote = async () => {
      if (!noteId || !currentUser) return;

      try {
        const noteDoc = await getDoc(doc(db, 'notes', noteId));
        if (noteDoc.exists()) {
          const noteData = noteDoc.data() as Omit<Note, 'id'>;
          setNote({
            id: noteDoc.id,
            ...noteData,
          });
        } else {
          console.error('Note not found');
          navigate('/notes');
        }
      } catch (error) {
        console.error('Error fetching note:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId, currentUser, navigate]);

  // Auto-save functionality
  useEffect(() => {
    if (lastEdit && !isSaved && note) {
      // Clear any existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set a new timeout to save after 5 seconds of inactivity
      saveTimeoutRef.current = setTimeout(() => {
        saveNote();
      }, 5000);

      console.log('Auto-save scheduled in 5 seconds');
    }

    // Cleanup function to clear the timeout
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [lastEdit, isSaved, note, saveNote]);

  // Handle content changes
  const handleContentChange = () => {
    if (!note) return;

    // Get current values from the refs
    const currentTitle = titleRef.current?.innerText || 'Untitled Note';
    const currentContent = contentRef.current?.innerHTML || '';

    // Update the note state immediately to reflect changes in the UI
    setNote({
      ...note,
      title: currentTitle,
      content: currentContent
    });

    // Mark as unsaved and set last edit time for auto-save
    setLastEdit(Date.now());
    setIsSaved(false);
  };

  // Delete note
  const deleteNote = async () => {
    if (!noteId || !currentUser) return;

    if (window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'notes', noteId));
        navigate('/notes');
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading note...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="container py-8 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Note not found.</p>
          <Button onClick={() => navigate('/notes')} variant="outline">
            Back to Notes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/notes')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Notes
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={saveNote}
            disabled={isSaved || saving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
          </Button>
          <Button
            variant="destructive"
            onClick={deleteNote}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-xs text-muted-foreground mb-4 italic">Click on title or content to edit</div>
          <div
            ref={titleRef}
            contentEditable="true"
            suppressContentEditableWarning={true}
            className="text-3xl font-bold mb-4 outline-none border-b border-border pb-2 focus:border-primary cursor-text p-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            onInput={handleContentChange}
            onBlur={handleContentChange}
            dangerouslySetInnerHTML={{ __html: note.title || 'Untitled Note' }}
          />
          <div
            ref={contentRef}
            contentEditable="true"
            suppressContentEditableWarning={true}
            className="prose prose-sm max-w-none outline-none min-h-[300px] p-2 cursor-text hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded"
            onInput={handleContentChange}
            onBlur={handleContentChange}
            dangerouslySetInnerHTML={{ __html: note.content || '' }}
          />
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground text-right">
        {isSaved ? 'All changes saved' : 'Unsaved changes'}
        {saving && ' • Saving...'}
      </div>
    </div>
  );
}
