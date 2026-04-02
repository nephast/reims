import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types/note';

const STORAGE_KEY = '@reims/notes';

export async function loadNotes(): Promise<Note[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Note[]) : [];
  } catch (e) {
    throw new Error(`Failed to load notes: ${String(e)}`);
  }
}

export async function saveNotes(notes: Note[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    throw new Error(`Failed to save notes: ${String(e)}`);
  }
}
