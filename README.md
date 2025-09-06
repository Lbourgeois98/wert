# ShawnSweeps Backend

Backend API for ShawnSweeps cryptocurrency payment integration using Wert.io.

## Railway Deployment

### 1. Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template)

Or manually:

1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your GitHub repository
4. Railway will automatically detect and deploy your Node.js app

### 2. Set Environment Variables

In your Railway dashboard, go to Variables and add:

```
WERT_API_KEY=776572742d70726f642d33343733656162352d653566312d343363352d626535312d616531336165643361643539
NODE_ENV=production
```

### 3. Update Frontend

Once deployed, update your frontend to use the Railway URL:

```javascript
// Your URLs are now configured:
// Railway: https://wert-production-029b.up.railway.app
// Netlify: https://shawnswert.netlify.app
```

## API Endpoints

### POST /api/create-wert-session

Creates a Wert payment session.

**Request Body:**
```json
{
  "wallet_address": "39zC2iwMf6qzmVVEcBdfXG6WpVn84Mwxzv",
  "currency_amount": 100,
  "currency": "USD",
  "commodity": "BTC",
  "network": "bitcoin",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "session_id": "abc123",
  "success": true
}
```

### GET /health

Health check endpoint for Railway.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Local Development

```bash
npm install
npm start
```

Server runs on `http://localhost:3001`