# API Client Documentation

This project uses **NSwag** to automatically generate a TypeScript API client from the ASP.NET Core Swagger specification.

## Setup

1. Ensure the API server is running on `http://localhost:5000`
2. Generate the API client: `npm run generate-api`

## Structure

### Generated Files

- `src/lib/generated-api.ts` - Auto-generated TypeScript client (DO NOT EDIT MANUALLY)
- `src/lib/api-wrapper.ts` - Custom HTTP client with request logging
- `src/lib/api-client.ts` - Exports configured API client instance

### Configuration

- `nswag.json` - NSwag configuration for code generation
- `.env.local` - Contains `NEXT_PUBLIC_API_URL` for API base URL

## Usage

Import the API client in your code:

```typescript
import { apiClient } from '@/lib/api-client'

// Use generated methods
const drills = await apiClient.listAllDrills()
const response = await apiClient.createDrill({ title: 'New Drill', pricePerMinute: 10 })
```

## Available Methods

### Drill API
- `listAllDrills()` - Get all drills
- `createDrill(data)` - Create a new drill
- `startDrill(data)` - Start drill for users
- `stopDrill(data)` - Stop drill for users
- `updateDrill(data)` - Update drill
- `deleteDrill(data)` - Delete drill

### User API
- `listAllUsers()` - Get all users
- `createUser(data)` - Create a new user
- `updateUser(data)` - Update user
- `deleteUser(data)` - Delete user

### UserDrill API
- `listAll()` - Get all user drill records
- `getActive()` - Get active drills (stoppedAt == null)
- `getCompleted()` - Get completed drills (stoppedAt != null)

## Logging

All API requests are logged to the console with:
- Timestamp
- HTTP method
- Full URL
- Request body (if present)

This is useful for debugging and monitoring in pm2.

## Regenerating the API Client

When the server API changes:

1. Ensure the API server is running
2. Run: `npm run generate-api`
3. The TypeScript client will be regenerated automatically

**Note:** The generated file `src/lib/generated-api.ts` should not be edited manually as it will be overwritten on the next generation.
