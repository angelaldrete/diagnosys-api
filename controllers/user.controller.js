const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const isDemo = process.env.DEMO === true || process.env.DEMO === "true";

const getAllUsers = async (req, res) => {
  if (isDemo) {
    return res.status(200).json([
      {
        id: 1,
        username: "admin",
        password: "admin",
        createdAt: "2021-05-01T00:00:00.000Z",
        updatedAt: "2021-05-01T00:00:00.000Z",
      },
      {
        id: 2,
        username: "user",
        password: "user",
        createdAt: "2021-05-01T00:00:00.000Z",
        updatedAt: "2021-05-01T00:00:00.000Z",
      },
    ]);
  }

  const users = await prisma.user.findMany();

  if (!users) {
    return res.status(404).json({
      message: "Users not found",
    });
  }

  return res.status(200).json({
    message: "Users found",
    users: users,
  });
};

const getUserById = async (req, res) => {
  if (isDemo) {
    return res.status(200).json({
      id: 1,
      username: "admin",
      password: "admin",
      createdAt: "2021-05-01T00:00:00.000Z",
      updatedAt: "2021-05-01T00:00:00.000Z",
    });
  }

  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  return res.status(200).json({
    message: "User found",
    user: user,
  });
};

const login = async (req, res) => {
  if (isDemo) {
    const token = jwt.sign(
      {
        id: 1,
        username: "admin",
        email: "",
        firstName: "Admin",
        lastName: "Admin",
      },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: 1,
        username: "admin",
        email: "",
        firstName: "Admin",
        lastName: "Admin",
      },
    });
  }

  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid password",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET
  );

  if (!token) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }

  return res.status(200).json({
    message: "Login successful",
    token: token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
};

const deleteUser = async (req, res) => {
  if (isDemo) {
    return res.status(200).json({
      message: "User deleted",
    });
  }

  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const deletedUser = await prisma.user.delete({
    where: {
      id: parseInt(id),
    },
  });

  if (!deletedUser) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }

  return res.status(200).json({
    message: "User deleted",
  });
};

const logout = async (req, res) => {
  if (isDemo) {
    return res.status(200).json({
      message: "Logout successful",
    });
  }

  return res.status(200).json({
    message: "Logout successful",
  });
};

const register = async (req, res) => {
  if (isDemo) {
    return res.status(201).json({
      message: "User created",
    });
  }

  const { firstName, lastName, username, email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (user) {
    return res.status(409).json({
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      password: hashedPassword,
    },
  });

  if (!newUser) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }

  return res.status(201).json({
    message: "User created",
  });
};

const updatePassword = async (req, res) => {
  if (isDemo) {
    return res.status(200).json({
      message: "Password updated",
    });
  }

  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid password",
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const updatedUser = await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: {
      password: hashedPassword,
    },
  });

  if (!updatedUser) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }

  return res.status(200).json({
    message: "Password updated",
    user: updatedUser,
  });
};

const updateUsername = async (req, res) => {
  if (isDemo) {
    return res.status(200).json({
      message: "Username updated",
    });
  }

  const { id } = req.params;
  const { username } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: {
      username: username,
    },
  });

  if (!updatedUser) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }

  return res.status(200).json({
    message: "Username updated",
    user: updatedUser,
  });
};

const updateEmail = async (req, res) => {
  if (isDemo) {
    return res.status(200).json({
      message: "Email updated",
    });
  }

  const { id } = req.params;
  const { newEmail } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: {
      email: newEmail,
    },
  });

  if (!updatedUser) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }

  return res.status(200).json({
    message: "Email updated",
    user: updatedUser,
  });
};

const updateName = async (req, res) => {
  if (isDemo) {
    return res.status(200).json({
      message: "Name updated",
    });
  }

  const { id } = req.params;
  const { newName, newLastName } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: parseInt(id),
    },
    data: {
      firstName: newName,
      lastName: newLastName,
    },
  });

  if (!updatedUser) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }

  return res.status(200).json({
    message: "Name updated",
    user: updatedUser,
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
  login,
  logout,
  register,
  updatePassword,
  updateUsername,
  updateEmail,
  updateName,
};
