var express = require('express');
var router = express.Router();
const middlewares = require('./middlewares');
const moment = require('moment');

const Movie = require('../models/movie');
const User = require('../models/user')
const General = require('../models/general')



router.post('/userData', async (req, res) => {
    const userId = await middlewares.checkToken(req);
    const datosUsuario = await User.getById(userId);

    const datosPeliculaUsuario = await Movie.checkMovieUser(req.body, datosUsuario);
    console.log('userdata', datosPeliculaUsuario)
    res.send(datosPeliculaUsuario);
})


// POST localhost:3000/movies/mark

router.post('/mark', async (req, res) => {

    let datosPunt = req.body;
    const userId = await middlewares.checkToken(req);
    const datosUsuario = await User.getById(userId);

    const registro = await Movie.checkMovieUser(datosPunt, datosUsuario);

    datosPunt.idUsuario = datosUsuario.id;
    datosPunt.fechaPuntuacion = moment().format('YYYY-MM-DD HH:mm.ss');

    console.log('LA ROW', registro)

    if (registro[0] === undefined) {
        Movie.insertMark(datosPunt)
    } else {
        Movie.updateMark(datosPunt)
    }
    res.send(registro);
})

// POST localhost:3000/movies/pendiente

router.post('/pendiente', async (req, res) => {

    let pendiente = req.body;
    const userId = await middlewares.checkToken(req);
    const datosUsuario = await User.getById(userId);

    const registro = await Movie.checkMovieUser(pendiente, datosUsuario)

    pendiente.idUsuario = datosUsuario.id

    console.log('entra en pendiente', registro)
    if (registro[0] === undefined) {
        Movie.insertToSee(pendiente)
    } else {
        Movie.updateToSee(pendiente)
    }
    res.send(registro);
})

// GET localhost:3000/movies/search/:pSearch
router.get('/search/:pSearch', (req, res) => {
    Movie.getMovieSearch(req.params.pSearch)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log('error en movie route');
        });
})

// GET localhost:3000/movies/seenMovies/
router.post('/seenMovies', async (req, res) => {
    const userId = await middlewares.checkToken(req);
    const arrPeliculas = await Movie.getSeenMovies(userId)

    arrPeliculas.sort(function (a, b) {
        a = new Date(a.fechapuntuacion);
        b = new Date(b.fechapuntuacion);
        return a > b ? -1 : a < b ? 1 : 0;
    });

    for (pelicula of arrPeliculas) {
        pelicula.fechapuntuacion = General.changeDateFormatDiaMes(pelicula.fechapuntuacion)
    }

    res.send(arrPeliculas)
});

router.post('/toSeeMovies', async (req, res) => {
    const userId = await middlewares.checkToken(req);
    const arrPeliculas = await Movie.getToSeeMovies(userId)

    res.send(arrPeliculas)
})

// GET localhost:3000/movies/pId
router.get('/:pId', (req, res) => {
    Movie.getById(req.params.pId)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log('error en movie route');
        });
})



module.exports = router;