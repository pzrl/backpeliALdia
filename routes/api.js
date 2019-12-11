const express = require('express');
const router = express.Router();
const Request = require('request');
const axios = require('axios');
const cheerio = require('cheerio');

const Movie = require('../models/movie')


async function getCinema(pUrl) {

}

// Reverse geocode para sacar las coordenadas por la direccion



router.get('/cogerPeliculas', async (req, res) => {
    console.log('ENTRA EN LA API!!!!!!!!!!!!!!!!!!!')

    for (i = 270000; i <= 270100; i++) {
        console.log('ENTRA EN EL FOR', 'https://api-filmaffinity.herokuapp.com/api/pelicula/' + i)
        Request.get('https://api-filmaffinity.herokuapp.com/api/pelicula/' + i, async (error, response, body) => {
            console.log('ENTRA EN LA REQUEST')
            if (error) {
                return console.dir(error);
            }
            console.dir(JSON.parse(body));
            const pelicula = JSON.parse(body);
            let repetida = false
            console.log('pelicula antes del check', pelicula)

            await Movie.checkMovie(pelicula)
                .then(res => {
                    console.log('resultado del check', res.length)
                    if (res.legnth === 0) {
                        repetida = false;
                        console.log('dice que esta NO repaetida', repetida)
                    }
                    if (res.legnth === 0) {
                        repetida = true;
                        console.log('dice que esta repaetida', repetida)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            console.log(pelicula)

            /* if (repetida === false) {
                await Movie.insertMovie(pelicula)
                    .then(res => {
                        console.log('PA LA BASE DE DATOS!!!!!!!!!!!!!!!!!!!', res)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } */
        });
    }
})


module.exports = router;

