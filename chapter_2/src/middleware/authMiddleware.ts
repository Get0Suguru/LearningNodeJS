import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

function jwtAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
      const paylaod = decoded as {userId: number};
      (req as any).userId = paylaod.userId;
      next();
    });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export default jwtAuthMiddleware;