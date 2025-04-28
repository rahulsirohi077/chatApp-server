import { body, param, validationResult } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";

const validateHandler = (req, res, next) => {
  const errors = validationResult(req);

  const errorMessage = errors
    .array()
    .map((error) => error.msg)
    .join(", ");

  if (errors.isEmpty()) {
    next();
  } else {
    next(new ErrorHandler(errorMessage, 400));
  }
};

const registerValidator = () => [
  body("name", "Please Enter Your Name").notEmpty(),
  body("username", "Please Enter Your Username").notEmpty(),
  body("bio", "Please Enter Your Bio").notEmpty(),
  body("password", "Please Enter Your Password").notEmpty(),
];

const loginValidator = () => [
  body("username", "Please Enter Your Username").notEmpty(),
  body("password", "Please Enter Your Password").notEmpty(),
];

const newGroupValidator = () => [
  body("name", "Please Enter Your Name").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please Enter Members")
    .isArray({ min: 2, max: 100 })
    .withMessage("Members must be 2-100"),
];

const addMemberValidator = () => [
  body("chatId", "Please Enter Chat ID").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please Enter Members")
    .isArray({ min: 1, max: 97 })
    .withMessage("Members must be 1-97"),
];

const removeMemberValidator = () => [
  body("chatId", "Please Enter Chat ID").notEmpty(),
  body("userId", "Please Enter User ID").notEmpty(),
];

const sendAttachmentValidator = () => [
  body("chatId", "Please Enter Chat ID").notEmpty(),
];

const chatIdValidator = () => [param("id", "Please Enter Chat ID").notEmpty()];

const renameGroupValidator = () => [
  param("id", "Please Enter Chat ID").notEmpty(),
  body("name", "Please Enter New Name").notEmpty(),
];

const sendRequestValidator = () => [
  body("userId", "Please Enter User ID").notEmpty(),
];

const acceptRequestValidator = () => [
  body("requestId", "Please Enter Request ID").notEmpty(),
  body("accept")
    .notEmpty()
    .withMessage("Please Add Accept")
    .isBoolean()
    .withMessage("Accept must be Boolean"),
];

const adminLoginValidator = () => [
  body("secretKey", "Please Enter Secret Key").notEmpty(),
]

export {
  acceptRequestValidator, addMemberValidator, adminLoginValidator, chatIdValidator, loginValidator, newGroupValidator, registerValidator, removeMemberValidator, renameGroupValidator, sendAttachmentValidator, sendRequestValidator, validateHandler
};

