import { ApiError, NotFoundError } from "../src/utils/errors";

describe("Error Utilities", () => {
  test("creates ApiError with correct properties", () => {
    const error = new ApiError(400, "Bad Request");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe("Bad Request");
  });

  test("creates NotFoundError with correct properties", () => {
    const error = new NotFoundError("Resource not found");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toBeInstanceOf(NotFoundError);
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe("Resource not found");
  });

  test("creates NotFoundError with default message", () => {
    const error = new NotFoundError();

    expect(error).toBeInstanceOf(NotFoundError);
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe("Resource not found");
  });

  test("constructs ApiError with error name", () => {
    const error = new ApiError(400, "Bad Request");
    expect(error.name).toBe("ApiError");
  });
});
