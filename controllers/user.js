const db = require("../models");
const User = db.users;

// Create and Save a new User
exports.create = async (req, res) => {
  // Validate request
  const existUser = await User.findOne({
    where: {
      username: req.body.username
    }
  });

  if (!req.body.fullname || req.body.fullname.length === 0) {
    res.status(400).send({
      message: "Nama lengkap harus diisi!"
    });
    return;
  }

  if (!req.body.username || req.body.username.length === 0) {
    res.status(400).send({
      message: "Username tidak boleh kosong!"
    });
    return;
  }

  if (!req.body.password || req.body.password.length === 0) {
    res.status(400).send({
      message: "Password tidak boleh kosong!"
    });
    return;
  }

  if (existUser) {
    res.status(400).send({
      message: "Username sudah terdaftar!"
    });
    return;
  }

  // Create a User
  const payload = {
    fullname: req.body.fullname,
    username: req.body.username,
    password: req.body.password
  };

  // Save User in the database

  try {
    const data = await User.create(payload);

    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while creating the User."
    });
  }
};

// Find a single User with an id
exports.findOne = (req, res) => {
  
};