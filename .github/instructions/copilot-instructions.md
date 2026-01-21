# FiveM Viewer - Instructions for AI Coding Agents

## Project Overview

This is a modern FiveM server player list viewer built with React 19, TypeScript, and TailwindCSS. The application displays real-time player information from FiveM servers using the official FiveM API.

## Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS 4.x
- **Charts**: Recharts for statistics visualization
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React hooks (useState, useEffect, useCallback)
- **Data Persistence**: localStorage for user preferences
- **Internationalization**: i18next for multilingual support

### Key Components
- `Origin.tsx`: Main application component with all functionality (players, favorites, statistics)
- `StatisticsCharts.tsx`: Recharts integration for player statistics
- `Notifications.tsx`: Toast notification system
- `useNotifications.ts`: Custom hook for notification management
- `TopServ.tsx`: Top servers display component
- `Mobile.tsx`: Mobile-specific layout component
- `Footer.tsx`: Site footer component
- `Terms.tsx`: Terms of service page
- `LanguageSwitcher.tsx`: Component for switching between languages

### Data Flow
1. User enters server ID → API call to `https://servers-frontend.fivem.net/api/servers/single/{serverId}`
2. Server data parsed and displayed in tables
3. User preferences (theme, favorites, history, language) saved to localStorage
4. Real-time updates every 30 seconds when auto-refresh enabled

## Developer Workflow

### Development Server
```bash
pnpm dev          # Start development server on localhost:5173
pnpm build        # Production build
pnpm preview      # Preview production build
pnpm lint         # ESLint checking
```

### Key Patterns & Conventions

#### State Management
- Use functional components with hooks
- Prefer `useCallback` for functions passed to child components
- Group related state in single `useState` calls when possible
- Large components like Origin.tsx handle multiple concerns (consider refactoring)

#### Data Fetching
```tsx
const fetchServerData = useCallback(async () => {
  setLoading(true);
  try {
    const response = await fetch(`https://servers-frontend.fivem.net/api/servers/single/${serverId}`);
    if (!response.ok) throw new Error("Server not found");

    const data = await response.json();
    const serverData = data.Data;

    // Process server data...
  } catch (error) {
    console.error("Error fetching server data:", error);
    addNotification({
      type: "error",
      title: "Error",
      message: "Unable to load server data",
    });
  } finally {
    setLoading(false);
  }
}, [serverId, addNotification]);
```
    const data = await response.json();
    // Process data...
  } catch (error) {
    // Handle errors with notifications
  } finally {
    setLoading(false);
  }
}, [serverId]);
```

#### Theme Handling
- Theme state managed in App component
- Theme saved immediately on toggle, not via useEffect

#### Error Handling
- Try-catch blocks around localStorage operations
- User-friendly error messages via notification system
- Graceful fallbacks for corrupted data

#### Component Structure
```tsx
function ComponentName({ prop }: Props) {
  // Hooks at top
  const [state, setState] = useState(initialValue);

  // Effects in logical order
  useEffect(() => { /* side effects */ }, [dependencies]);

  // Event handlers
  const handleEvent = useCallback(() => { /* logic */ }, [dependencies]);

  // Render
  return (
    <div className={conditionalClasses}>
      {/* JSX */}
    </div>
  );
}
```

## Critical Implementation Details

### API Integration
- Endpoint: `https://servers-frontend.fivem.net/api/servers/single/{serverId}`
- Response structure: `{ Data: { hostname, players: [...], sv_maxclients } }`
- Players array contains: `{ id, name, ping, identifiers }`

### localStorage Keys
- `theme`: 'dark' | 'light'
- `lastServerId`: string
- `favorites`: JSON array of Player objects
- `serverHistory`: JSON array of server history objects
- `autoRefresh`: 'true' | 'false'
- `language`: 'en' | 'fr'

### Theme System
- Automatic system preference detection on first load
- Manual override persists across sessions
- All components receive `isDarkTheme` prop for styling

### Internationalization
- Library: i18next for React
- Supported languages: English (en), French (fr)
- Language files: `src/locales/{lang}/common.json`
- Language switcher component: `LanguageSwitcher.tsx`
- Language preference saved in localStorage: `language`

### Notification System
- Types: 'success', 'error', 'warning', 'info'
- Auto-dismiss after 5 seconds (configurable)
- Manual close button available

### Performance Considerations
- Debounced search input
- Memoized expensive calculations
- Efficient re-renders with proper dependency arrays

## Common Patterns

### Conditional Styling
```tsx
className={`base-classes ${isDarkTheme ? 'dark:bg-zinc-800 dark:text-white' : 'bg-white text-gray-900'}`}
```

### Data Validation
```tsx
if (savedData) {
  try {
    const parsed = JSON.parse(savedData);
    setState(parsed);
  } catch (error) {
    console.warn('Corrupted data, resetting:', error);
    localStorage.removeItem(key);
  }
}
```

### API Error Handling
```tsx
try {
  const response = await fetch(url);
  if (!response.ok) throw new Error('API Error');
  const data = await response.json();
  // Success handling
} catch (error) {
  addNotification({ type: 'error', title: 'Error', message: error.message });
}
```

## Testing Guidelines

### Manual Testing Checklist
- [ ] Theme toggle persists across page refreshes
- [ ] Server loading shows proper loading states
- [ ] Search filters players correctly
- [ ] Favorites are saved and restored
- [ ] Auto-refresh works as expected
- [ ] Error states display appropriate messages
- [ ] Responsive design works on mobile/desktop

### Edge Cases to Test
- Network failures during API calls
- Corrupted localStorage data
- Empty server responses
- Very large player lists
- Browser compatibility (localStorage support)

## Deployment Notes

- Static hosting compatible (Vite build outputs to `dist/`)
- Deployed on Vercel with custom configuration in `vercel.json`
- No server-side requirements
- All assets bundled by Vite
- External dependencies: Recharts, i18next (bundled)

Remember: This is a client-side only application that relies on the FiveM public API. Ensure CORS policies allow the API calls when deploying.