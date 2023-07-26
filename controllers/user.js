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
      message: "Nama pengguna tidak boleh kosong!",
    });
    return;
  }

  if (!req.body.password || req.body.password.length === 0) {
    res.status(400).send({
      message: "Kata sandi tidak boleh kosong!",
    });
    return;
  }

  if (existUser) {
    res.status(400).send({
      message: "Nama pengguna sudah terdaftar!",
    });
    return;
  }

  // Create account
  const payload = {
    fullname: req.body.fullname,
    username: req.body.username,
    password: await bcrypt.hash(req.body.password, salt),
  };

  // Save account in the database
  try {
    const data = await User.create(payload);

    res.send(data);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Terjadi kesalahan saat membuat akun",
    });
  }
};

// Find a single User with an id
exports.findOne = async (req, res) => {
  if (!req.body.username || req.body.username.length === 0) {
    res.status(400).send({
      message: "Nama pengguna tidak boleh kosong!",
    });
    return;
  }

  if (!req.body.password || req.body.password.length === 0) {
    res.status(400).send({
      message: "Kata sandi tidak boleh kosong!",
    });
    return;
  }

  // Find User in the database
  try {
    const user = await User.findOne({ where: { username: req.body.username }});

    if (!user) {
      return res.status(400).json({message: "Akun tidak terdaftar"})
    }

    const password_valid = await bcrypt.compare(req.body.password, user?.password);
    
    if (password_valid) {
      const accessToken = jwt.sign({ "id": user?.id, "username": user?.username, "fullname": user?.fullname }, 'sM4rTR3c1P3');
      delete user?.password
      
      const {id, fullname, username} = user

      res.status(200).json({
        success: true,
        message: 'Berhasil login!',
        data: {
          id,
          fullname,
          username,
          accessToken
        }
      });
    } else {
      res.status(400).json({ message:  "Password tidak sesuai" });
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).send({
      message: error.message || "Terjadi kesalahan saat mencari akun",
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
      message: error.message || "Terjadi kesalahan saat menghapus akun",
    });
  }
};
