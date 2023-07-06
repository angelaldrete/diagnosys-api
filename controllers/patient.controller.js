const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();

const getAll = async (req, res) => {
  const { limit, search } = req.query;

  let patients;

  if (search) {
    // patients = await prisma.paciente
    // raw query
    patients = await prisma.$queryRaw`
      SELECT *
      FROM paciente
      WHERE nombre LIKE '%' || ${search} || '%'
        OR apellido LIKE '%' || ${search} || '%'
        OR fechaNacimiento LIKE '%' || ${search} || '%'
      ORDER BY nombre ASC
    `;
  } else if (limit) {
    patients = await prisma.paciente.findMany({
      take: parseInt(limit),
      orderBy: {
        nombre: "asc",
      },
    });
  } else {
    patients = await prisma.paciente.findMany({
      orderBy: {
        nombre: "asc",
      },
    });
  }

  if (!patients) {
    return res.status(404).json({
      message: "Patients not found",
    });
  }

  return res.status(200).json(patients);
};

const getOne = async (req, res) => {
  const { id } = req.params;

  const patient = await prisma.paciente.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!patient) {
    return res.status(404).json({
      message: "Patient not found",
    });
  }

  return res.status(200).json(patient);
};

const create = async (req, res) => {
  const patient = req.body;

  const existingPatient = await prisma.paciente.findFirst({
    where: {
      nombre: patient.nombre,
      apellido: patient.apellido,
      fechaNacimiento: patient.fechaNacimiento,
    },
  });

  if (existingPatient) {
    return res.status(409).json({
      message: "Patient already exists",
    });
  }

  const newPatient = await prisma.paciente.create({
    data: {
      ...patient,
      edad: parseInt(patient.edad),
    },
  });

  if (!newPatient) {
    return res.status(500).json({
      message: "Error creating patient",
    });
  }

  return res.status(201).json({
    message: "Patient created",
    patient: newPatient,
  });
};

const update = async (req, res) => {
  const { id } = req.params;
  const patient = req.body;

  const updatedPatient = await prisma.paciente.update({
    where: {
      id: parseInt(id),
    },
    data: {
      ...patient,
      edad: parseInt(patient.edad),
    },
  });

  if (!updatedPatient) {
    return res.status(500).json({
      message: "Error updating patient",
    });
  }

  return res.status(200).json({
    message: "Patient updated",
    patient: updatedPatient,
  });
};

const deleteOne = async (req, res) => {
  const { id } = req.params;

  // delete all consultations from patient
  const deletedConsultations = await prisma.consulta.deleteMany({
    where: {
      pacienteId: parseInt(id),
    },
  });

  if (!deletedConsultations) {
    return res.status(500).json({
      message: "Error deleting consultations",
    });
  }

  const deletedPatient = await prisma.paciente.delete({
    where: {
      id: parseInt(id),
    },
  });

  if (!deletedPatient) {
    return res.status(500).json({
      message: "Error deleting patient",
    });
  }

  return res.status(200).json({
    message: "Patient deleted",
    patient: deletedPatient,
  });
};

const countMonth = async (req, res) => {
  const count = await prisma.$queryRaw`
    SELECT COUNT(*) as count FROM paciente
  `;

  if (!count) {
    return res.status(404).json({
      message: "Patients not found",
    });
  }
  return res.status(200).json({
    count: Number(count[0].count),
  });
};

const averageAge = async (req, res) => {
  const patients = await prisma.$queryRaw`
    SELECT AVG(edad) as age FROM paciente
  `;
  if (!patients) {
    return res.status(404).json({
      message: "Patients not found",
    });
  }
  return res.status(200).json({
    averageAge: patients[0].age,
  });
};

const increaseMonth = async (req, res) => {
  const patients = await prisma.paciente.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
  if (!patients) {
    return res.status(404).json({
      message: "Patients not found",
    });
  }
  const months = patients.reduce((acc, patient) => {
    const date = patient.createdAt.toISOString().split("T")[0];
    if (acc[date]) {
      acc[date] += 1;
    } else {
      acc[date] = 1;
    }
    return acc;
  }, {});
  if (!months) {
    return res.status(404).json({
      message: "Patients not found",
    });
  }
  const response = Object.keys(months).map((key) => {
    return {
      timestamp: key,
      value: months[key],
    };
  });
  if (!response) {
    return res.status(404).json({
      message: "Patients not found",
    });
  }
  return res.status(200).json(response);
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  deleteOne,
  countMonth,
  averageAge,
  increaseMonth,
};
