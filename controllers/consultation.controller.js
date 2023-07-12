const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();

const isDemo = process.env.DEMO === true || process.env.DEMO === "true";

const getAll = async (req, res) => {
  if (isDemo) {
    return res.status(200).json([
      {
        id: 1,
        fecha: "2021-05-01",
        motivo: "Dolor de cabeza",
        diagnostico: "Migraña",
        tratamiento: "Paracetamol",
        pacienteId: 1,
        createdAt: "2021-05-01T00:00:00.000Z",
        updatedAt: "2021-05-01T00:00:00.000Z",
      },
      {
        id: 2,
        fecha: "2021-05-02",
        motivo: "Dolor de cabeza",
        diagnostico: "Migraña",
        tratamiento: "Paracetamol",
        pacienteId: 1,
        createdAt: "2021-05-02T00:00:00.000Z",
        updatedAt: "2021-05-02T00:00:00.000Z",
      },
    ]);
  }

  const { search } = req.query;

  let consultations;

  if (search) {
    consultations = await prisma.consulta.findMany({
      where: {
        OR: [
          {
            motivo: {
              contains: search,
            },
          },
          {
            diagnostico: {
              contains: search,
            },
          },
          {
            tratamiento: {
              contains: search,
            },
          },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  } else {
    consultations = await prisma.consulta.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  if (!consultations) {
    return res.status(404).json({
      message: "Consultations not found",
    });
  }

  return res.status(200).json(consultations);
};

const getOne = async (req, res) => {
  if (isDemo) {
    return res.status(200).json({
      id: 1,
      fecha: "2021-05-01",
      motivo: "Dolor de cabeza",
      diagnostico: "Migraña",
      tratamiento: "Paracetamol",
      pacienteId: 1,
      createdAt: "2021-05-01T00:00:00.000Z",
      updatedAt: "2021-05-01T00:00:00.000Z",
    });
  }

  const { id } = req.params;

  const consultation = await prisma.consulta.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!consultation) {
    return res.status(404).json({
      message: "Consultation not found",
    });
  }

  return res.status(200).json(consultation);
};

const getAllFromPatient = async (req, res) => {
  if (isDemo) {
    return res.status(200).json([
      {
        id: 1,
        fecha: "2021-05-01",
        motivo: "Dolor de cabeza",
        diagnostico: "Migraña",
        tratamiento: "Paracetamol",
        pacienteId: 1,
        createdAt: "2021-05-01T00:00:00.000Z",
        updatedAt: "2021-05-01T00:00:00.000Z",
      },
      {
        id: 2,
        fecha: "2021-05-02",
        motivo: "Dolor de cabeza",
        diagnostico: "Migraña",
        tratamiento: "Paracetamol",
        pacienteId: 1,
        createdAt: "2021-05-02T00:00:00.000Z",
        updatedAt: "2021-05-02T00:00:00.000Z",
      },
    ]);
  }

  const { id } = req.params;

  const consultations = await prisma.consulta.findMany({
    where: {
      pacienteId: parseInt(id),
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!consultations) {
    return res.status(404).json({
      message: "Consultations not found",
    });
  }

  return res.status(200).json(consultations);
};

const create = async (req, res) => {
  if (isDemo) {
    return res.status(201).json({
      id: 1,
      fecha: "2021-05-01",
      motivo: "Dolor de cabeza",
      diagnostico: "Migraña",
      tratamiento: "Paracetamol",
      pacienteId: 1,
      createdAt: "2021-05-01T00:00:00.000Z",
      updatedAt: "2021-05-01T00:00:00.000Z",
    });
  }

  const consultation = req.body;

  const existingConsultation = await prisma.consulta.findFirst({
    where: {
      fecha: consultation.fecha,
      pacienteId: parseInt(consultation.pacienteId),
    },
  });

  if (existingConsultation) {
    return res.status(409).json({
      message: "Consultation already exists",
    });
  }

  const newConsultation = await prisma.consulta.create({
    data: {
      ...consultation,
      pacienteId: parseInt(consultation.pacienteId),
    },
  });

  if (!newConsultation) {
    return res.status(500).json({
      message: "Error creating consultation",
    });
  }

  return res.status(201).json(newConsultation);
};

const update = async (req, res) => {
  if (isDemo) {
    return res.status(200).json({
      id: 1,
      fecha: "2021-05-01",
      motivo: "Dolor de cabeza",
      diagnostico: "Migraña",
      tratamiento: "Paracetamol",
      pacienteId: 1,
      createdAt: "2021-05-01T00:00:00.000Z",
      updatedAt: "2021-05-01T00:00:00.000Z",
    });
  }

  const { id } = req.params;
  const consultation = req.body;

  const updatedConsultation = await prisma.consulta.update({
    where: {
      id: parseInt(id),
    },
    data: {
      ...consultation,
      pacienteId: parseInt(consultation.pacienteId),
    },
  });

  if (!updatedConsultation) {
    return res.status(404).json({
      message: "Consultation not found",
    });
  }

  return res.status(200).json(updatedConsultation);
};

const deleteOne = async (req, res) => {
  if (isDemo) {
    return res.status(200).json({
      id: 1,
      fecha: "2021-05-01",
      motivo: "Dolor de cabeza",
      diagnostico: "Migraña",
      tratamiento: "Paracetamol",
      pacienteId: 1,
      createdAt: "2021-05-01T00:00:00.000Z",
      updatedAt: "2021-05-01T00:00:00.000Z",
    });
  }

  const { id } = req.params;

  const deletedConsultation = await prisma.consulta.delete({
    where: {
      id: parseInt(id),
    },
  });

  if (!deletedConsultation) {
    return res.status(404).json({
      message: "Consultation not found",
    });
  }

  return res.status(200).json(deletedConsultation);
};

const countMonth = async (req, res) => {
  if (isDemo) {
    return res.status(200).json({
      count: 2,
    });
  }

  const count = await prisma.$queryRaw`
    SELECT COUNT(*) as count FROM Consulta
  `;
  if (!count) {
    return res.status(404).json({
      message: "Consultations not found",
    });
  }
  return res.status(200).json({
    count: Number(count[0].count),
  });
};

const averageTotal = async (req, res) => {
  if (isDemo) {
    return res.status(200).json({
      average: 2,
    });
  }
  const consultations = await prisma.$queryRaw`
    SELECT AVG(consultation_count) as average
    FROM (
      SELECT COUNT(*) as consultation_count
      FROM Consulta
    ) as consultation_count
  `;
  const average = consultations[0].average;
  if (!average) {
    return res.status(404).json({
      message: "Consultations not found",
    });
  }
  return res.status(200).json({
    average: average,
  });
};

const increaseMonth = async (req, res) => {
  if (isDemo) {
    return res.status(200).json([
      {
        timestamp: "2021-05-01",
        value: 2,
      },
    ]);
  }
  const consultations = await prisma.consulta.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
  if (!consultations) {
    return res.status(404).json({
      message: "Consultations not found",
    });
  }
  const months = consultations.reduce((acc, consultation) => {
    const date = consultation.fecha;
    if (acc[date]) {
      acc[date] += 1;
    } else {
      acc[date] = 1;
    }
    return acc;
  }, {});
  if (!months) {
    return res.status(404).json({
      message: "Consultations not found",
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
      message: "Consultations not found",
    });
  }
  return res.status(200).json(response);
};

module.exports = {
  getAll,
  getOne,
  getAllFromPatient,
  create,
  update,
  deleteOne,
  countMonth,
  averageTotal,
  increaseMonth,
};
