
const jwt = require('jwt-simple');
const moment = require('moment');

const User = require('../models/user');

const checkToken = (req, res, next) => {

    if (!req.headers.usertoken) {
        return res.json({ error: 'Tienes que incliuir la cabecera user-token' })
    } else {
        const token = req.headers.usertoken;
        let payload = null;
         try {
            payload = jwt.decode(token, process.env.TOKEN_KEY, 'HS256');
            return (payload.usuarioId)
        } catch (err) {
            return res.json({ error: 'El token es inválido' })
        }
        if (moment().unix() > payload.expiresAt) {
            return res.json({ error: 'El token está caducado. Pide otro.' })
        }
        next();
    }
}

module.exports = {
    checkToken: checkToken
}