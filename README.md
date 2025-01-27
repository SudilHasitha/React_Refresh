# React_Refresh
This is just to refresh the react concepts

* Project is taken from https://www.youtube.com/watch?v=dCLhUialKPQ and modify to company logo retreival with custom local backend with node, db mysql.

## Features
- Search company logos using Logo.dev API
- Track trending company searches
- Display company logos with details
- Custom backend with MySQL for analytics

## Prerequisites
- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Setup Instructions

### 1. Database Setup

1. Install MySQL if not already installed
```bash
sudo apt update
sudo apt install mysql-server
```
2. Start MySQL service
```bash
sudo systemctl start mysql
sudo systemctl enable mysql
```
3. Access MySQL shell
```bash
sudo mysql
```
4. Create database and user
```sql
CREATE DATABASE company_logos_db;
CREATE USER 'logo_user' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON company_logos_db. TO 'logo_user';
FLUSH PRIVILEGES;
```
5. Create required table
```sql
USE company_logos_db;
CREATE TABLE company_logos (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
count INT DEFAULT 0,
domain VARCHAR(255),
logo_url VARCHAR(255)
);
```
### 2. Frontend Setup

1. Clone the repository
```bash
git clone <repository-url>
cd refresh_react_concepts
```
2. Install dependencies
```bash
npm install
```
3. Create `.env.local` file in the root directory
```env
VITE_LOGOAPI_KEY=your_logo_dev_api_key
```
4. Start the development server
```bash
npm run dev
```
### 3. Backend Setup

1. Navigate to backend directory
```bash
cd backend
```
2. Install backend dependencies
```bash
npm install
```
3. Create `.env` file in the backend directory
```env
DB_HOST=localhost
DB_USER=logo_user
DB_PASSWORD=your_password
DB_DATABASE=company_logos_db
PORT=3000
```
4. Start the backend server
```bash
npm start
```
## API Documentation

### External API (Logo.dev)
- Base URL: https://api.logo.dev
- Documentation: https://docs.logo.dev/introduction
- Authentication: Bearer token required
- Endpoints:
  - GET /search?q={query} - Search for company logos

### Local Backend API
- Base URL: http://localhost:3000
- Endpoints:
  - GET /api/trending - Get trending company logos
  - POST /api/search - Update search count for a company

## Development

- Frontend runs on: http://localhost:5173
- Backend runs on: http://localhost:3000

## Tech Stack
- React + TypeScript
- Vite
- TailwindCSS
- MySQL
- Node.js/Express