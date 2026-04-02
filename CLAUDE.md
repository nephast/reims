# CLAUDE.md — Reims Notes App

## Project Overview

**Reims** is a lightweight, offline-first notes application targeting Android devices.
The primary deliverable is a downloadable `.apk` file that can be side-loaded or
distributed via a direct download link.

### Core Goals
- Create, edit, and delete plain-text notes
- Works fully offline (no server required)
- Fast and minimal — no bloat
- Produces a self-contained `.apk` installable on Android

---

## Technology Stack

### Framework: React Native + Expo

**Why React Native + Expo:**
- Single JavaScript/TypeScript codebase targeting Android (and iOS if desired later)
- Expo's EAS Build service produces a signed `.apk` / `.aab` without requiring a
  local Android SDK installation
- Large ecosystem; simple setup; easy for AI-assisted development

**Key dependencies (to be added):**
| Package | Purpose |
|---|---|
| `expo` | Managed workflow runtime |
| `expo-router` | File-based navigation |
| `@react-native-async-storage/async-storage` | Persistent local storage for notes |
| `react-native-paper` | Material Design UI components |
| `typescript` | Type safety |

### Build Target
- **Minimum Android SDK:** 24 (Android 7.0 Nougat)
- **Target SDK:** 34 (Android 14)
- Output: `.apk` (debug) or `.aab` → `.apk` (release via EAS)

---

## Expected Project Structure

Once initialised, the project should follow this layout:

```
reims/
├── CLAUDE.md                  # This file
├── app.json                   # Expo app configuration
├── package.json
├── tsconfig.json
├── .gitignore
├── app/                       # expo-router pages (file-based routing)
│   ├── _layout.tsx            # Root layout / navigation shell
│   ├── index.tsx              # Note list screen
│   ├── note/
│   │   ├── [id].tsx           # View / edit a single note
│   │   └── new.tsx            # Create a new note
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── NoteCard.tsx
│   │   └── NoteEditor.tsx
│   ├── hooks/                 # Custom React hooks
│   │   └── useNotes.ts        # CRUD operations + AsyncStorage
│   ├── types/
│   │   └── note.ts            # Note type definitions
│   └── utils/
│       └── storage.ts         # AsyncStorage helpers
└── assets/                    # Icons and splash screens
```

---

## Data Model

```typescript
// src/types/note.ts
export interface Note {
  id: string;          // UUID v4
  title: string;       // First line of content, or explicit title
  content: string;     // Full plain-text body
  createdAt: number;   // Unix timestamp (ms)
  updatedAt: number;   // Unix timestamp (ms)
}
```

Notes are stored as a JSON array under the AsyncStorage key `@reims/notes`.

---

## Development Workflow

### Initial Setup

```bash
# Install Expo CLI globally (once)
npm install -g expo-cli eas-cli

# Bootstrap the project (run once, from the repo root)
npx create-expo-app@latest . --template blank-typescript

# Install dependencies
npm install @react-native-async-storage/async-storage react-native-paper expo-router

# Start the dev server
npx expo start
```

### Running on a Physical Android Device (dev)

1. Install **Expo Go** from the Google Play Store on the phone.
2. Run `npx expo start` and scan the QR code.

### Building a Downloadable APK

#### Option A — EAS Build (recommended, cloud build, no local SDK needed)

```bash
# One-time setup
eas login
eas build:configure

# Build a debug APK (directly installable)
eas build -p android --profile preview

# The CLI prints a download URL for the .apk when done
```

Add this profile to `eas.json`:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

#### Option B — Local build (requires Android SDK + JDK)

```bash
npx expo run:android --variant release
# Output: android/app/build/outputs/apk/release/app-release.apk
```

### Running Tests

```bash
npm test           # Jest unit tests
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

---

## Coding Conventions

### Language & Style
- **TypeScript** everywhere — no `any` types without justification
- Functional components only; no class components
- Hooks for all stateful logic; keep components presentational where possible
- Prefer `const` over `let`; avoid `var`

### File Naming
- React components: `PascalCase.tsx`
- Hooks: `camelCase.ts`, prefixed with `use`
- Utilities: `camelCase.ts`
- Types/interfaces: defined in `src/types/`, exported named

### State Management
- Local component state: `useState` / `useReducer`
- Persisted app state: AsyncStorage via the `useNotes` hook
- No external state library (Redux, Zustand) unless complexity demands it

### Styling
- Use `react-native-paper` components for consistent Material Design
- Avoid inline styles; use `StyleSheet.create` or component `style` props
- Support both light and dark mode via `react-native-paper`'s `PaperProvider`

### Note Operations
All CRUD operations live in `src/hooks/useNotes.ts`. Components must not
call AsyncStorage directly — they must go through this hook.

### Error Handling
- Wrap AsyncStorage calls in `try/catch`; surface errors via an error state
  in `useNotes`, not thrown exceptions
- Never silently swallow errors

---

## Key Constraints for AI Assistants

1. **Do not add a backend.** This app is intentionally offline-only. All data
   lives in AsyncStorage on the device. Do not introduce API calls, databases,
   or servers.

2. **Keep the APK small.** Avoid heavy libraries. Prefer packages already in
   the Expo SDK over third-party alternatives.

3. **Target Android first.** iOS compatibility is welcome but not required.
   Do not break Android behaviour for iOS niceties.

4. **Stick to the data model.** Changes to `Note` in `src/types/note.ts`
   require a migration utility in `src/utils/storage.ts`.

5. **Expo managed workflow.** Do not eject to bare workflow without explicit
   instruction. Do not write native Java/Kotlin/Swift code.

6. **Build branch.** Active development happens on
   `claude/add-claude-documentation-4U7jV` (or as specified per session).
   Push to that branch; open a PR to `main` when a feature is complete.

---

## Git Conventions

- **Commit style:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)
- **Branch naming:** `feature/<short-description>` or `fix/<short-description>`
- **No force-push to `main`**
- Keep commits focused — one logical change per commit

---

## Glossary

| Term | Meaning |
|---|---|
| APK | Android Package — the installable app file |
| EAS | Expo Application Services — Expo's cloud build infrastructure |
| AsyncStorage | React Native's simple key-value local persistence layer |
| Managed workflow | Expo project that does not expose native Android/iOS project files |
