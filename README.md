# Netflix Clone - Movie Streaming Web App

A modern, responsive Netflix-like web application built with React.js that streams movies and TV series from your JSON data collection.

## 🎯 Features

### 🏠 Core Features
- **Netflix-style UI/UX** - Familiar interface with dark theme
- **Hero Section** - Featured content with auto-rotation
- **Category Browsing** - Horizontal scrollable content rows
- **Advanced Search** - Real-time search across all content
- **Video Player** - Full-screen streaming with Video.js
- **Content Details** - Modal popups with episode selection
- **Responsive Design** - Works on mobile, tablet, and desktop

### 🎬 Content Features
- **Movies & TV Series** - Support for both content types
- **Multiple Qualities** - 720p, 1080p, and other resolutions
- **Episode Management** - Season and episode navigation for series
- **Category Organization** - 19+ different content categories
- **Quality Indicators** - Visual quality badges
- **Content Cards** - Hover effects with play/info buttons

### 🔧 Technical Features
- **React 18** with modern hooks
- **React Router** for navigation
- **Video.js** for robust video playback
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **Error Handling** - Graceful fallbacks
- **Loading States** - Skeleton screens
- **Performance Optimized** - Lazy loading and virtual scrolling

## 🚀 Installation

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Navigate to the project directory:**
   ```bash
   cd movie_web_app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
movie_web_app/
├── public/
│   ├── data/                    # JSON data files
│   │   ├── index.json          # Categories index
│   │   ├── english_movies_1080p.json
│   │   ├── tv_web_series.json
│   │   └── ... (other category files)
│   └── index.html
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── Navbar.jsx         # Navigation bar with search
│   │   ├── HeroSection.jsx    # Featured content banner
│   │   ├── ContentCard.jsx    # Movie/series cards
│   │   ├── ContentRow.jsx     # Horizontal scrolling rows
│   │   ├── VideoPlayer.jsx    # Full-screen video player
│   │   └── ErrorBoundary.jsx  # Error handling
│   ├── pages/                 # Page components
│   │   ├── Home.jsx          # Main dashboard
│   │   ├── CategoryPage.jsx  # Category-specific content
│   │   └── SearchPage.jsx    # Search results
│   ├── context/              # State management
│   │   └── MovieContext.jsx # Global app state
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # App entry point
│   └── index.css            # Global styles
├── package.json             # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
└── README.md               # This file
```

## 🎮 Usage Guide

### Navigation
- **Home Page**: Browse featured content and category rows
- **Categories**: Click on category names to view all content
- **Search**: Use the search icon to find specific content
- **Mobile Menu**: Toggle menu on mobile devices

### Playing Content
1. **Movies**: Click play button to start streaming immediately
2. **TV Series**: Click info button to select season/episode
3. **Quality Selection**: Choose from available video qualities
4. **Player Controls**: Full-screen player with standard controls

### Content Interaction
- **Hover Effects**: Cards scale and show action buttons
- **Info Modal**: View details, seasons, and episodes
- **Responsive Cards**: Adapt to different screen sizes
- **Error Handling**: Fallback images for broken links

## ⚙️ Configuration

### Video Player Settings
The Video.js player includes:
- **Playback Rates**: 0.5x, 1x, 1.25x, 1.5x, 2x
- **Keyboard Shortcuts**: Space (play/pause), arrows (seek)
- **Auto-play**: Automatically starts when content is selected
- **Error Recovery**: Handles broken video URLs gracefully

### Data Structure
Your JSON files should follow this structure:

**Movies (e.g., english_movies_1080p.json):**
```json
{
  "category": "English Movies 1080p",
  "type": "movie",
  "items": [
    {
      "title": "Movie Title",
      "banner": "http://example.com/poster.jpg",
      "sources": [
        {
          "quality": "1080",
          "urls": ["http://example.com/movie.mkv"]
        }
      ]
    }
  ]
}
```

**TV Series (e.g., tv_web_series.json):**
```json
{
  "category": "TV & WEB Series",
  "type": "series",
  "items": [
    {
      "title": "Series Title",
      "banner": "http://example.com/poster.jpg",
      "seasons": [
        {
          "season_number": 1,
          "episodes": [
            {
              "episode_number": 1,
              "title": "Episode Title",
              "sources": [
                {
                  "quality": "720",
                  "urls": ["http://example.com/episode.mkv"]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## 🎨 Customization

### Styling
- **Colors**: Modify `tailwind.config.js` for custom color schemes
- **Fonts**: Update font families in the config
- **Animations**: Adjust Framer Motion settings in components

### Features
- **Categories**: Add/remove categories in `featuredCategories` array
- **Content Limits**: Modify items per row in `ContentRow.jsx`
- **Player Settings**: Configure Video.js options in `VideoPlayer.jsx`

## 🔧 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🌐 Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Mobile Features
- **Touch Navigation**: Swipe to scroll content rows
- **Responsive Design**: Adapts to all screen sizes
- **Mobile Menu**: Collapsible navigation
- **Touch Controls**: Optimized video player controls

## 🚀 Performance Optimizations
- **Lazy Loading**: Images load as they come into view
- **Code Splitting**: Dynamic imports for better performance
- **Optimized Images**: Placeholder images for broken links
- **Efficient Rendering**: Virtual scrolling for large datasets

## 🐛 Troubleshooting

### Common Issues
1. **Videos not playing**: Check if URLs are accessible
2. **Images not loading**: Verify image URLs or check CORS policy
3. **Slow loading**: Ensure JSON files are properly formatted
4. **Player errors**: Check video format compatibility

### Error Messages
- **"Category not found"**: Invalid category URL parameter
- **"No content available"**: JSON files not loaded properly
- **"Playback Error"**: Video source is unavailable

## 🤝 Contributing
This is a complete Netflix-like streaming application ready for deployment. You can:
- Add new categories by creating JSON files
- Customize the UI theme and colors
- Extend functionality with user accounts
- Add bookmarking and watch history features

## 📄 License
This project is created for educational purposes. Make sure you have proper licensing for any content you stream.

---

**Enjoy your Netflix-like streaming experience! 🎬🍿**
