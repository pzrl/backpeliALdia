
const jwt = require('jwt-simple');

const checkToken = (req, res, next) => {

    if (!req.headers.usertoken) {
        return res.json({ error: 'No user-token' })
    } else {
        const token = req.headers.usertoken;
        let payload = null;
        try {
            payload = jwt.decode(token, process.env.TOKEN_KEY, 'HS256');
            return (payload.usuarioId)
        } catch (err) {
            return res.json({ error: 'Token inválido' })
        }
    }
}

module.exports = {
    checkToken: checkToken
}