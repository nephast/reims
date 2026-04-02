import { StyleSheet } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';
import { Note } from '../types/note';

interface Props {
  note: Note;
  onPress: () => void;
  onDelete: () => void;
}

export default function NoteCard({ note, onPress, onDelete }: Props) {
  const preview = note.content.slice(note.title.length).trim();

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Title
        title={note.title}
        subtitle={new Date(note.updatedAt).toLocaleDateString()}
        right={(props) => (
          <IconButton {...props} icon="delete-outline" onPress={onDelete} />
        )}
      />
      {preview.length > 0 && (
        <Card.Content>
          <Text variant="bodyMedium" numberOfLines={2} style={styles.preview}>
            {preview}
          </Text>
        </Card.Content>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 10 },
  preview: { opacity: 0.7 },
});
