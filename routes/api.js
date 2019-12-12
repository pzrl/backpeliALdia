const express = require('express');
const router = express.Router();
const Request = require('request');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const Movie = require('../models/movie')


async function getCinema(pUrl) {

}

// Reverse geocode para sacar las coordenadas por la direccion

const insertDatosPelicula = (pPelicula) => {
    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO `peliculas` (link, titulo) VALUES (?, ?)', [pPelicula.url, pPelicula.titulo], (err, res) => {
            if (err) reject(err)
            console.log('el insert', res)
            resolve(res)
        });
    });
}

const getUrlPelicula = (pPelicula) => {
    return prom = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM peliculas WHERE director = ''`, (err, res) => {
            if (err) reject(err)
            /* console.log('el get', res) */
            resolve(res)
        });
    });
}

const insertImagenPelicula = (pImagen, pLink) => {
    console.log('EN EL INSERT IMAGEN', pImagen, pLink)
    return prom = new Promise((resolve, reject) => {
        db.query('UPDATE `peliculas` SET imagen = ? WHERE link = ?', [pImagen, pLink], (err, res) => {
            if (err) reject(err)
            console.log('UPDATED!!!!!!', res)
            resolve(res)

        });
    })
}



router.get('/cogerPeliculas', async (req, res) => {
    const arrPeliculas = await getUrlPelicula()

    let i = 0;
    setInterval(async function () {
        j = i;
        if (i < arrPeliculas.length) {
            console.log('la request', arrPeliculas[j].idfa)
            Request('https://api-filmaffinity.herokuapp.com/api/pelicula/' + arrPeliculas[j].idfa, (err, res, body) => {
                if (err) { return console.log(err); }
                pelicula = JSON.parse(res.body)
                console.log('la peli', pelicula)
                const exito = updateMovie(pelicula, arrPeliculas[j].idfa) // VOLVER A ACTIVAR
                console.log('A ver...', exito)
            });
        }
        i++
        console.log('i después del puto a ver...')
    }, 1000)

})


const updateMovie = (pPelicula, pId) => {
    console.log(pPelicula)
    return prom = new Promise((resolve, reject) => {
        db.query('UPDATE `peliculas` SET director = ?, sinopsis = ?, anio = ?, reparto = ? WHERE idFA = ?', [pPelicula.direccion, pPelicula.sinopsis, pPelicula.anio, pPelicula.reparto, pId], (err, res) => {
            if (err) reject(err)
            console.log('UPDATED', res)
            resolve(res)

        });
    })
}




module.exports = router;

