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
        idItem: parseInt(req.body.iditem),
        categoria: req.body.categoria
    };

    if (post.categoria === 'usuario') {
        await User.getChat(post)
            .then(rows => {
                for (row of rows) {
                    row = General.changeDateFormatDateTime(row);
                };
                res.send(rows)
            })
            .catch(err => console.log('devolucion error', err))
    } else if (post.categoria === 'pelicula') {
        await Movie.getChat(post)
            .then(rows => {
                for (row of rows) {
                    row = General.changeDateFormatDateTime(row);
                };
                res.send(rows)
            })
            .catch(err => console.log('devolucion error', err))
    } else if (post.categoria === 'cine') {
        await Theater.getChat(post)
            .then(rows => {
                for (row of rows) {
                    row = General.changeDateFormatDateTime(row);
                }
                res.send(rows);
            })
            .catch(err => console.log('devolucion error', err))
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
        await User.savePost(post)
            .then(rows => res.send(rows))
            .catch(err => console.log('devolucion error', err))
    } else if (req.body.categoria === 'pelicula') {
        await Movie.savePost(post)
            .then(rows => res.send(rows))
            .catch(err => console.log('devolucion error', err))
    } else if (req.body.categoria === 'cine') {
        await Theater.savePost(post)
            .then(rows => res.send(rows))
            .catch(err => console.log('devolucion error', err))
    }
})






module.exports = router;