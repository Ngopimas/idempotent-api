import request from "supertest";
import { app } from "../src/app";
import { createClient } from "redis-mock";

const client = createClient();

beforeAll(async () => {
  await client.connect();
});

afterEach(async () => {
  await client.flushAll();
});

afterAll(async () => {
  await client.quit();
});

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

    const firstResponse = await request(app)
      .post("/orders")
      .set("Idempotency-Key", "test-key-123")
      .send(orderData);

    expect(firstResponse.status).toBe(201);

    const secondResponse = await request(app)
      .post("/orders")
      .set("Idempotency-Key", "test-key-123")
      .send(orderData);

    expect(secondResponse.status).toBe(200);
    expect(secondResponse.body).toEqual(firstResponse.body);
  });
});
