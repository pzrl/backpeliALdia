var express = require('express');
var router = express.Router();
const middlewares = require('./middlewares');

const Theater = require('../models/theater');
const User = require('../models/user')

router.get('/opiniones', async (req, res) => {
    const userId = await middlewares.checkToken(req);
    const datosUsuario = await User.getById(userId);

    let post = {
        idUsuario: datosUsuario.id,
        idCine: parseInt(req.headers.idtheater)
    };

    Theater.getOpiniones(post)
        .then(rows => {
            res.send(rows)
        }).catch(err => {
            console.log('devolucion error', err)
        })

})

router.post('/userTheaterData', async (req, res) => {
    const userId = await middlewares.checkToken(req);
    const datosUsuario = await User.getById(userId);

    await Theater.getUserTheaterData(datosUsuario, req.body)
        .then(result => res.json(result))
        .catch(err => console.log(err))
})

// GET localhost:3000/theaters/favorito
router.post('/favorite', async (req, res) => {
    const userId = await middlewares.checkToken(req);
    const datosUsuario = await User.getById(userId);

    let follow = {
        usuario: datosUsuario.id,
        cine: req.body.idCine,
        favorito: req.body.favorito
    };

    const checkInsertUpdate = await Theater.favoriteTheater(follow)

    if (checkInsertUpdate.length === 1) {
        await Theater.updateFavorite(follow)
            .then(result => res.send(result))
            .catch(err => console.log(err))
    }
    else {
        await Theater.insertFavorite(follow)
            .then(result => res.send(result))
            .catch(err => console.log(err))
    }
});

// GET localhost:3000/theaters/cinesFavoritos

router.get('/cinesFavoritos', async (req, res) => {

    const userId = await middlewares.checkToken(req);
    const datosUsuario = await User.getById(userId);
    console.log('los datos usuario', datosUsuario)
    await Theater.getCinesFavoritos(datosUsuario)
        .then(result => res.send(result))
        .catch(err => console.log(err))
})

// GET localhost:3000/theaters/pId
router.get('/:pId', (req, res) => {
    Theater.getById(req.params.pId)
        .then((result) => {
            res.send(result)
        }).catch((err) => {
            console.log(err)
        });
})



module.exports = router;