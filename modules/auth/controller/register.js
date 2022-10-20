import userModle from "../../../DB/models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { myEmail } from "../../../services/email.js";
export const signup = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const user = await userModle.findOne({ email }).select("email");
    if (user) {
      res.status(400).json({ message: "email exist" });
    } else {
      const hashPassword = bcrypt.hashSync(
        password,
        parseInt(process.env.SALTROUND)
      );
      const newUser = new userModle({
        userName,
        email,
        password: hashPassword,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign(
        { id: savedUser._id },
        process.env.confirmEmailToken,
        {
          expiresIn: "1h",
        }
      );
      const reftoken = jwt.sign(
        { id: savedUser._id },
        process.env.confirmEmailToken,
        {
          expiresIn: "6h",
        }
        );
      const confirmLink = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`;
      const refLink = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/reConfirmEmail/${reftoken}`;
      const message = `
            <a href= ${confirmLink}>follow link to confirm your email</a>
            <br>
            <br>
            <a href= ${refLink}>follow link to Reconfirm your email</a>
            `;
      myEmail(savedUser.email, "Confirm Email", message);
      res.status(201).json({ message: "Done check your email"});
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const confirmEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.confirmEmailToken);
    if (!decoded?.id) {
      res.status(400).json({ message: "In-valid token" });
    } else {
      const user = await userModle
        .findById(decoded.id)
        .select("email confirmEmail");
      if (!user) {
        res.status(400).json({ message: "In-valid user id" });
      } else {
        if (user.confirmEmail) {
          res.status(400).json({ message: "email already confirmed" });
        } else {
          await userModle.updateOne(
            { email: user.email },
            { confirmEmail: true }
          );
          res.status(200).json({ message: "Done please signin" });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const reConfirmEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.confirmEmailToken);
    if (!decoded?.id) {
      res.status(400).json({ message: "In-valid token" });
    } else {
      const user = await userModle
        .findById(decoded.id)
        .select("email confirmEmail");
      if (!user) {
        res.status(400).json({ message: "In-valid user id" });
      } else {
        if (user.confirmEmail) {
          res.status(400).json({ message: "email already confirmed" });
        } else {
          const token = jwt.sign(
            { id: user._id },
            process.env.confirmEmailToken,
            {
              expiresIn: "2h",
            }
          );
          const confirmLink = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`;
          const message = `
                  <a href= ${confirmLink}>follow link to confirm your email</a>
                  `;
          myEmail(user.email, "Reconfirm Email", message);
          res
            .status(201)
            .json({ message: "Done check your email to confirm it" });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModle.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "In-Valid account" });
    } else {
      if (!user.confirmEmail) {
        res.status(400).json({ message: "please confirm your email first" });
      } else {
        const match = bcrypt.compareSync(password, user.password);
        if (!match) {
          res.status(400).json({ message: "In-Valid account" });
        } else {
          const token = jwt.sign(
            { id: user._id, isLoggedIn: true },
            process.env.TOKENSIGNATURE,
            {
              expiresIn: 60 * 60 * 24,
            }
          );
          res.status(200).json({message : 'Done', token})
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
