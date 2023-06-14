const multer = require('multer')
var router = require("express").Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'assets/images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = file.mimetype.split('/')[1]

    cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`)
  }
})
const upload = multer({ storage })
const clarifai = require('../controllers/clarifai');
const { authorization } = require('../middleware/auth');

module.exports = (app) => {

  router.post('/detect', upload.single('image'), clarifai.detector)
  router.get('/detail/:id', authorization, clarifai.detail)

  app.use("/api/clarifai", router);
}
