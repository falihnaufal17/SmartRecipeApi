const jwt = require('jsonwebtoken');
const db = require('../models');

module.exports = {
  authorization: async (req, res, next) => {
    try {
      const token = req.headers['authorization'].split(" ")[1];
      const decoded = jwt.verify(token, 'sM4rTR3c1P3');
      const user = await db.users.findOne({username: decoded.username})

      if (user) {
        next();
      }

    } catch (err) {
      console.log(err)
      res.status(401).json({ "msg": "Couldnt Authenticate" });
    }
  }
}