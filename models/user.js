const moment = require('moment');
const jwt = require('jwt-simple');

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

const getUserMovieData = (pId) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM `peliculas_usuarios` WHERE fk_usuario = ?', [pId], (err, rows) => {
            if (err) reject(err);
            resolve(rows)
        })
    })
}

const getUserUserData = (pIdUser, pIdAmigo) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT follow, block FROM `relacion-usuarios_usuarios` WHERE fk_usuario = ? && fk_amigo = ?', [pIdUser.id, pIdAmigo.amigo], (err, row) => {
            if (err) reject(err)
            resolve(row)
        })
    })
}


const getById = (pId) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM usuarios WHERE id = ?', [pId], (err, row) => {
            if (err) reject(err)
            resolve(row[0])
        })
    })
}

const checkUserName = (pUsuario) => {
    const user = pUsuario.usuario;
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT usuario FROM usuarios WHERE usuario = ?', [user], (err, row) => {
            if (err) reject(err)
            resolve(row[0])
        })
    });
}

const createToken = (pUsuario) => {
    let payload = {
        usuarioId: pUsuario.id,
        createdAt: moment().unix(),
        expiresAt: moment().add(5, 'days').unix()
    }
    return jwt.encode(payload, process.env.TOKEN_KEY, 'HS256');
}


const checkMail = (pUsuario) => {
    const email = pUsuario.mail;
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT mail FROM usuarios WHERE mail = ?', [email], (err, row) => {
            if (err) reject(err)
            resolve(row[0])
        })
    });
}

const guardarUsuario = ({ nombre, apellidos, fechaNacimiento, mail, password, avatar, usuario, cita }) => {
    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO usuarios (nombre, apellidos, fechaNacimiento, mail, password, avatar, usuario, cita) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [nombre, apellidos, fechaNacimiento, mail, password, avatar, usuario, cita], (err, res) => {
            if (err) reject(err)
            resolve(res)
        })
    })
}

const getByMail = ({ mail, password }) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT `id`, `mail`, `password`, `usuario` FROM usuarios WHERE mail = ?', [mail], (err, res) => {
            if (err) reject(err)
            resolve(res)
        })
    })
}


const getChat = (pPost) => {

    return prom = new Promise((resolve, reject) => {
        db.query('SELECT post, autor, fecha FROM `chat-usuarios_usuarios` WHERE (fk_usuario = ? && fk_amigo = ?) OR (fk_usuario = ? && fk_amigo = ?)', [pPost.idUsuario, pPost.idItem, pPost.idItem, pPost.idUsuario], (err, rows) => {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

const savePost = (pPost) => {

    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO `chat-usuarios_usuarios` (fk_usuario, fk_amigo, post, autor, fecha) VALUES (?, ?, ?, ?, ?)', [pPost.idUsuario, pPost.idItem, pPost.post, pPost.nombreUsuario, pPost.fecha], (err, res) => {
            if (err) reject(err)
            resolve(res)
        })
    })
}

const followUser = (pFollow) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM `relacion-usuarios_usuarios` WHERE (fk_usuario = ? && fk_amigo = ?)', [pFollow.usuario, pFollow.amigo], (err, res) => {
            if (err) reject(err)
            resolve(res)
        });
    });
}
const insertFollow = (pFollow) => {
    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO `relacion-usuarios_usuarios` (fk_usuario, fk_amigo, follow) VALUES (?, ?, ?)', [pFollow.usuario, pFollow.amigo, pFollow.accion], (err, res) => {
            if (err) reject(err)
            resolve(res)
        });
    });
}
const updateFollow = (pFollow) => {
    return prom = new Promise((resolve, reject) => {
        db.query('UPDATE `relacion-usuarios_usuarios` SET follow = ? WHERE (fk_usuario = ? && fk_amigo = ?)', [pFollow.accion, pFollow.usuario, pFollow.amigo], (err, res) => {
            if (err) reject(err)
            resolve(res)
        });
    });
}

const blockUser = (pBlock) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM `relacion-usuarios_usuarios` WHERE (fk_usuario = ? && fk_amigo = ?)', [pBlock.usuario, pBlock.amigo], (err, res) => {
            if (err) reject(err)
            resolve(res)
        });
    });
}
const insertBlock = (pBlock) => {
    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO `relacion-usuarios_usuarios` (fk_usuario, fk_amigo, block) VALUES (?, ?, ?)', [pBlock.usuario, pBlock.amigo, pBlock.accion], (err, res) => {
            if (err) reject(err)
            resolve(res)
        });
    });
}
const updateBlock = (pBlock) => {
    return prom = new Promise((resolve, reject) => {
        db.query('UPDATE `relacion-usuarios_usuarios` SET block = ? WHERE (fk_usuario = ? && fk_amigo = ?)', [pBlock.accion, pBlock.usuario, pBlock.amigo], (err, res) => {
            if (err) reject(err)
            resolve(res)
        });
    });
}

const getAmigos = (pId) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT `usuarios`.* FROM `usuarios`, `relacion-usuarios_usuarios` WHERE `usuarios`.id = `relacion-usuarios_usuarios`.fk_amigo && `relacion-usuarios_usuarios`.fk_usuario = ? &&  `relacion-usuarios_usuarios`.follow = 1', [pId.id], (err, res) => {
            if (err) reject(err)
            resolve(res)
        });
    });
}


module.exports = {
    getAll: getAll,
    createToken: createToken,
    getUserMovieData: getUserMovieData,
    getUserUserData: getUserUserData,
    getById: getById,
    checkUserName: checkUserName,
    checkMail: checkMail,
    guardarUsuario: guardarUsuario,
    getByMail: getByMail,
    getChat: getChat,
    savePost: savePost,
    followUser: followUser,
    blockUser: blockUser,
    insertBlock: insertBlock,
    updateBlock: updateBlock,
    insertFollow: insertFollow,
    updateFollow: updateFollow,
    getAmigos: getAmigos
}
