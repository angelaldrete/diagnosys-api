const express = require("express");
const router = express.Router();
const { verifyAuth } = require("../middlewares/verifyAuth");

const patientController = require("../controllers/patient.controller");

router.get("/", verifyAuth, patientController.getAll);
router.get("/:id", verifyAuth, patientController.getOne);
router.post("/", verifyAuth, patientController.create);
router.put("/:id", verifyAuth, patientController.update);
router.delete("/:id", verifyAuth, patientController.deleteOne);
router.get("/count/month", verifyAuth, patientController.countMonth);
router.get("/average/age", verifyAuth, patientController.averageAge);
router.get("/increase/month", verifyAuth, patientController.increaseMonth);

module.exports = router;
