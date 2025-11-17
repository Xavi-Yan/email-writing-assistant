# Email Writing Assistant - File Structure

This React application has been separated into modular files for better maintainability and readability.

## File Structure

```
├── EmailWriterApp.jsx    # Main React component with logic and JSX
├── translations.js       # All language translations
├── constants.js          # Configuration constants and tone options
├── styles.css           # All CSS styling
└── README.md            # This file
```

## File Descriptions

### EmailWriterApp.jsx
The main React component file containing:
- React hooks for state management
- Business logic (email generation, copy to clipboard, keyboard shortcuts)
- JSX structure (HTML-like markup)
- Component lifecycle methods

**Key Functions:**
- `generateEmail()` - Calls the Claude API to generate emails
- `copyToClipboard()` - Copies generated email to clipboard
- `handleKeyPress()` - Handles keyboard shortcuts (Cmd/Ctrl + Enter)
- `findMatchingLocale()` - Determines the user's language preference
- `t()` - Translation helper function

### translations.js
Contains all user-facing text in multiple languages:
- English (en-US) - Default language
- Spanish (es-ES) - Secondary language
- Easily extensible for additional languages

**Adding a new language:**
```javascript
"fr-FR": {
  "emailWritingAssistant": "Assistant de Rédaction d'Emails",
  // ... add all translation keys
}
```

### constants.js
Configuration values and static data:
- `TONE_OPTIONS` - Available email tone options
- `MAX_THOUGHTS_LENGTH` - Maximum character limit for user input
- `MAX_CONTEXT_LENGTH` - Maximum character limit for context
- `COPY_FEEDBACK_DURATION` - How long "Copied!" message shows
- `API_TIMEOUT` - API request timeout duration

### styles.css
All styling separated by section:
- **Base Layout** - Container and grid system
- **Header** - App title and description styling
- **Cards** - Card components and layouts
- **Buttons** - All button styles and states
- **Textareas** - Input field styling
- **Tone Selection** - Tone button grid
- **Email Output** - Generated email display
- **Empty State** - Placeholder when no email generated
- **Tips Card** - Pro tips section

## How It Works Together

1. **Component renders** using JSX from `EmailWriterApp.jsx`
2. **Styles applied** from `styles.css` using CSS class names
3. **Text displayed** using the `t()` function that pulls from `translations.js`
4. **Configuration** loaded from `constants.js` (tone options, limits, etc.)
5. **User interaction** triggers state changes and API calls
6. **Email generation** uses the Claude API via `window.claude.complete()`

## Dependencies

### External Libraries
- `react` - Core React library
- `lucide-react` - Icon library (Mail, Send, Copy, etc.)

### Browser APIs
- `navigator.clipboard` - For copy functionality
- `navigator.languages` - For locale detection

### Custom APIs
- `window.claude.complete()` - Claude AI API (needs to be implemented)

## Usage

To use this component in your application:

```jsx
import EmailWriterApp from './EmailWriterApp';

function App() {
  return <EmailWriterApp />;
}
```

## Next Steps

1. **Implement `window.claude.complete()` API**
2. Add input validation (character limits)
3. Add error handling improvements
4. Add loading timeouts
5. Consider adding localStorage for draft saving
6. Add more language translations
7. Implement accessibility improvements (ARIA labels)