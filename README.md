
A full-stack movie management application built with modern web technologies.

## Features

- Browse and search movies
- View detailed movie information
- Responsive user interface
- RESTful API backend
- MySQL database integration

## Tech Stack

**Frontend:**
- React.js
- Vite
- Modern CSS

**Backend:**
- Node.js
- Express.js
- MySQL

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

### Setup

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/movieplex.git
cd movieplex
```

2. Set up MySQL database
```bash
# Import the database schema
mysql -u root -p movieplex < database/movieDB.sql
```

3. Configure backend environment
```bash
cd Movie/backend
cp .env.example .env
# Edit .env with your database credentials
```

4. Install dependencies and run

**Backend:**
```bash
cd Movie/backend
npm install
npm start
```

**Frontend:**
```bash
cd Movie/frontend
npm install
npm run dev
```

5. Open your browser at `http://localhost:5173`

## Project Structure
```
Movieplex/
├── Movie/
│   ├── backend/          # Node.js Express API
│   ├── frontend/         # React application
│   └── database/         # MySQL schema
```

## Author

Ali Uzzama Khan
