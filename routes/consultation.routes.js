const express = require("express");
const router = express.Router();
const { verifyAuth } = require("../middlewares/verifyAuth");

const consultationController = require("../controllers/consultation.controller");

router.get("/", verifyAuth, consultationController.getAll);
router.get("/:id", verifyAuth, consultationController.getOne);
router.get(
  "/patient/:id",
  verifyAuth,
  consultationController.getAllFromPatient
);
router.post("/", verifyAuth, consultationController.create);
router.put("/:id", verifyAuth, consultationController.update);
router.delete("/:id", verifyAuth, consultationController.deleteOne);
router.get("/count/month", verifyAuth, consultationController.countMonth);
router.get("/average/month", verifyAuth, consultationController.averageTotal);
router.get("/increase/month", verifyAuth, consultationController.increaseMonth);

module.exports = router;
