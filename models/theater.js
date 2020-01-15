const checkMovieUser = (pId, pUsuario) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM `cines_usuarios` WHERE (fk_usuario = ? && fk_cine = ?)', [pUsuario.id, pId.idCine], (err, row) => {
            if (err) reject(err)
            resolve(row)
        })
    })
}

const clearTable = () => {
    return prom = new Promise((resolve, reject) => {
        db.query('DELETE FROM `cines_peliculas`', (err, row) => {
            if (err) reject(err)
            resolve(row)
        })
    })
}

const deletePost = (pId) => {
    const post = 'Esta opinión ha sido eliminada.';
    const clase = 'eliminado'
    return prom = new Promise((resolve, reject) => {
        db.query('UPDATE `chat-usuarios_cines` SET post = ?, clase = ? WHERE id = ?', [post, clase, pId], (err, res) => {
            if (err) reject(err)
            resolve(res)
        });
    });
}

const editPost = (pPost) => {
    const clase = 'editado'
    return prom = new Promise((resolve, reject) => {
        db.query('UPDATE `chat-usuarios_cines` SET post = ?, clase = ? WHERE id = ?', [pPost.post, clase, pPost.id], (err, res) => {
            if (err) reject(err)
            resolve(res)
        });
    });
}

const favoriteTheater = (pFavorite) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM `cines_usuarios` WHERE (fk_usuario = ? && fk_cine = ?)', [pFavorite.usuario, pFavorite.cine], (err, res) => {
            if (err) reject(err)
            resolve(res)
        });
    });
}

const getById = (pId) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM cines WHERE id = ?', [pId], (err, row) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(row)
            }
        });
    });
}

const getChat = (pPost) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT `chat-usuarios_cines`.*, `usuarios`.avatar FROM `chat-usuarios_cines`, `usuarios` WHERE (fk_cine = ? && `chat-usuarios_cines`.fk_usuario = `usuarios`.id)', [pPost.idItem], (err, rows) => {
            if (err) reject(err)
            rows.sort(function (a, b) {
                a = new Date(a.fecha);
                b = new Date(b.fecha);
                return b > a ? -1 : a < b ? 1 : 0;
            });
            resolve(rows)
        })
    })
}

const getDatosPuntuaciones = (pId) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM `cines_usuarios` WHERE fk_cine = ? && puntuacion IS NOT NULL', [pId.idCine], (err, rows) => {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

const getCinesFavoritos = (pId) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT `cines`.*, `cines_usuarios`.puntuacion FROM `cines`, `cines_usuarios` WHERE `cines`.id = `cines_usuarios`.fk_cine && `cines_usuarios`.fk_usuario = ? && `cines_usuarios`.favorito = 1', [pId.id], (err, res) => {
            if (err) reject(err)
            resolve(res)
        });
    });
}

const getTheaterFilms = (pIdCine) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT `cines_peliculas`.*, `peliculas`.* FROM `cines_peliculas`, `peliculas` WHERE `cines_peliculas`.fk_cines = ? && `cines_peliculas`.fk_peliculas = `peliculas`.id', [pIdCine], (err, res) => {
            if (err) reject(err)
            resolve(res)
        })
    })
}

const getTheatersPosition = () => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM `cines`', (err, res) => {
            if (err) reject(err)
            resolve(res)
        });
    });
}

const getUrls = () => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM `cines`', (err, rows) => {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

const getUserTheaterData = (pUsuario, pCine) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT favorito, puntuacion FROM `cines_usuarios` WHERE (fk_usuario = ? && fk_cine = ?)', [pUsuario.id, pCine.idCine], (err, res) => {
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

const insertMark = (pMark) => {
    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO `cines_usuarios` (fk_usuario, fk_cine, puntuacion) VALUES (?, ?, ?)', [pMark.idUsuario, pMark.idCine, pMark.puntuacion], (err, row) => {
            if (err) reject(err)
            resolve(row)
        })
    })
}

const insertSessions = (pHorario) => {
    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO `cines_peliculas` (fk_cines, fk_peliculas, horario, linkEntradas) VALUES (?, ?, ?, ?)', [pHorario.cine, pHorario.pelicula, pHorario.horario, pHorario.urlCine], (err, res) => {
            if (err) reject(err)
            resolve(res)
        });
    });
}

const savePost = (pPost) => {
    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO `chat-usuarios_cines` (fk_usuario, fk_cine, post, autor, fecha) VALUES (?, ?, ?, ?, ?)', [pPost.idUsuario, pPost.idItem, pPost.post, pPost.nombreUsuario, pPost.fecha], (err, res) => {
            if (err) reject(err)
            resolve(res)
        })
    })
}

const updateFavorite = (pFavorite) => {
    return prom = new Promise((resolve, reject) => {
        db.query('UPDATE `cines_usuarios` SET favorito = ? WHERE (fk_usuario = ? && fk_cine = ?)', [pFavorite.favorito, pFavorite.usuario, pFavorite.cine], (err, res) => {
            if (err) reject(err)
            resolve(res)
        });
    });
}

const updateMark = (pMark) => {
    return prom = new Promise((resolve, reject) => {
        db.query('UPDATE `cines_usuarios` SET puntuacion = ? WHERE fk_usuario = ? && fk_cine = ?', [pMark.puntuacion, pMark.idUsuario, pMark.idCine], (err, row) => {
            if (err) reject(err)
            resolve(row)
        })
    })
}



module.exports = {
    clearTable: clearTable,
    checkMovieUser: checkMovieUser,

    deletePost: deletePost,

    editPost: editPost,

    favoriteTheater: favoriteTheater,

    getById: getById,
    getChat: getChat,
    getCinesFavoritos: getCinesFavoritos,
    getDatosPuntuaciones: getDatosPuntuaciones,
    getTheaterFilms: getTheaterFilms,
    getTheatersPosition: getTheatersPosition,
    getUserTheaterData: getUserTheaterData,
    getUrls: getUrls,

    insertFavorite: insertFavorite,
    insertMark: insertMark,
    insertSessions: insertSessions,

    savePost: savePost,

    updateFavorite: updateFavorite,
    updateMark: updateMark,
}