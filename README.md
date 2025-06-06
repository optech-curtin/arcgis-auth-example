# ArcGIS Enterprise Authentication Example

This is a Next.js application demonstrating how to implement ArcGIS Enterprise authentication using OAuth 2.0. The example shows how to:
- Set up OAuth authentication with ArcGIS Enterprise
- Handle user sign-in and sign-out
- Display user information
- Render an ArcGIS Map after authentication

## Prerequisites

- Node.js 18+ and npm
- An ArcGIS Enterprise portal
- A registered application in your ArcGIS Enterprise portal

## Environment Setup

Create a `.env.local` file in the root directory with your ArcGIS Enterprise credentials:

```env
NEXT_PUBLIC_ARCGIS_PORTAL_URL=https://your-enterprise-portal.com/portal
NEXT_PUBLIC_ARCGIS_APP_ID=your-app-id
```

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

## Key Features

### Authentication Flow
- Uses OAuth 2.0 for secure authentication
- Supports both one-step and two-step authentication flows
- Automatically detects the appropriate flow type for your ArcGIS Enterprise version

### User Management
- Displays user's full name and username after successful authentication
- Provides sign-in and sign-out functionality
- Handles authentication state management

### Map Integration
- Renders an ArcGIS Map component after successful authentication
- Uses the authenticated session for secure map operations
- Implements proper cleanup on component unmount

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── ArcGISMap.tsx    # Map component
│   ├── layout.tsx           # Root layout with ArcGIS CSS
│   └── page.tsx            # Main page with auth logic
└── ...
```

## Dependencies

- Next.js 14+
- @arcgis/core - ArcGIS Maps SDK for JavaScript
- React 18+

## Security Notes

- Environment variables are prefixed with `NEXT_PUBLIC_` for client-side access
- OAuth credentials are managed securely through the ArcGIS Identity Manager
- No sensitive information is stored in the application
