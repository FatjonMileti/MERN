const jwt = require("jsonwebtoken");

module.exports = async (request, response, next) => {
  try {
    const token = request.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env['ACCESS_TOKEN_SECRET']);
    request.user = decodedToken;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const refreshToken = request.headers['x-refresh-token'];
      if (!refreshToken) {
        return response.status(401).json({
          error: new Error("Refresh token missing"),
        });
      }
      try {
        const decodedRefreshToken = jwt.verify(refreshToken, process.env['REFRESH_TOKEN_SECRET']);
        const { userId, userEmail } = decodedRefreshToken;
        const newAccessToken = jwt.sign(
          { userId, userEmail },
          process.env['ACCESS_TOKEN_SECRET'],
          { expiresIn: '15m' }
        );
        response.setHeader('Authorization', `Bearer ${newAccessToken}`);
        next();
      } catch (error) {
        return response.status(401).json({
          error: new Error("Invalid refresh token"),
        });
      }
    } else {
      return response.status(401).json({
        error: new Error("Invalid access token"),
      });
    }
  }
};