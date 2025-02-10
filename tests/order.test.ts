import request from "supertest";
import app from "../src/app";
import {
  initializeRedis,
  closeRedis,
  getRedisClient,
} from "../src/services/redisService";

beforeAll(async () => {
  await initializeRedis();
}, 30000);

afterEach(async () => {
  try {
    await getRedisClient().flushdb();
  } catch (error) {
    console.error("Error in afterEach:", error);
  }
});

afterAll(async () => {
  try {
    await getRedisClient().flushdb();
    await closeRedis();
  } catch (error) {
    console.error("Error in afterAll:", error);
  }
}, 30000);

describe("Idempotent Order API", () => {
  test("should return 400 if Idempotency-Key is missing", async () => {
    const response = await request(app)
      .post("/api/v1/orders")
      .send({ product: "Laptop", quantity: 1 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Missing Idempotency-Key header");
  });

  test("should create a new order if Idempotency-Key is provided", async () => {
    const response = await request(app)
      .post("/api/v1/orders")
      .set("Idempotency-Key", "unique-key-123")
      .send({ product: "Laptop", quantity: 1 });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Order created");
  });

  test("should return the same order for duplicate Idempotency-Key", async () => {
    const orderData = { product: "Laptop", quantity: 1 };
    const idempotencyKey = "test-key-123";

    const firstResponse = await request(app)
      .post("/api/v1/orders")
      .set("Idempotency-Key", idempotencyKey)
      .send(orderData);

    expect(firstResponse.status).toBe(201);

    const secondResponse = await request(app)
      .post("/api/v1/orders")
      .set("Idempotency-Key", idempotencyKey)
      .send(orderData);

    expect(secondResponse.status).toBe(200);
    expect(secondResponse.body.message).toBe("Order already processed");
    expect(secondResponse.body.order).toEqual(firstResponse.body.order);
  });

  test("should get all orders", async () => {
    // Clear the cache first
    await getRedisClient().flushdb();

    const orders = [
      { product: "Laptop", quantity: 1 },
      { product: "Mouse", quantity: 2 },
    ];

    for (let i = 0; i < orders.length; i++) {
      await request(app)
        .post("/api/v1/orders")
        .set("Idempotency-Key", `test-key-${i}`)
        .send(orders[i]);
    }

    const response = await request(app).get("/api/v1/orders");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
  });

  test("should get a specific order by ID", async () => {
    const orderData = { product: "Keyboard", quantity: 1 };
    const createResponse = await request(app)
      .post("/api/v1/orders")
      .set("Idempotency-Key", "test-get-key")
      .send(orderData);

    const orderId = createResponse.body.order.id;
    const response = await request(app).get(`/api/v1/orders/${orderId}`);

    expect(response.status).toBe(200);
    expect(response.body.product).toBe(orderData.product);
    expect(response.body.quantity).toBe(orderData.quantity);
  });

  test("should return 404 for non-existent order", async () => {
    const response = await request(app).get("/api/v1/orders/nonexistent-id");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Order not found");
  });

  test("should update an existing order", async () => {
    const createResponse = await request(app)
      .post("/api/v1/orders")
      .set("Idempotency-Key", "test-update-key")
      .send({ product: "Monitor", quantity: 1 });

    const orderId = createResponse.body.order.id;
    const updateData = { product: "Monitor", quantity: 2 };

    const updateResponse = await request(app)
      .put(`/api/v1/orders/${orderId}`)
      .set("Idempotency-Key", "test-update-key-2")
      .send(updateData);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.order.quantity).toBe(2);
  });

  test("should return 400 when updating without Idempotency-Key", async () => {
    const response = await request(app)
      .put("/api/v1/orders/some-id")
      .send({ product: "Mouse", quantity: 1 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Missing Idempotency-Key header");
  });

  test("should delete an existing order", async () => {
    const createResponse = await request(app)
      .post("/api/v1/orders")
      .set("Idempotency-Key", "test-delete-key")
      .send({ product: "Headphones", quantity: 1 });

    const orderId = createResponse.body.order.id;

    const deleteResponse = await request(app).delete(
      `/api/v1/orders/${orderId}`
    );
    expect(deleteResponse.status).toBe(204);

    const getResponse = await request(app).get(`/api/v1/orders/${orderId}`);
    expect(getResponse.status).toBe(404);
  });
});
