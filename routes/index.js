var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/load', (req, res) => {
  console.log('holaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')

})


/*
let sesiones = document.getElementsByClassName('sesiones')
sesiones.addEventListener('submit', cargarSesiones)

function cargarSesiones(e) {
  console.log(input)
}
 cargarSesiones('p') */

module.exports = router;
