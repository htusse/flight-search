# ✈️ Flight Search Application

A modern, feature-rich flight search application built with React, TypeScript, and Material-UI. Search, compare, and filter flights with real-time pricing data from the Amadeus API.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://flight-search-17.netlify.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 🚀 Live Demo

Visit the live application: **[https://flight-search-17.netlify.app/](https://flight-search-17.netlify.app/)**

## ✨ Features

### Core Functionality
- 🔍 **Real-time Flight Search** - Search flights using the Amadeus API
- 📊 **Price Graph Visualization** - Interactive charts showing price trends with Recharts
- 📅 **Price Calendar** - View prices across multiple dates
- 🎯 **Advanced Filtering** - Filter by price, stops, airlines, departure/arrival times
- ⚖️ **Flight Comparison** - Compare up to multiple flights side-by-side
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices

### User Experience
- 🎨 **Theme Support** - Light, dark, and system theme modes
- 💾 **Recent Searches** - Quick access to your search history
- 🔗 **URL State Persistence** - Share searches via URL
- ♿ **Accessibility** - WCAG compliant with skip links and ARIA labels
- ⚡ **Performance Optimized** - Fast loading with code splitting and caching
- 🎭 **Smooth Animations** - Polished UI with Framer Motion

## 🛠️ Tech Stack

### Frontend Framework
- **React 19.2** - Modern UI library with latest features
- **TypeScript 5.9** - Type-safe development
- **Vite 7.2** - Lightning-fast build tool and dev server

### UI & Styling
- **Material-UI (MUI) 7.3** - Comprehensive component library
- **Emotion** - CSS-in-JS styling
- **Framer Motion 12.26** - Animation library

### State Management
- **Zustand 5.0** - Lightweight state management
- **TanStack Query 5.90** - Powerful data fetching and caching

### Data & Visualization
- **Recharts 3.6** - Charting library for price graphs
- **Axios 1.13** - HTTP client for API requests
- **date-fns 4.1** - Modern date utility library

### Development Tools
- **ESLint 9.39** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting rules

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **Amadeus API credentials** (API Key and Secret)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/htusse/flight-search.git
cd flight-search
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Amadeus API Configuration
VITE_AMADEUS_API_KEY=your_api_key_here
VITE_AMADEUS_API_SECRET=your_api_secret_here
VITE_AMADEUS_API_BASE_URL=https://test.api.amadeus.com

# Optional UI Configuration
VITE_DRAWER_WIDTH=320
VITE_HEADER_HEIGHT=72
```

> **Note:** Get your free Amadeus API credentials at [https://developers.amadeus.com](https://developers.amadeus.com)

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production-ready bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

## 🏗️ Project Structure

```
flight-search/
├── public/              # Static assets
├── src/
│   ├── api/            # API integration
│   │   └── amadeus.ts  # Amadeus API client
│   ├── components/     # Reusable components
│   │   ├── ui/         # UI primitives
│   │   ├── AirlineLogo.tsx
│   │   ├── CompareFloatingBar.tsx
│   │   ├── FeatureHighlights.tsx
│   │   ├── FlightComparison.tsx
│   │   ├── PriceCalendar.tsx
│   │   ├── RecentSearches.tsx
│   │   ├── SearchSummary.tsx
│   │   ├── SkipLink.tsx
│   │   └── ThemeToggle.tsx
│   ├── features/       # Feature-based modules
│   │   └── flight/
│   │       ├── components/  # Flight feature components
│   │       ├── hooks/       # Custom hooks
│   │       ├── utils/       # Utility functions
│   │       ├── FlightSearchPage.tsx
│   │       └── types.ts
│   ├── hooks/          # Global custom hooks
│   │   └── useUrlParams.ts
│   ├── store/          # Zustand state stores
│   │   ├── filterStore.ts
│   │   ├── searchStore.ts
│   │   └── themeStore.ts
│   ├── utils/          # Global utilities
│   │   └── recentSearches.ts
│   ├── App.tsx         # Root component
│   ├── main.tsx        # Application entry point
│   ├── theme.ts        # MUI theme configuration
│   └── index.css       # Global styles
├── eslint.config.js    # ESLint configuration
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── package.json        # Project dependencies
```

## 🎯 Key Features Explained

### Price Graph
- Visual representation of flight prices over time
- Interactive tooltips with detailed information
- Helps identify the best time to book

### Advanced Filters
- **Price Range**: Set minimum and maximum budget
- **Number of Stops**: Direct, 1 stop, or 2+ stops
- **Airlines**: Filter by specific carriers
- **Departure/Arrival Times**: Morning, afternoon, evening, night
- **Flight Duration**: Set maximum acceptable duration

### Flight Comparison
- Select multiple flights to compare
- Side-by-side view of prices, duration, stops, and airlines
- Floating comparison bar for easy access

### Recent Searches
- Automatically saves your search history
- Quick re-run of previous searches
- Persisted in local storage

## 🌐 API Integration

The application integrates with the **Amadeus Travel API**:

- **Flight Offers Search** - Real-time flight availability and pricing
- **Token Management** - Automatic OAuth2 authentication
- **Error Handling** - Graceful error states with retry options
- **Caching** - Optimized API calls with TanStack Query

## 🎨 Theming

Three theme modes available:
- **Light** - Classic light theme
- **Dark** - Easy on the eyes
- **System** - Automatically matches OS preference

## ♿ Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Skip links for screen readers
- High contrast ratios
- Focus indicators

## 📱 Responsive Design

Breakpoints optimized for:
- Mobile phones (< 600px)
- Tablets (600px - 960px)
- Desktops (> 960px)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_AMADEUS_API_KEY` | Amadeus API client ID | Yes |
| `VITE_AMADEUS_API_SECRET` | Amadeus API client secret | Yes |
| `VITE_AMADEUS_API_BASE_URL` | API base URL (test/production) | Yes |
| `VITE_DRAWER_WIDTH` | Filter panel width in pixels | No |
| `VITE_HEADER_HEIGHT` | Header height in pixels | No |

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Deploy to Netlify

This project is configured for Netlify deployment:

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy!

### Other Hosting Platforms

The build output can be deployed to:
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Herve Tusse**

- GitHub: [@htusse](https://github.com/htusse)

## 🙏 Acknowledgments

- [Amadeus for Developers](https://developers.amadeus.com) - Flight data API
- [Material-UI](https://mui.com) - React component library
- [Recharts](https://recharts.org) - Charting library
- [Netlify](https://netlify.com) - Hosting platform

---

**Made with ❤️ using React and TypeScript**
