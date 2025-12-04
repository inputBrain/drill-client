# Drilling Equipment Tracking System - Client

Next.js frontend application for tracking drilling equipment usage, managing workers, and calculating costs in real-time. This is the **client-side** application that connects to a separate Node.js/Express backend API.

## Architecture

This project follows a **client-server architecture**:

- **Client (this repo)**: Next.js 16 frontend application
- **Server**: Separate Node.js/Express backend with Prisma + PostgreSQL (see your backend repo at `D:\apps\untitled`)

The client communicates with the backend via REST API endpoints.

## Features

- **Real-time Session Tracking**: Monitor active drilling sessions with live updates every 5 seconds
- **Worker Management**: Add and manage workers with email validation
- **Drill Management**: Configure drills with custom pricing per minute
- **Multi-worker Sessions**: Start drilling sessions for multiple workers simultaneously
- **Automatic Cost Calculation**: Real-time cost calculations based on duration and drill pricing
- **Comprehensive Reports**: View all sessions and drill summaries with live updates
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Azure-Ready**: Can be deployed to Azure App Service

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Backend**: Separate Node.js/Express server (see backend repo)
- **UI Components**: Custom components with React Toastify for notifications
- **Performance**: Optimized with React.memo, useMemo, and useCallback
- **API Communication**: Fetch API with custom API service layer

## Project Structure

```
drill-client/
├── src/
│   ├── app/
│   │   ├── (home)/
│   │   │   └── page.tsx              # Home page with drill cards
│   │   ├── reports/
│   │   │   └── page.tsx              # Reports page
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── layout/
│   │   │   └── Header.tsx            # Navigation header
│   │   ├── drilling/
│   │   │   ├── DrillCard.tsx         # Drill card with start/stop
│   │   │   ├── WorkerSelector.tsx    # Multi-select worker dropdown
│   │   │   └── ActiveSessionBadge.tsx # Active session indicator
│   │   ├── modals/
│   │   │   ├── CreateWorkerModal.tsx  # Add worker modal
│   │   │   └── CreateDrillModal.tsx   # Add drill modal
│   │   └── reports/
│   │       ├── SessionsTable.tsx      # All sessions table
│   │       └── SummaryTable.tsx       # Drill summaries
│   ├── lib/
│   │   ├── api.ts                    # API service for backend communication
│   │   ├── hooks/
│   │   │   ├── useActiveSessions.ts  # Active sessions polling
│   │   │   └── useElapsedTime.ts     # Real-time elapsed time
│   │   └── utils/
│   │       ├── calculations.ts        # Cost/duration calculations
│   │       └── formatters.ts          # Date/currency formatters
│   └── providers/
│       ├── ToastProvider.tsx         # Toast notifications setup
│       └── VwVhProvider.tsx          # Viewport height provider
├── .env.local                        # Environment variables (not in git)
├── AZURE_DEPLOYMENT.md               # Azure deployment guide
└── README.md                         # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- **Backend server running** (see backend repo at `D:\apps\untitled`)
- Code editor (VS Code recommended)

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment variables**:

Create `.env.local` file (already created):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Change the URL if your backend runs on a different port.

3. **Start the backend server** (in a separate terminal):
```bash
cd D:\apps\untitled
npm run dev
```

The backend should be running on `http://localhost:5000`.

4. **Start the development server**:
```bash
npm run dev
```

5. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

### Quick Start Guide

1. **Add Workers**: Click the green "Працівник" button (bottom-right) to add workers
2. **Add Drills**: Click the blue "Бур" button (bottom-right) to add drills with pricing
3. **Start Drilling**: Select workers from the dropdown on a drill card and click "СТАРТ"
4. **Stop Drilling**: Click "СТОП" to end active sessions
5. **View Reports**: Navigate to "Звіти" to see all sessions and summaries

## Development

### Available Scripts

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Environment Variables

The client requires only one environment variable:

**`.env.local`**:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

- **Development**: Use `http://localhost:5000/api`
- **Production**: Use your deployed backend URL (e.g., `https://your-backend.azurewebsites.net/api`)

**Note**: The database is managed by the backend server, not the client.

## Features In Detail

### Home Page

- **Drill Cards Grid**: Responsive grid showing all active drills
- **Worker Selection**: Multi-select dropdown to choose one or more workers
- **Start/Stop Controls**: Buttons with loading states and validation
- **Active Session Badges**: Shows count of active workers with tooltip details
- **Real-time Updates**: Polls active sessions every 5 seconds
- **Floating Action Buttons**: Quick access to add workers and drills

