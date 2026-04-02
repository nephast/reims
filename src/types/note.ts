export interface Note {
  id: string;       // crypto.randomUUID()
  title: string;    // First line of content (max 80 chars) or 'Untitled'
  content: string;  // Full plain-text body
  createdAt: number; // Unix timestamp ms
  updatedAt: number; // Unix timestamp ms
}
