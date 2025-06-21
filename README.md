# Weather Clothing App

A smart weather application that analyzes daily temperature patterns and provides intelligent clothing recommendations to help you dress appropriately throughout the day.

## Features

- **Real-time Weather Data**: Fetches current weather and hourly forecasts from OpenWeatherMap API
- **Intelligent Analysis**: Analyzes temperature variations throughout the day (morning, afternoon, evening)
- **Smart Recommendations**: Provides clothing suggestions based on temperature patterns and weather conditions
- **Layering Strategy**: Suggests layering approaches for days with significant temperature variations
- **Location Management**: Save and manage multiple locations using Supabase
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Supabase (Database, Authentication)
- **Weather API**: OpenWeatherMap API
- **State Management**: React Hooks
- **Build Tool**: Create React App

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- OpenWeatherMap API account

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd weather-clothing-app
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Go to SQL Editor and run the schema from `supabase-schema.sql`

### 3. Set up OpenWeatherMap API

1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key from the dashboard

### 4. Environment Configuration

Create a `.env.local` file in the root directory:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_OPENWEATHER_API_KEY=your_openweather_api_key
```

### 5. Run the Application

```bash
npm start
```

The app will open at `http://localhost:3000`

## How It Works

### Weather Analysis
The app fetches hourly weather data and analyzes temperature patterns:
- **Morning** (6-10 AM): Early day temperatures
- **Afternoon** (12-4 PM): Peak temperatures
- **Evening** (6-10 PM): End of day temperatures

### Clothing Recommendations
Based on temperature analysis and weather conditions, the app suggests:

- **Stable Temperatures**: Single outfit recommendation
- **Variable Temperatures**: Layering strategy with removable items
- **Weather-Specific**: Adjustments for rain, snow, wind conditions

### Temperature Ranges
- **Freezing** (< 0°C): Heavy winter clothing
- **Cold** (0-10°C): Winter jacket, long pants
- **Cool** (10-18°C): Light jacket, long sleeves
- **Mild** (18-25°C): Light clothing, optional layers
- **Warm** (25-30°C): Summer clothing, sun protection
- **Hot** (> 30°C): Minimal clothing, maximum sun protection

## Project Structure

```
src/
├── components/
│   ├── Common/
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   ├── Weather/
│   │   └── WeatherDisplay.tsx
│   └── Recommendations/
│       ├── ClothingCard.tsx
│       └── RecommendationList.tsx
├── hooks/
│   ├── useWeather.ts
│   └── useLocation.ts
├── services/
│   ├── supabase.ts
│   ├── weatherApi.ts
│   └── recommendations.ts
├── types/
│   ├── weather.ts
│   └── recommendations.ts
└── App.tsx
```

## Available Scripts

- `npm start`: Run development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App

## Usage

1. **Grant Location Permission**: Allow the app to access your location
2. **View Weather**: See current conditions and daily temperature patterns
3. **Get Recommendations**: Review clothing suggestions based on weather analysis
4. **Follow Layering Advice**: Use provided strategies for variable temperature days

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed to any static hosting service that supports React applications.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support or questions:
- Check the issues section
- Review the documentation
- Contact the development team

---

**Note**: This app provides general clothing recommendations based on weather conditions. Always consider your personal preferences, activities, and specific circumstances when choosing what to wear.
