import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../src/middleware/errorHandler";
import { ApiError } from "../src/utils/errors";

describe("Error Handler Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("handles ApiError correctly", () => {
    const apiError = new ApiError(400, "Bad Request");
    errorHandler(
      apiError,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Bad Request",
      success: false
    });
  });

  test("handles generic Error correctly", () => {
    const error = new Error("Server Error");
    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Internal server error",
      success: false
    });
  });
});
