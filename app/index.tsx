import { StyleSheet, View, FlatList } from 'react-native';
import { FAB, Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useNotes } from '../src/hooks/useNotes';
import NoteCard from '../src/components/NoteCard';

export default function NoteListScreen() {
  const { notes, loading, deleteNote } = useNotes();
  const router = useRouter();
  const theme = useTheme();

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {notes.length === 0 ? (
        <View style={styles.center}>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
            No notes yet — tap + to create one.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              onPress={() => router.push(`/note/${item.id}`)}
              onDelete={() => deleteNote(item.id)}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}
      <FAB icon="plus" style={styles.fab} onPress={() => router.push('/note/new')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 12 },
  fab: { position: 'absolute', bottom: 24, right: 24 },
});
