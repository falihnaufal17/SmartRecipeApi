require("dotenv/config");
const express = require("express");
const db = require('./models')

const app = express();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded());

app.use(express.static('public'))

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Selamat datang di Smart Food Recipe API!" });
});

require("./routes/user")(app);
require("./routes/bookmark")(app);
require("./routes/clarifai")(app);
require("./routes/recipe")(app);
// require("./routes/image")(app);

db.sequelize.sync({
  force: false,
  alter: true
})

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}.`);
});
