const express = require('express');
const router = express.Router();
 
module.exports = (app) => {
  router.get('/images', express.static('assets/images'))
  router.get('/recipe-images', express.static('assets/recipe-images'))

  app.use('/assets', router)
}