# Career DNA frontend

React + Vite demonstration dashboard for the Career DNA API.

## Requirements

- Node.js 18 or newer
- Career DNA FastAPI server running locally

Start the API from the repository root:

```powershell
uvicorn services.server.app:app --reload --port 8000
```

## Install

From the `frontend` directory:

```powershell
npm install
```

## Run

```powershell
npm run dev
```

Vite prints the local dashboard URL, normally `http://localhost:5173`.

## Configuration

The dashboard sends analysis requests to `http://localhost:8000` by default. Set `VITE_API_URL` when the backend runs elsewhere:

```powershell
$env:VITE_API_URL="http://localhost:8000"
npm run dev
```

The configured backend must expose `POST /analyze` and permit the frontend origin through CORS.

## Production build

```powershell
npm run build
```

The optimized static bundle is written to `dist/`.
