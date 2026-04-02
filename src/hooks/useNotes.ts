import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { createElement } from 'react';
import { Note } from '../types/note';
import { loadNotes, saveNotes } from '../utils/storage';

interface NotesContextValue {
  notes: Note[];
  loading: boolean;
  error: string | null;
  createNote: (content: string) => Promise<Note>;
  updateNote: (id: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

const NotesContext = createContext<NotesContextValue | null>(null);

function deriveTitle(content: string): string {
  return content.split('\n')[0].trim().slice(0, 80) || 'Untitled';
}

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNotes()
      .then(setNotes)
      .catch((e: unknown) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  // Uses functional setState to avoid stale-closure issues with `notes`.
  const persistUpdate = useCallback(
    (updater: (prev: Note[]) => Note[]) => {
      setNotes((prev) => {
        const next = updater(prev);
        saveNotes(next).catch((e: unknown) => setError(String(e)));
        return next;
      });
    },
    [],
  );

  const createNote = useCallback(
    async (content: string): Promise<Note> => {
      const now = Date.now();
      const note: Note = {
        id: crypto.randomUUID(),
        title: deriveTitle(content),
        content,
        createdAt: now,
        updatedAt: now,
      };
      persistUpdate((prev) => [note, ...prev]);
      return note;
    },
    [persistUpdate],
  );

  const updateNote = useCallback(
    async (id: string, content: string): Promise<void> => {
      persistUpdate((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, content, title: deriveTitle(content), updatedAt: Date.now() }
            : n,
        ),
      );
    },
    [persistUpdate],
  );

  const deleteNote = useCallback(
    async (id: string): Promise<void> => {
      persistUpdate((prev) => prev.filter((n) => n.id !== id));
    },
    [persistUpdate],
  );

  return createElement(
    NotesContext.Provider,
    { value: { notes, loading, error, createNote, updateNote, deleteNote } },
    children,
  );
}

export function useNotes(): NotesContextValue {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used inside <NotesProvider>');
  return ctx;
}
