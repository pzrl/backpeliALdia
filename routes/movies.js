var express = require('express');
var router = express.Router();
const middlewares = require('./middlewares');
const moment = require('moment');

const Movie = require('../models/movie');
const User = require('../models/user')
const General = require('../models/general')


// DATOS PELÍCULA
router.post('/movieData', async (req, res) => {
    const movieData = await Movie.getDatosPuntuaciones(req.body)

    let datosPelicula = {
        numeroPuntuaciones: movieData.length
    }
    let puntuacion = 0;
    for (dato of movieData) {
        puntuacion += dato.puntuacion;
    }
    datosPelicula.puntuacion = puntuacion / movieData.length;
    datosPelicula.puntuacion = datosPelicula.puntuacion.toFixed(1);

    res.json(datosPelicula);
})


// DATOS PELÍCULA - USUARIO (PUNTUACIÓN - FAVORITO)
router.post('/userData', async (req, res) => {
    const userId = await middlewares.checkToken(req);
    const datosUsuario = await User.getById(userId);

    const datosPeliculaUsuario = await Movie.checkMovieUser(req.body, datosUsuario);

    res.send(datosPeliculaUsuario);
})


// PONER / ACTUALIZAR PUNTUACIÓN
router.post('/mark', async (req, res) => {
    let datosPunt = req.body;
    const userId = await middlewares.checkToken(req);
    const datosUsuario = await User.getById(userId);

    const registro = await Movie.checkMovieUser(datosPunt, datosUsuario);

    datosPunt.idUsuario = datosUsuario.id;
    datosPunt.fechaPuntuacion = moment().format('YYYY-MM-DD HH:mm.ss');

    if (registro[0] === undefined) {
        Movie.insertMark(datosPunt)
    } else {
        Movie.updateMark(datosPunt)
    }
    res.send(registro);
})


// PONER / QUITAR PELÍCULA PENDIENTE
router.post('/pendiente', async (req, res) => {
    let pendiente = req.body;
    const userId = await middlewares.checkToken(req);
    const datosUsuario = await User.getById(userId);

    const registro = await Movie.checkMovieUser(pendiente, datosUsuario)

    pendiente.idUsuario = datosUsuario.id

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
})


// PELÍCULAS VISTAS POR EL USUARIO
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


// PELÍCULAS VISTAS POR UN AMIGO
router.post('/seenMoviesFriend', async (req, res) => {
    const arrPeliculas = await Movie.getSeenMovies(req.body.idAmigo)

    arrPeliculas.sort(function (a, b) {
        a = new Date(a.fechapuntuacion);
        b = new Date(b.fechapuntuacion);
        return a > b ? -1 : a < b ? 1 : 0;
    });

    for (pelicula of arrPeliculas) {
        pelicula.fechapuntuacion = General.changeDateFormatDiaMes(pelicula.fechapuntuacion)
    }

    let arrFinal = []
    for (i = 0; i < arrPeliculas.length && i < 25; i++) {
        arrFinal.push(arrPeliculas[i])
    }

    res.send(arrFinal)
});


// PELÍCULAS PENDIENTES
router.post('/toSeeMovies', async (req, res) => {
    const userId = await middlewares.checkToken(req);
    const arrPeliculas = await Movie.getToSeeMovies(userId)

    let arrFinal = []
    for (i = 0; i < arrPeliculas.length && i < 25; i++) {
        arrFinal.push(arrPeliculas[i])
    }

    res.send(arrFinal)
})


// PELÍCULAS PENDIENTES DE UN AMIGO
router.post('/toSeeMoviesFriend', async (req, res) => {
    const arrPeliculas = await Movie.getToSeeMovies(req.body.idAmigo)

    let arrFinal = []
    for (i = 0; i < arrPeliculas.length && i < 25; i++) {
        arrFinal.push(arrPeliculas[i])
    }

    res.send(arrFinal)
})


// LISTA PRÓXIMOS ESTRENOS
router.post('/proximosEsternos', async (req, res) => {
    const userId = await middlewares.checkToken(req);
    let arrEstrenos = await Movie.getUpcomingMovies();
    const arrOcultas = await Movie.getHiddenUpcomingMovies(userId);

    if (arrOcultas.length > 0) {
        for (i = 0; i < arrOcultas.length; i++) {
            arrEstrenos = arrEstrenos.filter(estreno => estreno.id !== arrOcultas[i].fk_pelicula)
        }
    }

    arrEstrenos.sort(function (b, a) {
        a = new Date(a.fechaestreno);
        b = new Date(b.fechaestreno);
        return a > b ? -1 : a < b ? 1 : 0;
    });

    for (pelicula of arrEstrenos) {
        pelicula.fechaestreno = General.changeDateFormatDiaMes(pelicula.fechaestreno)
    }

    res.send(arrEstrenos)
})


// MARCAR ESTRENO PARA NO MOSTRARLO
router.post('/hideMovie', async (req, res) => {

    const peliculaOculta = req.body;
    const userId = await middlewares.checkToken(req);
    const datosUsuario = await User.getById(userId);

    const registro = await Movie.checkMovieUser(peliculaOculta, datosUsuario);

    peliculaOculta.idUsuario = datosUsuario.id

    if (registro[0] === undefined) {
        Movie.insertHide(peliculaOculta)
    } else {
        Movie.updateHide(peliculaOculta)
    }
})

// FICHA CINE
router.get('/:pId', (req, res) => {
    Movie.getById(req.params.pId)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
        });
})



module.exports = router;