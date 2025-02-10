# Idempotent API in TypeScript

## 🚀 Overview

This is a **demonstration project** showcasing how to implement an **Idempotent API** using TypeScript. Built with Express, Redis, and Jest, this project serves as an educational example of handling idempotency in API requests.

## 📄 Article: Understanding Idempotent APIs

Idempotency is a crucial concept in API design, ensuring that multiple identical requests have the same effect as a single request. This is particularly important in scenarios where network issues or client retries might lead to duplicate requests.

### What is Idempotency?

Idempotency means that an operation can be performed multiple times without changing the result beyond the initial application. In the context of APIs, it ensures that making the same request multiple times will not have additional side effects.

### Why is Idempotency Important?

- **Prevents Duplicate Operations**: Ensures that operations like order creation or payment processing are not executed multiple times.
- **Improves Reliability**: Helps in building reliable systems that can handle retries gracefully.
- **Enhances User Experience**: Users can safely retry operations without worrying about unintended consequences.

### How to Implement Idempotency?

1. **Idempotency Key**: Clients generate a unique key for each request and send it in the request header.
2. **Storage Mechanism**: Use a storage system like Redis to store and check idempotency keys.
3. **Check and Process**: On receiving a request, check if the key exists. If it does, return the previous response; otherwise, process the request and store the key.

### Example Workflow

1. **Client** sends a POST request with an Idempotency-Key.
2. **Server** checks if the key exists in Redis.
   - If it exists, return the stored response.
   - If it does not exist, process the request, store the key, and return the response.

By following these principles, you can ensure that your API operations are idempotent, providing a more robust and user-friendly experience.

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
