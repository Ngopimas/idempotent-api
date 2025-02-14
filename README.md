# Idempotent API in TypeScript

## 🚀 Overview

This is a **demonstration project** showcasing how to implement an **Idempotent API** using TypeScript. Built with Express, Redis, and Jest, this project serves as an educational example of handling idempotency in API requests.

## 📄 Article: Understanding Idempotent APIs

For more detailed explanation, check out the accompanying article on [**romaincoupey.com**](https://www.romaincoupey.com/blog/idempotent-api-project).

## 🎯 Purpose

This basic project illustrates:

- How to implement idempotency using Redis as a storage mechanism
- Proper handling of idempotency keys in API requests
- Best practices for ensuring exactly-once semantics in API operations
- Testing strategies for idempotent endpoints

## 📂 Project Structure

```
idempotent-api/
│── src/
│   ├── server.ts            # Express server
│   ├── app.ts               # Express app (for testing)
│   ├── controllers/
│   │   ├── orderController.ts # Order logic
│   ├── middleware/
│   │   ├── errorHandler.ts  # Global error handling
│   │   ├── validator.ts     # Request validation
│   │   ├── logger.ts        # Request logging
│   ├── routes/
│   │   ├── orderRoutes.ts   # Order routes
│   ├── services/
│   │   ├── orderService.ts  # Business logic
│   │   ├── redisService.ts  # Redis service
│   ├── types/
│   │   ├── index.ts         # TypeScript interfaces
│   │   ├── order.ts         # TypeScript types
│   ├── utils/
│   │   ├── errors.ts        # Custom error classes
│   ├── validations/
│   │   ├── orderSchema.ts   # Order validation schemas
│── tests/
│   ├── order.test.ts        # Unit tests
│── .env                     # Environment variables
│── jest.config.ts           # Jest config
│── package.json             # Dependencies
│── tsconfig.json            # TypeScript config
```

## 🔥 Features

### Request Validation

- Built-in request validation using Joi
- Type-safe request handling
- Automatic validation error responses

### Error Handling

- Centralized error handling
- Custom error classes for different scenarios
- Consistent error response format

### Logging

- Request/Response logging
- Performance timing
- HTTP status code tracking

### Type Safety

- TypeScript support
- Interfaces for API responses
- Type-safe error handling

---

## 🛠 Installation

### 1️⃣ Clone the repository

```sh
git clone https://github.com/ngopimas/idempotent-api.git
cd idempotent-api
```

### 2️⃣ Install dependencies

```sh
npm install
```

### 3️⃣ Create a `.env` file

```sh
PORT=3000
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
```

Make sure you have Redis installed and running locally.

### 4️⃣ Start the server (development)

```sh
npm run dev
```

The server will run on **http://localhost:3000**.

---

## 🔥 Usage

### **1️⃣ Create an order (Idempotent POST request)**

```sh
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: unique-key-123" \
  -d '{"product": "Laptop", "quantity": 1}'
```

#### ✅ Response (First Request)

```json
{
  "message": "Order created",
  "order": {
    "id": "1712941234567",
    "product": "Laptop",
    "quantity": 1
  }
}
```

#### ✅ Response (Same Idempotency-Key Again)

```json
{
  "message": "Order already processed",
  "order": {
    "id": "1712941234567",
    "product": "Laptop",
    "quantity": 1
  }
}
```

If the **Idempotency-Key** is missing:

```json
{
  "error": "Missing Idempotency-Key header"
}
```

---

## ✅ Running Tests

Run the unit tests using Jest:

```sh
npm test
```

---

## 📌 Technologies Used

- **TypeScript** - Strongly typed JavaScript
- **Express.js** - Fast and minimal web framework
- **Redis** - Caching system for storing idempotency keys
- **Jest & Supertest** - Unit testing and API testing
