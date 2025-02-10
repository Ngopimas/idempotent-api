export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export class DuplicateRequestError extends ApiError {
  constructor(message: string = "Duplicate request detected") {
    super(409, message);
    this.name = "DuplicateRequestError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found") {
    super(404, message);
    this.name = "NotFoundError";
  }
}
