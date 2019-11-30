
const getSearch = (pSearch) => {

    let arrBusqueda = pSearch.split(' ');
    let busquedaPeliculas = 'SELECT * FROM peliculas WHERE titulo LIKE "%';
    let busquedaUsuarios = 'SELECT * FROM usuarios WHERE usuario LIKE "%';
    let busquedaCines = 'SELECT * FROM cines WHERE nombre LIKE "%';

    for (i = 0; i < arrBusqueda.length; i++) {
        busquedaPeliculas += arrBusqueda[i];
        busquedaPeliculas += i < arrBusqueda.length - 1 ? '%" or titulo LIKE "%' : '%"; ';

        busquedaUsuarios += arrBusqueda[i];
        busquedaUsuarios += i < arrBusqueda.length - 1 ? '%" or usuario LIKE "%' : '%"; ';

        busquedaCines += arrBusqueda[i];
        busquedaCines += i < arrBusqueda.length - 1 ? '%" or nombre LIKE "%' : '%"'
    }

    let busquedaCompleta = busquedaPeliculas + busquedaUsuarios + busquedaCines;
    console.log(busquedaCompleta)

    return prom = new Promise((resolve, reject) => {
        db.query(busquedaCompleta, (err, rows) => {
            if (err) reject(err)
            resolve(rows)
        });
    });
}


module.exports = {
    getSearch: getSearch
}