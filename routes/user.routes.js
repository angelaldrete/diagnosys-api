const express = require("express");
const router = express.Router();
const { verifyAuth } = require("../middlewares/verifyAuth");
const { verifyNotAuth } = require("../middlewares/verifyNotAuth");

const userController = require("../controllers/user.controller");

router.get("/", verifyAuth, userController.getAllUsers);
router.get("/:id", verifyAuth, userController.getUserById);
router.delete("/:id", verifyAuth, userController.deleteUser);
router.post("/login", verifyNotAuth, userController.login);
router.post("logout", verifyAuth, userController.logout);
router.post("/register", userController.register);
router.put("/:id/password", verifyAuth, userController.updatePassword);
router.put("/:id/username", verifyAuth, userController.updateUsername);
router.put("/:id/email", verifyAuth, userController.updateEmail);
router.put("/:id/name", verifyAuth, userController.updateName);

module.exports = router;
