import userModle from "../../../DB/models/User.model.js";
import cloudinary from "./../../../services/cloudinary.js";
import { myEmail } from "./../../../services/email.js";
import fs from "fs"
import path from 'path'
export const updateProfile = async (req, res) => {
  const { userName } = req.body;
  try {
    const user = await userModle.findOneAndUpdate(
      { _id: req.authUser._id, isDeleted: false },
      { userName },
      { new: true }
    );
    if (!user) {
      res.status(406).json({ message: "in-valid user id or may be deleted" });
    } else {
      res.status(200).json({ message: "Done", user });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const softDelete = async (req, res) => {
  try {
    const user = await userModle.findOneAndUpdate(
      { _id: req.authUser._id, isDeleted: false },
      { isDeleted: true }
    );
    if (!user) {
      res.status(406).json({ message: "in-valid user id or may be deleted" });
    } else {
      res.status(200).json({ message: "Done" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const addProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "Please upload your image" });
    } else {
      const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
        folder: `user/profile/${req.authUser._id}`,
      });
      await userModle.updateOne(
        { _id: req.authUser._id },
        { profilePic: secure_url }
      );
      res.status(200).json({ message: "Done", secure_url });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const addProfileCov = async (req, res) => {
  try {
    if (!req.files) {
      res.status(400).json({ message: "Please upload your images" });
    } else {
      const urls = [];
      for (const file of req.files) {
        const { secure_url } = await cloudinary.uploader.upload(file.path, {
          folder: `user/profile/cover/${req.authUser._id}`,
        });
        urls.push(secure_url);
      }
      await userModle.updateOne({ _id: req.authUser._id }, { coverPic: urls });
      res.status(200).json({ message: "Done", urls });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const sendPdf = async (req, res) => {
  try {
    if (!req.file) {
      res
        .status(400)
        .json({ message: "Please upload your pdf Before send it" });
    } else {
      const users = await userModle.find().select("email");
      if (!users.length) {
        res.json({ message: "Users Not found" });
      } else {
        const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
          folder: "about/pdf",
        });
        for (const user of users){
            myEmail(
            user.email,
            "about website pdf",
            `<a href='${secure_url}'>follow link to recive pdf</a>`
          );
        }
        res.status(200).json({message : 'Done check your email', secure_url})
      }
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
