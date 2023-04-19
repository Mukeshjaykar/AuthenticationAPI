import express from "express";
import userController from "../controllers/userController.js";
import CheckUserAuth from "../middilewares/auth-middileware.js";
const router = express.Router();

// Route level middleware - to protect route
router.use("/changepassword", CheckUserAuth);
router.use("/loggeduser", CheckUserAuth);

// PUBLIC ROUTES
router.get("/data", userController.finddata);
router.post("/register", userController.userregistration);
router.post("/login", userController.userLogin);
router.post(
  "/send-reset-password-email",
  userController.SendUserResetPasswordEmail
);
router.post("/reset-password/:id/:token", userController.UserResetPassword);

// PROTECTED ROUTES
router.post("/changepassword", userController.ChangeUserPassword);
router.get("/loggeduser", userController.LoggedUser);

export default router;
