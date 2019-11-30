var express = require('express');
var router = express.Router();

const Movie = require('../models/movie');


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


// POST localhost:3000/movies/mark

router.post('/mark', async (req, res) => {
    const row = await Movie.checkMovieUser(req.body)
    console.log(row[0])
    if (row[0] === undefined) {
        Movie.insertMark(req.body)
    } else {
        Movie.updateMark(req.body)
    }
    res.send(row);
})

// POST localhost:3000/movies/pendiente

router.post('/pendiente', async (req, res) => {
    const row = await Movie.checkMovieUser(req.body)
    console.log('Esto es lo que SALE', row)
    console.log('devuelve algo', row !== undefined)
    if (row === undefined) {
        Movie.insertToSee(req.body)
    } else {
        console.log('entra aqui?') // SI
        Movie.updateToSee(req.body)
    }
    res.send(row);
})


module.exports = router;