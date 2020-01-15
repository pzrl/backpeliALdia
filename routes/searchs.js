var express = require('express');
var router = express.Router();

const Search = require('../models/search');

// LISTADO DE BÚSQUEDAS (PELÍCULAS, USUARIOS, CINES)
router.get('/:pSearch', async (req, res) => {
    const busqueda = await Search.getSearch(req.params.pSearch)
    res.send(busqueda)

})

module.exports = router;