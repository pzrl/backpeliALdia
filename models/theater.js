
const getById = (pId) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM cines WHERE id = ?', [pId], (err, row) => {
            if (err) { reject(err) }
            else {
                console.log(row)
                resolve(row)
            }
        });
    });
}

const getChat = (pPost) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT post, autor, fecha FROM `chat-usuarios_cines` WHERE (fk_cines = ?)', [pPost.idItem], (err, rows) => {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

const savePost = (pPost) => {
    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO `chat-usuarios_cines` (fk_usuarios, fk_cines, post, autor, fecha) VALUES (?, ?, ?, ?, ?)', [pPost.idUsuario, pPost.idItem, pPost.post, pPost.nombreUsuario, pPost.fecha], (err, res) => {
            if (err) reject(err)
            resolve(res)
        })
    })
}

const favoriteTheater = (pFavorite) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM `cines_usuarios` WHERE (fk_usuario = ? && fk_cine = ?)', [pFavorite.usuario, pFavorite.cine], (err, res) => {
            if (err) reject(err)
            resolve(res)
        });
    });
}

const getUserTheaterData = (pUsuario, pCine) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT favorito FROM `cines_usuarios` WHERE (fk_usuario = ? && fk_cine = ?)', [pUsuario.id, pCine.idCine], (err, res) => {
            if (err) reject(err)
            resolve(res)
        });
    });
}

const insertFavorite = (pFavorite) => {
    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO `cines_usuarios` (fk_usuario, fk_cine, favorito) VALUES (?, ?, ?)', [pFavorite.usuario, pFavorite.cine, pFavorite.favorito], (err, res) => {
            if (err) reject(err)
            resolve(res)
        });
    });
}

const updateFavorite = (pFavorite) => {
    return prom = new Promise((resolve, reject) => {
        db.query('UPDATE `cines_usuarios` SET favorito = ? WHERE (fk_usuario = ? && fk_cine = ?)', [pFavorite.favorito, pFavorite.usuario, pFavorite.cine], (err, res) => {
            if (err) reject(err)
            resolve(res)
        });
    });
}

const getCinesFavoritos = (pId) => {
    console.log(pId)

    return prom = new Promise((resolve, reject) => {
        db.query('SELECT `cines`.* FROM `cines`, `cines_usuarios` WHERE `cines`.id = `cines_usuarios`.fk_cine && `cines_usuarios`.fk_usuario = ? && `cines_usuarios`.favorito = 1', [pId.id], (err, res) => {
            if (err) reject(err)
            resolve(res)
        });
    });
}


module.exports = {
    getById: getById,
    getChat: getChat,
    savePost: savePost,
    insertFavorite: insertFavorite,
    getUserTheaterData: getUserTheaterData,
    updateFavorite: updateFavorite,
    favoriteTheater: favoriteTheater,
    getCinesFavoritos: getCinesFavoritos
}