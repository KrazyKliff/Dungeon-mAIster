export class AppError extends Error {
  constructor(
    public override message: string,
    public code: string,
    public statusCode = 500,
    public isOperational = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class RuleViolationError extends AppError {
  constructor(message: string) {
    super(message, 'RULE_VIOLATION', 422);
  }
}