export const errorHandler = (err, req, res, next) => {
  // Default error structure
  let error = {
    success: false,
    message: err.message || "Something went wrong",
    statusCode: err.statusCode || 500,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    errors: err.errors || undefined,
  };

  // Handle specific error types
  if (err.name === "ValidationError") {
    // Mongoose validation error
    error.statusCode = 400;
    error.message = "Validation Error";
    error.errors = {};

    Object.keys(err.errors).forEach((key) => {
      error.errors[key] = err.errors[key].message;
    });
  } else if (err.name === "CastError") {
    // Mongoose cast error (invalid ID format)
    error.statusCode = 400;
    error.message = `Resource not found with id of ${err.value}`;
  } else if (err.code === 11000) {
    // MongoDB duplicate key error
    error.statusCode = 400;
    error.message = "Duplicate field value entered";
    const field = Object.keys(err.keyValue)[0];
    error.errors = { [field]: `This ${field} is already in use` };
  } else if (err.name === "JsonWebTokenError") {
    // JWT error
    error.statusCode = 401;
    error.message = "Not authorized, token failed";
  } else if (err.name === "TokenExpiredError") {
    // JWT expired error
    error.statusCode = 401;
    error.message = "Not authorized, token expired";
  } else if (err.name === "UnauthorizedError") {
    // Express-jwt auth error
    error.statusCode = 401;
    error.message = "Not authorized";
  }

  // Log the error in development
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", {
      message: err.message,
      stack: err.stack,
      name: err.name,
      statusCode: error.statusCode,
      path: req.path,
      method: req.method,
      body: req.body,
      query: req.query,
      params: req.params,
    });
  }

  // Send error response
  res.status(error.statusCode).json(error);
};

class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends ApiError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

class NotFoundError extends ApiError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export default {
  ApiError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
};
