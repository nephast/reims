import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNotes } from '../../src/hooks/useNotes';
import NoteEditor from '../../src/components/NoteEditor';

export default function EditNoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { notes, updateNote, deleteNote } = useNotes();
  const router = useRouter();
  const theme = useTheme();

  const note = notes.find((n) => n.id === id);
  const [content, setContent] = useState(note?.content ?? '');

  // Sync editor if the note loads after mount (e.g. cold start deep-link).
  useEffect(() => {
    if (note && !content) setContent(note.content);
  }, [note?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSave() {
    if (content.trim() && id) {
      await updateNote(id, content.trim());
    }
    router.back();
  }

  function handleDelete() {
    Alert.alert('Delete note', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (id) await deleteNote(id);
          router.back();
        },
      },
    ]);
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <NoteEditor value={content} onChange={setContent} />
      <Button mode="contained" onPress={handleSave} style={styles.btn}>
        Save
      </Button>
      <Button
        mode="outlined"
        onPress={handleDelete}
        style={styles.btn}
        textColor={theme.colors.error}
      >
        Delete
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  btn: { marginHorizontal: 16, marginBottom: 8 },
});
