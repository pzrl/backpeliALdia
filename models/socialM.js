const getSeenMovies = async (pId) => {

    const arrAmigos = await new Promise((resolve, reject) => {
        db.query('SELECT `fk_amigo` FROM `relacion-usuarios_usuarios` WHERE (fk_usuario = ? && follow = 1 && block = 0)', [pId], (err, res) => {
            if (err) reject(err)
            resolve(res)
        })
    })

    let arrPelisAmigos = []
    for (amigo of arrAmigos) {
        pelicula = await new Promise((resolve, reject) => {
            db.query('SELECT `usuarios`.id , `usuarios`.usuario ,`usuarios`.avatar, `peliculas_usuarios`.fechapuntuacion, `peliculas`.id AS `idPelicula`, `peliculas`.titulo FROM `peliculas_usuarios`, `usuarios`, `peliculas` WHERE`usuarios`.id = `peliculas_usuarios`.fk_usuario && `peliculas_usuarios`.fk_usuario = ? && `peliculas`.id =  `peliculas_usuarios`.fk_pelicula && `peliculas_usuarios`.fechapuntuacion IS NOT NULL', [amigo.fk_amigo], (err, res) => {
                if (err) { reject(err) }
                else if (res.length === 0) { resolve(res) }
                else if (res.length !== 0) { resolve(res) }
            })
        })
        if (pelicula.length !== 0) { arrPelisAmigos.push(pelicula) }
    }

    let arrFinal = [];
    for (peli of arrPelisAmigos) {
        arrFinal = arrFinal.concat(peli)
    }

    arrFinal.sort(function (a, b) {
        a = new Date(a.fechapuntuacion);
        b = new Date(b.fechapuntuacion);

        return a > b ? -1 : a < b ? 1 : 0;
    })

    return (arrFinal)
}

const getLastMessages = async (pId) => {
    return arrMensajes = await new Promise((resolve, reject) => {
        db.query('SELECT `chat-usuarios_usuarios`.*, `usuarios`.avatar, `relacion-usuarios_usuarios`.ultimavisita FROM `chat-usuarios_usuarios`, `usuarios`, `relacion-usuarios_usuarios` WHERE `chat-usuarios_usuarios`.fk_amigo = ? && `usuarios`.id = `chat-usuarios_usuarios`.fk_usuario && `relacion-usuarios_usuarios`.fk_usuario = `chat-usuarios_usuarios`.fk_amigo && `relacion-usuarios_usuarios`.fk_amigo = `chat-usuarios_usuarios`.fk_usuario && `chat-usuarios_usuarios`.clase != ?', [pId, 'eliminado'], (err, res) => {
            if (err) reject(err)
            resolve(res)
        });
    });
}


module.exports = {
    getSeenMovies: getSeenMovies,
    getLastMessages: getLastMessages
}