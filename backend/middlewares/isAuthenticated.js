import jwt from 'jsonwebtoken';

function getCookieFromHeader(cookieString, name) {
    const value = `; ${cookieString}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;  // Return null if the cookie doesn't exist
}

const isAuthenticated = async (req, res, next) => {
    try {
        // Access the 'token' cookie from the request headers
        const cookieHeader = req.headers.cookie;
        const token = cookieHeader ? getCookieFromHeader(cookieHeader, "token") : null;

        if (!token) {
            return res.status(401).json({
                message: "User not found",
                success: false,
            });
        }

        // Verify the JWT token
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            });
        }

        req.id = decoded.userId; // Attach the decoded user ID to the request
        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
        });
    }
};

export default isAuthenticated;
