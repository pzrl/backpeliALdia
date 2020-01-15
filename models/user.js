const moment = require('moment');
const jwt = require('jwt-simple');



const checkBlockedUser = (pBlock) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM `relacion-usuarios_usuarios` WHERE (fk_usuario = ? && fk_amigo = ?)', [pBlock.usuario, pBlock.amigo], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

const checkMail = (pUsuario) => {
    const email = pUsuario.mail;
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT mail FROM usuarios WHERE mail = ?', [email], (err, row) => {
            if (err) reject(err);
            resolve(row[0]);
        })
    });
}

const checkUserName = (pUsuario) => {
    const user = pUsuario.usuario;
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT usuario FROM usuarios WHERE usuario = ?', [user], (err, row) => {
            if (err) reject(err);
            resolve(row[0]);
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

const deletePost = (pId) => {
    const post = 'Este mensaje ha sido eliminado.';
    const clase = 'eliminado'
    return prom = new Promise((resolve, reject) => {
        db.query('UPDATE `chat-usuarios_usuarios` SET post = ?, clase = ? WHERE id = ?', [post, clase, pId], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

const editPost = (pPost) => {
    const clase = 'editado'
    return prom = new Promise((resolve, reject) => {
        db.query('UPDATE `chat-usuarios_usuarios` SET post = ?, clase = ? WHERE id = ?', [pPost.post, clase, pPost.id], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

const followUser = (pFollow) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM `relacion-usuarios_usuarios` WHERE (fk_usuario = ? && fk_amigo = ?)', [pFollow.usuario, pFollow.amigo], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

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

const getAmigos = (pId) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT `usuarios`.* FROM `usuarios`, `relacion-usuarios_usuarios` WHERE `usuarios`.id = `relacion-usuarios_usuarios`.fk_amigo && `relacion-usuarios_usuarios`.fk_usuario = ? &&  `relacion-usuarios_usuarios`.follow = 1', [pId.id], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

const getAvatares = () => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM `avatares`', (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

const getById = (pId) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM `usuarios` WHERE id = ?', [pId], (err, row) => {
            if (err) reject(err);
            resolve(row[0]);
        });
    });
}

const getByMail = ({ mail, password }) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT `id`, `mail`, `password`, `usuario` FROM usuarios WHERE mail = ?', [mail], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

const getChat = (pPost) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT `chat-usuarios_usuarios`.*, `usuarios`.avatar FROM `chat-usuarios_usuarios`, `usuarios` WHERE(`chat-usuarios_usuarios`.fk_usuario = ? && `chat-usuarios_usuarios`.fk_amigo = ? && `chat-usuarios_usuarios`.fk_usuario = `usuarios`.id) OR(`chat-usuarios_usuarios`.fk_usuario = ? && `chat-usuarios_usuarios`.fk_amigo = ? && `chat-usuarios_usuarios`.fk_usuario = `usuarios`.id)', [pPost.idUsuario, pPost.idItem, pPost.idItem, pPost.idUsuario], (err, rows) => {
            if (err) reject(err)
            rows.sort(function (a, b) {
                a = new Date(a.fecha);
                b = new Date(b.fecha);
                return b > a ? -1 : a < b ? 1 : 0;
            });
            resolve(rows);
        });
    });
}

const getUserMovieData = (pId) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM `peliculas_usuarios` WHERE fk_usuario = ?', [pId], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
}

const getUserUserData = (pIdUser, pIdAmigo) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM `relacion-usuarios_usuarios` WHERE fk_usuario = ? && fk_amigo = ?', [pIdUser.id, pIdAmigo.amigo], (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
}

const getBloqueados = (pId) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT `usuarios`.* FROM `usuarios`, `relacion-usuarios_usuarios` WHERE `usuarios`.id = `relacion-usuarios_usuarios`.fk_amigo && `relacion-usuarios_usuarios`.fk_usuario = ? &&  `relacion-usuarios_usuarios`.block = 1', [pId.id], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

const guardarUsuario = ({ nombre, apellidos, fechaNacimiento, mail, password, avatar, usuario, cita }) => {
    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO usuarios (nombre, apellidos, fechaNacimiento, mail, password, avatar, usuario, cita) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [nombre, apellidos, fechaNacimiento, mail, password, avatar, usuario, cita], (err, res) => {
            if (err) reject(err);
            resolve(res);
        })
    })
}

const insertFollow = (pFollow) => {
    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO `relacion-usuarios_usuarios` (fk_usuario, fk_amigo, follow) VALUES (?, ?, ?)', [pFollow.usuario, pFollow.amigo, pFollow.accion], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

const insertVisitDate = (pIdUsuario, pIdAmigo, pFechaVisita) => {
    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO `relacion-usuarios_usuarios` (fk_usuario, fk_amigo, ultimavisita) VALUES (?, ?, ?)', [pIdUsuario, pIdAmigo, pFechaVisita], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

const insertBlock = (pBlock) => {
    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO `relacion-usuarios_usuarios` (fk_usuario, fk_amigo, block, follow) VALUES (?, ?, ?, 0)', [pBlock.usuario, pBlock.amigo, pBlock.accion], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

const savePost = (pPost) => {
    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO `chat-usuarios_usuarios` (fk_usuario, fk_amigo, post, autor, fecha) VALUES (?, ?, ?, ?, ?)', [pPost.idUsuario, pPost.idItem, pPost.post, pPost.nombreUsuario, pPost.fecha], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

const updateBlock = (pBlock) => {
    return prom = new Promise((resolve, reject) => {
        db.query('UPDATE `relacion-usuarios_usuarios` SET block = ?, follow = 0 WHERE (fk_usuario = ? && fk_amigo = ?)', [pBlock.accion, pBlock.usuario, pBlock.amigo], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

const updateFollow = (pFollow) => {
    return prom = new Promise((resolve, reject) => {
        db.query('UPDATE `relacion-usuarios_usuarios` SET follow = ? WHERE (fk_usuario = ? && fk_amigo = ?)', [pFollow.accion, pFollow.usuario, pFollow.amigo], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

const updateProfile = (pPerfil, pId) => {
    return prom = new Promise((resolve, reject) => {
        db.query('UPDATE `usuarios` SET avatar = ?, cita = ? WHERE (id = ?)', [pPerfil.avatar, pPerfil.cita, pId], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

const updateVisitDate = (pIdUsuario, pIdAmigo, pFechaVisita) => {
    return prom = new Promise((resolve, reject) => {
        db.query('UPDATE `relacion-usuarios_usuarios` SET ultimavisita = ? WHERE (fk_usuario = ? && fk_amigo = ?)', [pFechaVisita, pIdUsuario, pIdAmigo], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

module.exports = {
    checkBlockedUser: checkBlockedUser,
    checkMail: checkMail,
    checkUserName: checkUserName,
    createToken: createToken,

    deletePost: deletePost,

    editPost: editPost,

    followUser: followUser,

    getAll: getAll,
    getAmigos: getAmigos,
    getAvatares: getAvatares,
    getBloqueados: getBloqueados,
    getById: getById,
    getByMail: getByMail,
    getChat: getChat,
    getUserMovieData: getUserMovieData,
    getUserUserData: getUserUserData,
    guardarUsuario: guardarUsuario,

    insertVisitDate: insertVisitDate,
    insertBlock: insertBlock,
    insertFollow: insertFollow,

    savePost: savePost,

    updateBlock: updateBlock,
    updateFollow: updateFollow,
    updateProfile: updateProfile,
    updateVisitDate: updateVisitDate
}
