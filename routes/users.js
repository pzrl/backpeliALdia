var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const moment = require('moment');
const middlewares = require('./middlewares');

const User = require('../models/user');
const Movie = require('../models/movie');

// LOGIN

router.post('/login', (req, res) => {
  let datosLogin = req.body;
  User.getByMail(datosLogin)
    .then((row) => {
      if (row.length !== 1) {
        res.json({ error: 'Usuario y/o password incorrecto' });
      } else {

        const iguales = (req.body.password === row[0].password);
        console.log('iguales: ', iguales)
        if (iguales) {
          const token = User.createToken(row[0])
          res.json({
            'alerta': false,
            'token': token
          });
        } else {
          res.json({
            'alerta': true,
            'token': null
          });
        }
      }
    })
    .catch((err) => {
      console.log(err)
    })
})



// NUEVO USUARIO

router.post('/new', async (req, res) => {
  const user = await User.checkUserName(req.body)
  const email = await User.checkMail(req.body)
  console.log('Después de los check', req.body);

  if (user === undefined && email === undefined) {

    /* console.log('Antes de convertir el password', req.body)

    req.body.password = bcrypt.hashSync(req.body.password, 10)

    console.log('Después de convertir el password', req.body) */

    await User.guardarUsuario(req.body)
    res.json({ 'user': false, 'email': false })
  }
  else if (user === undefined && email !== undefined) {
    res.json({ 'user': false, 'email': true })
  } else if (user !== undefined && email === undefined) {
    res.json({ 'user': true, 'email': false })
  } else if (user !== undefined && email !== undefined) {
    res.json({ 'user': true, 'email': true })
  }

})


// BUSCAR USUARIO PRINCIPAL POR TOKEN

router.get('/mainUser/', async (req, res) => {

  const userId = await middlewares.checkToken(req);
  const datosUsuario = await User.getById(userId);

  let user = {
    usuario: datosUsuario.usuario,
    avatar: datosUsuario.avatar,
    cita: datosUsuario.cita
  }

  const datosPeliculas = await User.getUserMovieData(userId)

  const calculos = Movie.calcularDatosPeliculas(datosPeliculas)

  user.peliculasPuntuadas = calculos.peliculasPuntuadas;
  user.peliculasPendientes = calculos.peliculasPendientes;
  user.puntuacionMedia = calculos.puntuacionMedia;

  res.send(user);
})

// CONSEGUIR DATOS DE USUARIO (FOLLOW Y BLOCK)

router.post('/userData/', async (req, res) => {

  const userId = await middlewares.checkToken(req);
  const datosUsuario = await User.getById(userId);

  await User.getUserUserData(datosUsuario, req.body)
    .then(result => res.json(result))
    .catch(err => console.log(err))
})

// FOLLOW

router.post('/follow/', async (req, res) => {

  const userId = await middlewares.checkToken(req);
  const datosUsuario = await User.getById(userId);

  follow = {
    usuario: datosUsuario.id,
    amigo: req.body.amigo,
    accion: req.body.accion
  };

  const checkInsertUpdate = await User.followUser(follow)

  if (checkInsertUpdate.length === 1) {
    await User.updateFollow(follow)
      .then(result => res.send(result))
      .catch(err => console.log(err))
  }
  else {
    await User.insertFollow(follow)
      .then(result => res.send(result))
      .catch(err => console.log(err))
  }

})

// BLOQUEAR

router.post('/block/', async (req, res) => {

  const userId = await middlewares.checkToken(req);
  const datosUsuario = await User.getById(userId);

  block = {
    usuario: datosUsuario.id,
    amigo: req.body.amigo,
    accion: req.body.accion
  };

  const checkInsertUpdate = await User.blockUser(block)

  if (checkInsertUpdate.length === 1) {
    await User.updateBlock(block)
      .then(result => res.send(result))
      .catch(err => console.log(err))
  }
  else {
    await User.insertBlock(block)
      .then(result => res.send(result))
      .catch(err => console.log(err))
  }
})

// BUSCAR AMIGOS 

router.get('/amigos', async (req, res) => {

  const userId = await middlewares.checkToken(req);
  const datosUsuario = await User.getById(userId);

  await User.getAmigos(datosUsuario)
    .then(result => res.send(result))
    .catch(err => console.log(err))
})


// BUSCAR UN USUARIO POR ID
router.get('/:pId', async (req, res) => {

  const datosUsuario = await User.getById(req.params.pId)

  let user = {
    usuario: datosUsuario.usuario,
    avatar: datosUsuario.avatar,
    cita: datosUsuario.cita
  }

  const datosPeliculas = await User.getUserMovieData(req.params.pId)
  const calculos = await Movie.calcularDatosPeliculas(datosPeliculas)

  user.peliculasPuntuadas = calculos.peliculasPuntuadas;
  user.peliculasPendientes = calculos.peliculasPendientes;
  user.puntuacionMedia = calculos.puntuacionMedia;

  res.send(user);
})



module.exports = router;
