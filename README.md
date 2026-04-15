# Carseer Demo App

A vehicle explorer that lets you browse the NHTSA database — search manufacturers, pick a year and type, and see what models are available.

Built with React + TypeScript on the frontend and ASP.NET Core 10 on the backend. The backend acts as a simple proxy to the [NHTSA vPIC API](https://vpic.nhtsa.dot.gov/api/).

## Running it

### Docker (easiest)

```bash
docker build -t carseer-demo-app .
docker run -p 8080:8080 carseer-demo-app
```

Then open [http://localhost:8080](http://localhost:8080).

> Note: you need to publish the backend first before building the image — see below.

### Local development

**Frontend:**

```bash
cd src/frontend
npm install
npm run dev
```

**Backend:**

```bash
cd src/backend
dotnet run
```

### Publishing for Docker

```bash
cd src/frontend
npm run build

# copy the build output to the backend's static files folder
# (replace wwwroot if it already exists)
cp -r dist ../backend/wwwroot

cd ../backend
dotnet publish -c Release -r linux-musl-x64 --self-contained true /p:PublishSingleFile=true /p:PublishTrimmed=false
```

Then build the Docker image from the repo root.

## Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, Shadcn
- **Backend:** ASP.NET Core 10 (minimal APIs)
- **Data:** NHTSA vPIC API
- **Container:** Alpine Linux

## API Endpoints

The backend proxies these NHTSA endpoints:

| Route | Description |
|-------|-------------|
| `GET /api/vehicles/makes` | All manufacturers |
| `GET /api/vehicles/makes/:id/types` | Vehicle types for a make |
| `GET /api/vehicles/makes/:id/years/:year/models` | Models for a make + year |
