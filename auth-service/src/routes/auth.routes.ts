import { Router } from "express";
import {
  login,
  logout,
  refreshToken,
  register,
} from "../controllers/auth.controller";
import { asyncHandler } from "../helpers/error-handler.helper";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/refresh-token", asyncHandler(refreshToken));
router.post("/logout", asyncHandler(logout));

export default router;
