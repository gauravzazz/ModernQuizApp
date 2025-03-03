# Modern Quiz App

A modern, futuristic quiz application built with React Native and Expo, following atomic design principles and supporting multiple themes and languages.

## Project Structure

```
src/
├── atoms/         # Fundamental building blocks (buttons, inputs, icons)
├── molecules/     # Simple combinations of atoms
├── organisms/     # Complex UI components
├── templates/     # Page-level components
├── pages/         # Screen components
├── theme/         # Theme configuration and styles
│   ├── dark/      # Dark theme specific styles
│   └── light/     # Light theme specific styles
├── i18n/          # Internationalization
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── constants/     # App constants
├── navigation/    # Navigation configuration
├── services/      # API and external services
└── mocks/         # Mock data for development
```

## Features

- 🎨 Modern and futuristic design
- 🌓 Dark and light theme support
- 🌐 Internationalization
- 📱 Platform-specific optimizations
- ⚛️ Atomic design architecture
- 🔄 Mock data system

## Tech Stack

- React Native
- Expo
- TypeScript
- React Navigation
- i18next
- React Native Paper
- Reanimated

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on specific platform:
```bash
npm run ios     # for iOS
npm run android # for Android
```

## Development Guidelines

### Atomic Design

- **Atoms**: Basic UI components like buttons, inputs, and typography
- **Molecules**: Simple component combinations like form fields with labels
- **Organisms**: Complex UI sections like headers, forms, or quiz cards
- **Templates**: Page-level components defining the layout
- **Pages**: Actual screens combining templates and organisms

### Theming

The app uses a centralized theming system with support for both light and dark modes. Theme configurations are stored in the `theme` directory.

### Internationalization

All text content is managed through the i18n system, making it easy to add new languages and maintain translations.

### Platform Specific Code

Platform-specific implementations are centralized in the utils directory, using the `.ios.ts` and `.android.ts` extension pattern when needed.

### Mock Data

Mock data is stored separately in the `mocks` directory, making it easy to switch to real API endpoints later.