const jwt = require('jsonwebtoken');
const db = require("../models");

module.exports = {
  getUserByToken: async (token) => {
    const decoded = jwt.verify(token, 'sM4rTR3c1P3');
    const user = await db.users.findOne({id: decoded.id})

    return user
  }
}