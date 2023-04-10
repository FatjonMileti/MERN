const jwt = require("jsonwebtoken");

exports.authMiddleware = async (req, res, next) => {
  try {
    // Get the token from the headers
    const token = req.headers.authorization.split(" ")[1];
    
    // Verify the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    // Add the decoded user to the request object
    req.user = decodedToken;
    
    // Call the next middleware/controller function
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const refreshToken = req.headers['x-refresh-token'];
      if (!refreshToken) {
        return res.status(401).json({
          error: new Error("Refresh token missing"),
        });
      }
      try {
        const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const { userId, userEmail } = decodedRefreshToken;
        const newAccessToken = jwt.sign(
          { userId, userEmail },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '15m' }
        );
        res.setHeader('Authorization', `Bearer ${newAccessToken}`);
        next();
      } catch (error) {
        return res.status(401).json({
          error: new Error("Invalid refresh token"),
        });
      }
    } else {
      return res.status(401).json({
        error: new Error("Invalid access token"),
      });
    }
  }
};