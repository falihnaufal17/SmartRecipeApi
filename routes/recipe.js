const recipe = require('../controllers/recipe')
const router = require('express').Router()
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/recipe-images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = file.mimetype.split('/')[1]

    cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`)
  }
})
const upload = multer({ storage })

module.exports = (app) => {
  // create new recipe
  router.post('/add', upload.single('thumbnail'), recipe.create)

  // update recipe
  router.put('/:id/update', upload.single('thumbnail'), recipe.update)

  app.use('/api/recipe', router)
}