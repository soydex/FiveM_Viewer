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
- **Responsive Design**: Optimized for desktop and mobile devices
- **Toast Notifications**: User-friendly feedback for all actions
- **Server History**: Quick access to recently visited servers

### 🔗 Social Integration
- **Steam Profiles**: Direct links to player Steam profiles
- **Discord Integration**: Server Discord links and player Discord profiles
- **URL Parameters**: Shareable links with pre-filled server ID and search terms

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS 4.x
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite with TypeScript

## Development

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation
```bash

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Available Scripts
```bash
pnpm dev          # Start development server on localhost:5173
pnpm build        # Production build
pnpm preview      # Preview production build
pnpm lint         # ESLint checking
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your GitHub repository** to Vercel
2. **Deploy automatically** - Vercel will detect the Vite configuration
3. **Custom domain** (optional) - Add your domain in Vercel settings

The `vercel.json` file is configured for:
- ✅ SPA routing support (React Router)
- ✅ Security headers
- ✅ Automatic deployments on push

### Manual Deployment

Build and deploy the `dist/` folder to any static hosting service:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── Footer.tsx      # Site footer
│   ├── Mobile.tsx      # Mobile-specific layout
│   ├── Notifications.tsx # Toast notification system
│   ├── StatisticsCharts.tsx # ReChart.js integration
│   └── TopServ.tsx     # Top servers display
├── hooks/              # Custom React hooks
│   └── useNotifications.ts # Notification management
├── pages/              # Page components
│   ├── Origin.tsx      # Main application page
│   └── Terms.tsx       # Terms of service
├── utils.ts            # Utility functions
└── main.tsx            # Application entry point
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

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

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