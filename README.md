# FiveM Viewer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

A modern, responsive web application for viewing real-time player lists from FiveM game servers. Built with Vite, React 19, TypeScript, and TailwindCSS.

## Features

### 🎮 Player Management
- **Real-time Player List**: View connected players with ID, name, ping, and social links
- **Live Search**: Filter players by ID, name, or social identifiers
- **Auto-refresh**: Automatic updates every 30 seconds with visual timer
- **Infinite Scroll**: Load more players as you scroll for better performance

### ⭐ Favorites System
- **Player Favorites**: Save favorite players with star icons
- **Server Favorites**: Quick access to frequently visited servers
- **Status Tracking**: See online/offline status of favorite players

### 📊 Statistics & Analytics
- **Player Distribution Charts**: Histogram showing player ID ranges
- **Ping Analysis**: Pie chart categorizing connection quality
- **Server Metrics**: Current/max player counts and server information

### 🎨 User Experience
- **Dark/Light Theme**: Automatic system preference detection with manual override
- **Multilingual Support**: English and French language options
- **Responsive Design**: Optimized for desktop and mobile devices
- **Toast Notifications**: User-friendly feedback for all actions
- **Server History**: Quick access to recently visited servers

### 🔗 Social Integration
- **Steam Profiles**: Direct links to player Steam profiles
- **Discord Integration**: Server Discord links and player Discord profiles
- **URL Parameters**: Shareable links with pre-filled server ID and search terms

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Frontend**: React 19 + TypeScript
- **Styling**: TailwindCSS 4.x
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Internationalization**: next-intl for multilingual support
- **Deployment**: Vercel

## Development

### Prerequisites
- Node.js 18+
- bun (recommended), pnpm, or npm

### Installation
```bash
# Install dependencies
bun install

# Start development server
bun dev
```

### Available Scripts
```bash
bun dev          # Start development server
bun build        # Production build
bun start        # Start production server
bun lint         # Lint with Biome
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your GitHub repository** to Vercel
2. **Deploy automatically** - Vercel will detect the Next.js configuration

The `vercel.json` file is configured for security headers.


### Project Structure
```
src/
├── app/                # Next.js App Router (Internationalized)
│   ├── [locale]/       # Locale-specific routes
│   │   ├── terms/      # Terms of Service page
│   │   ├── layout.tsx  # Root layout with next-intl Providers
│   │   └── page.tsx    # Main dashboard page
│   ├── api/            # API Proxy routes for FiveM
│   └── globals.css     # Global styles (Tailwind 4)
├── components/         # Reusable UI components
├── hooks/              # Custom React hooks
├── i18n/               # next-intl configuration
├── utils/              # Utility functions
├── middleware.ts       # next-intl middleware
└── routing.ts          # next-intl routing definition
messages/               # Translation files (en.json, fr.json)
```

## ⚖️ Legal Notice

**Important**: This project is not affiliated with Rockstar Games, Take-Two Interactive, or FiveM. It uses only the official public FiveM API to display publicly available server information. Users are responsible for complying with FiveM's terms of service and applicable laws.

- No copyrighted content from Rockstar Games is distributed
- All data displayed is publicly available through FiveM's official API
- This tool is provided "as is" without warranties

## API Integration

The application uses the official FiveM API:
- **Endpoint**: `https://servers-frontend.fivem.net/api/servers/single/{serverId}`
- **Data**: Real-time server information including player lists
- **Rate Limiting**: Respects API limits with appropriate error handling

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for detailed information on:

- How to report bugs and suggest features
- Development setup and workflow
- Coding standards and best practices
- Pull request process

## Code of Conduct

This project follows a [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a welcoming environment for all contributors.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 soydex

## Acknowledgments

- FiveM community for the public API
- React and TypeScript teams for excellent developer experience
- TailwindCSS for utility-first styling approach

All Hand-Made by soydex.