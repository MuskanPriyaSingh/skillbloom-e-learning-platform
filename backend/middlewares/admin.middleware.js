import jwt from "jsonwebtoken";
import config from "../config.js";

function adminMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "No token provided or token format is invalid",
        });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, config.JWT_ADMIN_PASSWORD);

        req.adminId = decoded.id;

        next(); 
    } catch (error) {
        console.error("JWT verification error:", error);
        res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
}

export default adminMiddleware;
