import request from "supertest";
import { app } from "../src/app";
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
    await getRedisClient().flushDb();
  } catch (error) {
    console.error("Error in afterEach:", error);
  }
});

afterAll(async () => {
  try {
    await getRedisClient().flushDb();
    await closeRedis();
  } catch (error) {
    console.error("Error in afterAll:", error);
  }
}, 30000);

describe("Idempotent Order API", () => {
  test("should return 400 if Idempotency-Key is missing", async () => {
    const response = await request(app)
      .post("/orders")
      .send({ product: "Laptop", quantity: 1 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Missing Idempotency-Key header");
  });

  test("should create a new order if Idempotency-Key is provided", async () => {
    const response = await request(app)
      .post("/orders")
      .set("Idempotency-Key", "unique-key-123")
      .send({ product: "Laptop", quantity: 1 });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Order created");
  });

  test("should return the same order for duplicate Idempotency-Key", async () => {
    const orderData = { product: "Laptop", quantity: 1 };
    const idempotencyKey = "test-key-123";

    const firstResponse = await request(app)
      .post("/orders")
      .set("Idempotency-Key", idempotencyKey)
      .send(orderData);

    expect(firstResponse.status).toBe(201);

    const secondResponse = await request(app)
      .post("/orders")
      .set("Idempotency-Key", idempotencyKey)
      .send(orderData);

    expect(secondResponse.status).toBe(200);
    expect(secondResponse.body.message).toBe("Order already processed");
    expect(secondResponse.body.order).toEqual(firstResponse.body.order);
  });
});
