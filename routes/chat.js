import express from "express";
import {
    addMembers,
    deleteChat,
    getChatDetails,
    getMessages,
    getMyChats,
    getMyGroups,
    leaveGroup,
    newGroupChat,
    removeMember,
    renameGroups,
    sendAttachment,
} from "../controllers/chat.js";
import {
    addMemberValidator,
    chatIdValidator,
    newGroupValidator,
    removeMemberValidator,
    renameGroupValidator,
    sendAttachmentValidator,
    validateHandler
} from "../lib/validators.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { attachmentsMulter } from "../middlewares/multer.js";

const app = express.Router();

// after here user must be logged in to access the routes
app.use(isAuthenticated);

app.post("/new", newGroupValidator(), validateHandler, newGroupChat);

app.get("/my", getMyChats);

app.get("/my/groups", getMyGroups);

app.put("/addmembers", addMemberValidator(), validateHandler, addMembers);

app.put(
  "/removemember",
  removeMemberValidator(),
  validateHandler,
  removeMember
);

app.delete("/leave/:id", chatIdValidator(), validateHandler, leaveGroup);

// Send Attachments
app.post(
  "/message",
  attachmentsMulter,
  sendAttachmentValidator(),
  validateHandler,
  sendAttachment
);

// Get Messages
app.get("/message/:id", chatIdValidator(), validateHandler, getMessages);

// Get Chat Details, rename, delete
app
  .route("/:id")
  .get(chatIdValidator(), validateHandler, getChatDetails)
  .put(renameGroupValidator(),validateHandler,renameGroups)
  .delete(chatIdValidator(), validateHandler,deleteChat);

export default app;