### Reports Page

- **Sessions Table**:
  - All drilling sessions sorted by newest first
  - Real-time updates for active sessions
  - Live cost and duration calculations
  - Active badge with pulsing animation

- **Summary Table**:
  - Aggregated statistics by drill
  - Total time and cost per drill
  - Grand totals row
  - Auto-updates with active sessions

### API Integration

The client uses `src/lib/api.ts` to communicate with the backend server. All API calls are routed through this service layer:

**Workers API**:
- `api.workers.getAll()` - Get all active workers
- `api.workers.create()` - Create new worker
- `api.workers.update()` - Update worker
- `api.workers.deactivate()` - Deactivate worker

**Drills API**:
- `api.drills.getAll()` - Get all active drills
- `api.drills.create()` - Create new drill
- `api.drills.update()` - Update drill
- `api.drills.deactivate()` - Deactivate drill

**Sessions API**:
- `api.sessions.start()` - Start drilling session
- `api.sessions.end()` - End drilling session
- `api.sessions.getAll()` - Get all sessions
- `api.sessions.getActive()` - Get active sessions
- `api.sessions.getReport()` - Get report with statistics

For full backend API documentation, see the backend repo or visit `http://localhost:5000/api-docs` (Swagger).

## Performance Optimizations

- **React.memo**: All major components memoized to prevent unnecessary re-renders
- **useMemo**: Expensive calculations cached (sorting, filtering, aggregations)
- **useCallback**: Event handlers stable across renders
- **Optimistic UI**: Immediate feedback before API responses
- **Efficient Polling**: Only active sessions polled for updates
- **Connection Pooling**: Optimized Prisma client for Azure PostgreSQL

## Backend API

The database and API logic are managed by the separate backend server. See the backend repository for:

- Database schema (Prisma models)
- API endpoints documentation
- Business logic and validation
- Database migrations

Backend location: `D:\apps\untitled`
Backend Swagger docs: `http://localhost:5000/api-docs`

## Deployment

See [AZURE_DEPLOYMENT.md](./AZURE_DEPLOYMENT.md) for comprehensive Azure deployment guide including:

- Setting up Azure Database for PostgreSQL
- Configuring Azure App Service
- Environment variable configuration
- GitHub Actions deployment
- Monitoring and logging
- Cost optimization strategies

## Troubleshooting

### API Connection Issues

If you see network errors or "Failed to fetch":

1. **Check backend is running**:
   ```bash
   # Should return JSON
   curl http://localhost:5000/api/employees
   ```

2. **Verify environment variable**:
   - Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
   - Restart Next.js dev server after changing `.env.local`

3. **CORS issues**: Backend should have CORS enabled for `http://localhost:3000`

### Build Errors

```bash
# Clean install
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

### Port Already in Use

```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <process-id> /F

# Or use a different port
npm run dev -- -p 3001
```

## Future Enhancements

- **Azure AD Integration**: Auto-detect logged-in user
- **Advanced Reporting**: Date range filtering, export to Excel/PDF
- **Drill Maintenance Tracking**: Schedule and track maintenance
- **Push Notifications**: Alert when sessions exceed time/cost thresholds
- **Mobile App**: React Native companion app
- **Multi-tenancy**: Support multiple organizations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check existing GitHub issues
- Review `AZURE_DEPLOYMENT.md` for deployment help
- Check Prisma documentation: https://www.prisma.io/docs
- Check Next.js documentation: https://nextjs.org/docs

## Changes from Original Architecture

This application was refactored to use a separate backend server:

### ❌ Removed from Client:
- Next.js API routes (`src/app/api/`)
- Prisma client and schema (`src/lib/db.ts`, `prisma/`)
- Direct database access
- All backend logic and validation

### ✅ Added to Client:
- API service layer (`src/lib/api.ts`)
- Environment variable for backend URL
- Type-safe API calls with error handling

### Benefits:
- **Separation of concerns**: Frontend and backend can be developed independently
- **Better scaling**: Backend can be scaled separately
- **Reusability**: Backend API can be used by mobile apps, other clients
- **Security**: Database credentials not exposed to client

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styling: [Tailwind CSS](https://tailwindcss.com/)
- Notifications: [React Toastify](https://fkhadra.github.io/react-toastify/)
- Backend: Node.js/Express + Prisma + PostgreSQL
