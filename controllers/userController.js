import UserModel from "../models/user.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import transporter from "../config/emailConfig.js";

class userController {
  // GET ALL DATA FROM UserModel Collection
  static finddata = async (req, res) => {
    const data = await UserModel.find();
    res.send(data);
  };

  // USER REGISTRATION API
  static userregistration = async (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const confirm_password = req.body.confirm_password;
    const tc = req.body.tc;
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      if (name && email && password && confirm_password && tc) {
        if (password == confirm_password) {
          try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const doc = new UserModel({
              name: name,
              email: email,
              password: hashPassword,
              confirm_password: confirm_password,
              tc: tc,
            });
            await doc.save();
            const saved_user = await UserModel.findOne({ email: email });
            //GENERATE WEB TOKEN
            const token = JWT.sign(
              { USER_ID: saved_user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "5d" }
            );
            res.send({ msg: "registration ho gail bhai", token: token });
          } catch (error) {
            console.log(error);
          }
        } else {
          res.send({ status: "failed", msg: "password are not matching" });
        }
      } else {
        res.send({ status: "failed", msg: "All fields are required" });
      }
    } else {
      res.send({ status: "failed", msg: "email already exists" });
    }
  };

  // USER LOGIN API
  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email: email });
      if (user) {
        if (email && password) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (user.email === email && isMatch) {
            // GENERATE TOKEN
            const token = JWT.sign(
              { USER_ID: user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "5d" }
            );
            res.send({ msg: "Login ho gaya re baba", "token ke sath": token });
          } else {
            res.send({ msg: "bhai kuch to galat hai email or password" });
          }
        } else {
          res.send({ msg: "Email aur Password dono daliye maharaj" });
        }
      } else {
        res.send({ msg: "Email registered nhi hai bhai" });
      }
    } catch (error) {
      console.log(error);
      res.send({ msg: "Abe Yarr Kya kar diye ho" });
    }
  };

  // Change User Password
  static ChangeUserPassword = async (req, res) => {
    const { password, confirm_password } = req.body;
    if (password && confirm_password) {
      if (password == confirm_password) {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        // const hashConfirmPassword = await bcrypt.hash(password, salt);
        await UserModel.findByIdAndUpdate(req.user._id, {
          $set: {
            password: hashPassword,
            confirm_password: confirm_password,
          },
        });
        res.send({
          status: "success",
          msg: "password changed successfully",
        });
      } else {
        res.send({ msg: "password aur confirm_password same rakhiye mahraj" });
      }
    } else {
      res.send({ msg: "dono jaruri hai na bhai" });
    }
  };

  // Get logged User Data -- help to get user profile or dashboard
  static LoggedUser = async (req, res) => {
    res.send({ User: req.user });
  };

  // Send User Reset Password Email
  static SendUserResetPasswordEmail = async (req, res) => {
    const { email } = req.body;
    if (email) {
      const user = await UserModel.findOne({ email: email });
      if (user) {
        const secret = user._id + process.env.JWT_SECRET_KEY;
        const token = JWT.sign({ USER_ID: user._id }, secret, {
          expiresIn: "5d",
        });
        const link = `http://127.0.0.1:8000/api/user/sent/reset/${user._id}/${token}`;
        // SEND EMAIL
        let info = transporter.sendMail({
          from: "jaykarmukesh3377@gmail.com",
          to: user.email,
          subject: `Reset Password Link`,
          html: `<a href="${link}">Click here</a> to reset your password`,
        });
        res.send({
          userid: user._id,
          token: token,
          status: "success",
          msg: "Password Reset Email Sent...Please Check Your Link",
          info: info,
        });
      } else {
        res.send({ status: "failed", msg: "Please Enter Register Email" });
      }
    } else {
      res.send({ status: "failed", msg: "Please Enter email" });
    }
  };

  // Reset Password and Update
  static UserResetPassword = async (req, res) => {
    const { password, confirm_password } = req.body;
    const { id, token } = req.params;
    const user = await UserModel.findById(id);
    const new_secret = user._id + process.env.JWT_SECRET_KEY;
    try {
      JWT.verify(token, new_secret);
      if (password && confirm_password) {
        if (password == confirm_password) {
          const salt = await bcrypt.genSalt(10);
          const newhashPassword = await bcrypt.hash(password, salt);
          await UserModel.findByIdAndUpdate(user._id, {
            $set: {
              password: newhashPassword,
              confirm_password: confirm_password,
            },
          });
          res.send({ status: "Success", msg: "password reset successfully" });
        } else {
          res.send({
            status: "failed",
            msg: "password and confirm_password are not matching",
          });
        }
      } else {
        res.send({ status: "failed", msg: "Please fill all required fields" });
      }
    } catch (error) {
      console.log(error);
      res.send({ status: "failed", msg: "Invalid Token" });
    }
  };
}

export default userController;
