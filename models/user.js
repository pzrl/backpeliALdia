const moment = require('moment');

const getAll = () => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM usuarios', (err, rows) => {
            if (err) reject(err);
            for (let row of rows) {
                row.fechaNacimiento = moment(row.fechaNacimiento).format('DD-MM-YYYY');
            };
            resolve(rows);
        });
    });
}

const getById = (pId) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM usuarios WHERE id = ?', [pId], (err, row) => {
            if (err) reject(err)
            resolve(row[0])
        })
    })
}

const guardarUsuario = ({ nombre, apellidos, fechaNacimiento, mail, password, avatar, usuario, cita }) => {
    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO usuarios (nombre, apellidos, fechaNacimiento, mail, password, avatar, usuario, cita) values (?, ?, ?, ?, ?, ?, ?, ?)', [nombre, apellidos, fechaNacimiento, mail, password, avatar, usuario, cita], (err, res) => {
            if (err) reject(err)
            resolve(res)
        })
    })
}

const getByMail = ({ mail, password }) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT `mail`, `password`, `usuario` FROM usuarios WHERE mail = ?', [mail], (err, res) => {
            if (err) reject(err)
            resolve(res)
        })
    })
}



module.exports = {
    getAll: getAll,
    getById: getById,
    guardarUsuario: guardarUsuario,
    getByMail: getByMail
}
