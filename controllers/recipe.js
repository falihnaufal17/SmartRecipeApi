const db = require('../models');
const Validator = require('validatorjs');
const Recipe = db.recipes;

// const host = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:3000' : 'https://smartrecipeapi.kevinpratamasinaga.my.id'
const host = 'https://smartrecipeapi.kevinpratamasinaga.my.id'

exports.create = async (req, res) => {
  const {title, ingredients, equipments, instructions, video_url} = req.body
  const {file} = req
  const rules = {
    title: 'required',
    ingredients: 'required',
    equipments: 'required',
    instructions: 'required',
    thumbnail: 'required',
    video_url: 'required'
  }
  const payload = {
    title,
    ingredients,
    equipments,
    instructions,
    video_url,
    thumbnail: `${host}/recipe-images/${file.filename}`
  }
  const validation = new Validator(payload, rules)

  if (validation.fails()) {
    return res.status(400).json({
      'success': false,
      'message': 'Form invalid',
      'data': validation.errors
    })
  }


  try {
    await Recipe.create(payload)

    return res.status(201).json({
      'success': true,
      'message': 'Berhasil menambahkan resep masakan!',
      'data': payload
    })
  } catch (e) {
    return res.status(500).json({
      'success': false,
      'message': `Terjadi kesalahan pada server: ${e.message}`,
      'data': null
    })
  }
}

exports.update = async (req, res) => {
  const {title, ingredients, equipments, instructions, video_url} = req.body
  const {file} = req
  const {id} = req.params //recipe id
  const rules = {
    title: 'required',
    ingredients: 'required',
    equipments: 'required',
    instructions: 'required',
    thumbnail: 'required|string',
    video_url: 'required',
    id: 'numeric'
  }
  const data = await Recipe.findOne({where: {id}})
  const payload = {
    title,
    ingredients,
    equipments,
    instructions,
    video_url
  }
  
  if (file) {
    payload.thumbnail = `${host}/recipe-images/${file.filename}`
  } else {
    payload.thumbnail = data.thumbnail
  }
  const validation = new Validator({...payload, id}, rules)

  if (validation.fails()) {
    return res.status(400).json({
      'success': false,
      'message': 'Form invalid',
      'data': validation.errors
    })
  }

  try {
    await Recipe.update(payload, {
      where: {
        id
      }
    })

    return res.status(200).json({
      'success': true,
      'message': 'Berhasil mengubah resep masakan!',
      'data': payload
    })
  } catch (e) {
    return res.status(500).json({
      'success': false,
      'message': `Terjadi kesalahan pada server: ${e.message}`,
      'data': null
    })
  }
}