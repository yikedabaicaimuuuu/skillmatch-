# SkillMatch

A skill-sharing and project matching platform that connects people based on their skills and interests. Built for the Microsoft Fabric Hackathon.

[![CI/CD Pipeline](https://github.com/yourusername/skillmatch/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/skillmatch/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/yourusername/skillmatch/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/skillmatch)

## Features

- **User Authentication**: Secure signup/login with email verification (OTP)
- **Skill Management**: Add, remove, and showcase your skills with portfolio links
- **Interest Tracking**: Define your interests and expertise levels
- **Project Creation**: Create projects and specify required skills
- **Team Matching**: Find team members based on skill compatibility
- **Real-time Updates**: Live notifications for project updates

## Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Material-UI & Ant Design** - Component libraries

### Backend
- **Node.js + Express** - REST API server
- **PostgreSQL** - Primary database
- **Redis** - Session storage and caching
- **bcrypt** - Password hashing
- **Nodemailer** - Email service for OTP
- **Swagger** - API documentation

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **Jest + Vitest** - Testing frameworks

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Docker (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/skillmatch.git
   cd skillmatch
   ```

2. **Setup Backend**
   ```bash
   cd server
   cp .env.example .env  # Configure your environment variables
   npm install
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd client
   cp .env.example .env  # Configure your environment variables
   npm install
   npm run dev
   ```

### Using Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Testing

### Backend Tests
```bash
cd server
npm test              # Run tests
npm run test:watch    # Watch mode
npm run test:ci       # CI mode with coverage
```

### Frontend Tests
```bash
cd client
npm test              # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:coverage # Run with coverage
```

## API Documentation

Once the server is running, visit:
- Local: http://localhost:8000/docs
- Production: https://skillmatch-dara.onrender.com/docs

## Project Structure

```
skillmatch/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── routes/         # Route components
│   │   ├── redux/          # State management
│   │   └── __tests__/      # Frontend tests
│   └── Dockerfile
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Express middlewares
│   │   └── __tests__/      # Backend tests
│   └── Dockerfile
├── .github/workflows/      # CI/CD configuration
├── docker-compose.yml      # Docker orchestration
└── README.md
```

## Environment Variables

### Backend (.env)
```
PORT=8000
DATABASE_URL=postgresql://user:password@localhost:5432/skillmatch
REDIS_URL=redis://localhost:6379
SESSION_SECRET=your-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- Microsoft Fabric Hackathon
- All team members and contributors
