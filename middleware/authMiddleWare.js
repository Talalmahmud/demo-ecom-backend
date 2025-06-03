// authMiddleware.js
import jwt from "jsonwebtoken";
import { UnauthorizedError, ForbiddenError } from "./errorHandleMiddleware.js";
/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
const authMiddleware = (roles = []) => {
  // roles param can be a string (e.g., 'admin') or array (e.g., ['admin', 'superadmin'])
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    try {
      // 1. Get token from header
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        throw new UnauthorizedError("Authentication token missing");
      }

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach user data to request

      // 3. Check roles if specified
      if (roles.length > 0 && !roles.includes(req.user.role)) {
        throw new ForbiddenError("Insufficient permissions");
      }

      next();
    } catch (err) {
      // Handle JWT-specific errors
      if (err.name === "TokenExpiredError") {
        err = new UnauthorizedError("Token expired");
      } else if (err.name === "JsonWebTokenError") {
        err = new UnauthorizedError("Invalid token");
      }
      next(err);
    }
  };
};

module.exports = authMiddleware;
