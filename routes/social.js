var express = require('express');
var router = express.Router();
const middlewares = require('./middlewares');

const Social = require('../models/socialM')
const User = require('../models/user')

router.get('/seenMovies', async (req, res) => {
    const userId = await middlewares.checkToken(req);
    const datosUsuario = await User.getById(userId)

    const movies = await Social.getSeenMovies(datosUsuario.id)

    movies.sort(function (a, b) {
        a = new Date(a.fechaVista);
        b = new Date(b.fechaVista);
        return a > b ? -1 : a < b ? 1 : 0;
    });

    let lastMovies = []

    for (i = 0; i < 7 && i < movies.length; i++) {
        lastMovies.push(movies[i])
    }
    res.json(lastMovies)
})

router.get('/lastMessages', async (req, res) => {
    const userId = await middlewares.checkToken(req);
    const datosUsuario = await User.getById(userId)

    const messages = await Social.getLastMessages(datosUsuario.id)

    messages.sort(function (a, b) {
        a = new Date(a.fechaVista);
        b = new Date(b.fechaVista);
        return a > b ? -1 : a < b ? 1 : 0;
    });

    let lastMessages = []

    for (i = 0; i < 7 && i < messages.length; i++) {
        lastMessages.push(messages[i])
    }
    res.json(lastMessages)
})





module.exports = router;