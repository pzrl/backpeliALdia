var express = require('express');
var router = express.Router();
const middlewares = require('./middlewares');
const moment = require('moment');

const User = require('../models/user');
const Movie = require('../models/movie');
const Theater = require('../models/theater');
const General = require('../models/general')


// RECOGER CHAT
router.post('/get', async (req, res) => {
    const userId = await middlewares.checkToken(req);
    const datosUsuario = await User.getById(userId);

    let post = {
        idUsuario: datosUsuario.id,
        idItem: req.body.iditem,
        categoria: req.body.categoria
    };

    if (post.categoria === 'usuario') {
        let rows = await User.getChat(post)
        for (row of rows) {
            row = General.changeDateFormatDateTime(row);
        };
        res.json({
            id: userId,
            posts: rows
        })
    }
    else if (post.categoria === 'pelicula') {
        let rows = await Movie.getChat(post)
        for (row of rows) {
            row = General.changeDateFormatDateTime(row);
        };
        res.json({
            id: userId,
            posts: rows
        })
    }
    else if (post.categoria === 'cine') {
        let rows = await Theater.getChat(post)
        for (row of rows) {
            row = General.changeDateFormatDateTime(row);
        }
        res.json({
            id: userId,
            posts: rows
        })
    }
})


// GUARDAR UN POST
router.post('/save', async (req, res) => {
    const userId = await middlewares.checkToken(req);
    const datosUsuario = await User.getById(userId);

    let post = {
        idUsuario: datosUsuario.id,
        nombreUsuario: datosUsuario.usuario,
        idItem: req.body.iditem,
        post: req.body.post,
        fecha: moment().format('YYYY-MM-DD HH:mm.ss')
    }

    if (req.body.categoria === 'usuario') {
        rows = await User.savePost(post)
    }
    else if (req.body.categoria === 'pelicula') {
        rows = await Movie.savePost(post)
    }
    else if (req.body.categoria === 'cine') {
        rows = await Theater.savePost(post)
    }
    res.send(rows)
})


// EDITAR POST
router.post('/edit', async (req, res) => {
    if (req.body.categoria === 'usuario') {
        rows = await User.editPost(req.body)
    }
    else if (req.body.categoria === 'pelicula') {
        rows = await Movie.editPost(req.body)
    }
    else if (req.body.categoria === 'cine') {
        rows = await Theater.editPost(req.body)
    }
    res.send(rows)
})


// ELIMINAR POST
router.post('/delete', async (req, res) => {
    if (req.body.categoria === 'usuario') {
        rows = await User.deletePost(req.body.idPost)
    }
    else if (req.body.categoria === 'pelicula') {
        rows = await Movie.deletePost(req.body.idPost)
    }
    else if (req.body.categoria === 'cine') {
        rows = await Theater.deletePost(req.body.idPost)
    }
    res.send(rows)
})

module.exports = router;