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
        res.json({
          'alerta': true,
          'token': null
        });
      } else {
        const iguales = bcrypt.compareSync(req.body.password, row[0].password)
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
    .catch((err) => console.log(err))
})


// NUEVO USUARIO
router.post('/new', async (req, res) => {
  const user = await User.checkUserName(req.body)
  const email = await User.checkMail(req.body)

  if (user === undefined && email === undefined) {
    req.body.password = bcrypt.hashSync(req.body.password, 10)

    await User.guardarUsuario(req.body)
    res.json({ 'user': false, 'email': false })
  }
  else if (user === undefined && email !== undefined) {
    res.json({
      'user': false,
      'email': true
    })
  }
  else if (user !== undefined && email === undefined) {
    res.json({
      'user': true,
      'email': false
    })
  }
  else if (user !== undefined && email !== undefined) {
    res.json({
      'user': true,
      'email': true
    })
  }

})


// AVATARES
router.get('/avatares', async (req, res) => {
  let avatar = await User.getAvatares()

  res.json(avatar)
})


// ACTUALIZAR DATOS DE USUARIO 
router.post('/updateUser', async (req, res) => {
  const userId = await middlewares.checkToken(req);

  let resultado = await User.updateProfile(req.body, userId)

  res.send(resultado)
})


// BUSCAR DATOS USUARIO PRINCIPAL POR TOKEN
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

  const relacion = await User.getUserUserData(datosUsuario, req.body)
  const relacion2 = await User.getUserUserData({ id: req.body.amigo }, { amigo: datosUsuario.id })

  if (relacion[0] == undefined && relacion2[0] == undefined) {
    res.json({
      follow: 0,
      block: 0,
      amigoFollow: 0,
      amigoBlock: 0
    })
  }
  if (relacion[0] == undefined && relacion2.length != 0) {
    res.json({
      follow: 0,
      block: 0,
      amigoFollow: relacion2[0].follow,
      amigoBlock: relacion2[0].block
    })
  }
  if (relacion[0].length != 0 && relacion2[0] == undefined) {
    res.json({
      follow: relacion[0].follow,
      block: relacion[0].block,
      amigoFollow: 0,
      amigoBlock: 0
    })
  }
  if (relacion[0].length != 0 && relacion2.length != 0) {
    res.json({
      follow: relacion[0].follow,
      block: relacion[0].block,
      amigoFollow: relacion2[0].follow,
      amigoBlock: relacion2[0].block
    })
  }
})


// FOLLOW
router.post('/follow/', async (req, res) => {
  const userId = await middlewares.checkToken(req);
  const datosUsuario = await User.getById(userId);

  let follow = {
    usuario: datosUsuario.id,
    amigo: req.body.amigo,
    accion: req.body.accion
  };

  const checkInsertUpdate = await User.followUser(follow)

  if (checkInsertUpdate.length === 1) {
    let resultado = await User.updateFollow(follow);
  }
  else {
    resultado = await User.insertFollow(follow);
  }
  res.send(resultado)
})


// BLOQUEAR
router.post('/block/', async (req, res) => {

  const userId = await middlewares.checkToken(req);
  const datosUsuario = await User.getById(userId);

  let block = {
    usuario: datosUsuario.id,
    amigo: req.body.amigo,
    accion: req.body.accion
  };

  const checkInsertUpdate = await User.checkBlockedUser(block)

  // desbloquear a un usuario
  if (block.accion == 0) {
    if (checkInsertUpdate.length === 1) {
      let resultado = await User.updateBlock(block)
    }
    else {
      resultado = await User.insertBlock(block)
    }
  }

  // bloquear a un usuario y que el bloqueado deje de seguire
  else {
    if (block.accion == 1) {
      if (checkInsertUpdate.length === 1) {
        resultado = await User.updateBlock(block)
      }
      else {
        resultado = await User.insertBlock(block)
      }

      follow = {
        usuario: req.body.amigo,
        amigo: datosUsuario.id,
        accion: 0
      };

      const checkInsertUpdate2 = await User.followUser(follow);
      if (checkInsertUpdate2.length === 1) {
        resultado = await User.updateFollow(follow)
      }
      else {
        resultado = await User.insertFollow(follow)
      }
    }
    res.send(resultado)
  }
})


// BUSCAR AMIGOS 
router.get('/amigos', async (req, res) => {
  const userId = await middlewares.checkToken(req);
  const datosUsuario = await User.getById(userId);

  const resultado = await User.getAmigos(datosUsuario)
  res.send(resultado)
})


// BUSCAR AMIGOS DEL AMIGO
router.post('/amigosDeAmigo', async (req, res) => {
  const datosUsuario = await User.getById(req.body.idAmigo);
  const resultado = await User.getAmigos(datosUsuario)

  res.send(resultado)
})


// BUSCAR USUARIOS BLOQUEADOS
router.get('/bloqueados', async (req, res) => {
  const userId = await middlewares.checkToken(req);
  const datosUsuario = await User.getById(userId);

  const resultado = await User.getBloqueados(datosUsuario);
  res.send(resultado);

})


// BUSCAR UN USUARIO POR ID
router.get('/:pId', async (req, res) => {
  const idUsuario = await middlewares.checkToken(req);
  const idAmigo = req.params.pId;
  const datosAmigo = await User.getById(idAmigo)

  if (datosAmigo != undefined) {

    let amigo = {
      usuario: datosAmigo.usuario,
      avatar: datosAmigo.avatar,
      cita: datosAmigo.cita
    }

    const datosPeliculas = await User.getUserMovieData(idAmigo)
    const calculos = Movie.calcularDatosPeliculas(datosPeliculas)

    amigo.peliculasPuntuadas = calculos.peliculasPuntuadas;
    amigo.peliculasPendientes = calculos.peliculasPendientes;
    amigo.puntuacionMedia = calculos.puntuacionMedia;

    res.send(amigo);

    const checkRelacionUsuarios = await User.getUserUserData({ id: idUsuario }, { amigo: idAmigo })

    const fechaVisita = moment().format('YYYY-MM-DD HH:mm.ss');

    if (checkRelacionUsuarios.length == 0) {
      User.insertVisitDate(idUsuario, idAmigo, fechaVisita)
    } else {
      User.updateVisitDate(idUsuario, idAmigo, fechaVisita)
    }

  }
  else {
    res.send([])
  }
})

module.exports = router;
