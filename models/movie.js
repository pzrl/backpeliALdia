const calcularDatosPeliculas = (pDatosPeliculas) => {
    let averageMark = 0;
    let count = 0;
    let toSeeCount = 0;
    for (dato of pDatosPeliculas) {
        if (dato.puntuacion > 0) {
            count++;
            averageMark += dato.puntuacion;
        }
        if (dato.pendiente === 1) toSeeCount++
    }
    averageMark = averageMark / count;

    let user = {};
    user.peliculasPuntuadas = count;
    user.peliculasPendientes = toSeeCount;
    user.puntuacionMedia = averageMark.toFixed(1);

    return (user)
}

const checkMovie = (pPelicula) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM `peliculas` WHERE (titulo = ? && anio = ? && director = ?)', [pPelicula.titulo, pPelicula.anio, pPelicula.direccion], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

const checkMovieUser = (pId, pUsuario) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM `peliculas_usuarios` WHERE (fk_usuario = ? && fk_pelicula = ?)', [pUsuario.id, pId.idPelicula], (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
}

const deletePost = (pId) => {
    const post = 'Este comentario ha sido eliminado.';
    const clase = 'eliminado'
    return prom = new Promise((resolve, reject) => {
        db.query('UPDATE `chat-usuarios_peliculas` SET post = ?, clase = ? WHERE id = ?', [post, clase, pId], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

const editPost = (pPost) => {
    const clase = 'editado'
    return prom = new Promise((resolve, reject) => {
        db.query('UPDATE `chat-usuarios_peliculas` SET post = ?, clase = ? WHERE id = ?', [pPost.post, clase, pPost.id], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

const getById = (pId) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM peliculas WHERE id = ?', [pId], (err, row) => {
            if (err) reject(err);
            resolve(row[0]);
        });
    });
}

const getByIdFA = (pIdFA) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM peliculas WHERE idfa = ?', [pIdFA], (err, row) => {
            if (err) reject(err);
            resolve(row[0]);
        });
    });
}

const getDatosPuntuaciones = (pId) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM `peliculas_usuarios` WHERE fk_pelicula = ? && puntuacion IS NOT NULL', [pId.idPelicula], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        })
    })
}

const getHiddenUpcomingMovies = (pId) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT fk_pelicula FROM `peliculas_usuarios` WHERE fk_usuario = ? && hide = 1', [pId], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

const getSeenMovies = (pId) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT `peliculas`.*, `peliculas_usuarios`.* FROM `peliculas_usuarios`, `peliculas` WHERE (fk_usuario = ? && `peliculas_usuarios`.puntuacion IS NOT NULL && `peliculas_usuarios`.fk_pelicula = `peliculas`.id)', [pId], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

const getToSeeMovies = (pId) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT `peliculas`.*, `peliculas_usuarios`.* FROM `peliculas_usuarios`, `peliculas` WHERE (fk_usuario = ? && `peliculas_usuarios`.pendiente = 1 && `peliculas_usuarios`.fk_pelicula = `peliculas`.id)', [pId], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

const getUpcomingMovies = () => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT `peliculas`.* FROM `peliculas` WHERE fechaestreno >= NOW()', (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

const insertMark = (pMark) => {
    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO `peliculas_usuarios` (fk_usuario, fk_pelicula, puntuacion, fechapuntuacion) VALUES (?, ?, ?, ?)', [pMark.idUsuario, pMark.idPelicula, pMark.puntuacion, pMark.fechaPuntuacion], (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
}

const insertMovie = (pPelicula) => {
    console.log(pPelicula)
    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO `peliculas` (idFA, titulo, anio, director, reparto, sinopsis) VALUES (?, ?, ?, ?, ?, ?)', [pPelicula.idFA, pPelicula.titulo, pPelicula.anio, pPelicula.direccion, pPelicula.reparto, pPelicula.sinopsis], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

const insertToSee = (pToSee) => {
    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO `peliculas_usuarios` (fk_usuario, fk_pelicula, pendiente) VALUES (' + pToSee.idUsuario + ', ' + pToSee.idPelicula + ', ' + pToSee.pendiente + ')', (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
}

const insertHide = (pHide) => {
    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO `peliculas_usuarios` (fk_usuario, fk_pelicula, hide) VALUES (' + pHide.idUsuario + ', ' + pHide.idPelicula + ', 1)', (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
}

const getChat = (pPost) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT `chat-usuarios_peliculas`.*, `usuarios`.avatar FROM `chat-usuarios_peliculas`, `usuarios` WHERE (`chat-usuarios_peliculas`.fk_pelicula = ? && `chat-usuarios_peliculas`.fk_usuario = `usuarios`.id)', [pPost.idItem], (err, rows) => {
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

const savePost = (pPost) => {
    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO `chat-usuarios_peliculas` (fk_usuario, fk_pelicula, post, autor, fecha) VALUES (?, ?, ?, ?, ?)', [pPost.idUsuario, pPost.idItem, pPost.post, pPost.nombreUsuario, pPost.fecha], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

const updateHide = (pHide) => {
    return prom = new Promise((resolve, reject) => {
        db.query('UPDATE `peliculas_usuarios` SET hide = 1 WHERE fk_usuario = ? && fk_pelicula = ?', [pHide.idUsuario, pHide.idPelicula], (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
}

const updateMark = (pMark) => {
    return prom = new Promise((resolve, reject) => {
        db.query('UPDATE `peliculas_usuarios` SET puntuacion = ?, fechapuntuacion = ? WHERE fk_usuario = ? && fk_pelicula = ?', [pMark.puntuacion, pMark.fechaPuntuacion, pMark.idUsuario, pMark.idPelicula], (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
}

const updateToSee = (pToSee) => {
    return prom = new Promise((resolve, reject) => {
        db.query('UPDATE `peliculas_usuarios` SET pendiente = ? WHERE fk_usuario = ? && fk_pelicula = ?', [pToSee.pendiente, pToSee.idUsuario, pToSee.idPelicula], (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
}



module.exports = {
    calcularDatosPeliculas: calcularDatosPeliculas,
    checkMovieUser: checkMovieUser,
    checkMovie: checkMovie,

    deletePost: deletePost,

    editPost: editPost,

    getById: getById,
    getByIdFA: getByIdFA,
    getChat: getChat,
    getDatosPuntuaciones: getDatosPuntuaciones,
    getHiddenUpcomingMovies: getHiddenUpcomingMovies,
    getSeenMovies: getSeenMovies,
    getToSeeMovies: getToSeeMovies,
    getUpcomingMovies: getUpcomingMovies,

    insertMark: insertMark,
    insertToSee: insertToSee,
    insertHide: insertHide,
    insertMovie: insertMovie,

    updateMark: updateMark,
    updateToSee: updateToSee,
    updateHide: updateHide,

    savePost: savePost,
}