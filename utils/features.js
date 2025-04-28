import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import {v2 as cloudinary} from "cloudinary";
import { getBase64, getSockets } from "../lib/helper.js";

const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  secure: true,
  httpOnly: true,
};

const connectDB = (url) => {
  mongoose
    .connect(url, { dbName: "ChatApp" })
    .then((data) => {
      console.log(`Connected to DB: ${data.connection.host}`);
    })
    .catch((err) => {
      throw err;
    });
};

const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  return res.status(code).cookie("chatAppToken", token, cookieOptions).json({
    success: true,
    message,
    user
  });
};

const emitEvent = (req, event, users, data) => {
  const io = req.app.get("io");
  const usersSockets = getSockets(users);
  io.to(usersSockets).emit(event, data);
};

const uploadFileToCloudinary = async (files = []) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),
        {
          resource_type: "auto",
          public_id: uuid(),
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
  });

  try {
    const results = await Promise.all(uploadPromises);

    const formattedResults = results.map((result) => {
      return {
        public_id: result.public_id,
        url: result.secure_url,
      };
    });

    return formattedResults;
  } catch (error) {
    throw new Error("Error while uploading files to Cloudinary",error);
  }
};

const deleteFilesFromCloudinary = async (public_ids) => {
  // Delete Files from cloudinary
};

export {
  connectDB,
  sendToken,
  cookieOptions,
  emitEvent,
  deleteFilesFromCloudinary,
  uploadFileToCloudinary,
};
