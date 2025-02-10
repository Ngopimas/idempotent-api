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
