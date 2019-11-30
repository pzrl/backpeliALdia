
const getById = (pId) => {
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM peliculas WHERE id = ?', [pId], (err, row) => {
            if (err) reject(err)
            resolve(row[0])
        });
    });
}


const checkMovieUser = (pIds) => {
    console.log('entra en checkMovieUser', pIds)
    return prom = new Promise((resolve, reject) => {
        db.query('SELECT * FROM `peliculas_usuarios` WHERE fk_usuario = ? && fk_pelicula = ?', [pIds.idUsuario, pIds.idPelicula], (err, row) => {
            if (err) reject(err)
            resolve(row)
        })
    })
}

const insertMark = (pMark) => {
    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO `peliculas_usuarios` (fk_usuario, fk_pelicula, puntuacion) VALUES (' + pMark.idUsuario + ', ' + pMark.idPelicula + ',' + pMark.puntuacion + ');', (err, row) => {
            if (err) reject(err)
            resolve(row)
        })
    })
}
const updateMark = (pMark) => {
    return prom = new Promise((resolve, reject) => {
        db.query('UPDATE `peliculas_usuarios` SET puntuacion = ' + pMark.puntuacion + ' WHERE fk_usuario = ' + pMark.idUsuario + ' && fk_pelicula = ' + pMark.idPelicula, (err, row) => {
            if (err) reject(err)
            resolve(row)
        })
    })
}

const insertToSee = (pToSee) => {
    return prom = new Promise((resolve, reject) => {
        db.query('INSERT INTO `peliculas_usuarios` (fk_usuario, fk_pelicula, pendiente) VALUES (' + pToSee.idUsuario + ', ' + pToSee.idPelicula + ', true);', (err, row) => {
            if (err) reject(err)
            resolve(row)
        })
    })
}
const updateToSee = (pToSee) => {
    console.log(pToSee)
    return prom = new Promise((resolve, reject) => {
        db.query('UPDATE `peliculas_usuarios` SET pendiente = ' + pToSee.pendiente + ' WHERE fk_usuario = ' + pToSee.idUsuario + ' && fk_pelicula = ' + pToSee.idPelicula, (err, row) => {
            if (err) reject(err)
            resolve(row)
        })
    })
}


module.exports = {
    getById: getById,
    checkMovieUser: checkMovieUser,
    insertMark: insertMark,
    updateMark: updateMark,
    insertToSee: insertToSee,
    updateToSee: updateToSee
}