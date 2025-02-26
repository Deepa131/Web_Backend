const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    // Check for the presence of the authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.error("Access denied: No token provided.");
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    // Extract the token from the header
    const token = authHeader.split(" ")[1];

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
        if (err) {
            console.error("Token verification failed:", err.message);
            return res.status(403).json({ error: "Invalid or expired token." });
        }

        // Attach decoded user data to request for use in routes
        req.user = decoded; 
        next(); // Proceed to next middleware
    });
};

module.exports = { verifyToken };
