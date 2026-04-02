import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useNotes } from '../../src/hooks/useNotes';
import NoteEditor from '../../src/components/NoteEditor';

export default function NewNoteScreen() {
  const [content, setContent] = useState('');
  const { createNote } = useNotes();
  const router = useRouter();
  const theme = useTheme();

  async function handleSave() {
    if (content.trim()) {
      await createNote(content.trim());
    }
    router.back();
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <NoteEditor value={content} onChange={setContent} />
      <Button mode="contained" onPress={handleSave} style={styles.btn}>
        Save
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  btn: { margin: 16 },
});
