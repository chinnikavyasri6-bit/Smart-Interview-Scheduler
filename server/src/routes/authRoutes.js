const express = require("express");

const {
  register,
  login,
  getProfile
} = require("../controllers/authController");

const validate = require("../middlewares/validate");

const {
  registerSchema,
  loginSchema
} = require("../validators/authValidator");

const {
  authenticate,
  authorizeRoles
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/register",
  validate(registerSchema),
  register
);

router.post(
  "/login",
  validate(loginSchema),
  login
);

router.get(
  "/profile",
  authenticate,
  getProfile
);

module.exports = router;