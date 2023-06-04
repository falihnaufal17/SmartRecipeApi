const db = require("../models");
const bcrypt = require("bcrypt");
const User = db.users;
const jwt = require('jsonwebtoken');

// Create and Save a new User
exports.create = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  // Validate request
  const existUser = await User.findOne({
    where: {
      username: req.body.username,
    },
  });

  if (!req.body.fullname || req.body.fullname.length === 0) {
    res.status(400).send({
      message: "Nama lengkap harus diisi!",
    });
    return;
  }

  if (!req.body.username || req.body.username.length === 0) {
    res.status(400).send({
      message: "Username tidak boleh kosong!",
    });
    return;
  }

  if (!req.body.password || req.body.password.length === 0) {
    res.status(400).send({
      message: "Password tidak boleh kosong!",
    });
    return;
  }

  if (existUser) {
    res.status(400).send({
      message: "Username sudah terdaftar!",
    });
    return;
  }

  // Create a User
  const payload = {
    fullname: req.body.fullname,
    username: req.body.username,
    password: await bcrypt.hash(req.body.password, salt),
  };

  // Save User in the database
  try {
    const data = await User.create(payload);

    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while creating the User.",
    });
  }
};

// Find a single User with an id
exports.findOne = async (req, res) => {
  if (!req.body.username || req.body.username.length === 0) {
    res.status(400).send({
      message: "Username tidak boleh kosong!",
    });
    return;
  }

  if (!req.body.password || req.body.password.length === 0) {
    res.status(400).send({
      message: "Password tidak boleh kosong!",
    });
    return;
  }

  // Find User in the database
  try {
    const user = await User.findOne({ username: req.body.username });
    const password_valid = await bcrypt.compare(req.body.password, user.password);

    if (password_valid) {
      const accessToken = jwt.sign({ "id": user.id, "username": user.username, "fullname": user.fullname }, 'sM4rTR3c1P3');
      delete user.password
      
      const {id, fullname, username} = user

      res.status(200).json({
        success: true,
        message: 'Login Success',
        data: {
          id,
          fullname,
          username,
          accessToken
        }
      });
    } else {
      res.status(400).json({ error: "Password Incorrect" });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while finding the User.",
    });
  }
};

// Delete a User with the specified id
exports.delete = async (req, res) => {
  const id = req.body.id;

  try {
    const data = await User.delete(id);

    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while deleting the User.",
    });
  }
};
