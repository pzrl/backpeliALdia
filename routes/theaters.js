var express = require('express');
var router = express.Router();
const middlewares = require('./middlewares');
const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');
const Request = require('request');

const Theater = require('../models/theater');
const User = require('../models/user')
const Movie = require('../models/movie')


// OPINIONES DEL CINE
router.get('/opiniones', async (req, res) => {
    const userId = await middlewares.checkToken(req);
    const datosUsuario = await User.getById(userId);

    let post = {
        idUsuario: datosUsuario.id,
        idCine: parseInt(req.headers.idtheater)
    };

    Theater.getOpiniones(post)
        .then(rows => res.send(rows))
        .catch(err => console.log(err))
})


// DATOS DEL CINE
router.post('/theaterData', async (req, res) => {
    const theaterData = await Theater.getDatosPuntuaciones(req.body)

    let datosCine = {
        numeroPuntuaciones: theaterData.length
    }

    let puntuacion = 0;

    for (dato of theaterData) {
        puntuacion += dato.puntuacion;
    }

    datosCine.puntuacion = puntuacion / theaterData.length;
    datosCine.puntuacion = datosCine.puntuacion.toFixed(1);

    res.json(datosCine)
})

// RELACION CINE USUARIO
router.post('/userTheaterData', async (req, res) => {
    const userId = await middlewares.checkToken(req);
    const datosUsuario = await User.getById(userId);

    const resultado = await Theater.getUserTheaterData(datosUsuario, req.body);

    res.json(resultado);
})


// PUNTUAR / CAMBIAR PUNTUACIÓN CINE
router.post('/mark', async (req, res) => {
    let datosPunt = req.body;
    const userId = await middlewares.checkToken(req);
    const datosUsuario = await User.getById(userId);

    const registro = await Theater.checkMovieUser(datosPunt, datosUsuario);

    datosPunt.idUsuario = datosUsuario.id;

    if (registro[0] === undefined) {
        Theater.insertMark(datosPunt)
    } else {
        Theater.updateMark(datosPunt)
    }
    res.send(registro);
})

// MARCAR/QUITAR CINE FAVORITO
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
        resultado = await Theater.updateFavorite(follow)
    }
    else {
        resultado = await Theater.insertFavorite(follow)
    }
    res.send(resultado)
});


// HORARIOS DE LAS PELICULAS DE LOS CINES
router.post('/getTheaterSessions', async (req, res) => {
    let idCine = req.body.idCine;
    let arrCartelera = await Theater.getTheaterFilms(idCine);

    for (i = 0; i < arrCartelera.length; i++) {
        arrCartelera.sort(function (a, b) {
            a = new String(a.horario);
            b = new String(b.horario);
            return b > a ? -1 : a < b ? 1 : 0;
        });
    }

    let arrPeliculas = [];

    for (let pelicula of arrCartelera) {

        let busca = arrPeliculas.find(item => item.id === pelicula.id);
        if (busca) {
            busca.horarios.push({ horario: pelicula.horario, link: pelicula.linkEntradas })
        } else {
            let peli = { ...pelicula };
            peli.horarios = [{ horario: pelicula.horario, link: pelicula.linkEntradas }];
            arrPeliculas.push(peli)
        }
    }
    res.send(arrPeliculas);
});



// CARGAR SESIONES DE LAS PEÍCULAS DE TODOS LOS CINES PARA EL DÍA ACTUAL
router.get('/loadSessions', async (req, res) => {

    await Theater.clearTable()
    const fecha = moment().format('YYYY-MM-DD');
    const cines = await Theater.getUrls()

    let h = 0;
    const interval = setInterval(async function () {
        let arrSesiones = [];
        if (h < cines.length) {
            const response = await axios.get(cines[h].urlhorario)
            const $ = cheerio.load(response.data);
            const peliculas = $('.movie')

            for (i = 0; i < peliculas.length; i++) {
                let sesion = $('#' + peliculas[i].attribs.id + ' *[data-sess-date="' + fecha + '"] .sess-times li a')

                for (j = 0; j < sesion.length; j++) {

                    let pCine = cines[h].id;
                    let pPelicula = parseInt(peliculas[i].attribs.id.slice(2))
                    await Movie.getByIdFA(pPelicula)
                        .then((result) => {
                            if (result === undefined) { pPelicula = null; }
                            else { pPelicula = result.id; }
                        }).catch((err) => {
                            console.log(err)
                        });

                    let pHorario = sesion[j].children[0].data;
                    let pUrlCine = sesion[j].attribs.href;
                    console.log({ cine: pCine, pelicula: pPelicula, horario: pHorario, urlCine: pUrlCine })
                    arrSesiones.push({ cine: pCine, pelicula: pPelicula, horario: pHorario, urlCine: pUrlCine })
                }
            }

            for (sesion of arrSesiones) {

                if (sesion.pelicula !== null) {
                    Theater.insertSessions(sesion)
                        .then((result) => {
                            res.send(result)
                        }).catch((err) => {
                            console.log(err)
                        });
                }
            }
            h++
        } else {
            console.log('FIN')
            clearInterval(interval)
        }
    }, 1000)
})


// CINE MÁS CERCANO
router.post('/closerTheater', async (req, res) => {
    const ubicacionUsuario = req.body;
    let ubicacionCines = await Theater.getTheatersPosition();
    ubicacionCines = ubicacionCines.filter(ubicacion => ubicacion.latitud !== null && ubicacion.longitud !== null)

    let arrDistancia = [];
    for (ubicacion of ubicacionCines) {
        latitude = ubicacion.latitud - ubicacionUsuario.latitud;
        longitude = ubicacion.longitud - ubicacionUsuario.longitud;
        distance = Math.sqrt(Math.pow(latitude, 2) + Math.pow(longitude, 2))
        arrDistancia.push({ idCine: ubicacion.id, nombre: ubicacion.nombre, distancia: distance })
    }
    let cineCercano = { id: 0, distancia: 1000 }

    for (cine of arrDistancia) {
        if (cineCercano.distancia > cine.distancia) {
            cineCercano.id = cine.idCine;
            cineCercano.nombre = cine.nombre;
            cineCercano.distancia = cine.distancia;
        }
    }
    res.json(cineCercano)
})


// LISTA CINES FAVORITOS
router.get('/cinesFavoritos', async (req, res) => {
    const userId = await middlewares.checkToken(req);
    const datosUsuario = await User.getById(userId);

    const cines = await Theater.getCinesFavoritos(datosUsuario)
    res.send(cines)
})


// CINES FAVORITOS DEL AMIGO
router.post('/cinesFavoritosAmigo', async (req, res) => {
    const datosUsuario = await User.getById(req.body.idAmigo);
    let datos = await Theater.getCinesFavoritos(datosUsuario);

    res.send(datos)
})


// FICHA DEL CINE
router.get('/:pId', (req, res) => {
    Theater.getById(req.params.pId)
        .then((result) => {
            res.send(result)
        }).catch((err) => {
            console.log(err)
        });
})


module.exports = router;