import { StyleSheet, TextInput } from 'react-native';
import { useTheme } from 'react-native-paper';

interface Props {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}

export default function NoteEditor({ value, onChange, placeholder = 'Start writing…' }: Props) {
  const theme = useTheme();

  return (
    <TextInput
      style={[
        styles.input,
        {
          color: theme.colors.onBackground,
          backgroundColor: theme.colors.background,
        },
      ]}
      value={value}
      onChangeText={onChange}
      multiline
      autoFocus
      placeholder={placeholder}
      placeholderTextColor={theme.colors.onSurfaceVariant}
      textAlignVertical="top"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    padding: 16,
  },
});
