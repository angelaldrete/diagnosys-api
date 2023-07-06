const express = require("express");
const app = express();
const PORT = 3000;
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

app.get("/", (req, res) => {
  res.sendStatus(200);
});

const userRoutes = require("./routes/user.routes");
const consultationRoutes = require("./routes/consultation.routes");
const patientRoutes = require("./routes/patient.routes");

app.use("/api/users", userRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/patients", patientRoutes);
