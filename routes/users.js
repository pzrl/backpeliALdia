var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const moment = require('moment');

const User = require('../models/user');

// LOGIN

router.post('/login', (req, res) => {
  User.getByMail(req.body)
    .then((row) => {
      if (row.length !== 1) {
        console.log('Error en el usuario');
        res.send({ error: 'Usuario y/o password incorrecto' });
      } else {

        const iguales = bcrypt.compareSync(req.body.password, row[0].password);
        console.log('iguales: ', iguales)
        if (iguales) {
          console.log('login correcto')
          res.json({ 'exito': row[0].usuario });
        } else {
          console.log('El check devuelve un usuario, pero el password es incorrecto')
          res.send({ error: 'Usuario y/o password incorrecto' });
        }
      }
    })
    .catch((err) => {
      console.log(err)
    })
})

/* const createToken = (user) => {
  let payload = {
    userId: user.id,
    createdAt: moment().unix(),
    expiresAt: moment().add(7, 'days').unix()
  }
  console.log('proces', process.env.TOKEN_KEY);
  return jwt.encode(payload, process.env.TOKEN_KEY);
} */


// NUEVO USUARIO

router.post('/new', async (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password, 10)

  const result = await User.guardarUsuario(req.body)
})


// BUSCAR UN USUARIO
router.get('/:pId', (req, res) => {
  User.getById(req.params.pId)
    .then((result) => {
      console.log(result)
      res.send(result)
    }).catch((err) => {
      console.log(err)
    });
})

router.post('/:pId', (req, res) => {
  User.getById(req.params.pId)
    .then((row) => {
      res.send(row)
    }).catch((err) => {
      console.log(err)
    })
})


// TODOS LOS USUARIOS
/* router.get('/', (req, res) => {
  User.getAll()
    .then((rows) => {
      console.log('Prueba row 0', rows[0])
    }).catch((err) => {
      console.log(err)
    });
})

router.post('/', (req, res) => {
  User.getAll()
    .then((rows) => {
      res.send(rows)
    }).catch((err) => {
      console.log(err)
    });
}) */

module.exports = router;
