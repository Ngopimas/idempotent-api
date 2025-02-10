# Idempotent API in TypeScript

## 🚀 Overview

This project is a **TypeScript-based Idempotent API** built using **Express, Redis, and Jest**. The API ensures that multiple identical requests with the same **Idempotency-Key** result in a single action being executed, preventing duplicate operations.

## 📂 Project Structure

```
idempotent-api/
│── src/
│   ├── server.ts            # Express server
│   ├── app.ts               # Express app (for testing)
│   ├── routes/orderRoutes.ts # Order routes
│   ├── controllers/orderController.ts # Order logic
│   ├── services/orderService.ts  # Business logic
│   ├── services/redisService.ts  # Redis service
│   ├── types/order.ts       # TypeScript types
│── tests/
│   ├── order.test.ts        # Unit tests
│── tsconfig.json            # TypeScript config
│── jest.config.ts           # Jest config
│── package.json             # Dependencies
│── .env                     # Environment variables
```

---

## 🛠 Installation

### 1️⃣ Clone the repository

```sh
git clone https://github.com/your-username/idempotent-api.git
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
