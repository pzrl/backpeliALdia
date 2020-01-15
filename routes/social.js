const express = require('express');
const router = express.Router();
const middlewares = require('./middlewares');

const Social = require('../models/socialM')
const User = require('../models/user')
const General = require('../models/general')


// PELICULAS VISTA POR AMIGOS
router.get('/seenMovies', async (req, res) => {
    const userId = await middlewares.checkToken(req);
    const datosUsuario = await User.getById(userId)

    const movies = await Social.getSeenMovies(datosUsuario.id)

    let lastMovies = []

    for (i = 0; i < 9 && i < movies.length; i++) {
        lastMovies.push(movies[i])
    }
    res.json(lastMovies)
})


// MENSAJES RECIBIDOS
router.post('/lastMessages', async (req, res) => {
    const componente = req.body.componente;
    const userId = await middlewares.checkToken(req);
    const datosUsuario = await User.getById(userId)

    const messages = await Social.getLastMessages(datosUsuario.id)

    messages.sort(function (a, b) {
        if (a.fecha > a.ultimavisita) {
            a.nuevo = true;
        } else {
            a.nuevo = false;
        }
        a = new Date(a.fecha);
        b = new Date(b.fecha);
        return a > b ? -1 : a < b ? 1 : 0;
    });

    for (message of messages) {
        message = General.changeDateFormatDateTime(message);
    };

    if (componente == 'social') {
        let lastMessages = []
        for (i = 0; i < 9 && i < messages.length; i++) {
            lastMessages.push(messages[i])
        }
        res.json(lastMessages)
    } else {
        res.json(messages)
    }
})


module.exports = router;