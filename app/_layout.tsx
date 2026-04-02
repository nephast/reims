import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { NotesProvider } from '../src/hooks/useNotes';

export default function RootLayout() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? MD3DarkTheme : MD3LightTheme;

  return (
    <PaperProvider theme={theme}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <NotesProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Reims' }} />
          <Stack.Screen name="note/new" options={{ title: 'New Note' }} />
          <Stack.Screen name="note/[id]" options={{ title: 'Edit Note' }} />
        </Stack>
      </NotesProvider>
    </PaperProvider>
  );
}
