const { verify } = require("jsonwebtoken");

module.exports = {
  checkToken: (req, res, next) => {
    let token = req.get("authorization");
    if (token) {
      token = token.slice(7);
      verify(token, "shezan", (err, decoded) => {
        if (err) {
          return res.status(401).json({
            success: 0,
            message: "Invalid token",
          });
        }
        next();
      });
    } else {
      return res.json({
        success: 0,
        message: "Token is not provided",
      });
    }
  },
};
