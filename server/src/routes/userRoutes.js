const express = require("express");

const {
  getUsers
} = require("../controllers/userController");

const {
  authenticate
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get(
  "/",
  authenticate,
  getUsers
);

module.exports = router;