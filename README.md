# Backtrack Console

Enterprise Management Platform for Backtrack - Built with React, TanStack Router, TanStack Query, and HeroUI.

## Overview

This is the admin/enterprise console for the Backtrack platform. It provides a comprehensive interface for managing users, analytics, and system operations.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TanStack Router** - File-based routing
- **TanStack Query** - Data fetching and caching
- **HeroUI** - UI component library (formerly NextUI)
- **Firebase** - Authentication
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Tailwind CSS 4** - Styling
- **date-fns** - Date formatting

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_URL=your_api_url_here
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

### Development

```bash
# Start the development server (runs on port 3000)
npm run dev
```

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

### Testing

```bash
# Run tests
npm run test
```

### Linting & Formatting

```bash
# Run ESLint
npm run lint

# Run Prettier
npm run format

# Run both linting and formatting
npm run check
```

## Project Structure

```
src/
├── components/
│   └── ui/
│       ├── errors/           # Error page components (404, 403, 500, etc.)
│       ├── spinner.tsx       # Loading spinner component
│       └── splash.tsx        # Splash screen component
├── hooks/
│   ├── use-dashboard-stats.ts    # TanStack Query hook for dashboard stats
│   ├── use-activity-logs.ts      # TanStack Query hook for activity logs
│   └── use-user.ts               # TanStack Query hook for user data
├── lib/
│   ├── api-client.ts         # Axios client configuration with auth interceptors
│   ├── firebase.ts           # Firebase configuration and initialization
│   ├── toast.ts              # Toast notification wrapper
│   ├── utils.ts              # Utility functions (cn, getErrorMessage)
│   └── mock-data.ts          # Mock data for development/demo
├── routes/
│   ├── __root.tsx            # Root layout with providers
│   ├── index.tsx             # Home page
│   └── dashboard.tsx         # Dashboard with analytics
├── services/
│   ├── analytics.service.ts  # Analytics API service
│   └── user.service.ts       # User API service
├── types/
│   ├── api-response.type.ts  # API response types
│   ├── pagination.type.ts    # Pagination types
│   ├── user.types.ts         # User-related types
│   └── analytics.types.ts    # Analytics-related types
└── main.tsx                  # Application entry point
```

## Key Concepts

### Routing

This project uses **TanStack Router** with file-based routing. Routes are defined as files in the `src/routes` directory.

To add a new route:
1. Create a new file in `src/routes` (e.g., `settings.tsx`)
2. Export a route component using `createFileRoute`

```tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings')({
  component: Settings,
});

function Settings() {
  return <div>Settings Page</div>;
}
```

### Data Fetching

We use **TanStack Query** for data fetching. The pattern is:

1. **Service Layer** (`src/services/`) - Contains API calls
2. **Hooks** (`src/hooks/`) - TanStack Query hooks that use services
3. **Components** - Use hooks to fetch and display data

Example:

```tsx
// In component
import { useDashboardStats } from '@/hooks/use-dashboard-stats';

function Dashboard() {
  const { data, isLoading, error } = useDashboardStats();

  if (isLoading) return <Spinner />;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data.totalUsers}</div>;
}
```

### API Client

The API client (`src/lib/api-client.ts`) provides two instances:

- `privateClient` - Automatically includes Firebase auth token in requests
- `publicClient` - No authentication required

The private client automatically:
- Adds the Firebase auth token to requests
- Refreshes the token if it expires (401 response)
- Handles token refresh errors

### Mock Data

For development and demo purposes, services can use mock data instead of real API calls. Toggle this in the service file:

```tsx
// In src/services/analytics.service.ts
const USE_MOCK_DATA = true; // Set to false to use real API
```

### UI Components

This project uses **HeroUI** (formerly NextUI) for UI components. HeroUI is a modern, React-based UI library built on top of Tailwind CSS.

Common components:
- `Card`, `CardHeader`, `CardBody` - Card layouts
- `Button` - Buttons with various styles
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell` - Tables
- `Chip` - Small labels/badges
- `Spinner` - Loading indicators
- `Modal`, `Dropdown`, `Input`, etc.

Example:

```tsx
import { Card, CardBody, Button } from '@heroui/react';

function MyComponent() {
  return (
    <Card>
      <CardBody>
        <Button color="primary">Click me</Button>
      </CardBody>
    </Card>
  );
}
```

### Toast Notifications

Use the `showToast` utility for notifications:

```tsx
import { showToast } from '@/lib/toast';

// Success message
showToast.success('Operation completed!');

// Error message
showToast.error('Something went wrong');

// From error object
showToast.fromError(error);

// Loading state
showToast.loading('Processing...');
```

### Authentication

Firebase Authentication is configured in `src/lib/firebase.ts`. The auth instance is used by the API client to automatically include auth tokens in requests.

```tsx
import { auth } from '@/lib/firebase';

// Get current user
const user = auth.currentUser;

// Listen to auth state
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
  } else {
    // User is signed out
  }
});
```

### Error Pages

Pre-built error pages are available in `src/components/ui/errors/`:

- `NotFoundPage` - 404 error
- `Forbidden` - 403 error
- `Unauthorized` - 401 error
- `InternalServerError` - 500 error

Use them in your routes for consistent error handling.

## Development Guidelines

### Adding a New Feature

1. **Define types** in `src/types/`
2. **Create service** in `src/services/`
3. **Create TanStack Query hook** in `src/hooks/`
4. **Create route/component** that uses the hook
5. **Use HeroUI components** for UI

### Styling

- Use **Tailwind CSS** utility classes
- Use **HeroUI components** for common UI patterns
- Use the `cn()` utility from `@/lib/utils` to conditionally combine classes

### Code Organization

- Keep components small and focused
- Extract reusable logic into custom hooks
- Use TypeScript for type safety
- Follow the existing file structure

## Demo Dashboard

Visit `/dashboard` to see a demo dashboard that showcases:
- HeroUI components (Cards, Tables, Chips)
- TanStack Query integration
- Mock data fetching
- Loading states
- Error handling
- Toast notifications

## Deployment

The project is configured for deployment on Vercel (see `vercel.json`).

```bash
# Build for production
npm run build

# The build output will be in the dist/ directory
```

## Additional Resources

- [TanStack Router Docs](https://tanstack.com/router)
- [TanStack Query Docs](https://tanstack.com/query)
- [HeroUI Docs](https://heroui.com)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com)

## Support

For issues or questions, please contact the development team or create an issue in the repository.
