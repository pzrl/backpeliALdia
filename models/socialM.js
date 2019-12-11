

const getSeenMovies = async (pId) => {

    const arrAmigos = await new Promise((resolve, reject) => {
        db.query('SELECT `fk_amigo` FROM `relacion-usuarios_usuarios` WHERE (fk_usuario = ? && follow = 1)', [pId], (err, res) => {
            if (err) reject(err)
            resolve(res)
        })
    })

    let arrIdsPelisAmigos = []
    for (amigo of arrAmigos) {
        pelicula = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM `peliculas_usuarios` WHERE (fk_usuario = ?)', [amigo.fk_amigo], (err, res) => {
                if (err) { reject(err) }
                else if (res.length === 0) { resolve(res) }
                else if (res.length !== 0) { resolve(res) }
            })
        })
        if (pelicula.length !== 0) { arrIdsPelisAmigos.push(pelicula) }
    }

    let arrDatosAmigo = [];
    for (amigo of arrIdsPelisAmigos) {
        for (pelicula of amigo) {

            const datosUsuario = await new Promise((resolve, reject) => {
                db.query('SELECT id, usuario, avatar FROM usuarios WHERE id = ?', [pelicula.fk_usuario], (err, res) => {
                    if (err) reject(err)
                    resolve(res)
                })
            })
            arrDatosAmigo.push(datosUsuario)
        }
    }

    let arrDatosPelicula = [];
    for (amigo of arrIdsPelisAmigos) {
        for (pelicula of amigo) {
            const datosUsuario = await new Promise((resolve, reject) => {
                db.query('SELECT id, titulo FROM peliculas WHERE id = ?', [pelicula.fk_pelicula], (err, res) => {
                    if (err) reject(err)
                    resolve(res)
                })
            })
            arrDatosPelicula.push(datosUsuario)
        }
    }

    let arrFinal = []

    for (i = 0; i < arrDatosAmigo.length; i++) {
        for (j = 0; j < arrDatosPelicula.length; j++) {
            if (i === j) {
                item = {
                    usuario: arrDatosAmigo[i],
                    pelicula: arrDatosPelicula[j]
                }
                arrFinal.push(item)
            }
        }
    }

    return (arrFinal)
}

const getLastMessages = async (pId) => {
    return arrMensajes = await new Promise((resolve, reject) => {
        db.query('SELECT `chat-usuarios_usuarios`.*, `usuarios`.avatar FROM `chat-usuarios_usuarios`, `usuarios` WHERE fk_amigo = ? && `usuarios`.id = `chat-usuarios_usuarios`.fk_usuario', [pId], (err, res) => {
            if (err) reject(err)
            resolve(res)
        });
    });
}





module.exports = {
    getSeenMovies: getSeenMovies,
    getLastMessages: getLastMessages
}