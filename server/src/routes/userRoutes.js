const express = require("express");

const {
  createUser,
  getUsers
} = require("../controllers/userController");

const validate = require("../middlewares/validate");
const {
  createUserSchema
} = require("../validators/userValidator");

const router = express.Router();

router.post(
  "/",
  validate(createUserSchema),
  createUser
);

router.get("/", getUsers);

module.exports = router;