import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";
import { adminSecretKey } from "../app.js";
import { TryCatch } from "./error.js";
import { User } from "../models/user.js";

const isAuthenticated = TryCatch((req, res, next) => {
  const token = req.cookies.chatAppToken;
  if (!token) {
    return next(new ErrorHandler("Please login to access this route", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decoded.id;
  next();
});

const adminOnly = (req, res, next) => {
  const token = req.cookies.chatAppAdminToken;
  if (!token) {
    return next(new ErrorHandler("Only Admin can access this route", 401));
  }

  const adminId = jwt.verify(token, process.env.JWT_SECRET);

  const isMatched = adminId === adminSecretKey;

  if (!isMatched) {
    return next(new ErrorHandler("Invalid Admin Key", 401));
  }

  next();
};

const socketAuthenticator = async(err,socket,next)=>{
  try {
    if(err) return next(err);

    const authToken = socket.request.cookies.chatAppToken;

    if(!authToken) {
      return next(new ErrorHandler("Please login to access this route", 401));
    }

    const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

    const user = await User.findById(decodedData.id);

    if(!user) {
      return next(new ErrorHandler("User not found", 401));
    }

    socket.user = user;

    return next();

  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Please Login To access this route", 401));
  }
};

export { isAuthenticated , adminOnly, socketAuthenticator };
