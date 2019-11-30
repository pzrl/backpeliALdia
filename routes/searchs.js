var express = require('express');
var router = express.Router();

const Search = require('../models/search');

// GET localhost:3000/search/:pSearch
router.get('/:pSearch', (req, res) => {
    console.log(req.params.pSearch)
    Search.getSearch(req.params.pSearch)
        .then(result => {
            console.log('el resultado', result)
            res.send(result);
        })
        .catch(err => {
            console.log('error en searchs route', err);
        });
})


module.exports = router;