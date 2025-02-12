# Airthings Air Quality Monitor

A Node.js worker that monitors Airthings device readings and sends notifications via Pushover when air quality thresholds are exceeded.

## Features

- Fetches real-time air quality data from Airthings devices
- Monitors CO2 levels and sends alerts when exceeding 1000ppm
- Automatic token management for Airthings API
- Push notifications to mobile devices via Pushover
- Robust error handling and logging

## Prerequisites

- Node.js (v14 or higher)
- npm or pnpm
- Airthings device and API credentials
- Pushover account and app installed on your devices

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
pnpm install
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
AIRTHINGS_CLIENT_ID=your_client_id
AIRTHINGS_SECRET=your_client_secret
AIRTHINGS_SERIAL_NIMBER=your_device_serial
PUSHOVER_USER_KEY=your_pushover_user_key
PUSHOVER_APP_TOKEN=your_pushover_app_token
```

### Getting the credentials

1. **Airthings API credentials:**
   - Go to [Airthings Dashboard](https://dashboard.airthings.com)
   - Navigate to Integrations
   - Create a new API client to get CLIENT_ID and SECRET

2. **Pushover credentials:**
   - Sign up at [Pushover](https://pushover.net/)
   - Create a new application to get APP_TOKEN
   - Get your USER_KEY from your account page

## Usage

Start the worker:

```bash
node airthings_worker.js
```

The worker will:
- Run continuously
- Check air quality every 5 minutes
- Send notifications when CO2 levels exceed 1000ppm
- Log all activities with timestamps
- Auto-retry on errors with a 1-minute delay

## Project Structure

- `airthings_worker.js` - Main worker process
- `api.js` - Airthings API integration
- `token.js` - Token management
- `notifications.js` - Pushover notification handling
- `logger.js` - Logging utility

## Error Handling

The worker includes comprehensive error handling:
- API connection issues
- Token expiration and renewal
- Failed notifications
- Missing environment variables

## License

MIT License
