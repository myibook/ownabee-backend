import express, { RequestHandler } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  syncUserHandler,
  updateUser,
} from "../controllers/userController";

const router = express.Router();

router.get("/:id", getUserById as RequestHandler);
router.get("/", getAllUsers);
router.post("/", createUser);
router.post("/sync", syncUserHandler);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
