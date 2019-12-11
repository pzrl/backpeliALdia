
const getById = (pId) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM peliculas WHERE id = ?', [pId], (err, row) => {
            if (err) reject(err)
            resolve(row[0])
        });
    });
}

const checkMovieUser = (pId, pUsuario) => {
    console.log('en el checkMovie', pId, pUsuario)
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM `peliculas_usuarios` WHERE (fk_usuario = ? && fk_pelicula = ?)', [pUsuario.id, pId.idPelicula], (err, row) => {
            if (err) reject(err)
            resolve(row)
        })
    })
}

const insertMark = (pMark) => {
    console.log('insert', pMark)
    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO `peliculas_usuarios` (fk_usuario, fk_pelicula, puntuacion, fechapuntuacion) VALUES (?, ?, ?, ?)', [pMark.idUsuario, pMark.idPelicula, pMark.puntuacion, pMark.fechaPuntuacion], (err, row) => {
            if (err) reject(err)
            console.log(row)
            resolve(row)
        })
    })
}

const updateMark = (pMark) => {
    console.log('update', pMark)
    return prom = new Promise((resolve, reject) => {
        db.query('UPDATE `peliculas_usuarios` SET puntuacion = ? WHERE fk_usuario = ? && fk_pelicula = ?', [pMark.puntuacion, pMark.idUsuario, pMark.idPelicula, pMark.fechaPuntuacion], (err, row) => {
            if (err) reject(err)
            resolve(row)
        })
    })
}

const insertToSee = (pToSee) => {
    console.log('insert', pToSee)
    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO `peliculas_usuarios` (fk_usuario, fk_pelicula, pendiente) VALUES (' + pToSee.idUsuario + ', ' + pToSee.idPelicula + ', ' + pToSee.pendiente + ')', (err, row) => {
            if (err) reject(err)
            resolve(row)
        })
    })
}
const updateToSee = (pToSee) => {
    console.log('update', pToSee)
    return prom = new Promise((resolve, reject) => {
        db.query('UPDATE `peliculas_usuarios` SET pendiente = ? WHERE fk_usuario = ? && fk_pelicula = ?', [pToSee.pendiente, pToSee.idUsuario, pToSee.idPelicula], (err, row) => {
            if (err) reject(err)
            resolve(row)
        })
    })
}

const getChat = (pPost) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT post, autor, fecha FROM `chat-usuarios_peliculas` WHERE (fk_pelicula = ?)', [pPost.idItem], (err, rows) => {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

const savePost = (pPost) => {
    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO `chat-usuarios_peliculas` (fk_usuario, fk_pelicula, post, autor, fecha) VALUES (?, ?, ?, ?, ?)', [pPost.idUsuario, pPost.idItem, pPost.post, pPost.nombreUsuario, pPost.fecha], (err, res) => {
            if (err) reject(err)
            resolve(res)
        })
    })
}

const calcularDatosPeliculas = (pDatosPeliculas) => {
    let averageMark = 0
    let count = 0
    let toSeeCount = 0
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

const getSeenMovies = (pId) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT `peliculas`.*, `peliculas_usuarios`.* FROM `peliculas_usuarios`, `peliculas` WHERE (fk_usuario = ? && `peliculas_usuarios`.puntuacion IS NOT NULL && `peliculas_usuarios`.fk_pelicula = `peliculas`.id)', [pId], (err, res) => {
            if (err) reject(err)
            resolve(res)
        });
    });
}

const checkMovie = (pPelicula) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM `peliculas` WHERE (titulo = ? && anio = ? && director = ?)', [pPelicula.titulo, pPelicula.anio, pPelicula.direccion], (err, res) => {
            if (err) reject(err)
            resolve(res)
        });
    });
}

const insertMovie = (pPelicula) => {
    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO `peliculas` (titulo, anio, director, reparto, sinopsis) VALUES (?, ?, ?, ?, ?)', [pPelicula.titulo, pPelicula.anio, pPelicula.direccion, pPelicula.reparto, pPelicula.sinopsis], (err, res) => {
            if (err) reject(err)
            resolve(res)
        });
    });
}


module.exports = {
    getById: getById,
    checkMovieUser: checkMovieUser,
    insertMark: insertMark,
    updateMark: updateMark,
    insertToSee: insertToSee,
    updateToSee: updateToSee,
    getChat: getChat,
    savePost: savePost,
    calcularDatosPeliculas: calcularDatosPeliculas,
    getSeenMovies: getSeenMovies,
    checkMovie: checkMovie,
    insertMovie: insertMovie
}