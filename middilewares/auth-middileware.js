import JWT from "jsonwebtoken";
import UserModel from "../models/user.js";

const CheckUserAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      // Get token from header
      token = authorization.split(" ")[1];
      // Verify Token
      const { USER_ID } = JWT.verify(token, process.env.JWT_SECRET_KEY);

      // Get User from Token
      req.user = await UserModel.findById(USER_ID)
        .select("-password")
        .select("-confirm_password");
      next();
    } catch (error) {
      res.send({ status: "failed", msg: "Unauthorized user" });
    }
  }
  if (!token) {
    res.send({ status: "failed", msg: "Unauthorized user, no token" });
  }
};
export default CheckUserAuth;
