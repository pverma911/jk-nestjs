
# 📦 JK NestJS Backend Project

A scalable backend application built with [NestJS](https://nestjs.com/), [PostgreSQL](https://www.postgresql.org/), and [TypeORM](https://typeorm.io/). Includes modular structure, authentication with JWT, role-based access, and Swagger documentation.

*NOTE*: I Recommend to use Postman for API Documentation : https://documenter.getpostman.com/view/10717273/2sB2x8DqxL#ea867516-15bb-4816-ba0d-e6e5123e53da
---

## 🚀 Features

* Modular architecture (`User`, `Document`, `Ingestion` modules)
* PostgreSQL with TypeORM integration
* Secure authentication using JWT
* Role-based access control (RBAC)
* File upload handling with Multer
* Global exception handling
* Swagger API documentation
* DTO validation using class-validator
* Easily testable with Jest

---

## 📁 Folder Structure Overview

```
├── src/                       # Main source code of the application
│   ├── config/                # Configuration files (e.g., database, JWT, etc.)
│   ├── decorators/            # Custom decorators used across the app
│   ├── entities/              # TypeORM entity definitions (database models)
│   ├── filters/               # Global or route-specific exception filters
│   ├── guards/                # Authorization guards (e.g., roles, auth)
│   ├── interfaces/            # Shared TypeScript interfaces
│   ├── modules/               # Feature modules (user, document, ingestion, etc.)
│   ├── strategies/            # Passport JWT strategies
│   ├── utils/                 # Utility/helper functions or services
│   ├── app.module.ts          # Root module of the application
│   └── main.ts                # Entry point of the application (bootstraps Nest app)
├── test/                      # Test utilities or global test setup
├── uploads/                   # Uploaded files directory
├── .env                       # Environment variables file (local use)
├── .env.example               # Example env file for reference or sharing
├── .gitignore                 # Git ignore rules
├── .prettierrc                # Prettier code formatting configuration
├── eslint.config.mjs          # ESLint configuration
├── nest-cli.json              # NestJS CLI configuration
├── package-lock.json          # Auto-generated lock file for npm
├── package.json               # Project metadata and dependencies
├── README.md                  # Project documentation and usage instructions
├── tsconfig.build.json        # TypeScript config for building the project
└── tsconfig.json              # TypeScript base configuration

```

---

## 🧰 Prerequisites

* [Node.js](https://nodejs.org/) (v19+)
* [PostgreSQL](https://www.postgresql.org/) (v13+)
* npm or yarn
* Git

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/pverma911/jk-nestjs.git
cd jk-nestjs
```

---

### 2. Install Dependencies

```bash
npm install
# OR
yarn install
```

---

### 3. Configure Environment Variables

Create a `.env` file using the example:

```bash
cp .env.example .env
```

Edit `.env` with your local PostgreSQL and JWT config:

```
APP_PORT=8080
DB_HOST=localhost
DB_NAME=jk_psql
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=12345
JWT_SECRET =a92fd48e30d2b6e19c4a9a52fbd5d2757f0d3d6d58ec58e6c1f6e8d8f0ad50c3a4d6a1f1ea1c8a87419a991e7d10346f4cd71a7a36597e8124d9d71b0a2a79b0

```

---

### 4. Set Up PostgreSQL Database

#### Option A: Using SQL CLI

```sql
CREATE DATABASE jk_docs;
```

#### Option B: Using Docker (optional)

```bash
docker run --name postgres-jk -e POSTGRES_PASSWORD=your_db_password -p 5432:5432 -d postgres
```

---

### 5. Run the App Locally

```bash
npm run start:dev
```

Visit:

* Postman API Doc [https://documenter.getpostman.com/view/10717273/2sB2x8DqxL#ea867516-15bb-4816-ba0d-e6e5123e53da](https://documenter.getpostman.com/view/10717273/2sB2x8DqxL#ea867516-15bb-4816-ba0d-e6e5123e53da)

* Swagger UI: [http://localhost:3000/api](http://localhost:3000/api)

---

### 6. Available NPM Scripts

| Command      | Description                  |
| ------------ | ---------------------------- |
| `start:dev`  | Start app in dev mode        |
| `start:prod` | Start app in production mode |
| `test`       | Run unit tests               |
| `test:watch` | Watch and run unit tests     |
| `test:cov`   | Show test coverage           |
| `build`      | Compile the app              |
| `format`     | Format code with Prettier    |

---

## 🧪 Running Tests

```bash
npm run test
```

For code coverage:

```bash
npm run test:cov
```

---

## 🔐 API Authentication

* Register: `POST /user/register`
* Login: `POST /user/login`
* Use the returned `accessToken` in headers:

  ```
  Authorization: Bearer <token>
  ```

---

## 📘 Swagger/Postman API Docs[Postman Recommended]

```Postman URL
https://documenter.getpostman.com/view/10717273/2sB2x8DqxL#ea867516-15bb-4816-ba0d-e6e5123e53da
```
Open the URL and click on run on postman in top right.

```http
http://localhost:3000/api
```

Generated using `@nestjs/swagger`. Includes request/response schema and role-based route protection.

---

## 🗂 Sample API Response Format

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Please proceed to login",
  "data": {
    "userId": "uuid"
  }
}
```

Consistently returned using `ResponseService`.

---

## 🚀 Deployment Instructions

### 1. Build the App

```bash
npm run build
```

### 2. Set up `.env` on your server (same as local)

### 3. Run with Node

```bash
node dist/main.js
```

### 4. (Optional) Use PM2 or Docker for production

```bash
npm install -g pm2
pm2 start dist/main.js
```
---

## 🧑‍💻 Author

**Pranshu Verma**
💼 [LinkedIn](https://www.linkedin.com/in/pranshuverma-sde)
🖥️ [GitHub](https://github.com/pverma911)

---
